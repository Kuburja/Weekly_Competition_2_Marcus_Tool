function isPresent(value) {
  return value != null;
}

function createLine(label, value) {
  if (!isPresent(value)) {
    return null;
  }

  return { label, value };
}

export function getRetirementTooltipContent({
  calculation,
  formatCurrency,
  formatPercent,
  inputs,
  type,
}) {
  if (!calculation || !inputs) {
    return null;
  }

  if (type === 'projectedSavings') {
    return {
      title: 'How projected savings is calculated',
      description:
        'This value combines your current savings with your ongoing monthly contributions, then grows both forward using the app’s annual return assumption until your target retirement age.',
      lines: [
        createLine('Current savings', formatCurrency(inputs.currentSavings)),
        createLine('Monthly contribution', formatCurrency(inputs.monthlySavings)),
        createLine('Expected return', formatPercent(calculation.annualReturnRate)),
        createLine('Years until retirement', String(calculation.yearsToRetirement)),
        createLine(
          'Projected value of current savings',
          formatCurrency(calculation.futureValueCurrentSavings),
        ),
        createLine(
          'Projected value of monthly contributions',
          formatCurrency(calculation.futureValueMonthlyContributions),
        ),
      ].filter(Boolean),
    };
  }

  if (type === 'retirementTarget') {
    return {
      title: 'How retirement target is calculated',
      description:
        'In this tool, the retirement target is based on estimated annual spending. Estimated spending is your household income minus the annual amount you are currently saving, then multiplied by the app’s retirement multiple.',
      lines: [
        createLine('Household income', formatCurrency(inputs.income)),
        createLine(
          'Annual savings from monthly contribution',
          formatCurrency(calculation.annualSavings),
        ),
        createLine(
          'Estimated annual spending',
          formatCurrency(calculation.annualExpenses),
        ),
        createLine(
          'Retirement multiple',
          isPresent(calculation.retirementMultiple)
            ? `${calculation.retirementMultiple}x`
            : null,
        ),
        createLine(
          'Target formula',
          `${formatCurrency(calculation.annualExpenses)} x ${calculation.retirementMultiple} = ${formatCurrency(
            calculation.retirementTarget,
          )}`,
        ),
      ].filter(Boolean),
    };
  }

  if (type === 'gap') {
    return {
      title: 'How gap is calculated',
      description:
        'This value is the difference between the retirement target and projected savings.',
      lines: [
        createLine('Formula', 'Gap = Retirement target - Projected savings'),
        createLine(
          'Live values',
          `Gap = ${formatCurrency(calculation.retirementTarget)} - ${formatCurrency(
            calculation.totalProjectedRetirementSavings,
          )} = ${formatCurrency(calculation.gap)}`,
        ),
      ].filter(Boolean),
    };
  }

  return null;
}
