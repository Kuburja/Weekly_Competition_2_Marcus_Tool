import { COLOR_ACCENT, COLOR_PRIMARY, COLOR_SURFACE, FONT_BODY, FONT_HEADING } from '../constants';

const BORDER_SOFT = '#DECFC1';
const SURFACE_SOFT = '#F4EEE3';
const TRACK_REMAINING = '#DDDDD8';
const TEXT_MUTED = '#7B817D';
const TEXT_SECONDARY = '#4E5752';

function DollarIcon() {
  return (
    <svg fill="none" height="14" viewBox="0 0 20 20" width="14" xmlns="http://www.w3.org/2000/svg">
      <text
        dominantBaseline="auto"
        fill={COLOR_PRIMARY}
        fontFamily="Inter, sans-serif"
        fontSize="17"
        fontWeight="700"
        textAnchor="middle"
        x="10"
        y="16"
      >
        $
      </text>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg fill="none" height="14" viewBox="0 0 20 20" width="14" xmlns="http://www.w3.org/2000/svg">
      <rect height="13" rx="2" stroke={COLOR_PRIMARY} strokeWidth="1.5" width="16" x="2" y="4" />
      <path d="M2 8h16" stroke={COLOR_PRIMARY} strokeWidth="1.5" />
      <path d="M6 2v3M14 2v3" stroke={COLOR_PRIMARY} strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function SliderRow({
  fieldId,
  helperText,
  iconType,
  label,
  max,
  maxLabel,
  min,
  minLabel,
  onChange,
  shortValueText,
  step,
  value,
  valueText,
}) {
  const percent = max === min ? 100 : ((value - min) / (max - min)) * 100;

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={styles.iconCircle}>
          {iconType === 'savings' ? <DollarIcon /> : <CalendarIcon />}
        </div>
        <div style={styles.textBlock}>
          <label htmlFor={fieldId} style={styles.cardLabel}>
            {label}
          </label>
          <p style={styles.helperText}>{helperText}</p>
        </div>
        <div style={styles.valuePill}>{valueText}</div>
      </div>
      <div style={styles.sliderArea}>
        <input
          aria-label={label}
          className="slider-custom"
          id={fieldId}
          max={max}
          min={min}
          onChange={(e) => onChange(Number(e.target.value))}
          step={step}
          style={{
            ...styles.input,
            '--fill-pct': `${percent}%`,
          }}
          type="range"
          value={value}
        />
        <div style={styles.labelsRow}>
          <span style={styles.trackLabel}>{minLabel}</span>
          <span style={styles.trackLabel}>{shortValueText}</span>
          <span style={styles.trackLabel}>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255, 253, 249, 0.94)',
    border: `1px solid ${BORDER_SOFT}`,
    borderRadius: '22px',
    padding: '14px 16px 14px',
    boxShadow: '0 12px 28px rgba(40, 35, 28, 0.05)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '10px',
  },
  iconCircle: {
    width: '30px',
    height: '30px',
    minWidth: '30px',
    borderRadius: '999px',
    background: SURFACE_SOFT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: '1 1 240px',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  cardLabel: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: 'clamp(17px, 1.8vw, 19px)',
    fontWeight: 500,
    lineHeight: 1.15,
    cursor: 'pointer',
  },
  helperText: {
    margin: 0,
    color: TEXT_SECONDARY,
    fontFamily: FONT_BODY,
    fontSize: '14px',
    lineHeight: 1.45,
  },
  valuePill: {
    background: COLOR_PRIMARY,
    borderRadius: '999px',
    padding: '10px 16px',
    color: 'white',
    fontFamily: FONT_BODY,
    fontSize: '15px',
    fontWeight: 700,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    alignSelf: 'flex-start',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  sliderArea: {
    marginTop: '12px',
  },
  input: {
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '100%',
    height: '5px',
    borderRadius: '999px',
    outline: 'none',
    cursor: 'pointer',
    margin: 0,
    display: 'block',
  },
  labelsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
  },
  trackLabel: {
    fontFamily: FONT_BODY,
    fontSize: '13px',
    color: TEXT_MUTED,
    lineHeight: 1.3,
  },
};

export default SliderRow;
