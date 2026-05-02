import { calculate } from '../calc';
import { SLIDER_COPY } from '../copy';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
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
