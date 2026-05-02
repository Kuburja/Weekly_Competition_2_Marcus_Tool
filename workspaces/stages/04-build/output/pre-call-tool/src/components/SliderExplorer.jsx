import { calculate } from '../calc';
import { SLIDER_COPY } from '../copy';
import {
  COLOR_ACCENT,
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
  formatCurrencyWhole,
  formatMonthlySavingsShort,
  formatMonthlySavingsValue,
  formatPercentWhole,
  formatRetirementAgeShort,
  formatRetirementAgeValue,
  getMonthlySavingsMax,
  getOutlookTone,
  getProgressPercent,
  getProjectedChange,
  getSliderContext,
} from './sliderExplorerUtils';

const BORDER_SOFT = '#D8CDBE';
const SURFACE_SOFT = '#FBF7EF';
const PANEL_SHADOW = '0 24px 60px rgba(62, 46, 31, 0.08)';
const POSITIVE_BG = '#EEF4E7';
const POSITIVE_TEXT = '#5B7D3C';
const CAUTION_BG = '#F1F0E4';
const CAUTION_TEXT = '#60704B';
const ALERT_BG = '#F7E7E0';
const ALERT_TEXT = '#9B4E35';

function SparkleMark() {
  return (
    <svg aria-hidden="true" height="28" viewBox="0 0 24 24" width="28">
      <path
        d="M12 1.5c.7 5.3 1.2 5.8 6.5 6.5-5.3.7-5.8 1.2-6.5 6.5-.7-5.3-1.2-5.8-6.5-6.5 5.3-.7 5.8-1.2 6.5-6.5Z"
        fill="none"
        stroke={COLOR_ACCENT}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function TrendLine() {
  return (
    <svg aria-hidden="true" height="74" viewBox="0 0 260 74" width="100%" style={{ display: 'block', height: 'auto' }}>
      <path
        d="M10 58c20-4 24-10 39-8 12 1 17-7 28-8 12-1 14-9 28-10 16-1 19-10 32-12 12-2 17-7 28-6 0 5 7 0 16-1 11-1 18-11 29-12"
        fill="none"
        stroke={COLOR_PRIMARY}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M231 4h18v18"
        fill="none"
        stroke={COLOR_PRIMARY}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M249 4 226 27"
        fill="none"
        stroke={COLOR_PRIMARY}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <circle cx="249" cy="4" fill={COLOR_ACCENT} r="3" />
    </svg>
  );
}

function LeafBadge() {
  return (
    <svg aria-hidden="true" height="22" viewBox="0 0 24 24" width="22">
      <circle cx="12" cy="12" fill="none" r="10" stroke={COLOR_SECONDARY} strokeWidth="1.5" />
      <path
        d="M7.5 12.5c4.4.1 7.1-2.4 8.7-6 1.5 4.7.4 8.9-4 10.5-2.5.9-4.1-.5-4.7-2.1Z"
        fill="none"
        stroke={COLOR_PRIMARY}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9 16c1.4-2.1 3.2-3.8 5.7-5.2"
        fill="none"
        stroke={COLOR_PRIMARY}
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ProgressRing({ gap, percent }) {
  const radius = 86;
  const circumference = 2 * Math.PI * radius;
  const boundedPercent = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference - (boundedPercent / 100) * circumference;
  const isAhead = gap < 0;

  return (
    <div style={styles.ringWrap}>
      <svg aria-hidden="true" height="160" viewBox="0 0 220 220" width="160">
        <circle
          cx="110"
          cy="110"
          fill="none"
          r={radius}
          stroke="#E9E2D7"
          strokeWidth="18"
        />
        <circle
          cx="110"
          cy="110"
          fill="none"
          r={radius}
          stroke={COLOR_PRIMARY}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="18"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '110px 110px',
          }}
        />
      </svg>
      <div style={styles.ringLabel}>
        {isAhead ? (
          <>
            <span style={styles.ringCaption}>Ahead by</span>
            <span style={styles.ringValueCompact}>{formatCurrencyWhole(Math.abs(gap))}</span>
          </>
        ) : (
          <>
            <span style={styles.ringValue}>{formatPercentWhole(percent)}</span>
            <span style={styles.ringCaption}>of target</span>
          </>
        )}
      </div>
    </div>
  );
}

function getBadgeStyle(tone) {
  if (tone === 'positive') {
    return {
      backgroundColor: POSITIVE_BG,
      color: POSITIVE_TEXT,
    };
  }

  if (tone === 'alert') {
    return {
      backgroundColor: ALERT_BG,
      color: ALERT_TEXT,
    };
  }

  return {
    backgroundColor: CAUTION_BG,
    color: CAUTION_TEXT,
  };
}

function getTrendCopy(context, calculation) {
  if (calculation.gap <= 0) {
    return 'Your changes moved you onto the target line.';
  }

  if (context === SLIDER_COPY.improvingContext) {
    return 'Your changes are putting you on a stronger path.';
  }

  return 'You can keep adjusting to see how the gap responds.';
}

function getDeltaLabel(changeAmount) {
  if (changeAmount > 0) {
    return `+${formatCurrencyWhole(changeAmount)}`;
  }

  if (changeAmount < 0) {
    return `-${formatCurrencyWhole(Math.abs(changeAmount))}`;
  }

  return 'No change';
}

function SliderExplorer({ inputs, isMobile, onSliderChange, sliderState }) {
  const monthlySavingsMax = getMonthlySavingsMax(inputs.monthlySavings);
  const originalCalculation = calculate(inputs);
  const calculation = calculate(inputs, sliderState);
  const context = getSliderContext({ inputs, sliderState });

  if (!calculation || !originalCalculation) {
    return null;
  }

  const outlookTone = getOutlookTone(calculation);
  const progressPercent = getProgressPercent(calculation);
  const projectedChange = getProjectedChange(originalCalculation, calculation);
  const badgeStyle = getBadgeStyle(outlookTone.tone);
  const hasPositiveGap = calculation.gap > 0;

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
        {isMobile ? (
          <div style={styles.mobileLayout}>
            <div style={styles.ringWrapper}>
              <p style={styles.ringTitle}>Retirement progress</p>
              <ProgressRing gap={calculation.gap} percent={progressPercent} />
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
            <p style={styles.mobileContext}>
              <span style={styles.contextLead}>Tip:</span> {context}
            </p>
          </div>
        ) : (
          <div style={styles.layout}>
            <div style={styles.slidersAndTip}>
              <div style={styles.slidersRow}>
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
              <p style={styles.context}>
                <span style={styles.contextLead}>Tip:</span> {context}
              </p>
            </div>
            <div style={styles.ringWrapper}>
              <p style={styles.ringTitle}>Retirement progress</p>
              <ProgressRing gap={calculation.gap} percent={progressPercent} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const styles = {
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  rule: {
    margin: '0 0 40px',
    border: 'none',
    borderTop: `1px solid ${COLOR_SECONDARY}`,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    background: `radial-gradient(circle at top left, #fffaf3 0%, ${COLOR_SURFACE} 55%, #fffaf1 100%)`,
    border: `1px solid ${BORDER_SOFT}`,
    borderRadius: '28px',
    padding: '26px clamp(24px, 3.2vw, 38px) 28px',
    boxShadow: PANEL_SHADOW,
  },
  mobilePanel: {
    background: `radial-gradient(circle at top left, #fffaf3 0%, ${COLOR_SURFACE} 55%, #fffaf1 100%)`,
    border: `1px solid ${BORDER_SOFT}`,
    borderRadius: '24px',
    padding: '24px 16px 22px',
    boxShadow: '0 18px 42px rgba(62, 46, 31, 0.08)',
  },
  sparkleRow: {
    display: 'flex',
    justifyContent: 'center',
  },
  headingBlock: {
    display: 'grid',
    gap: '12px',
    justifyItems: 'center',
    textAlign: 'center',
    marginTop: '8px',
  },
  heading: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: 'clamp(26px, 3.8vw, 48px)',
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
    fontSize: 'clamp(16px, 2vw, 18px)',
    lineHeight: 1.6,
    maxWidth: '720px',
  },
  mobileSubhead: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '16px',
    lineHeight: 1.55,
  },
  layout: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '28px',
    marginTop: '72px',
  },
  slidersAndTip: {
    flex: 1,
    display: 'grid',
    gap: '16px',
    alignContent: 'start',
  },
  slidersRow: {
    display: 'grid',
    gap: '18px',
  },
  sliderRingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  mobileSliderRingRow: {
    display: 'grid',
    gap: '22px',
    justifyItems: 'center',
  },
  mobileLayout: {
    display: 'grid',
    gap: '22px',
    marginTop: '30px',
  },
  sliderColumn: {
    minWidth: 0,
  },
  sliderStack: {
    display: 'grid',
    gap: '18px',
  },
  context: {
    margin: 0,
    padding: '0 2px',
    color: '#748862',
    fontFamily: FONT_BODY,
    fontSize: 'clamp(16px, 2vw, 18px)',
    lineHeight: 1.6,
  },
  mobileContext: {
    margin: '18px 0 0',
    color: '#748862',
    fontFamily: FONT_BODY,
    fontSize: '16px',
    lineHeight: 1.55,
  },
  contextLead: {
    color: '#82966D',
    fontWeight: 600,
  },
  outlookColumn: {
    minWidth: 0,
    display: 'grid',
    gap: '18px',
  },
  outlookCard: {
    border: `1px solid ${BORDER_SOFT}`,
    borderRadius: '22px',
    backgroundColor: 'rgba(255, 253, 249, 0.92)',
    overflow: 'hidden',
  },
  outlookHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '24px 24px 8px',
    flexWrap: 'wrap',
  },
  outlookHeading: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: 'clamp(18px, 2.5vw, 28px)',
    fontWeight: 500,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '14px',
    padding: '10px 14px',
    fontFamily: FONT_BODY,
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1,
  },
  statusDot: {
    width: '9px',
    height: '9px',
    borderRadius: '999px',
    backgroundColor: 'currentColor',
  },
  outlookMetrics: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '24px',
    padding: '6px 24px 22px',
  },
  mobileOutlookMetrics: {
    display: 'grid',
    gap: '18px',
    justifyItems: 'center',
    padding: '6px 18px 18px',
  },
  ringWrap: {
    position: 'relative',
    width: '160px',
    height: '160px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  ringValue: {
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: '38px',
    lineHeight: 0.9,
  },
  ringValueCompact: {
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: '26px',
    lineHeight: 1,
    textAlign: 'center',
  },
  ringCaption: {
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '13px',
    lineHeight: 1,
  },
  metricList: {
    display: 'grid',
    gap: '16px',
    flex: 1,
    minWidth: 0,
  },
  metricRow: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '12px',
  },
  metricLabel: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '15px',
    lineHeight: 1.2,
  },
  metricValue: {
    margin: '6px 0 0',
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: 'clamp(18px, 2.5vw, 36px)',
    lineHeight: 0.95,
  },
  metricDivider: {
    height: '1px',
    backgroundColor: '#E9E0D3',
  },
  metricDelta: {
    display: 'grid',
    justifyItems: 'center',
    gap: '4px',
    minWidth: '96px',
    borderRadius: '14px',
    padding: '10px 12px',
    fontFamily: FONT_BODY,
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1.1,
    textAlign: 'center',
  },
  positiveDelta: {
    backgroundColor: POSITIVE_BG,
    color: POSITIVE_TEXT,
  },
  negativeDelta: {
    backgroundColor: SURFACE_SOFT,
    color: COLOR_PRIMARY,
  },
  metricDeltaCaption: {
    fontSize: '12px',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },
  metricDash: {
    color: COLOR_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '28px',
    lineHeight: 1,
    paddingRight: '12px',
  },
  ringWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  ringTitle: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  trendPanel: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: '14px',
    alignItems: 'flex-end',
    borderTop: `1px solid #E9E0D3`,
    padding: '18px 24px 18px',
    overflow: 'hidden',
  },
  trendCopy: {
    display: 'grid',
    gap: '6px',
    flex: '1 1 0',
    minWidth: 0,
  },
  trendHeading: {
    margin: 0,
    color: COLOR_TEXT,
    fontFamily: FONT_BODY,
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  trendText: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '15px',
    lineHeight: 1.45,
  },
  trendGraphic: {
    display: 'flex',
    alignItems: 'flex-end',
    flex: '0 0 auto',
    width: '35%',
    maxWidth: '160px',
    minWidth: '60px',
    overflow: 'hidden',
  },
  noteCard: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    gap: '12px',
    alignItems: 'start',
    border: `1px solid ${BORDER_SOFT}`,
    borderRadius: '18px',
    padding: '16px 18px',
    backgroundColor: '#F5F3E8',
  },
  noteCopy: {
    display: 'grid',
    gap: '4px',
  },
  noteHeadline: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: '20px',
    lineHeight: 1.1,
  },
  noteText: {
    margin: 0,
    color: COLOR_TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '15px',
    lineHeight: 1.45,
  },
  ctaBlock: {
    display: 'grid',
    justifyItems: 'center',
    gap: '14px',
    marginTop: '34px',
  },
  button: {
    width: 'min(100%, 420px)',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: COLOR_PRIMARY,
    color: COLOR_SURFACE,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '18px',
    fontWeight: 700,
    padding: '18px 20px',
    boxShadow: '0 16px 30px rgba(35, 71, 54, 0.18)',
  },
  mobileButton: {
    width: '100%',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: COLOR_PRIMARY,
    color: COLOR_SURFACE,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '16px',
    fontWeight: 700,
    padding: '15px 18px',
    boxShadow: '0 14px 28px rgba(35, 71, 54, 0.18)',
  },
  resetBlock: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '18px',
  },
  resetButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: COLOR_PRIMARY,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '16px',
    fontWeight: 600,
    padding: '8px 12px',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
  mobileResetButton: {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    color: COLOR_PRIMARY,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    fontSize: '15px',
    fontWeight: 600,
    padding: '10px 16px',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};

export default SliderExplorer;
