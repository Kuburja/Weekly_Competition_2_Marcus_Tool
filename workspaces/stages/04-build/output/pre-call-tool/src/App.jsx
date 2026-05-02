import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  COLOR_BACKGROUND,
  COLOR_PRIMARY,
  COLOR_SURFACE,
  COLOR_TEXT,
  FONT_BODY,
} from './constants';
import { SLIDER_COPY } from './copy';
import CardFlow from './components/CardFlow';
import SliderExplorer from './components/SliderExplorer';
import TheLetter from './components/TheLetter';
import { useWindowWidth } from './useWindowWidth';

const SCROLL_CUE_HIDE_OFFSET = 72;
const SCROLL_CUE_BOTTOM_GAP = 18;

function getSectionVisibility(rect, viewportHeight) {
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, viewportHeight);
  return Math.max(0, visibleBottom - visibleTop);
}

function getActiveResultSection(sections, viewportHeight) {
  return sections.reduce((activeSection, section) => {
    if (!section.element) {
      return activeSection;
    }

    const rect = section.element.getBoundingClientRect();
    const visibleHeight = getSectionVisibility(rect, viewportHeight);

    if (visibleHeight <= 0) {
      return activeSection;
    }

    if (!activeSection || visibleHeight > activeSection.visibleHeight) {
      return {
        ...section,
        rect,
        visibleHeight,
      };
    }

    return activeSection;
  }, null);
}

function ScrollCue() {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ opacity: [0.18, 0.34, 0.18], y: [0, 4, 0] }}
      data-testid="mobile-scroll-cue"
      initial={{ opacity: 0, y: 0 }}
      style={styles.scrollCue}
      transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
    >
      <svg height="18" viewBox="0 0 20 20" width="18">
        <path
          d="M4 7.5 10 13.5l6-6"
          fill="none"
          stroke={COLOR_PRIMARY}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
    </motion.div>
  );
}

function App() {
  const isMobile = useWindowWidth();
  const [inputs, setInputs] = useState(null);
  const [sliderState, setSliderState] = useState({
    monthlySavings: null,
    targetRetirementAge: null,
  });
  const [visiblePhase, setVisiblePhase] = useState(1);
  const [showScrollCue, setShowScrollCue] = useState(false);
  const letterSectionRef = useRef(null);
  const sliderSectionRef = useRef(null);

  useEffect(() => {
    if (visiblePhase === 2) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [visiblePhase]);

  useEffect(() => {
    if (!isMobile || visiblePhase < 2) {
      setShowScrollCue(false);
      return undefined;
    }

    function updateScrollCue() {
      const viewportHeight = window.innerHeight;
      const activeSection = getActiveResultSection(
        [
          { key: 'letter', element: letterSectionRef.current },
          { key: 'slider', element: sliderSectionRef.current },
        ],
        viewportHeight,
      );

      if (!activeSection) {
        setShowScrollCue(false);
        return;
      }

      const scrollIntoSection = Math.max(0, -activeSection.rect.top);
      const hasMoreBelow = activeSection.rect.bottom > viewportHeight - 24;

      setShowScrollCue(scrollIntoSection < SCROLL_CUE_HIDE_OFFSET && hasMoreBelow);
    }

    updateScrollCue();
    window.addEventListener('scroll', updateScrollCue, { passive: true });
    window.addEventListener('resize', updateScrollCue);

    return () => {
      window.removeEventListener('scroll', updateScrollCue);
      window.removeEventListener('resize', updateScrollCue);
    };
  }, [isMobile, visiblePhase]);

  function handleCardFlowComplete(nextInputs) {
    setInputs(nextInputs);
    setSliderState({
      monthlySavings: nextInputs.monthlySavings,
      targetRetirementAge: nextInputs.targetRetirementAge,
    });
    setVisiblePhase(2);
  }

  function onSliderChange(field, value) {
    setSliderState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  function handleReset() {
    setVisiblePhase(1);
    setInputs(null);
    setSliderState({
      monthlySavings: null,
      targetRetirementAge: null,
    });
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: COLOR_BACKGROUND,
        color: COLOR_TEXT,
        fontFamily: FONT_BODY,
        padding: 0,
      }}
    >
      <div
        style={{
          ...styles.pageShell,
          alignItems: 'flex-start',
        }}
      >
        <AnimatePresence mode="wait">
          {visiblePhase === 1 ? (
            <motion.section
              key="phase-1"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              style={styles.phaseOne}
            >
              <CardFlow isMobile={isMobile} onComplete={handleCardFlowComplete} />
            </motion.section>
          ) : visiblePhase >= 2 ? (
            <motion.section
              key="phase-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={isMobile ? styles.phaseTwo : styles.phaseTwoDesktop}
            >
              <div data-testid="letter-section" ref={letterSectionRef} style={styles.resultBlock}>
                <TheLetter
                  inputs={inputs}
                  isMobile={isMobile}
                  sliderState={sliderState}
                />
              </div>
              <div
                data-testid="slider-section"
                ref={sliderSectionRef}
                style={isMobile ? styles.resultBlock : styles.sliderBlock}
              >
                <SliderExplorer
                  inputs={inputs}
                  isMobile={isMobile}
                  onSliderChange={onSliderChange}
                  sliderState={sliderState}
                />
                <div style={isMobile ? styles.ctaBox : styles.ctaBoxDesktop}>
                  <button style={isMobile ? styles.mobileButton : styles.button} type="button">
                    {SLIDER_COPY.ctaButton}
                  </button>
                  <button onClick={handleReset} style={styles.resetButton} type="button">
                    Start over
                  </button>
                </div>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
        {showScrollCue ? <ScrollCue /> : null}
      </div>
    </main>
  );
}

const styles = {
  pageShell: {
    width: '100%',
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    justifyContent: 'center',
  },
  phaseOne: {
    width: '100%',
  },
  phaseTwo: {
    width: '100%',
    display: 'grid',
    gap: '24px',
  },
  phaseTwoDesktop: {
    width: '100%',
    maxWidth: '1600px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))',
    alignItems: 'start',
    gap: 'clamp(20px, 2.5vw, 40px)',
    padding: 'clamp(24px, 3.5vw, 48px) clamp(20px, 3vw, 40px) clamp(32px, 5vw, 64px)',
    margin: '0 auto',
  },
  resultBlock: {
    width: '100%',
    minWidth: 0,
  },
  sliderBlock: {
    width: '100%',
    minWidth: 0,
    display: 'grid',
    gap: '40px',
    alignContent: 'start',
  },
  ctaBox: {
    width: '100%',
    display: 'grid',
    gap: '16px',
    justifyItems: 'center',
    padding: '0 16px 28px',
  },
  ctaBoxDesktop: {
    display: 'grid',
    gap: '16px',
    justifyItems: 'center',
    padding: '0 4px',
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
  scrollCue: {
    position: 'fixed',
    left: '50%',
    bottom: `${SCROLL_CUE_BOTTOM_GAP}px`,
    transform: 'translateX(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255, 253, 248, 0.88)',
    boxShadow: '0 6px 16px rgba(35, 71, 54, 0.08)',
    pointerEvents: 'none',
    zIndex: 20,
  },
};

export default App;
