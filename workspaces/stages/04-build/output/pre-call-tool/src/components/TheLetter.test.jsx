/* @vitest-environment jsdom */
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { COLOR_ACCENT } from '../constants';

vi.mock('framer-motion', () => {
  const createMotionComponent = (tag) =>
    React.forwardRef(
      ({ animate, exit, initial, transition, children, ...props }, ref) =>
        React.createElement(
          tag,
          {
            ...props,
            ref,
            'data-animate-color': animate?.color,
          },
          children,
        ),
    );

  return {
    motion: {
      span: createMotionComponent('span'),
      article: createMotionComponent('article'),
    },
  };
});

import { calculate } from '../calc';
import TheLetter from './TheLetter';
import {
  formatSlotValue,
  renderTemplateParts,
  selectLetterTierKey,
} from './theLetterUtils';

const LETTER_TEXT_COLOR = '#1F252B';

describe('theLetterUtils', () => {
  it('selects the finalized tone tiers at the defined gap boundaries', () => {
    expect(
      selectLetterTierKey({ gap: -300, retirementTarget: 1000 }),
    ).toBe('wayAhead');
    expect(
      selectLetterTierKey({ gap: -299, retirementTarget: 1000 }),
    ).toBe('slightlyAhead');
    expect(
      selectLetterTierKey({ gap: -50, retirementTarget: 1000 }),
    ).toBe('slightlyAhead');
    expect(
      selectLetterTierKey({ gap: -49, retirementTarget: 1000 }),
    ).toBe('onTrack');
    expect(
      selectLetterTierKey({ gap: 49, retirementTarget: 1000 }),
    ).toBe('onTrack');
    expect(
      selectLetterTierKey({ gap: 50, retirementTarget: 1000 }),
    ).toBe('slightlyBehind');
    expect(
      selectLetterTierKey({ gap: 249, retirementTarget: 1000 }),
    ).toBe('slightlyBehind');
    expect(
      selectLetterTierKey({ gap: 250, retirementTarget: 1000 }),
    ).toBe('significantlyBehind');
    expect(
      selectLetterTierKey({ gap: 599, retirementTarget: 1000 }),
    ).toBe('significantlyBehind');
    expect(
      selectLetterTierKey({ gap: 600, retirementTarget: 1000 }),
    ).toBe('wayBehind');
  });

  it('formats letter slots for display-safe copy', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };
    const calculation = calculate(inputs);

    expect(formatSlotValue('monthly_savings', inputs, calculation)).toBe('$1,500');
    expect(formatSlotValue('years_to_retirement', inputs, calculation)).toBe('25');
    expect(formatSlotValue('target_retirement_age', inputs, calculation)).toBe('65');
    expect(formatSlotValue('gap', inputs, calculation)).toBe('$2,292,149');
  });

  it('formats years-to-retirement slots from the provided calculation', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };
    const reactiveCalculation = calculate(inputs, {
      monthlySavings: 2000,
      targetRetirementAge: 67,
    });

    expect(formatSlotValue('years_to_retirement', inputs, reactiveCalculation)).toBe(
      '27',
    );
    expect(
      formatSlotValue('target_retirement_age', inputs, reactiveCalculation),
    ).toBe('67');
  });

  it('splits templates into text and slot parts without dropping order', () => {
    expect(
      renderTemplateParts('Hello {{gap}} world {{monthly_savings}}.'),
    ).toEqual([
      { type: 'text', value: 'Hello ' },
      { type: 'slot', value: 'gap' },
      { type: 'text', value: ' world ' },
      { type: 'slot', value: 'monthly_savings' },
      { type: 'text', value: '.' },
    ]);
  });
});

