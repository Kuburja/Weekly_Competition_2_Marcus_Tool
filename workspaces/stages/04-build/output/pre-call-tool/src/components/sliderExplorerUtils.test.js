import { describe, expect, it } from 'vitest';

import { SLIDER_COPY } from '../copy';
import { calculate } from '../calc';
import {
  formatMonthlySavingsValue,
  formatRetirementAgeValue,
  getOutlookTone,
  getMonthlySavingsMax,
  getSliderContext,
} from './sliderExplorerUtils';

describe('sliderExplorerUtils', () => {
  const inputs = {
    currentAge: 40,
    income: 180000,
    annualExpenses: 90000,
    currentSavings: 100000,
    monthlySavings: 1500,
    targetRetirementAge: 65,
  };

  it('derives the monthly savings ceiling and slider display labels', () => {
    expect(getMonthlySavingsMax(inputs.monthlySavings)).toBe(5000);
    expect(formatMonthlySavingsValue(2000)).toBe('$2,000 / month');
    expect(formatRetirementAgeValue(68)).toBe('Age 68');
  });

  it('returns unchanged copy when the sliders match the original inputs', () => {
    expect(
      getSliderContext({
        inputs,
        sliderState: {
          monthlySavings: inputs.monthlySavings,
          targetRetirementAge: inputs.targetRetirementAge,
        },
      }),
    ).toBe(SLIDER_COPY.unchangedContext);
  });

  it('returns improving copy when the gap shrinks but remains open', () => {
    expect(
      getSliderContext({
        inputs,
        sliderState: {
          monthlySavings: 1600,
          targetRetirementAge: 66,
        },
      }),
    ).toBe(SLIDER_COPY.improvingContext);
  });

  it('returns on-target copy when the recalculation closes the gap', () => {
    const originalCalculation = calculate(inputs);
    const onTargetState = {
      monthlySavings:
        Math.ceil((originalCalculation.totalMonthlySavingsNeeded ?? 0) / 100) * 100,
      targetRetirementAge: inputs.targetRetirementAge,
    };

    expect(
      calculate(inputs, onTargetState).gap,
    ).toBeLessThanOrEqual(0);
    expect(
      getSliderContext({
        inputs,
        sliderState: onTargetState,
      }),
    ).toBe(SLIDER_COPY.onTargetContext);
  });

  it('classifies the current outcome into an outlook tone for the summary badge', () => {
    expect(getOutlookTone(calculate(inputs))).toMatchObject({
      label: 'Slightly Behind',
      tone: 'caution',
    });
  });
});
