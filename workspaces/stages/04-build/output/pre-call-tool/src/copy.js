export const CARD_REACTIONS = [
  ["Good. Now let's see what you're bringing in.", "Got it. Now — household income."],
  (income) => {
    if (income < 50000) return "Got it. Let's see what you've managed to set aside.";
    if (income <= 120000) return "Got it. Now let's see what you've saved.";
    return "Got it. Let's see what you've put away.";
  },
  (savings) => {
    if (savings < 10000) return "That's where a lot of people are. Let's see what you're putting in each month.";
    if (savings <= 60000) return "A real foundation. Let's see what you're adding to it.";
    return "That's something to build on. Let's see what's going in each month.";
  },
  (monthly) => {
    if (monthly < 500) return "It all compounds. Let's see when you want to get there.";
    if (monthly <= 1000) return "That's real progress every month. Now let's talk timing.";
    return "That's serious momentum. Let's see when you want to land.";
  },
  "Alright, let's run it.",
];

export const LETTER_TIER_META = [
  {
    key: 'wayAhead',
    label: 'Way Ahead',
    minGapRatio: null,
    maxGapRatio: -0.3,
    maxInclusive: true,
    emotionalRegister:
      'Warm confidence. Affirm real strength without overselling. The goal is to keep good momentum going, not celebrate.',
  },
  {
    key: 'slightlyAhead',
    label: 'Slightly Ahead',
    minGapRatio: -0.3,
    maxGapRatio: -0.05,
    minInclusive: false,
    maxInclusive: true,
    emotionalRegister:
      'Quiet optimism. The picture looks good. Note what is working and where a small adjustment could make it even better.',
  },
  {
    key: 'onTrack',
    label: 'On Track',
    minGapRatio: -0.05,
    maxGapRatio: 0.05,
    minInclusive: false,
    maxInclusive: false,
    emotionalRegister:
      'Steady and grounded. Things are in balance. Surface any fragility without alarm - the meeting is about staying there.',
  },
  {
    key: 'slightlyBehind',
    label: 'Slightly Behind',
    minGapRatio: 0.05,
    maxGapRatio: 0.25,
    minInclusive: true,
    maxInclusive: false,
    emotionalRegister:
      'Honest and calm. Name the gap plainly. Show the path forward is real and manageable with the right moves.',
  },
  {
    key: 'significantlyBehind',
    label: 'Significantly Behind',
    minGapRatio: 0.25,
    maxGapRatio: 0.6,
    minInclusive: true,
    maxInclusive: false,
    emotionalRegister:
      'Direct and constructive. The gap is real and needs attention. The letter leans heavily toward the path forward - this is what the meeting is for.',
  },
  {
    key: 'wayBehind',
    label: 'Way Behind',
    minGapRatio: 0.6,
    maxGapRatio: null,
    minInclusive: true,
    emotionalRegister:
      'Clear-eyed and forward-leaning. The picture is hard to look at. Do not soften it. But anchor the letter in what is still possible.',
  },
];

export const LETTER_TEMPLATES = {
  wayAhead: `You are in strong shape. Your projected savings of {{total_projected_retirement_savings}} put you meaningfully ahead of your retirement target of {{retirement_target}}.

That gives us options. In the meeting, I want to look at how those savings are structured — taxes, investment mix, and the risks that do not show up neatly in a calculator. You have built a strong base. Now we make sure the plan around it is just as strong.

Marcus`,
  slightlyAhead: `You are tracking ahead of your {{retirement_target}} retirement target. With projected savings of {{total_projected_retirement_savings}} and {{years_to_retirement}} years left, you are not starting from behind.

That is a good place to plan from. In our meeting, we will look at whether your current savings rate is enough to keep that cushion, and whether small changes now could give you more flexibility later.

Marcus`,
  onTrack: `You are on track. Your projected savings of {{total_projected_retirement_savings}} are close to your {{retirement_target}} retirement target, and the math is holding together right now.

That does not mean the plan is locked in. A market pullback, a pause in saving, or a higher expense year can still move the numbers. In our meeting, we will look at where the risks are and whether there are simple ways to give you more cushion.

Marcus`,
  slightlyBehind: `There is a gap. At your current pace, your projected savings of {{total_projected_retirement_savings}} fall short of your {{retirement_target}} retirement target by roughly {{gap}}.

That is not a crisis. It is a drift we can look at clearly. Closing the full gap would mean saving about {{additional_monthly_savings_needed}} more per month, for a total of {{total_monthly_savings_needed}}. In our meeting, we will look at whether that number is realistic — and what other options may help close the gap.

Marcus`,
  significantlyBehind: `Your projected savings of {{total_projected_retirement_savings}} are tracking significantly short of your {{retirement_target}} retirement target. The gap is roughly {{gap}}.

That is not an easy number, but it is useful to know before we sit down. Closing the full gap would take about {{additional_monthly_savings_needed}} more per month, bringing your total monthly savings to {{total_monthly_savings_needed}}. In our meeting, we will look at what can realistically change — savings rate, investment structure, timing, and what a practical path forward looks like.

Marcus`,
  wayBehind: `Your projected savings of {{total_projected_retirement_savings}} fall well short of your {{retirement_target}} retirement target. The gap is roughly {{gap}}.

That number is serious, but it gives us a clear place to start. Closing the full gap would require about {{additional_monthly_savings_needed}} more per month, for a total of {{total_monthly_savings_needed}}. That may not be realistic, and that is okay. In our meeting, we will work through what is actually available to you and build a plan from there.

Marcus`,
};

export const SLIDER_COPY = {
  heading: 'Adjust Your Path',
  subhead:
    "See how small changes shift your outcome. Drag either slider to explore what's possible.",
  monthlyLabel: 'Monthly savings',
  monthlyHelper:
    'This is where the math changes most. Even $100 more per month adds up fast.',
  retirementAgeLabel: 'Target retirement age',
  retirementAgeHelper:
    'Working a year or two longer gives your money more time to compound and you more time to save.',
  unchangedContext: 'Drag the sliders to see what shifts.',
  improvingContext:
    "You're closing the gap. Keep adjusting to see how close you can get.",
  onTargetContext: "That closes it. You're on target now.",
  ctaButton: 'Schedule your meeting',
  ctaSupportingLine:
    "You've seen your numbers. Let's talk about the next step.",
};
