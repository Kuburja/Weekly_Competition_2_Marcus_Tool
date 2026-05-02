export const CARD_STEPS = [
  {
    key: 'currentAge',
    label: 'How old are you?',
    kind: 'integer',
    placeholder: 'e.g. 38',
    min: 18,
    max: 79,
    emptyError: 'We need your age to get started.',
    invalidError: 'Enter an age between 18 and 79.',
  },
  {
    key: 'income',
    label: 'What does your household bring home each year?',
    kind: 'currency',
    placeholder: 'e.g. $85,000',
    emptyError: 'Enter your household income.',
    invalidError: 'Household income must be greater than $0.',
    lowError: "That's on the low side for a yearly income — double-check you've entered your annual total.",
    lowThreshold: 10000,
  },
  {
    key: 'currentSavings',
    label: 'What do you have set aside right now?',
    kind: 'currency',
    placeholder: 'e.g. $42,000',
    emptyError: 'Enter your current savings.',
    invalidError: 'Current savings cannot be negative.',
  },
  {
    key: 'monthlySavings',
    label: 'Monthly savings',
    kind: 'currency',
    placeholder: 'e.g. $500',
    emptyError: 'Enter your monthly savings.',
    invalidError: 'Monthly savings cannot be negative.',
  },
  {
    key: 'targetRetirementAge',
    label: 'When do you want to retire?',
    kind: 'integer',
    placeholder: 'e.g. 65',
    max: 80,
    emptyError: 'Enter your target retirement age in whole years.',
    invalidError: 'Retirement age must be greater than your current age and no later than 80.',
  },
];

const STEP_MAP = Object.fromEntries(CARD_STEPS.map((step) => [step.key, step]));

export function getInitialFieldValue() {
  return '';
}

function parseCurrency(value) {
  const normalized = value.replace(/[$,\s]/g, '');

  if (!normalized) {
    return null;
  }

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return Number.NaN;
  }

  return Number(normalized);
}

function parseInteger(value) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (!/^\d+$/.test(normalized)) {
    return Number.NaN;
  }

  return Number(normalized);
}

export function validateStepValue(stepKey, rawValue, inputsSoFar) {
  const step = STEP_MAP[stepKey];

  if (!step) {
    return {
      value: null,
      error: 'Unknown field.',
    };
  }

  const parsedValue =
    step.kind === 'currency' ? parseCurrency(rawValue) : parseInteger(rawValue);

  if (parsedValue === null) {
    return {
      value: null,
      error: step.emptyError,
    };
  }

  if (Number.isNaN(parsedValue)) {
    return {
      value: null,
      error: step.invalidError,
    };
  }

  if (step.kind === 'currency') {
    const minValue = stepKey === 'income' ? 0 : -1;
    if (parsedValue <= minValue) {
      return { value: null, error: step.invalidError };
    }
    if (step.lowThreshold != null && parsedValue < step.lowThreshold) {
      return { value: null, error: step.lowError };
    }
  }

  if (stepKey === 'currentAge' && (parsedValue < 18 || parsedValue > 79)) {
    return { value: null, error: step.invalidError };
  }

  if (stepKey === 'targetRetirementAge') {
    if (parsedValue <= (inputsSoFar.currentAge ?? 0) || parsedValue > 80) {
      return { value: null, error: step.invalidError };
    }
  }

  return {
    value: parsedValue,
    error: '',
  };
}
