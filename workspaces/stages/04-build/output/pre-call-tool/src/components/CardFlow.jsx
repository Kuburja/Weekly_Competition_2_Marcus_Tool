import { Fragment, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { CARD_REACTIONS } from '../copy';
import { CARD_STEPS, validateStepValue } from './cardFlowConfig';

const C = {
  surface: '#FFFDF9',
  surfaceSoft: '#F8F4EC',
  greenPrimary: '#214F3D',
  greenDark: '#183B2D',
  greenBorder: '#2F6450',
  textPrimary: '#1F2523',
  textSecondary: '#4D5651',
  textMuted: '#6B736E',
  accentRust: '#C46C46',
  borderSoft: '#D8CCBD',
  borderLight: '#E7DED1',
  borderStrong: '#CBBEAF',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", "Helvetica Neue", Arial, sans-serif';

function formatCurrencyInput(raw) {
  const stripped = raw.replace(/[^0-9.]/g, '');
  if (!stripped) return '';
  const dotIndex = stripped.indexOf('.');
  if (dotIndex === -1) {
    return stripped.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const intPart = stripped.slice(0, dotIndex).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decPart = stripped.slice(dotIndex + 1).replace(/\./g, '');
  return `${intPart}.${decPart}`;
}

function formatDisplayValue(step, value) {
  if (step.kind === 'integer') return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

function PiggyBankIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.greenPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.2 7A6 6 0 0 0 6 11c0 2.2 1.2 4.1 3 5.2V18h6v-1.8a6 6 0 0 0 3-5.2 6 6 0 0 0-.1-1.1" />
      <path d="M9 18v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1" />
      <path d="M17 11h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2" />
      <circle cx="10" cy="10" r="1" fill={C.greenPrimary} stroke="none" />
    </svg>
  );
}

function ChartIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.greenPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function CalendarIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.greenPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function WalletIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.greenPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
      <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
      <circle cx="16" cy="13" r="1.5" fill={C.greenPrimary} stroke="none" />
    </svg>
  );
}

function PersonIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={C.greenPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accentRust} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const STEP_ICON_COMPONENTS = {
  currentAge: PersonIcon,
  income: WalletIcon,
  currentSavings: PiggyBankIcon,
  monthlySavings: ChartIcon,
  targetRetirementAge: CalendarIcon,
};

