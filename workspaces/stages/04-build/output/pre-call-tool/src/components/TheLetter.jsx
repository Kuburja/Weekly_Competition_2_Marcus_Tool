import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { calculate } from '../calc';
import { LETTER_TIER_META } from '../copy';
import {
  formatSlotValue,
  getLetterContent,
  getReactiveSlotValues,
  renderTemplateParts,
  selectLetterTierKey,
} from './theLetterUtils';

const WHOLE_DOLLAR_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const TIER_BADGE_COLORS = {
  wayAhead: '#4F7A5A',
  slightlyAhead: '#6F8F5F',
  onTrack: '#7A7054',
  slightlyBehind: '#B8893B',
  significantlyBehind: '#B9673F',
  wayBehind: '#B84F34',
};

const C = {
  cardBg: '#FFFDF8',
  textMain: '#1F252B',
  signature: '#8A7B64',
  accentRust: '#B84F34',
  accentRustDark: '#9F3F2A',
  accentLine: '#D8B9A5',
  borderSoft: '#CDBFAE',
  borderLight: '#E4D3C2',
  dividerDashed: '#DEC7B5',
  statCardBg: '#FBF7EF',
  statLabel: '#3F464C',
};

const FONT_SANS = '"Inter", "Helvetica Neue", Arial, sans-serif';
const FONT_SERIF = '"Cormorant Garamond", Georgia, serif';
const FONT_SCRIPT = '"Great Vibes", "Allura", cursive';

function StatCard({ label, value, isMobile }) {
  return (
    <div style={isMobile ? styles.mobileStatCard : styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={isMobile ? styles.mobileStatValue : styles.statValue}>{value}</div>
    </div>
  );
}

function SectionLabel({ children, isMobile }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={isMobile ? styles.mobileSectionLabelText : styles.sectionLabelText}>
        {children}
      </div>
      <div style={styles.sectionAccentLine} />
    </div>
  );
}

function TheLetter({ inputs, isMobile, sliderState }) {
  const initialCalculation = useMemo(() => calculate(inputs), [inputs]);
  const lockedTierKey = useMemo(
    () => selectLetterTierKey(initialCalculation),
    [initialCalculation],
  );
  const reactiveCalculation = calculate(inputs, sliderState);
  const { paragraphs, signature } = useMemo(
    () => getLetterContent(lockedTierKey),
    [lockedTierKey],
  );
  const reactiveSlotValues = useMemo(
    () => getReactiveSlotValues(inputs, reactiveCalculation),
    [inputs, reactiveCalculation],
  );
  const [highlightedSlots, setHighlightedSlots] = useState(() => new Set());
  const previousReactiveSlotValuesRef = useRef(null);
  const slotTimeoutsRef = useRef(new Map());

  useEffect(() => {
    return () => {
      slotTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      slotTimeoutsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!reactiveCalculation) {
      return undefined;
    }

    const previousReactiveSlotValues = previousReactiveSlotValuesRef.current;
    previousReactiveSlotValuesRef.current = reactiveSlotValues;

    if (previousReactiveSlotValues == null) {
      return undefined;
    }

    const changedSlots = Object.keys(reactiveSlotValues).filter(
      (slotName) =>
        previousReactiveSlotValues[slotName] !== reactiveSlotValues[slotName],
    );

    if (changedSlots.length === 0) {
      return undefined;
    }

    setHighlightedSlots((currentSlots) => {
      const nextSlots = new Set(currentSlots);
      changedSlots.forEach((slotName) => nextSlots.add(slotName));
      return nextSlots;
    });

    changedSlots.forEach((slotName) => {
      const existingTimeoutId = slotTimeoutsRef.current.get(slotName);

      if (existingTimeoutId != null) {
        window.clearTimeout(existingTimeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        setHighlightedSlots((currentSlots) => {
          const nextSlots = new Set(currentSlots);
          nextSlots.delete(slotName);
          return nextSlots;
        });
        slotTimeoutsRef.current.delete(slotName);
      }, 600);

      slotTimeoutsRef.current.set(slotName, timeoutId);
    });

    return undefined;
  }, [reactiveCalculation, reactiveSlotValues]);

  if (!initialCalculation || !reactiveCalculation) {
    return null;
  }

  const tierMeta = LETTER_TIER_META.find((t) => t.key === lockedTierKey);
  const badgeColor = TIER_BADGE_COLORS[lockedTierKey] ?? C.accentRust;

  const projectedSavings = WHOLE_DOLLAR_FORMATTER.format(
    reactiveCalculation.totalProjectedRetirementSavings,
  );
  const retirementTarget = WHOLE_DOLLAR_FORMATTER.format(reactiveCalculation.retirementTarget);
  const gap = WHOLE_DOLLAR_FORMATTER.format(Math.abs(reactiveCalculation.gap));

  function renderParagraph(paragraph) {
    return renderTemplateParts(paragraph).map((part, index) =>
      part.type === 'text' ? (
        <span key={`text-${index}`}>{part.value}</span>
      ) : (
        <motion.span
          key={`slot-${part.value}-${index}`}
          data-slot-name={part.value}
          animate={{
            color: highlightedSlots.has(part.value) ? C.accentRust : C.textMain,
          }}
          initial={false}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {formatSlotValue(part.value, inputs, reactiveCalculation)}
        </motion.span>
      ),
    );
  }

  return (
    <div style={isMobile ? styles.mobileCard : styles.card}>
      <header style={isMobile ? styles.mobileHeader : styles.header}>
        <div style={isMobile ? styles.mobileTitleText : styles.titleText}>
          YOUR RETIREMENT OUTLOOK
        </div>
        <div style={{ ...styles.badge, backgroundColor: badgeColor }}>
          {(tierMeta?.label ?? '').toUpperCase()}
        </div>
      </header>

      <div
        style={isMobile ? styles.mobileStatsGrid : styles.statsGrid}
      >
        <StatCard label="Projected savings" value={projectedSavings} isMobile={isMobile} />
        <StatCard label="Retirement target" value={retirementTarget} isMobile={isMobile} />
        {reactiveCalculation.gap > 0 && (
          <StatCard label="Gap" value={gap} isMobile={isMobile} />
        )}
      </div>

      {paragraphs[0] && (
        <section style={styles.section}>
          <SectionLabel isMobile={isMobile}>WHAT THE NUMBERS SAY</SectionLabel>
          <p style={isMobile ? styles.mobileSectionBody : styles.sectionBody}>
            {renderParagraph(paragraphs[0])}
          </p>
        </section>
      )}

      <hr style={styles.divider} />

      {paragraphs[1] && (
        <section style={styles.section}>
          <SectionLabel isMobile={isMobile}>WHAT WE'LL REVIEW TOGETHER</SectionLabel>
          <p style={isMobile ? styles.mobileSectionBody : styles.sectionBody}>
            {renderParagraph(paragraphs[1])}
          </p>
        </section>
      )}

      <footer style={styles.signatureArea}>
        <div style={isMobile ? styles.mobileSignatureText : styles.signatureText}>
          {signature}
        </div>
      </footer>
    </div>
  );
}

