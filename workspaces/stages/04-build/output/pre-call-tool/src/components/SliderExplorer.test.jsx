/* @vitest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { calculate } from '../calc';
import SliderExplorer from './SliderExplorer';

describe('SliderExplorer', () => {
  const inputs = {
    currentAge: 40,
    income: 180000,
    currentSavings: 100000,
    monthlySavings: 1500,
    targetRetirementAge: 65,
  };

  const sliderState = {
    monthlySavings: 1500,
    targetRetirementAge: 65,
  };

  it('renders the retirement outlook summary from the current calculations', () => {
    const onReset = vi.fn();
    const onSliderChange = vi.fn();
    const calculation = calculate(inputs, sliderState);

    render(
      <SliderExplorer
        inputs={inputs}
        isMobile={false}
        onReset={onReset}
        onSliderChange={onSliderChange}
        sliderState={sliderState}
      />,
    );

    expect(screen.getByText('Your retirement outlook')).toBeTruthy();
    expect(screen.getByText('Projected savings')).toBeTruthy();
    expect(screen.getByText('Retirement target')).toBeTruthy();
    expect(screen.getByText('Gap')).toBeTruthy();
    expect(
      screen.getByText(`${Math.round((calculation.totalProjectedRetirementSavings / calculation.retirementTarget) * 100)}%`),
    ).toBeTruthy();
    expect(screen.getByText('Slightly Behind')).toBeTruthy();
  });
});
