# Calculation Logic Specification

This document defines the calculation rules for Marcus's "Are We Okay?" pre-call retirement tool. It is the canonical source for the tool's math and should be implemented exactly as written unless Marcus changes the methodology.

## Purpose

Marcus uses this tool to recreate the same simple retirement math he walks through in the first 20 minutes of an intro call. The tool should give users an honest snapshot of where they stand and, when they are behind, show a practical path forward instead of stopping at a negative verdict.

The logic should stay intentionally simple:

- Retirement target is based on the 25x rule.
- Investment growth assumes a flat 7% average annual return.
- Inputs are limited to the values Marcus actually uses in conversation.
- Outputs should be understandable without financial expertise.

## Required Inputs

The tool must collect these six inputs:

| Input | Type | Notes |
|---|---|---|
| Current age | number | Whole years. |
| Income | currency | Annual household income. Used for context in copy, not core retirement math. |
| Annual expenses | currency | Required for Marcus's 25x target calculation. |
| Current savings | currency | Current retirement/investment savings balance. |
| Monthly savings | currency | Ongoing monthly contribution going forward. |
| Target retirement age | number | Whole years. |

## Core Assumptions

Use these assumptions everywhere in the tool:

- Retirement target multiple: `25`
- Assumed average annual return: `7%`
- Monthly rate for contribution growth: `0.07 / 12`
- Contribution frequency: monthly
- Projection horizon: from current age to target retirement age

No inflation adjustment, tax modeling, salary growth modeling, Social Security estimate, or withdrawal sequencing should be added in this version.

## Derived Values

Calculate these intermediate values before producing final outputs:

- `years_to_retirement = target_retirement_age - current_age`
- `months_to_retirement = years_to_retirement * 12`
- `annual_return_rate = 0.07`
- `monthly_return_rate = annual_return_rate / 12`

Ages are collected in whole years, so `years_to_retirement` should also be treated as a whole number.

## Retirement Target Calculation

Marcus's retirement target must be calculated exactly as:

`retirement_target = annual_expenses * 25`

This is the primary benchmark shown to the user. The tool should not substitute income, withdrawal-rate variants, or any other target method.

## Future Value Projection for Current Savings

Current savings should be projected forward using annual compounding based on Marcus's 7% average annual return:

`future_value_current_savings = current_savings * pow(1 + annual_return_rate, years_to_retirement)`

Where:

- `current_savings` is the user's current balance
- `annual_return_rate = 0.07`
- `years_to_retirement = target_retirement_age - current_age`

If `current_savings = 0`, this value is `0`.

## Future Value Projection for Ongoing Monthly Contributions

Monthly savings should be projected using a standard future value of a monthly contribution stream with monthly compounding:

`future_value_monthly_contributions = monthly_savings * ((pow(1 + monthly_return_rate, months_to_retirement) - 1) / monthly_return_rate)`

Where:

- `monthly_savings` is the user's monthly contribution
- `monthly_return_rate = 0.07 / 12`
- `months_to_retirement = years_to_retirement * 12`

Assume contributions are made at the end of each month. Do not add an additional `(1 + monthly_return_rate)` factor for beginning-of-month contributions.

If `monthly_savings = 0`, this value is `0`.

## Total Projected Retirement Savings

Projected retirement savings at the target retirement age is the sum of the two projected components:

`total_projected_retirement_savings = future_value_current_savings + future_value_monthly_contributions`

This total is the number compared against the retirement target.

## Gap Calculation

Gap must be calculated exactly as:

`gap = retirement_target - total_projected_retirement_savings`

Interpretation:

- `gap > 0`: the user is behind target by that amount
- `gap = 0`: the user is exactly on target
- `gap < 0`: the user is ahead of target by `abs(gap)`

The underlying math should preserve negative values so the product can distinguish "ahead" from "exactly on track."

## Path-Forward Calculations

When the user is behind, the tool must show how the gap could be closed. These path-forward scenarios are part of the product, not an optional enhancement.

### Additional Monthly Savings Needed to Close the Gap by the Target Date

When `gap > 0` and `months_to_retirement > 0`, calculate the additional monthly savings required to fully close the gap by the current target retirement age:

`additional_monthly_savings_needed = gap / ((pow(1 + monthly_return_rate, months_to_retirement) - 1) / monthly_return_rate)`

Then calculate the total monthly savings needed:

`total_monthly_savings_needed = monthly_savings + additional_monthly_savings_needed`

Behavior:

- If `gap <= 0`, `additional_monthly_savings_needed = 0`
- If `gap <= 0`, `total_monthly_savings_needed` is not applicable and should not be displayed
- If `months_to_retirement <= 0`, do not calculate this value; treat it as not applicable
- If `additional_monthly_savings_needed` is not applicable, `total_monthly_savings_needed` is also not applicable and should not be displayed

### How the Gap Changes if Retirement Is Delayed

When the target retirement age changes, recalculate the full model using the same formulas with the new horizon:

- `years_to_retirement`
- `months_to_retirement`
- `future_value_current_savings`
- `future_value_monthly_contributions`
- `total_projected_retirement_savings`
- `gap`
- `additional_monthly_savings_needed`
- `total_monthly_savings_needed`

The result should show that delaying retirement can reduce the gap in two ways:

- assets have more time to compound
- monthly contributions continue for more months

### Smaller Timeline Adjustments

The slider experience should make smaller adjustments meaningful. Each one-year change to retirement age should trigger the same full recalculation so the user can see whether modest delays materially improve the outcome.