const styles = {
  card: {
    width: '100%',
    backgroundColor: C.cardBg,
    border: `1px solid ${C.borderSoft}`,
    borderRadius: '10px',
    padding: 'clamp(30px, 4vw, 48px) clamp(22px, 5vw, 56px) 36px',
    boxShadow: '0 12px 32px rgba(60, 45, 30, 0.12)',
  },
  mobileCard: {
    width: '100%',
    backgroundColor: C.cardBg,
    borderRadius: '0',
    border: 'none',
    boxShadow: 'none',
    padding: '32px 22px 28px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '28px',
    paddingBottom: '24px',
    borderBottom: `1px solid ${C.accentLine}`,
  },
  mobileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
    textAlign: 'center',
    marginBottom: '18px',
    paddingBottom: '12px',
  },
  titleText: {
    flex: '1 1 240px',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.accentRustDark,
    fontFamily: FONT_SANS,
  },
  mobileTitleText: {
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: C.accentRustDark,
    fontFamily: FONT_SANS,
  },
  badge: {
    color: '#FFFFFF',
    borderRadius: '999px',
    padding: '10px 22px',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontFamily: FONT_SANS,
    whiteSpace: 'nowrap',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '42px',
  },
  mobileStatsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginBottom: '34px',
  },
  statCard: {
    backgroundColor: C.statCardBg,
    border: `1px solid ${C.borderLight}`,
    borderRadius: '9px',
    padding: '24px 20px',
    textAlign: 'center',
  },
  mobileStatCard: {
    backgroundColor: C.statCardBg,
    border: `1px solid ${C.borderLight}`,
    borderRadius: '9px',
    padding: '22px 16px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '16px',
    color: C.statLabel,
    marginBottom: '10px',
    fontFamily: FONT_SANS,
  },
  statValue: {
    fontFamily: FONT_SANS,
    fontSize: 'clamp(32px, 4vw, 44px)',
    fontWeight: '600',
    lineHeight: '1.05',
    color: C.textMain,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
  },
  mobileStatValue: {
    fontFamily: FONT_SANS,
    fontSize: '38px',
    fontWeight: '600',
    lineHeight: '1',
    color: C.textMain,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
  },
  section: {
    marginBottom: '28px',
  },
  sectionLabelText: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: C.accentRustDark,
    fontFamily: FONT_SANS,
  },
  mobileSectionLabelText: {
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: C.accentRustDark,
    fontFamily: FONT_SANS,
  },
  sectionAccentLine: {
    width: '34px',
    height: '2px',
    backgroundColor: C.accentRust,
    marginTop: '10px',
  },
  sectionBody: {
    fontSize: 'clamp(18px, 2.1vw, 20px)',
    lineHeight: '1.65',
    color: C.textMain,
    maxWidth: '900px',
    margin: '0',
    fontFamily: FONT_SANS,
  },
  mobileSectionBody: {
    fontSize: '18px',
    lineHeight: '1.58',
    color: C.textMain,
    margin: '0',
    fontFamily: FONT_SANS,
  },
  divider: {
    border: 'none',
    borderTop: `1px dashed ${C.dividerDashed}`,
    margin: '28px 0',
  },
  signatureArea: {
    marginTop: '34px',
    paddingTop: '22px',
    borderTop: `1px solid ${C.accentLine}`,
  },
  signatureText: {
    fontFamily: FONT_SCRIPT,
    fontSize: 'clamp(52px, 6vw, 64px)',
    color: C.signature,
    lineHeight: '1',
  },
  mobileSignatureText: {
    fontFamily: FONT_SCRIPT,
    fontSize: '58px',
    color: C.signature,
    lineHeight: '1',
  },
};

export default TheLetter;
