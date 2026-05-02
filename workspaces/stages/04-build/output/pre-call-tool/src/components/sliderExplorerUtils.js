import { calculate } from '../calc';
import { SLIDER_COPY } from '../copy';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const wholeNumberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

export function formatMonthlySavingsValue(value) {
  return `${currencyFormatter.format(value)} / month`;
}

export function formatMonthlySavingsShort(value) {
  return currencyFormatter.format(value);
}

export function formatRetirementAgeValue(value) {
  return `Age ${value}`;
}

export function formatRetirementAgeShort(value) {
  return String(value);
}

export function getMonthlySavingsMax(monthlySavings) {
  return Math.max(monthlySavings * 3, 5000);
}

export function formatCurrencyWhole(value) {
  return currencyFormatter.format(value);
}

export function formatPercentWhole(value) {
  return `${wholeNumberFormatter.format(value)}%`;
}

export function getProgressPercent(calculation) {
  if (!calculation || calculation.retirementTarget <= 0) {
    return 0;
  }

  const percent = (calculation.totalProjectedRetirementSavings / calculation.retirementTarget) * 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

export function getOutlookTone(calculation) {
  if (!calculation || calculation.retirementTarget <= 0) {
    return {
      label: 'In View',
      tone: 'neutral',
    };
  }

  const percent = getProgressPercent(calculation);

  if (calculation.gap <= 0) {
    return {
      label: 'On Track',
      tone: 'positive',
    };
  }

  if (percent >= 40) {
    return {
      label: 'Slightly Behind',
      tone: 'caution',
    };
  }

  return {
    label: 'Needs Attention',
    tone: 'alert',
  };
}

export function getProjectedChange(originalCalculation, nextCalculation) {
  if (!originalCalculation || !nextCalculation) {
    return 0;
  }

  return nextCalculation.totalProjectedRetirementSavings - originalCalculation.totalProjectedRetirementSavings;
}

export function getSliderContext({ inputs, sliderState }) {
  const originalCalculation = calculate(inputs);
  const nextCalculation = calculate(inputs, sliderState);

  if (!originalCalculation || !nextCalculation) {
    return SLIDER_COPY.unchangedContext;
  }

  const hasChanged =
    sliderState.monthlySavings !== inputs.monthlySavings ||
    sliderState.targetRetirementAge !== inputs.targetRetirementAge;

  if (!hasChanged) {
    return SLIDER_COPY.unchangedContext;
  }

  if (nextCalculation.gap <= 0) {
    return SLIDER_COPY.onTargetContext;
  }

  if (nextCalculation.gap < originalCalculation.gap) {
    return SLIDER_COPY.improvingContext;
  }

  return SLIDER_COPY.unchangedContext;
}