function StepIcon({ stepKey, isMobile }) {
  const iconSize = isMobile ? 18 : 26;
  const boxSize = isMobile ? 40 : 56;
  const Icon = STEP_ICON_COMPONENTS[stepKey];
  return (
    <div style={{
      width: `${boxSize}px`,
      height: `${boxSize}px`,
      borderRadius: '999px',
      background: C.surfaceSoft,
      border: `1px solid ${C.borderLight}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={iconSize} />
    </div>
  );
}

function MarcusBadge({ isMobile }) {
  const size = isMobile ? 36 : 48;
  const fontSize = isMobile ? '18px' : '24px';
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '999px',
      backgroundColor: C.greenPrimary,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontFamily: SERIF,
      fontSize,
      fontWeight: 600,
      lineHeight: 1,
      userSelect: 'none',
    }}>
      M
    </div>
  );
}

function MarcusNote({ text, animate = false, isMobile }) {
  const colSize = isMobile ? '48px' : '64px';
  const bubblePadding = isMobile ? '10px 12px 10px 20px' : '16px 20px 16px 24px';
  const barLeft = isMobile ? '10px' : '13px';
  const barInset = isMobile ? '10px' : '16px';
  const textSize = isMobile ? '13px' : '16px';

  const inner = (
    <div style={{ display: 'grid', gridTemplateColumns: `${colSize} 1fr`, alignItems: 'center', gap: '10px' }}>
      <MarcusBadge isMobile={isMobile} />
      <div style={{
        background: 'rgba(255,255,255,0.35)',
        borderRadius: '12px',
        padding: bubblePadding,
        position: 'relative',
        minHeight: isMobile ? '44px' : '60px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          width: '3px',
          background: C.accentRust,
          borderRadius: '2px',
          position: 'absolute',
          left: barLeft,
          top: barInset,
          bottom: barInset,
        }} />
        <p style={{
          margin: 0,
          fontFamily: SANS,
          fontSize: textSize,
          fontWeight: 400,
          lineHeight: 1.45,
          color: C.textSecondary,
        }}>{text}</p>
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {inner}
      </motion.div>
    );
  }

  return inner;
}

function CompletedCard({ step, answer, isMobile }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.borderLight}`,
      borderRadius: '14px',
      padding: isMobile ? '10px 14px' : '18px 22px',
      minHeight: isMobile ? '64px' : '96px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: isMobile ? '12px' : '20px',
      boxShadow: '0 4px 14px rgba(40, 35, 28, 0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '16px', minWidth: 0 }}>
        <StepIcon stepKey={step.key} isMobile={isMobile} />
        <h2 style={{
          margin: 0,
          fontFamily: SERIF,
          fontSize: isMobile ? '18px' : '24px',
          fontWeight: 500,
          lineHeight: 1.15,
          color: C.textPrimary,
        }}>{step.label}</h2>
      </div>
      <div style={{
        background: '#EEF3E8',
        border: '1px solid #D5DECE',
        borderRadius: '12px',
        padding: isMobile ? '7px 12px' : '12px 18px',
        minWidth: isMobile ? '80px' : '110px',
        textAlign: 'center',
        flexShrink: 0,
        fontFamily: SANS,
        fontSize: isMobile ? '14px' : '18px',
        fontWeight: 700,
        lineHeight: 1,
        color: C.greenPrimary,
      }}>{answer}</div>
    </div>
  );
}

function CardFlow({ isMobile, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [draftValue, setDraftValue] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [sequencePhase, setSequencePhase] = useState('idle');
  const [sequenceIndex, setSequenceIndex] = useState(null);
  const [sequenceAnswers, setSequenceAnswers] = useState({});
  const inputRef = useRef(null);
  const activeCardRef = useRef(null);
  const timeoutsRef = useRef([]);
  const reactionVariantRef = useRef(Math.floor(Math.random() * 2));

  function getReaction(index, value) {
    const r = CARD_REACTIONS[index];
    if (typeof r === 'function') return r(value);
    return Array.isArray(r) ? r[reactionVariantRef.current % r.length] : r;
  }

  const currentStep = CARD_STEPS[activeIndex];
  const effectiveMin =
    currentStep?.key === 'targetRetirementAge' && answers.currentAge != null
      ? answers.currentAge + 1
      : currentStep?.min;
  const validation = currentStep
    ? validateStepValue(currentStep.key, draftValue, answers)
    : { error: '', value: null };
  const visibleError = showValidation ? validation.error : '';
  const completedSteps =
    sequencePhase === 'idle'
      ? CARD_STEPS.slice(0, activeIndex)
      : CARD_STEPS.slice(0, sequenceIndex);

  useEffect(() => {
    if (sequencePhase === 'idle') {
      inputRef.current?.focus();
      activeCardRef.current?.scrollIntoView({
        behavior: activeIndex === 0 ? 'auto' : 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex, sequencePhase]);

  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutsRef.current) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  function schedule(callback, delay) {
    const timeoutId = setTimeout(callback, delay);
    timeoutsRef.current.push(timeoutId);
  }

  function handleSubmit() {
    if (!currentStep || sequencePhase !== 'idle') return;
    if (validation.error) {
      setShowValidation(true);
      return;
    }

    const nextAnswers = { ...answers, [currentStep.key]: validation.value };
    const submittedIndex = activeIndex;

    setSequenceIndex(submittedIndex);
    setSequenceAnswers(nextAnswers);
    setSequencePhase('answer');

    schedule(() => {
      setSequencePhase('reaction');
      schedule(() => {
        const nextIndex = submittedIndex + 1;
        if (nextIndex >= CARD_STEPS.length) {
          onComplete(nextAnswers);
          return;
        }
        setAnswers(nextAnswers);
        setActiveIndex(nextIndex);
        setDraftValue('');
        setShowValidation(false);
        setSequencePhase('idle');
        setSequenceIndex(null);
        setSequenceAnswers({});
      }, 1000);
    }, 600);
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    handleSubmit();
  }

  const inputHeight = isMobile ? '50px' : '62px';
  const buttonSize = isMobile ? '50px' : '62px';

  return (
    <section style={{
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto',
      padding: isMobile ? '0 16px 60px' : '0 24px 60px',
      boxSizing: 'border-box',
    }}>
      {/* Header — sticky so it stays visible as cards build up below */}
      <header className="sticky" style={{
        top: 0,
        zIndex: 10,
        backgroundColor: '#F3EDE3',
        textAlign: 'center',
        paddingTop: isMobile ? '18px' : '28px',
        paddingBottom: isMobile ? '12px' : '18px',
      }}>
        <h1 style={{
          margin: '0 0 8px',
          fontFamily: SERIF,
          fontSize: isMobile ? '26px' : '42px',
          fontWeight: 500,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          color: C.greenPrimary,
        }}>
          Where Do You Stand?
        </h1>
        <p style={{
          maxWidth: '520px',
          margin: isMobile ? '0' : '0 auto',
          textAlign: 'center',
          fontFamily: SANS,
          fontSize: isMobile ? '13px' : '15px',
          fontWeight: 400,
          lineHeight: 1.45,
          color: C.textPrimary,
        }}>
          Before our first call, I want to know where you stand.
          <br />
          Five questions. Two minutes. That&apos;s it.
        </p>
      </header>

      {/* Step indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        margin: isMobile ? '12px 0 18px' : '18px 0 22px',
      }}>
        <span style={{ flex: 1, height: '1px', background: C.borderSoft, display: 'block' }} />
        <span style={{
          fontFamily: SANS,
          fontSize: '13px',
          fontWeight: 500,
          color: C.greenPrimary,
          whiteSpace: 'nowrap',
        }}>
          Step {activeIndex + 1} of {CARD_STEPS.length}
        </span>
        <span style={{ flex: 1, height: '1px', background: C.borderSoft, display: 'block' }} />
      </div>

      {/* Conversational flow */}
      <div style={{ display: 'grid', gap: '12px' }}>

        {/* Completed steps — each preceded by the Marcus reaction from the step before it */}
        {completedSteps.map((step, i) => (
          <Fragment key={step.key}>
            {i > 0 && (
              <MarcusNote
                isMobile={isMobile}
                text={getReaction(i - 1, answers[CARD_STEPS[i - 1].key])}
              />
            )}
            <CompletedCard
              isMobile={isMobile}
              step={step}
              answer={formatDisplayValue(step, answers[step.key])}
            />
          </Fragment>
        ))}

        {/* Step being transitioned (just submitted, not yet finalised) */}
        {sequencePhase !== 'idle' && sequenceIndex !== null && (
          <Fragment key={`seq-${CARD_STEPS[sequenceIndex].key}`}>
            {sequenceIndex > 0 && (
              <MarcusNote
                isMobile={isMobile}
                text={getReaction(sequenceIndex - 1, answers[CARD_STEPS[sequenceIndex - 1].key])}
              />
            )}
            <CompletedCard
              isMobile={isMobile}
              step={CARD_STEPS[sequenceIndex]}
              answer={formatDisplayValue(
                CARD_STEPS[sequenceIndex],
                sequenceAnswers[CARD_STEPS[sequenceIndex].key],
              )}
            />
            {sequencePhase === 'reaction' && (
              <MarcusNote
                animate
                isMobile={isMobile}
                text={getReaction(sequenceIndex, sequenceAnswers[CARD_STEPS[sequenceIndex].key])}
              />
            )}
          </Fragment>
        )}

        {/* Active question card */}
        {sequencePhase === 'idle' && currentStep && (
          <Fragment key="active">
            {activeIndex > 0 && (
              <MarcusNote
                isMobile={isMobile}
                text={getReaction(activeIndex - 1, answers[CARD_STEPS[activeIndex - 1].key])}
              />
            )}
            <div ref={activeCardRef} style={{
              background: C.surface,
              border: `2px solid ${C.greenBorder}`,
              borderRadius: '14px',
              padding: isMobile ? '12px 14px' : '18px 22px',
              boxShadow: '0 8px 20px rgba(33, 79, 61, 0.08)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '10px' : '16px',
              }}>
                <StepIcon stepKey={currentStep.key} isMobile={isMobile} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{
                    margin: isMobile ? '0 0 10px' : '0 0 14px',
                    fontFamily: SERIF,
                    fontSize: isMobile ? '18px' : '24px',
                    fontWeight: 500,
                    lineHeight: 1.15,
                    color: C.greenPrimary,
                  }}>
                    {currentStep.label}
                  </h2>
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                    style={{ display: 'grid', gap: '6px' }}
                  >
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {currentStep.kind === 'currency' ? (
                        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span style={{
                            position: 'absolute',
                            left: '16px',
                            fontFamily: SANS,
                            fontSize: isMobile ? '14px' : '16px',
                            color: C.textMuted,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          }}>$</span>
                          <input
                            ref={inputRef}
                            aria-describedby={visibleError ? `${currentStep.key}-error` : undefined}
                            aria-invalid={Boolean(visibleError)}
                            aria-label={currentStep.label}
                            autoComplete="off"
                            id={currentStep.key}
                            inputMode="decimal"
                            onChange={(e) => setDraftValue(formatCurrencyInput(e.target.value))}
                            onKeyDown={handleKeyDown}
                            placeholder={currentStep.placeholder.replace('$', '')}
                            style={{
                              width: '100%',
                              height: inputHeight,
                              border: `1.5px solid ${C.borderStrong}`,
                              borderRadius: '10px',
                              padding: '0 16px 0 30px',
                              background: '#FFFEFB',
                              fontFamily: SANS,
                              fontSize: isMobile ? '14px' : '16px',
                              color: C.textPrimary,
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                            type="text"
                            value={draftValue}
                          />
                        </div>
                      ) : (
                        <input
                          ref={inputRef}
                          aria-describedby={visibleError ? `${currentStep.key}-error` : undefined}
                          aria-invalid={Boolean(visibleError)}
                          aria-label={currentStep.label}
                          autoComplete="off"
                          id={currentStep.key}
                          inputMode="numeric"
                          onChange={(e) => setDraftValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          max={currentStep.max}
                          min={effectiveMin}
                          placeholder={currentStep.placeholder}
                          style={{
                            flex: 1,
                            height: inputHeight,
                            border: `1.5px solid ${C.borderStrong}`,
                            borderRadius: '10px',
                            padding: '0 16px',
                            background: '#FFFEFB',
                            fontFamily: SANS,
                            fontSize: isMobile ? '14px' : '16px',
                            color: C.textPrimary,
                            outline: 'none',
                          }}
                          type="number"
                          value={draftValue}
                        />
                      )}
                      <button
                        type="submit"
                        style={{
                          width: buttonSize,
                          height: buttonSize,
                          flexShrink: 0,
                          border: 'none',
                          borderRadius: '10px',
                          background: C.greenPrimary,
                          color: 'white',
                          fontSize: isMobile ? '20px' : '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 6px 14px rgba(33, 79, 61, 0.16)',
                        }}
                      >
                        →
                      </button>
                    </div>
                    <p
                      aria-atomic="true"
                      aria-live="polite"
                      id={`${currentStep.key}-error`}
                      role={visibleError ? 'alert' : undefined}
                      style={{
                        margin: 0,
                        fontFamily: SANS,
                        fontSize: '12px',
                        color: C.textSecondary,
                        lineHeight: 1.4,
                        visibility: visibleError ? 'visible' : 'hidden',
                        minHeight: '16px',
                      }}
                    >
                      {visibleError || 'Placeholder'}
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </Fragment>
        )}

        {/* Privacy footer */}
        <footer style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '8px',
        }}>
          <ShieldIcon />
          <span style={{
            fontFamily: SANS,
            fontSize: '13px',
            fontWeight: 400,
            color: C.textMuted,
          }}>
            Your information is private and secure.
          </span>
        </footer>

      </div>
    </section>
  );
}

export default CardFlow;
