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

import App from './App';

describe('App Phase 1 flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('renders the conversational intro and first question', () => {
    render(<App />);

    expect(screen.getByText('Where Do You Stand?')).toBeTruthy();
    expect(screen.getByLabelText('How old are you?')).toBeTruthy();
    expect(screen.getByLabelText('How old are you?').getAttribute('placeholder')).toBe('e.g. 38');
    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();
    expect(screen.queryByText('Question 1 of 5')).toBeNull();
  });

  it('uses a calmer mobile type scale across the card, letter, and slider views', async () => {
    setViewportWidth(390);

    const { container } = render(<App />);

    expect(screen.getByText('Where Do You Stand?').style.fontSize).toBe('28px');
    expect(
      screen.getByText(
        "Before our first call, I want to know where you stand. Five questions. Two minutes. That's it.",
      ).style.fontSize,
    ).toBe('15px');
    expect(screen.getByText('How old are you?').style.fontSize).toBe('18px');

    await completePhaseOne();

    expect(container.querySelector('article p')?.style.fontSize).toBe('16px');
    expect(screen.getByText('Marcus').style.fontSize).toBe('28px');
    expect(screen.getByText('Adjust Your Path').style.fontSize).toBe('34px');
    expect(
      screen.getByText(
        "See how small changes shift your outcome. Drag either slider to explore what's possible.",
      ).style.fontSize,
    ).toBe('16px');
    expect(screen.getByRole('button', { name: 'Schedule your meeting' }).style.fontSize).toBe(
      '16px',
    );
  });

  it('keeps the desktop result view side by side for the letter and slider panels', async () => {
    render(<App />);

    await completePhaseOne();

    const phaseTwoSection = screen
      .getByText('Adjust Your Path')
      .closest('section')
      ?.parentElement?.parentElement;

    expect(phaseTwoSection?.style.display).toBe('grid');
    expect(phaseTwoSection?.style.gridTemplateColumns).toBe(
      'minmax(0, 1fr) minmax(0, 1fr)',
    );
    expect(phaseTwoSection?.style.maxWidth).toBe('1600px');
    expect(phaseTwoSection?.style.margin).toBe('0px auto');
  });

  it('lets the result view collapse to a single responsive column on narrower desktop widths', async () => {
    setViewportWidth(1024);

    render(<App />);

    await completePhaseOne();

    const phaseTwoSection = screen
      .getByText('Adjust Your Path')
      .closest('section')
      ?.parentElement?.parentElement;

    expect(phaseTwoSection?.style.display).toBe('grid');
    expect(phaseTwoSection?.style.gridTemplateColumns).toContain('auto-fit');
    expect(phaseTwoSection?.style.gridTemplateColumns).toContain('minmax');
  });

  it('collects the five inputs, enters phase 2, and resets back to a blank first question', async () => {
    render(<App />);

    await completePhaseOne();

    expect(screen.getByText('Adjust Your Path')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

    expect(screen.getByText('Where Do You Stand?')).toBeTruthy();
    expect(screen.queryByText('Adjust Your Path')).toBeNull();

    const currentAgeInput = screen.getByLabelText('How old are you?');
    expect(currentAgeInput.getAttribute('value')).toBe('');
    expect(currentAgeInput.getAttribute('placeholder')).toBe('e.g. 38');
  });

  it('shows a fixed mobile scroll cue in the results view only', async () => {
    setViewportWidth(390);

    render(<App />);

    expect(screen.queryByTestId('mobile-scroll-cue')).toBeNull();

    await completePhaseOne();

    const letterSection = screen.getByTestId('letter-section');
    const sliderSection = screen.getByTestId('slider-section');

    Object.defineProperty(letterSection, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 0,
        bottom: 920,
        left: 0,
        right: 390,
        width: 390,
        height: 920,
      }),
    });

    Object.defineProperty(sliderSection, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        top: 960,
        bottom: 1680,
        left: 0,
        right: 390,
        width: 390,
        height: 720,
      }),
    });

    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('mobile-scroll-cue')).toBeTruthy();
  });
});

function submitQuestion(label, value) {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });
}

function setViewportWidth(width) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
}

async function answerAndWait(label, value) {
  await act(async () => {
    submitQuestion(label, value);
    await vi.advanceTimersByTimeAsync(1600);
  });
}

async function completePhaseOne() {
  await answerAndWait('How old are you?', '40');
  await answerAndWait('What does your household bring home each year?', '$180,000');
  await answerAndWait('What do you have set aside right now?', '$100,000');
  await answerAndWait('Monthly savings', '$1,500');
  await act(async () => {
    submitQuestion('When do you want to retire?', '65');
    await vi.runAllTimersAsync();
  });
}
