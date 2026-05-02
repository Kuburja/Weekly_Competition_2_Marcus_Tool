import { describe, expect, it } from 'vitest';

import { calculate } from './calc';

describe('calculate', () => {
  it('projects a behind-target scenario and computes the monthly gap closure', () => {
    const results = calculate({
      currentAge: 40,
      income: 180000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    });

    expect(results).not.toBeNull();
    expect(results.retirementTarget).toBe(4050000);
    expect(results.yearsToRetirement).toBe(25);
    expect(results.monthsToRetirement).toBe(300);
    expect(results.futureValueCurrentSavings).toBeCloseTo(542743.2640122897);
    expect(results.futureValueMonthlyContributions).toBeCloseTo(1215107.5395346663);
    expect(results.totalProjectedRetirementSavings).toBeCloseTo(1757850.803546956);
    expect(results.gap).toBeCloseTo(2292149.196453044);
    expect(results.additionalMonthlySavingsNeeded).toBeCloseTo(2829.56337839551);
    expect(results.totalMonthlySavingsNeeded).toBeCloseTo(4329.56337839551);
  });

  it('returns zero extra savings and null total needed when the user is ahead', () => {
    const results = calculate({
      currentAge: 35,
      income: 220000,
      currentSavings: 800000,
      monthlySavings: 2500,
      targetRetirementAge: 65,
    });

    expect(results).not.toBeNull();
    expect(results.gap).toBeLessThanOrEqual(0);
    expect(results.additionalMonthlySavingsNeeded).toBe(0);
    expect(results.totalMonthlySavingsNeeded).toBeNull();
  });

  it('clamps derived annual expenses at zero when annual savings exceed income', () => {
    const results = calculate({
      currentAge: 40,
      income: 60000,
      currentSavings: 10000,
      monthlySavings: 6000,
      targetRetirementAge: 65,
    });

    expect(results).not.toBeNull();
    expect(results.retirementTarget).toBe(0);
    expect(results.gap).toBeLessThanOrEqual(0);
    expect(results.additionalMonthlySavingsNeeded).toBe(0);
    expect(results.totalMonthlySavingsNeeded).toBeNull();
  });

  it('applies slider overrides without mutating the original inputs', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    const results = calculate(inputs, {
      monthlySavings: 2000,
      targetRetirementAge: 67,
    });

    expect(inputs.monthlySavings).toBe(1500);
    expect(inputs.targetRetirementAge).toBe(65);
    expect(results).not.toBeNull();
    expect(results.yearsToRetirement).toBe(27);
    expect(results.monthsToRetirement).toBe(324);
    expect(results.futureValueCurrentSavings).toBeCloseTo(621386.7629676706);
    expect(results.futureValueMonthlyContributions).toBeCloseTo(1914212.6776368755);
    expect(results.totalProjectedRetirementSavings).toBeCloseTo(2535599.440604546);
    expect(results.gap).toBeCloseTo(1364400.559395454);
    expect(results.additionalMonthlySavingsNeeded).toBeCloseTo(1425.5475113453192);
    expect(results.totalMonthlySavingsNeeded).toBeCloseTo(3425.5475113453194);
  });

  it('ignores slider override keys outside monthly savings and target retirement age', () => {
    const inputs = {
      currentAge: 40,
      income: 180000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    };

    const baseline = calculate(inputs);
    const results = calculate(inputs, {
      currentAge: 10,
      income: 1,
      monthlySavings: 1500,
    });

    expect(results).toEqual(baseline);
  });

  it('returns null when the target retirement age is not greater than the current age', () => {
    const results = calculate({
      currentAge: 50,
      income: 150000,
      currentSavings: 300000,
      monthlySavings: 1800,
      targetRetirementAge: 50,
    });

    expect(results).toBeNull();
  });

  it('returns null when the current age is fractional', () => {
    const results = calculate({
      currentAge: 40.5,
      income: 150000,
      currentSavings: 300000,
      monthlySavings: 1800,
      targetRetirementAge: 65,
    });

    expect(results).toBeNull();
  });

  it('returns null when the target retirement age is fractional', () => {
    const results = calculate({
      currentAge: 40,
      income: 150000,
      currentSavings: 300000,
      monthlySavings: 1800,
      targetRetirementAge: 65.5,
    });

    expect(results).toBeNull();
  });

  it('returns null when the current age is zero', () => {
    const results = calculate({
      currentAge: 0,
      income: 150000,
      currentSavings: 300000,
      monthlySavings: 1800,
      targetRetirementAge: 65,
    });

    expect(results).toBeNull();
  });

  it('returns null when any required input is not numeric', () => {
    const results = calculate({
      currentAge: 40,
      income: '150000',
      currentSavings: 300000,
      monthlySavings: 1800,
      targetRetirementAge: 65,
    });

    expect(results).toBeNull();
  });

  it('locks the canonical behavior for gap <= 0 by returning zero additional savings needed', () => {
    const results = calculate({
      currentAge: 35,
      income: 220000,
      currentSavings: 800000,
      monthlySavings: 2500,
      targetRetirementAge: 65,
    });

    expect(results).not.toBeNull();
    expect(results.gap).toBeLessThanOrEqual(0);
    expect(results.additionalMonthlySavingsNeeded).toBe(0);
    expect(results.totalMonthlySavingsNeeded).toBeNull();
  });
});