describe('TheLetter', () => {
  let originalClientWidthDescriptor;
  let originalScrollWidthDescriptor;

  beforeEach(() => {
    vi.useFakeTimers();
    originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(
      window.HTMLElement.prototype,
      'clientWidth',
    );
    originalScrollWidthDescriptor = Object.getOwnPropertyDescriptor(
      window.HTMLElement.prototype,
      'scrollWidth',
    );
  });

  afterEach(() => {
    if (originalClientWidthDescriptor) {
      Object.defineProperty(window.HTMLElement.prototype, 'clientWidth', originalClientWidthDescriptor);
    }
    if (originalScrollWidthDescriptor) {
      Object.defineProperty(window.HTMLElement.prototype, 'scrollWidth', originalScrollWidthDescriptor);
    }
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('keeps all letter values locked to the original inputs when sliders move', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    const initialCalculation = calculate(inputs);
    const updatedSliderState = {
      monthlySavings: 5000,
      targetRetirementAge: 65,
    };
    const updatedCalculation = calculate(inputs, updatedSliderState);

    const { rerender } = render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    expect(screen.getByText(/The gap is roughly/i)).toBeTruthy();
    expect(
      screen.getAllByText(
        formatCurrency(initialCalculation.totalProjectedRetirementSavings),
      ).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(formatCurrency(initialCalculation.gap)).length).toBeGreaterThan(0);

    rerender(<TheLetter inputs={inputs} sliderState={updatedSliderState} />);

    expect(screen.getByText(/The gap is roughly/i)).toBeTruthy();
    expect(
      screen.getAllByText(
        formatCurrency(initialCalculation.totalProjectedRetirementSavings),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(formatCurrency(initialCalculation.gap)).length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByText(
        formatCurrency(updatedCalculation.totalProjectedRetirementSavings),
      ),
    ).toBeNull();
    expect(screen.queryByText(formatCurrency(updatedCalculation.gap))).toBeNull();
  });

  it('uses adaptive stat columns so the summary cards can resize with the available width', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    const statsGrid = screen.getByText('Projected savings').parentElement?.parentElement;

    expect(statsGrid?.style.gridTemplateColumns).toContain('minmax');
  });

  it('keeps mobile stat cards in adaptive columns instead of forcing a single stacked column', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        isMobile
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    const statsGrid = screen.getByText('Projected savings').parentElement?.parentElement;

    expect(statsGrid?.style.gridTemplateColumns).toContain('minmax');
    expect(statsGrid?.style.gridTemplateColumns).not.toBe('1fr');
  });

  it('keeps the three summary cards in a fixed horizontal row on mobile widths', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        isMobile
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    const statsGrid = screen.getByText('Projected savings').parentElement?.parentElement;

    expect(statsGrid?.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('lets two visible summary cards fill the row when the gap card is hidden', () => {
    const inputs = {
      currentAge: 40,
      income: 0,
      annualExpenses: 0,
      currentSavings: 1000000,
      monthlySavings: 0,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        isMobile
        sliderState={{
          monthlySavings: 0,
          targetRetirementAge: 65,
        }}
      />,
    );

    const statsGrid = screen.getByText('Projected savings').parentElement?.parentElement;

    expect(screen.queryByText('Gap')).toBeNull();
    expect(statsGrid?.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('renders info buttons on all three visible summary cards', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Learn how Projected savings is calculated' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Learn how Retirement target is calculated' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Learn how Gap is calculated' }),
    ).toBeTruthy();
  });

  it('opens the correct tooltip and closes the previous one when another icon is clicked', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    const projectedButton = screen.getByRole('button', {
      name: 'Learn how Projected savings is calculated',
    });

    fireEvent.click(projectedButton);

    expect(
      screen.getByText(
        'This value combines your current savings with your ongoing monthly contributions, then grows both forward using the app’s annual return assumption until your target retirement age.',
      ),
    ).toBeTruthy();
    expect(projectedButton.getAttribute('aria-describedby')).toBeTruthy();

    const targetButton = screen.getByRole('button', {
      name: 'Learn how Retirement target is calculated',
    });

    fireEvent.click(targetButton);

    expect(
      screen.queryByText(
        'This value combines your current savings with your ongoing monthly contributions, then grows both forward using the app’s annual return assumption until your target retirement age.',
      ),
    ).toBeNull();
    expect(
      screen.getByText(
        'In this tool, the retirement target is based on estimated annual spending. Estimated spending is your household income minus the annual amount you are currently saving, then multiplied by the app’s retirement multiple.',
      ),
    ).toBeTruthy();
    expect(projectedButton.getAttribute('aria-describedby')).toBeNull();
    expect(targetButton.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('closes an open tooltip when clicking outside it', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Learn how Gap is calculated' }),
    );

    expect(
      screen.getByText(
        'This value is the difference between the retirement target and projected savings.',
      ),
    ).toBeTruthy();

    fireEvent.mouseDown(document.body);

    expect(
      screen.queryByText(
        'This value is the difference between the retirement target and projected savings.',
      ),
    ).toBeNull();
  });

  it('closes an open tooltip when Escape is pressed', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Learn how Gap is calculated' }),
    );

    expect(
      screen.getByText(
        'This value is the difference between the retirement target and projected savings.',
      ),
    ).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      screen.queryByText(
        'This value is the difference between the retirement target and projected savings.',
      ),
    ).toBeNull();
  });

  it('shows only the concise tooltip copy without calculation details', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };
    render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Learn how Projected savings is calculated',
      }),
    );

    expect(
      screen.getByText(
        'This value combines your current savings with your ongoing monthly contributions, then grows both forward using the app’s annual return assumption until your target retirement age.',
      ),
    ).toBeTruthy();
    expect(screen.queryByText('How projected savings is calculated')).toBeNull();
    expect(screen.queryByText(/^Current savings:?$/i)).toBeNull();
    expect(screen.queryByText(/^Monthly contribution:?$/i)).toBeNull();
  });

  it('keeps the mobile tooltip as a small anchored note', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        isMobile
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Learn how Projected savings is calculated',
      }),
    );

    const tooltip = screen.getByRole('tooltip');
    const infoText = screen.getByText(
      'This value combines your current savings with your ongoing monthly contributions, then grows both forward using the app’s annual return assumption until your target retirement age.',
    );

    expect(tooltip.style.position).toBe('absolute');
    expect(tooltip.style.top).toBe('36px');
    expect(tooltip.style.right).toBe('0px');
    expect(tooltip.style.maxWidth).toBe('calc(100vw - 48px)');
    expect(infoText.style.fontSize).toBe('12px');
  });

  it('shrinks long stat values so they stay inside the card width', async () => {
    Object.defineProperty(window.HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        if (this.getAttribute?.('data-stat-value') === 'true') {
          return 120;
        }

        return 240;
      },
    });

    Object.defineProperty(window.HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() {
        if (this.getAttribute?.('data-stat-value') === 'true') {
          const currentFontSize = Number.parseFloat(this.style.fontSize || '20');
          return currentFontSize * 8;
        }

        return 240;
      },
    });

    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    render(
      <TheLetter
        inputs={inputs}
        isMobile
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
      await Promise.resolve();
    });

    const projectedValue = document.querySelector('[data-stat-value="true"]');

    expect(Number.parseFloat(projectedValue?.style.fontSize ?? '20')).toBeLessThan(20);
  });

  it('does not highlight locked letter slots when sliders move', async () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    const { rerender } = render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    rerender(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 2000,
          targetRetirementAge: 65,
        }}
      />,
    );

    expect(getSlot('gap').getAttribute('data-animate-color')).toBe(LETTER_TEXT_COLOR);
  });

  it('keeps letter slots unhighlighted when slider state changes', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    const { rerender } = render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 1500,
          targetRetirementAge: 65,
        }}
      />,
    );

    rerender(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 2200,
          targetRetirementAge: 67,
        }}
      />,
    );

    expect(getSlot('total_projected_retirement_savings').getAttribute('data-animate-color')).toBe(
      LETTER_TEXT_COLOR,
    );
    expect(getSlot('gap').getAttribute('data-animate-color')).toBe(LETTER_TEXT_COLOR);
    expect(getSlot('additional_monthly_savings_needed').getAttribute('data-animate-color')).toBe(
      LETTER_TEXT_COLOR,
    );
    expect(getSlot('total_monthly_savings_needed').getAttribute('data-animate-color')).toBe(
      LETTER_TEXT_COLOR,
    );
    expect(getSlot('retirement_target').getAttribute('data-animate-color')).toBe(
      LETTER_TEXT_COLOR,
    );
  });

  it('keeps rendered fixed and summary values frozen when slider state changes', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      annualExpenses: 90000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    const initialCalculation = calculate(inputs);
    const updatedSliderState = {
      monthlySavings: 2500,
      targetRetirementAge: 70,
    };
    const updatedCalculation = calculate(inputs, updatedSliderState);

    const { rerender } = render(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: inputs.monthlySavings,
          targetRetirementAge: inputs.targetRetirementAge,
        }}
      />,
    );

    expect(getSlot('retirement_target').textContent).toBe(
      formatCurrency(initialCalculation.retirementTarget),
    );
    expect(getSlot('retirement_target').getAttribute('data-animate-color')).toBe(
      LETTER_TEXT_COLOR,
    );
    expect(screen.getAllByText(formatCurrency(initialCalculation.gap)).length).toBeGreaterThan(0);

    rerender(<TheLetter inputs={inputs} sliderState={updatedSliderState} />);

    expect(getSlot('retirement_target').textContent).toBe(
      formatCurrency(initialCalculation.retirementTarget),
    );
    expect(getSlot('retirement_target').getAttribute('data-animate-color')).toBe(
      LETTER_TEXT_COLOR,
    );
    expect(screen.getAllByText(formatCurrency(initialCalculation.gap)).length).toBeGreaterThan(0);
    expect(screen.queryByText(formatCurrency(updatedCalculation.gap))).toBeNull();
    expect(
      screen.queryByText(
        formatCurrency(updatedCalculation.totalProjectedRetirementSavings),
      ),
    ).toBeNull();
  });
});

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

function getSlot(slotName) {
  return document.querySelector(`[data-slot-name="${slotName}"]`);
}