The tool does not need a separate special-case formula for "small changes." It should simply recompute the entire projection each time the retirement age changes.

## Slider Interaction Math

The slider explorer has two controls:

- Monthly savings slider
- Retirement age slider

### Monthly Savings Slider

When the monthly savings slider changes:

- Replace `monthly_savings` with the slider value
- Keep all other inputs unchanged
- Recalculate `future_value_monthly_contributions`
- Recalculate `total_projected_retirement_savings`
- Recalculate `gap`
- Recalculate `additional_monthly_savings_needed`
- Recalculate `total_monthly_savings_needed` when `gap > 0`
- Treat `total_monthly_savings_needed` as not applicable when `gap <= 0`

`future_value_current_savings` does not change when only monthly savings changes.

### Retirement Age Slider

When the retirement age slider changes:

- Replace `target_retirement_age` with the slider value
- Recalculate `years_to_retirement` and `months_to_retirement`
- Recalculate all projection outputs using the new time horizon

Both projected current savings and projected monthly contributions must change when retirement age changes.

### Combined Interaction Rule

If both sliders are adjusted, calculations should always be based on the latest values of both controls. There should be no staged or partial math; each interaction should produce a fresh full recalculation from the raw inputs plus the current slider state.

## Display and Rounding Rules

For consistency across the tool:

- Keep calculation precision separate from display formatting
- Round only for display
- Display currency as whole dollars with standard thousands separators
- Display percentages as whole percentages unless a later UI explicitly needs one decimal place

Examples:

- `$125,000`
- `$1,840,000`
- `7%`

For user-facing copy:

- `retirement_target`: show as currency rounded to the nearest whole dollar
- `future_value_current_savings`: show as currency rounded to the nearest whole dollar
- `future_value_monthly_contributions`: show as currency rounded to the nearest whole dollar
- `total_projected_retirement_savings`: show as currency rounded to the nearest whole dollar
- `gap`: show as currency rounded to the nearest whole dollar
- `additional_monthly_savings_needed`: show as currency rounded to the nearest whole dollar
- `total_monthly_savings_needed`: show as currency rounded to the nearest whole dollar only when `gap > 0` and the value is calculated
- `income`, `annual_expenses`, `current_savings`, `monthly_savings`: display as entered currency values, normalized to whole dollars if needed

If the UI wants friendlier copy, it may also label negative gap as "ahead by" using the absolute value for display, but the underlying stored value should remain negative.

## Edge Cases

### Zero Current Savings

If `current_savings = 0`:

- `future_value_current_savings = 0`
- all remaining calculations should still work normally

The tool should not imply failure just because the starting balance is zero.

### Zero Monthly Savings

If `monthly_savings = 0`:

- `future_value_monthly_contributions = 0`
- total projected savings is based only on current savings growth
- if the user is behind, path-forward messaging should emphasize the additional monthly savings needed

### Retirement Age Less Than or Equal to Current Age

If `target_retirement_age <= current_age`, the projection horizon is invalid for forward-looking retirement math.

Behavior:

- do not run compounding formulas with zero or negative time
- flag the input state as invalid
- show a clear validation message telling the user the retirement age must be greater than the current age
- suppress projected outputs and path-forward calculations until the input is corrected

### Negative or Zero Gap

If `gap = 0`:

- user is exactly on target
- `additional_monthly_savings_needed = 0`
- `total_monthly_savings_needed` is not applicable and should not be displayed

If `gap < 0`:

- user is ahead of target
- display the result as ahead by `abs(gap)` if desired
- `additional_monthly_savings_needed = 0`
- `total_monthly_savings_needed` is not applicable and should not be displayed

The tool should not ask for more savings if the user is already on target or ahead.

### Invalid Negative Inputs

The following inputs cannot be negative:

- current age
- income
- annual expenses
- current savings
- monthly savings
- target retirement age

Behavior:

- negative values should be blocked by input validation where possible
- if negative values still enter the calculation layer, treat the state as invalid
- do not calculate or display projections until corrected

## Output Intent and Messaging Requirements

The logic should support three broad states:

- behind target
- on target
- ahead of target

But the product intent is especially important for the "behind" case:

- The tool must never stop at "you are short by X."
- It must also calculate what closing the gap looks like.
- The primary recovery levers are monthly savings increases and retirement age adjustments.

This means the calculation layer must always expose enough data for the UI to answer questions like:

- "How much more per month would close the gap by your current target date?"
- "What happens if you retire one year later?"
- "What happens if you save a little more each month and work a little longer?"

## Implementation Summary

For any valid input state:

1. Calculate `years_to_retirement` and `months_to_retirement`.
2. Calculate `retirement_target = annual_expenses * 25`.
3. Project current savings forward at `7%` annual growth.
4. Project monthly contributions forward at `7% / 12` monthly growth.
5. Sum both projected values into `total_projected_retirement_savings`.
6. Calculate `gap = retirement_target - total_projected_retirement_savings`.
7. If `gap > 0`, calculate `additional_monthly_savings_needed`.
8. If `gap > 0`, calculate `total_monthly_savings_needed = monthly_savings + additional_monthly_savings_needed`; otherwise treat `total_monthly_savings_needed` as not applicable.
9. Recompute the full model whenever the monthly savings or retirement age slider changes.

This specification is intentionally simple and should be implemented without adding extra planning assumptions beyond Marcus's stated method.
