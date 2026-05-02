/* @vitest-environment jsdom */
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => {
  const createMotionComponent = (tag) =>
    React.forwardRef(
      ({ animate, exit, initial, transition, children, ...props }, ref) =>
        React.createElement(tag, { ...props, ref }, children),
    );

  return {
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      div: createMotionComponent('div'),
      form: createMotionComponent('form'),
      section: createMotionComponent('section'),
      span: createMotionComponent('span'),
      article: createMotionComponent('article'),
      button: createMotionComponent('button'),
    },
  };
});

import CardFlow from './CardFlow';
import { CARD_REACTIONS } from '../copy';

describe('CardFlow conversational thread', () => {
  let scrollIntoViewMock;
  let scrollToMock;

  beforeEach(() => {
    vi.useFakeTimers();
    scrollIntoViewMock = vi.fn();
    scrollToMock = vi.fn();
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
    Object.defineProperty(window.HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollToMock,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('renders Marcus avatar and first question on load', () => {
    const { container } = render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const activeQuestionInput = screen.getByLabelText('How old are you?');
    const activeCard = activeQuestionInput.closest('form')?.parentElement;
    const activeRowAvatar = Array.from(container.querySelectorAll('*')).find(
      (element) =>
        element.textContent === 'M' &&
        activeCard?.contains(element) &&
        element.tagName !== 'INPUT',
    );

    expect(activeRowAvatar).toBeTruthy();
    expect(activeQuestionInput).toBeTruthy();
  });

  it('shows user answer bubble immediately after submit', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('How old are you?');
    await act(async () => {
      fireEvent.change(input, { target: { value: '40' } });
      fireEvent.submit(input.closest('form'));
    });

    expect(screen.getByText('40')).toBeTruthy();
  });

  it('shows reaction text after 600ms', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('How old are you?');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.submit(input.closest('form'));

    expect(screen.queryByText(CARD_REACTIONS[0])).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(599);
    });

    expect(screen.queryByText(CARD_REACTIONS[0])).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(screen.getByText(getFirstReactionMatcher())).toBeTruthy();
  });

  it('advances to next question after 1600ms total', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('How old are you?');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.submit(input.closest('form'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1599);
    });

    expect(screen.queryByLabelText('What does your household bring home each year?')).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(screen.getByLabelText('What does your household bring home each year?')).toBeTruthy();
  });

  it('reaction from first question stays visible after second question appears', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('How old are you?');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.submit(input.closest('form'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    expect(screen.getByText(getFirstReactionMatcher())).toBeTruthy();
    expect(screen.getByLabelText('What does your household bring home each year?')).toBeTruthy();
  });

  it('calls onComplete with all answers after fifth question', async () => {
    const onComplete = vi.fn();
    render(<CardFlow isMobile={false} onComplete={onComplete} />);

    await submitAndAdvance('How old are you?', '40');
    await submitAndAdvance('What does your household bring home each year?', '$180,000');
    await submitAndAdvance('What do you have set aside right now?', '$100,000');
    await submitAndAdvance('Monthly savings', '$1,500');

    await act(async () => {
      const input = screen.getByLabelText('When do you want to retire?');
      fireEvent.change(input, { target: { value: '65' } });
      fireEvent.submit(input.closest('form'));
      await vi.runAllTimersAsync();
    });

    expect(onComplete).toHaveBeenCalledWith({
      currentAge: 40,
      income: 180000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    });
  });

  it('shows inline validation error and does not advance on invalid input', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('How old are you?');
    await act(async () => {
      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.submit(input.closest('form'));
    });

    expect(screen.getByText('Enter an age between 18 and 79.')).toBeTruthy();
    expect(screen.queryByLabelText('What does your household bring home each year?')).toBeNull();
  });

  it('keeps the intro block pinned while the question flow moves underneath it', () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const title = screen.getByText('Where Do You Stand?');
    const intro = title.closest('div');

    expect(intro?.style.position).toBe('sticky');
    expect(intro?.style.top).toBe('0px');
  });

  it('scrolls the active prompt into view instead of using a nested thread scroller', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);
    scrollIntoViewMock.mockClear();
    scrollToMock.mockClear();

    const input = screen.getByLabelText('How old are you?');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.submit(input.closest('form'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    expect(scrollIntoViewMock).toHaveBeenCalled();
    expect(scrollToMock).not.toHaveBeenCalled();
  });
});

async function submitAndAdvance(label, value) {
  await act(async () => {
    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value } });
    fireEvent.submit(input.closest('form'));
    await vi.advanceTimersByTimeAsync(1600);
  });
}

function getFirstReactionMatcher() {
  return new RegExp(CARD_REACTIONS[0].map(escapeRegex).join('|'));
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
