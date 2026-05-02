import {
  ANNUAL_RETURN_RATE,
  MONTHLY_RETURN_RATE,
  MONTHS_PER_YEAR,
  RETIREMENT_MULTIPLE,
} from './constants';

const REQUIRED_INPUT_KEYS = [
  'currentAge',
  'income',
  'currentSavings',
  'monthlySavings',
  'targetRetirementAge',
];

const SLIDER_OVERRIDE_KEYS = ['monthlySavings', 'targetRetirementAge'];

function isValidNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function hasValidAgeInputs(values) {
  return (
    Number.isInteger(values.currentAge) &&
    values.currentAge > 0 &&
    Number.isInteger(values.targetRetirementAge) &&
    values.targetRetirementAge > values.currentAge
  );
}

function hasValidNonAgeInputs(values) {
  return ['income', 'currentSavings', 'monthlySavings'].every(
    (key) => {
      const value = values[key];
      return isValidNumber(value) && value >= 0;
    },
  );
}

function hasOnlyValidInputs(values) {
  return (
    REQUIRED_INPUT_KEYS.every((key) => isValidNumber(values[key])) &&
    hasValidAgeInputs(values) &&
    hasValidNonAgeInputs(values)
  );
}

function getAllowedSliderOverrides(sliderOverrides) {
  return SLIDER_OVERRIDE_KEYS.reduce((allowedOverrides, key) => {
    if (Object.prototype.hasOwnProperty.call(sliderOverrides, key)) {
      allowedOverrides[key] = sliderOverrides[key];
    }

    return allowedOverrides;
  }, {});
}

function getContributionGrowthFactor(monthsToRetirement) {
  return (
    (Math.pow(1 + MONTHLY_RETURN_RATE, monthsToRetirement) - 1) /
    MONTHLY_RETURN_RATE
  );
}

export function calculate(inputs, sliderOverrides = {}) {
  if (!inputs || typeof inputs !== 'object' || typeof sliderOverrides !== 'object') {
    return null;
  }

  const allowedSliderOverrides = getAllowedSliderOverrides(sliderOverrides);
  const resolvedInputs = {
    ...inputs,
    ...allowedSliderOverrides,
  };

  if (!hasOnlyValidInputs(resolvedInputs)) {
    return null;
  }

  const annualExpenses = Math.max(
    0,
    resolvedInputs.income - (resolvedInputs.monthlySavings * MONTHS_PER_YEAR),
  );

  const yearsToRetirement =
    resolvedInputs.targetRetirementAge - resolvedInputs.currentAge;
  const monthsToRetirement = yearsToRetirement * MONTHS_PER_YEAR;

  const retirementTarget =
    annualExpenses * RETIREMENT_MULTIPLE;
  const futureValueCurrentSavings =
    resolvedInputs.currentSavings *
    Math.pow(1 + ANNUAL_RETURN_RATE, yearsToRetirement);
  const contributionGrowthFactor =
    getContributionGrowthFactor(monthsToRetirement);
  const futureValueMonthlyContributions =
    resolvedInputs.monthlySavings * contributionGrowthFactor;
  const totalProjectedRetirementSavings =
    futureValueCurrentSavings + futureValueMonthlyContributions;
  const gap =
    retirementTarget - totalProjectedRetirementSavings;

  if (gap <= 0) {
    return {
      retirementTarget,
      futureValueCurrentSavings,
      futureValueMonthlyContributions,
      totalProjectedRetirementSavings,
      gap,
      additionalMonthlySavingsNeeded: 0,
      totalMonthlySavingsNeeded: null,
      yearsToRetirement,
      monthsToRetirement,
    };
  }

  const additionalMonthlySavingsNeeded = gap / contributionGrowthFactor;

  return {
    retirementTarget,
    futureValueCurrentSavings,
    futureValueMonthlyContributions,
    totalProjectedRetirementSavings,
    gap,
    additionalMonthlySavingsNeeded,
    totalMonthlySavingsNeeded:
      resolvedInputs.monthlySavings + additionalMonthlySavingsNeeded,
    yearsToRetirement,
    monthsToRetirement,
  };
}
