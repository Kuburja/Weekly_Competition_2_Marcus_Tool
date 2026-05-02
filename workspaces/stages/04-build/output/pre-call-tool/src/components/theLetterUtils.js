import { LETTER_TEMPLATES, LETTER_TIER_META } from '../copy';

const WHOLE_DOLLAR_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const REACTIVE_SLOT_NAMES = [
  'total_projected_retirement_savings',
  'gap',
  'additional_monthly_savings_needed',
  'total_monthly_savings_needed',
  'years_to_retirement',
  'target_retirement_age',
];

export function selectLetterTierKey(calculation) {
  if (!calculation || calculation.retirementTarget <= 0) {
    return LETTER_TIER_META[0].key;
  }

  const gapRatio = calculation.gap / calculation.retirementTarget;

  return (
    LETTER_TIER_META.find((tier) => {
      const minPasses =
        tier.minGapRatio == null
          ? true
          : tier.minInclusive
            ? gapRatio >= tier.minGapRatio
            : gapRatio > tier.minGapRatio;
      const maxPasses =
        tier.maxGapRatio == null
          ? true
          : tier.maxInclusive
            ? gapRatio <= tier.maxGapRatio
            : gapRatio < tier.maxGapRatio;

      return minPasses && maxPasses;
    })?.key ?? LETTER_TIER_META[LETTER_TIER_META.length - 1].key
  );
}

export function formatSlotValue(slotName, inputs, calculation) {
  if (!inputs || !calculation) {
    return '';
  }

  switch (slotName) {
    case 'total_projected_retirement_savings':
      return formatCurrency(calculation.totalProjectedRetirementSavings);
    case 'retirement_target':
      return formatCurrency(calculation.retirementTarget);
    case 'gap':
      return formatCurrency(Math.abs(calculation.gap));
    case 'additional_monthly_savings_needed':
      return formatCurrency(calculation.additionalMonthlySavingsNeeded);
    case 'total_monthly_savings_needed':
      return calculation.totalMonthlySavingsNeeded == null
        ? ''
        : formatCurrency(calculation.totalMonthlySavingsNeeded);
    case 'years_to_retirement':
      return String(calculation.yearsToRetirement);
    case 'target_retirement_age':
      return String(inputs.currentAge + calculation.yearsToRetirement);
    case 'monthly_savings':
      return formatCurrency(inputs.monthlySavings);
    default:
      return '';
  }
}

export function renderTemplateParts(template) {
  const parts = [];
  const slotPattern = /{{([a-z_]+)}}/g;
  let lastIndex = 0;

  template.replaceAll(slotPattern, (match, slotName, offset) => {
    if (offset > lastIndex) {
      parts.push({
        type: 'text',
        value: template.slice(lastIndex, offset),
      });
    }

    parts.push({
      type: 'slot',
      value: slotName,
    });
    lastIndex = offset + match.length;

    return match;
  });

  if (lastIndex < template.length) {
    parts.push({
      type: 'text',
      value: template.slice(lastIndex),
    });
  }

  return parts;
}

export function getLetterContent(lockedTierKey) {
  const template = LETTER_TEMPLATES[lockedTierKey] ?? '';
  const sections = template.trim().split(/\n\s*\n/);
  const signature = sections.pop() ?? '';

  return {
    paragraphs: sections,
    signature,
  };
}

export function getReactiveSlotValues(inputs, calculation) {
  return REACTIVE_SLOT_NAMES.reduce((slotValues, slotName) => {
    slotValues[slotName] = formatSlotValue(slotName, inputs, calculation);
    return slotValues;
  }, {});
}

function formatCurrency(value) {
  return WHOLE_DOLLAR_FORMATTER.format(value);
}
