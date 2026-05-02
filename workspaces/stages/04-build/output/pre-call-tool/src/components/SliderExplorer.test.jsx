/* @vitest-environment jsdom */
import { render, screen, within } from '@testing-library/react';
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

    expect(screen.getByText('Adjust Your Path')).toBeTruthy();
    expect(screen.getByText('Retirement progress')).toBeTruthy();
    expect(
      screen.getByText(`${Math.round((calculation.totalProjectedRetirementSavings / calculation.retirementTarget) * 100)}%`),
    ).toBeTruthy();
    expect(screen.getByText('of target')).toBeTruthy();
  });

  it('shows an ahead-by message when projected savings exceed the target', () => {
    const onReset = vi.fn();
    const onSliderChange = vi.fn();
    const aheadInputs = {
      ...inputs,
      currentSavings: 5000000,
    };
    const aheadCalculation = calculate(aheadInputs, sliderState);

    render(
      <SliderExplorer
        inputs={aheadInputs}
        isMobile={false}
        onReset={onReset}
        onSliderChange={onSliderChange}
        sliderState={sliderState}
      />,
    );

    expect(aheadCalculation.gap).toBeLessThan(0);
    expect(screen.getByText('Ahead by')).toBeTruthy();
    expect(
      screen.getByText(`$${Math.round(Math.abs(aheadCalculation.gap)).toLocaleString('en-US')}`),
    ).toBeTruthy();
  });

  it('renders the retirement progress ring above the sliders on mobile', () => {
    const onReset = vi.fn();
    const onSliderChange = vi.fn();

    const { container } = render(
      <SliderExplorer
        inputs={inputs}
        isMobile
        onReset={onReset}
        onSliderChange={onSliderChange}
        sliderState={sliderState}
      />,
    );

    const ringTitle = within(container).getByText('Retirement progress');
    const monthlySavingsLabel = within(container).getByText('Monthly savings');

    expect(
      ringTitle.compareDocumentPosition(monthlySavingsLabel) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
