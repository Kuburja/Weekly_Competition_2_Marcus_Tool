import { describe, expect, it } from 'vitest';

import {
  CARD_STEPS,
  getInitialFieldValue,
  validateStepValue,
} from './cardFlowConfig';

describe('CARD_STEPS', () => {
  it('defines the five fields in the required order', () => {
    expect(CARD_STEPS.map((step) => step.key)).toEqual([
      'currentAge',
      'income',
      'currentSavings',
      'monthlySavings',
      'targetRetirementAge',
    ]);
  });

  it('provides descriptive placeholders for every step', () => {
    expect(CARD_STEPS.map((step) => step.placeholder)).toEqual([
      'e.g. 38',
      'e.g. $85,000',
      'e.g. $42,000',
      'e.g. $500',
      'e.g. 65',
    ]);
  });
});

describe('getInitialFieldValue', () => {
  it('returns string defaults for each field type', () => {
    expect(getInitialFieldValue('currentAge')).toBe('');
    expect(getInitialFieldValue('income')).toBe('');
  });
});

describe('validateStepValue', () => {
  it('rejects empty current age', () => {
    expect(
      validateStepValue('currentAge', '', {
        currentAge: null,
      }),
    ).toEqual({
      value: null,
      error: 'Enter your current age in whole years.',
    });
  });

  it('rejects fractional ages', () => {
    expect(
      validateStepValue('currentAge', '40.5', {
        currentAge: null,
      }),
    ).toEqual({
      value: null,
      error: 'Enter an age between 18 and 79.',
    });
  });

  it('accepts zero-valued currency inputs', () => {
    expect(
      validateStepValue('monthlySavings', '$0', {
        currentAge: 40,
      }),
    ).toEqual({
      value: 0,
      error: '',
    });
  });

  it('rejects negative currency inputs', () => {
    expect(
      validateStepValue('income', '-1', {
        currentAge: 40,
      }),
    ).toEqual({
      value: null,
      error: 'Household income must be greater than $0.',
    });
  });

  it('requires target retirement age to exceed current age', () => {
    expect(
      validateStepValue('targetRetirementAge', '40', {
        currentAge: 40,
      }),
    ).toEqual({
      value: null,
      error: 'Retirement age must be greater than your current age and no later than 80.',
    });
  });

  it('parses formatted currency strings into numbers', () => {
    expect(
      validateStepValue('currentSavings', '$125,500.25', {
        currentAge: 40,
      }),
    ).toEqual({
      value: 125500.25,
      error: '',
    });
  });
});
