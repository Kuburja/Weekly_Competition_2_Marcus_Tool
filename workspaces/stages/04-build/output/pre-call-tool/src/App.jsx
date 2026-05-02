import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  COLOR_BACKGROUND,
  COLOR_TEXT,
  FONT_BODY,
} from './constants';
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
              <div style={styles.resultBlock}>
                <SliderExplorer
                  inputs={inputs}
                  isMobile={isMobile}
                  onReset={handleReset}
                  onSliderChange={onSliderChange}
                  sliderState={sliderState}
                />
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
    maxWidth: '980px',
    display: 'grid',
    gap: '32px',
    padding: '48px 40px 64px',
    margin: '0 auto',
  },
  resultBlock: {
    width: '100%',
    minWidth: 0,
  },
};

export default App;
