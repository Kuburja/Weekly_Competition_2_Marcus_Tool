import { calculate } from '../calc';
import { SLIDER_COPY } from '../copy';
import {
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_SURFACE,
  COLOR_TEXT,
  COLOR_TEXT_SECONDARY,
  FONT_BODY,
  FONT_HEADING,
} from '../constants';
import SliderRow from './SliderRow';
import {
  formatMonthlySavingsShort,
  formatMonthlySavingsValue,
  formatRetirementAgeShort,
  formatRetirementAgeValue,
  getMonthlySavingsMax,
  getSliderContext,
} from './sliderExplorerUtils';

function SliderExplorer({ inputs, isMobile, onReset, onSliderChange, sliderState }) {
  const monthlySavingsMax = getMonthlySavingsMax(inputs.monthlySavings);
  const calculation = calculate(inputs, sliderState);
  const context = getSliderContext({ inputs, sliderState });

  if (!calculation) {
    return null;
  }

  return (
    <section style={styles.section}>
      {isMobile && <hr style={styles.rule} />}
      <div style={isMobile ? styles.mobilePanel : styles.panel}>
        <div style={styles.headingBlock}>
          <h2 style={isMobile ? styles.mobileHeading : styles.heading}>
            {SLIDER_COPY.heading}
          </h2>
          <p style={isMobile ? styles.mobileSubhead : styles.subhead}>
            {SLIDER_COPY.subhead}
          </p>
        </div>

        <div style={styles.sliderStack}>
          <SliderRow
            fieldId="monthly-savings-slider"
            helperText={SLIDER_COPY.monthlyHelper}
            iconType="savings"
            label={SLIDER_COPY.monthlyLabel}
            max={monthlySavingsMax}
            maxLabel={formatMonthlySavingsShort(monthlySavingsMax)}
            min={0}
            minLabel="$0"
            onChange={(value) => onSliderChange('monthlySavings', value)}
            shortValueText={formatMonthlySavingsShort(sliderState.monthlySavings)}
            step={100}
            value={sliderState.monthlySavings}
            valueText={formatMonthlySavingsValue(sliderState.monthlySavings)}
          />
          <SliderRow
            fieldId="retirement-age-slider"
            helperText={SLIDER_COPY.retirementAgeHelper}
            iconType="retirement"
            label={SLIDER_COPY.retirementAgeLabel}
            max={80}
            maxLabel="80"
            min={inputs.currentAge + 1}
            minLabel={formatRetirementAgeShort(inputs.currentAge + 1)}
            onChange={(value) => onSliderChange('targetRetirementAge', value)}
            shortValueText={formatRetirementAgeShort(sliderState.targetRetirementAge)}
            step={1}
            value={sliderState.targetRetirementAge}
            valueText={formatRetirementAgeValue(sliderState.targetRetirementAge)}
          />
        </div>

        <p style={isMobile ? styles.mobileContext : styles.context}>{context}</p>

        <div style={styles.ctaBlock}>
          <button style={isMobile ? styles.mobileButton : styles.button} type="button">
            {SLIDER_COPY.ctaButton}
          </button>
          <p style={styles.ctaText}>{SLIDER_COPY.ctaSupportingLine}</p>
        </div>

        <div style={styles.resetBlock}>
          <button
            onClick={onReset}
            style={isMobile ? styles.mobileResetButton : styles.resetButton}
            type="button"
          >
            Start over
          </button>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    width: '100%',
  },
  rule: {
    margin: '0 0 40px',
    border: 'none',
    borderTop: `1px solid ${COLOR_SECONDARY}`,
  },
  panel: {
    backgroundColor: COLOR_SURFACE,
    border: `1px solid ${COLOR_SECONDARY}`,
    padding: '40px 36px 36px',
  },
  mobilePanel: {
    backgroundColor: COLOR_SURFACE,
    border: `1px solid ${COLOR_SECONDARY}`,
    padding: '24px 18px 20px',
  },
  headingBlock: {
    display: 'grid',
    gap: '12px',
  },
  heading: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: '48px',
    lineHeight: 0.95,
  },
  mobileHeading: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: '34px',
    lineHeight: 1,
  },
  subhead: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '18px',
    lineHeight: 1.6,
  },
  mobileSubhead: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '16px',
    lineHeight: 1.55,
  },
  sliderStack: {
    display: 'grid',
    gap: '14px',
    marginTop: '32px',
  },
  context: {
    margin: '28px 0 0',
    color: COLOR_TEXT,
    fontFamily: FONT_BODY,
    fontSize: '18px',
    lineHeight: 1.6,
  },
  mobileContext: {
    margin: '24px 0 0',
    color: COLOR_TEXT,
    fontFamily: FONT_BODY,
    fontSize: '16px',
    lineHeight: 1.55,
  },
  ctaBlock: {
    display: 'grid',
    justifyItems: 'center',
    gap: '14px',
    marginTop: '36px',
  },
  button: {
    width: '320px',
    border: 'none',
    backgroundColor: COLOR_PRIMARY,
    color: COLOR_SURFACE,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '18px',
    fontWeight: 600,
    padding: '16px 20px',
  },
  mobileButton: {
    width: '100%',
    border: 'none',
    backgroundColor: COLOR_PRIMARY,
    color: COLOR_SURFACE,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px 18px',
  },
  ctaText: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '16px',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  resetBlock: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '18px',
  },
  resetButton: {
    border: `1px solid ${COLOR_SECONDARY}`,
    backgroundColor: 'transparent',
    color: COLOR_TEXT,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '16px',
    fontWeight: 600,
    padding: '12px 18px',
  },
  mobileResetButton: {
    width: '100%',
    border: `1px solid ${COLOR_SECONDARY}`,
    backgroundColor: 'transparent',
    color: COLOR_TEXT,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '15px',
    fontWeight: 600,
    padding: '11px 16px',
  },
};

export default SliderExplorer;
