/* @vitest-environment jsdom */
import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { COLOR_ACCENT, COLOR_TEXT } from '../constants';

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

  it('formats reactive and fixed slots for display-safe letter copy', () => {
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
    expect(formatSlotValue('gap', inputs, calculation)).toBe('$492,149');
  });

  it('keeps years to retirement tied to the original completed inputs', () => {
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
      '25',
    );
    expect(
      formatSlotValue('target_retirement_age', inputs, reactiveCalculation),
    ).toBe('65');
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
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('updates reactive slot values without changing the locked tone tier', () => {
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

    expect(
      screen.getByText(/The shortfall at this level is not a crisis/i),
    ).toBeTruthy();
    expect(
      screen.getByText(
        formatCurrency(initialCalculation.totalProjectedRetirementSavings),
      ),
    ).toBeTruthy();

    rerender(<TheLetter inputs={inputs} sliderState={updatedSliderState} />);

    expect(
      screen.getByText(/The shortfall at this level is not a crisis/i),
    ).toBeTruthy();
    expect(
      screen.getByText(
        formatCurrency(updatedCalculation.totalProjectedRetirementSavings),
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(formatCurrency(updatedCalculation.gap)),
    ).toBeTruthy();
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

  it('keeps a slot highlighted for 600ms from its most recent change', async () => {
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

    expect(getSlot('gap').getAttribute('data-animate-color')).toBe(COLOR_ACCENT);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(400);
    });

    rerender(
      <TheLetter
        inputs={inputs}
        sliderState={{
          monthlySavings: 2500,
          targetRetirementAge: 65,
        }}
      />,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(250);
    });

    expect(getSlot('gap').getAttribute('data-animate-color')).toBe(COLOR_ACCENT);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(349);
    });

    expect(getSlot('gap').getAttribute('data-animate-color')).toBe(COLOR_ACCENT);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(getSlot('gap').getAttribute('data-animate-color')).toBe(COLOR_TEXT);
  });

  it('only highlights allowed reactive slots when slider state changes', () => {
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
      COLOR_ACCENT,
    );
    expect(getSlot('gap').getAttribute('data-animate-color')).toBe(COLOR_ACCENT);
    expect(getSlot('additional_monthly_savings_needed').getAttribute('data-animate-color')).toBe(
      COLOR_ACCENT,
    );
    expect(getSlot('total_monthly_savings_needed').getAttribute('data-animate-color')).toBe(
      COLOR_ACCENT,
    );
    expect(getSlot('retirement_target').getAttribute('data-animate-color')).toBe(
      COLOR_TEXT,
    );
  });

  it('keeps rendered fixed slots frozen when slider state changes', () => {
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
      COLOR_TEXT,
    );
    expect(screen.getByText(formatCurrency(initialCalculation.gap))).toBeTruthy();

    rerender(<TheLetter inputs={inputs} sliderState={updatedSliderState} />);

    expect(getSlot('retirement_target').textContent).toBe(
      formatCurrency(initialCalculation.retirementTarget),
    );
    expect(getSlot('retirement_target').getAttribute('data-animate-color')).toBe(
      COLOR_TEXT,
    );
    expect(screen.getByText(formatCurrency(updatedCalculation.gap))).toBeTruthy();
    expect(screen.queryByText(formatCurrency(initialCalculation.gap))).toBeNull();
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
