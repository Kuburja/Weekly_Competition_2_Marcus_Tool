import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { calculate } from '../calc';
import { LETTER_TIER_META } from '../copy';
import InfoTooltip from './InfoTooltip';
import { getRetirementTooltipContent } from './retirementTooltipContent';
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

const PERCENT_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'percent',
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

function getStatValueSizeBounds(isMobile) {
  return isMobile
    ? { max: 20, min: 9 }
    : { max: 34, min: 12 };
}

function AutoFitStatValue({ isMobile, value }) {
  const valueRef = useRef(null);
  const { max, min } = getStatValueSizeBounds(isMobile);
  const [fontSize, setFontSize] = useState(max);

  useEffect(() => {
    setFontSize(max);
  }, [max, value]);

  useEffect(() => {
    const element = valueRef.current;

    if (!element) {
      return undefined;
    }

    let frameId = null;

    function fitText() {
      const nextElement = valueRef.current;

      if (!nextElement) {
        return;
      }

      let nextFontSize = max;
      nextElement.style.fontSize = `${nextFontSize}px`;

      while (nextFontSize > min && nextElement.scrollWidth > nextElement.clientWidth) {
        nextFontSize -= 1;
        nextElement.style.fontSize = `${nextFontSize}px`;
      }

      setFontSize(nextFontSize);
    }

    frameId = window.requestAnimationFrame(fitText);
    window.addEventListener('resize', fitText);

    return () => {
      if (frameId != null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('resize', fitText);
    };
  }, [isMobile, max, min, value]);

  return (
    <div
      ref={valueRef}
      data-stat-value="true"
      style={{
        ...(isMobile ? styles.mobileStatValue : styles.statValue),
        fontSize: `${fontSize}px`,
      }}
    >
      {value}
    </div>
  );
}

function TooltipBody({ content }) {
  return (
    <div>
      <p style={styles.tooltipDescription}>{content.description}</p>
    </div>
  );
}

function StatCard({
  infoContent,
  isInfoOpen,
  isMobile,
  label,
  onInfoToggle,
  setContainerRef,
  type,
  value,
}) {
  const tooltipId = `${type}-info-tooltip`;

  return (
    <div
      ref={setContainerRef}
      style={isMobile ? styles.mobileStatCard : styles.statCard}
    >
      <button
        aria-describedby={isInfoOpen ? tooltipId : undefined}
        aria-expanded={isInfoOpen}
        aria-label={`Learn how ${label} is calculated`}
        onClick={onInfoToggle}
        style={styles.infoButton}
        type="button"
      >
        <span aria-hidden="true" style={styles.infoButtonText}>
          i
        </span>
      </button>
      {isInfoOpen && infoContent ? (
        <InfoTooltip
          body={<TooltipBody content={infoContent} />}
          id={tooltipId}
          isMobile={isMobile}
          title={null}
        />
      ) : null}
      <div style={styles.statLabel}>{label}</div>
      <AutoFitStatValue isMobile={isMobile} value={value} />
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
  const lockedSlotValues = useMemo(
    () => getReactiveSlotValues(inputs, initialCalculation),
    [inputs, initialCalculation],
  );
  const reactiveSlotValues = useMemo(
    () => getReactiveSlotValues(inputs, initialCalculation),
    [inputs, initialCalculation],
  );
  const [highlightedSlots, setHighlightedSlots] = useState(() => new Set());
  const [openTooltipKey, setOpenTooltipKey] = useState(null);
  const previousReactiveSlotValuesRef = useRef(null);
  const slotTimeoutsRef = useRef(new Map());
  const statCardRefs = useRef({});

  useEffect(() => {
    setOpenTooltipKey(null);
  }, [inputs]);

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

  useEffect(() => {
    if (openTooltipKey == null) {
      return undefined;
    }

    function handleMouseDown(event) {
      const activeCard = statCardRefs.current[openTooltipKey];

      if (activeCard && !activeCard.contains(event.target)) {
        setOpenTooltipKey(null);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenTooltipKey(null);
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openTooltipKey]);

  if (!initialCalculation || !reactiveCalculation) {
    return null;
  }

  const tierMeta = LETTER_TIER_META.find((t) => t.key === lockedTierKey);
  const badgeColor = TIER_BADGE_COLORS[lockedTierKey] ?? C.accentRust;

  const projectedSavings = WHOLE_DOLLAR_FORMATTER.format(
    initialCalculation.totalProjectedRetirementSavings,
  );
  const retirementTarget = WHOLE_DOLLAR_FORMATTER.format(initialCalculation.retirementTarget);
  const gap = WHOLE_DOLLAR_FORMATTER.format(Math.abs(initialCalculation.gap));
  const visibleStatCount = initialCalculation.gap > 0 ? 3 : 2;
  const statsGridStyle = {
    ...(isMobile ? styles.mobileStatsGrid : styles.statsGrid),
    gridTemplateColumns: `repeat(${visibleStatCount}, minmax(0, 1fr))`,
  };
  const formatCurrency = (amount) => WHOLE_DOLLAR_FORMATTER.format(Math.abs(amount));
  const formatPercent = (amount) => PERCENT_FORMATTER.format(amount);
  const projectedSavingsTooltip = getRetirementTooltipContent({
    type: 'projectedSavings',
    calculation: initialCalculation,
    inputs,
    formatCurrency,
    formatPercent,
  });
  const retirementTargetTooltip = getRetirementTooltipContent({
    type: 'retirementTarget',
    calculation: initialCalculation,
    inputs,
    formatCurrency,
    formatPercent,
  });
  const gapTooltip = getRetirementTooltipContent({
    type: 'gap',
    calculation: initialCalculation,
    inputs,
    formatCurrency,
    formatPercent,
  });

  function toggleTooltip(key) {
    setOpenTooltipKey((currentKey) => (currentKey === key ? null : key));
  }

  function setStatCardRef(key) {
    return (node) => {
      if (node) {
        statCardRefs.current[key] = node;
        return;
      }

      delete statCardRefs.current[key];
    };
  }

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
          {lockedSlotValues[part.value] ?? formatSlotValue(part.value, inputs, initialCalculation)}
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

      <div style={statsGridStyle}>
        <StatCard
          infoContent={projectedSavingsTooltip}
          isInfoOpen={openTooltipKey === 'projectedSavings'}
          isMobile={isMobile}
          label="Projected savings"
          onInfoToggle={() => toggleTooltip('projectedSavings')}
          setContainerRef={setStatCardRef('projectedSavings')}
          type="projectedSavings"
          value={projectedSavings}
        />
        <StatCard
          infoContent={retirementTargetTooltip}
          isInfoOpen={openTooltipKey === 'retirementTarget'}
          isMobile={isMobile}
          label="Retirement target"
          onInfoToggle={() => toggleTooltip('retirementTarget')}
          setContainerRef={setStatCardRef('retirementTarget')}
          type="retirementTarget"
          value={retirementTarget}
        />
        {initialCalculation.gap > 0 && (
          <StatCard
            infoContent={gapTooltip}
            isInfoOpen={openTooltipKey === 'gap'}
            isMobile={isMobile}
            label="Gap"
            onInfoToggle={() => toggleTooltip('gap')}
            setContainerRef={setStatCardRef('gap')}
            type="gap"
            value={gap}
          />
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
    height: '100%',
    backgroundColor: C.cardBg,
    border: `1px solid ${C.borderSoft}`,
    borderRadius: '28px',
    padding: 'clamp(30px, 4vw, 48px) clamp(22px, 5vw, 56px) 36px',
    boxShadow: '0 12px 32px rgba(60, 45, 30, 0.12)',
    boxSizing: 'border-box',
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
    gap: '14px',
    marginBottom: '42px',
  },
  mobileStatsGrid: {
    display: 'grid',
    gap: '10px',
    marginBottom: '34px',
  },
  statCard: {
    position: 'relative',
    backgroundColor: C.statCardBg,
    border: `1px solid ${C.borderLight}`,
    borderRadius: '9px',
    padding: '18px 14px',
    textAlign: 'center',
    minWidth: 0,
  },
  mobileStatCard: {
    position: 'relative',
    backgroundColor: C.statCardBg,
    border: `1px solid ${C.borderLight}`,
    borderRadius: '9px',
    padding: '14px 10px',
    textAlign: 'center',
    minWidth: 0,
  },
  statLabel: {
    fontSize: 'clamp(12px, 1.4vw, 16px)',
    color: C.statLabel,
    marginBottom: '8px',
    paddingRight: '26px',
    fontFamily: FONT_SANS,
  },
  statValue: {
    fontFamily: FONT_SANS,
    fontSize: 'clamp(16px, 2.3vw, 34px)',
    fontWeight: '600',
    lineHeight: '1.05',
    color: C.textMain,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
    whiteSpace: 'nowrap',
  },
  mobileStatValue: {
    fontFamily: FONT_SANS,
    fontSize: 'clamp(12px, 4vw, 20px)',
    fontWeight: '600',
    lineHeight: '1',
    color: C.textMain,
    letterSpacing: '-0.03em',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
    whiteSpace: 'nowrap',
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
    fontSize: 'clamp(36px, 5vw, 64px)',
    color: C.signature,
    lineHeight: '1',
  },
  mobileSignatureText: {
    fontFamily: FONT_SCRIPT,
    fontSize: '58px',
    color: C.signature,
    lineHeight: '1',
  },
  infoButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '20px',
    height: '20px',
    borderRadius: '999px',
    border: `1px solid ${C.accentRust}`,
    backgroundColor: '#FFFDF8',
    color: C.accentRust,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(60, 45, 30, 0.08)',
  },
  infoButtonText: {
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: 1,
  },
  tooltipDescription: {
    margin: 0,
    fontSize: '12px',
    lineHeight: 1.5,
    color: C.textMain,
  },
};

export default TheLetter;
