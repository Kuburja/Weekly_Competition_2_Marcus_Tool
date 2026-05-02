import { useEffect, useState } from 'react';
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

function App() {
  const isMobile = useWindowWidth();
  const [inputs, setInputs] = useState(null);
  const [sliderState, setSliderState] = useState({
    monthlySavings: null,
    targetRetirementAge: null,
  });
  const [visiblePhase, setVisiblePhase] = useState(1);

  useEffect(() => {
    if (visiblePhase === 2) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [visiblePhase]);

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
              <div style={styles.resultBlock}>
                <TheLetter
                  inputs={inputs}
                  isMobile={isMobile}
                  sliderState={sliderState}
                />
              </div>
              <div style={isMobile ? styles.resultBlock : styles.sliderBlock}>
                <SliderExplorer
                  inputs={inputs}
                  isMobile={isMobile}
                  onSliderChange={onSliderChange}
                  sliderState={sliderState}
                />
              </div>
              <div style={isMobile ? styles.ctaBox : styles.ctaBoxDesktop}>
                <button style={isMobile ? styles.mobileButton : styles.button} type="button">
                  {SLIDER_COPY.ctaButton}
                </button>
                <button onClick={handleReset} style={styles.resetButton} type="button">
                  Start over
                </button>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
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
    alignItems: 'stretch',
    gap: 'clamp(20px, 2.5vw, 40px)',
    padding: 'clamp(24px, 3.5vw, 48px) clamp(20px, 3vw, 40px) clamp(32px, 5vw, 64px)',
    margin: '0 auto',
  },
  resultBlock: {
    width: '100%',
    minWidth: 0,
    height: '100%',
  },
  sliderBlock: {
    width: '100%',
    minWidth: 0,
    height: '100%',
  },
  ctaBox: {
    width: '100%',
    display: 'grid',
    gap: '16px',
    justifyItems: 'center',
    padding: '28px 16px',
  },
  ctaBoxDesktop: {
    gridColumn: '1 / -1',
    display: 'grid',
    gap: '16px',
    justifyItems: 'center',
    padding: '32px 40px',
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
};

export default App;
