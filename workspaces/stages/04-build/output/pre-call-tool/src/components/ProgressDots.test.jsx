/* @vitest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ProgressDots from './ProgressDots';

describe('ProgressDots', () => {
  it('uses centered alignment by default and accepts a custom justify value', () => {
    const { rerender } = render(
      <ProgressDots completedCount={1} currentIndex={1} total={4} />,
    );

    expect(screen.getByRole('group', { name: 'Progress: step 2 of 4' }).style.justifyContent).toBe(
      'center',
    );

    rerender(
      <ProgressDots
        completedCount={1}
        currentIndex={1}
        justify="flex-start"
        total={4}
      />,
    );

    expect(screen.getByRole('group', { name: 'Progress: step 2 of 4' }).style.justifyContent).toBe(
      'flex-start',
    );
  });
});
