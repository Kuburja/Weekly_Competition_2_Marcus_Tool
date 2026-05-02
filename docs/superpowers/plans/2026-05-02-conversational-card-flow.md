# Conversational Card Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the big centered card layout with a conversational thread where Marcus asks each question as a chat message, the user replies, and reactions stay permanently in the thread.

**Architecture:** `CardFlow.jsx` is fully rewritten around a thread model — completed Q&A exchanges render above, the active question (with green border) and input render below. An `seqPhase` state machine drives the 600ms → reaction → 1000ms → next-question animation. `CardStep.jsx` is deleted; its job moves inline into `CardFlow.jsx`.

**Tech Stack:** React 18, Framer Motion (fade-in for reactions), Vitest + @testing-library/react, inline styles

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/CardFlow.jsx` | Rewrite | Thread layout, animation sequence, all state |
| `src/components/CardFlow.test.jsx` | Create | Unit tests for thread rendering and animation sequence |
| `src/App.test.jsx` | Update | Remove chip tests, update helpers to new button/timer model |
| `src/components/ProgressDots.jsx` | Modify | Add optional `justify` prop (default `'center'`), used as `'flex-start'` in thread |
| `src/App.jsx` | Modify | Remove conditional `alignItems` — always `'flex-start'` |
| `src/components/CardStep.jsx` | Delete | Absorbed into CardFlow |

Files NOT touched: `cardFlowConfig.js`, `copy.js`, `TheLetter.jsx`, `SliderExplorer.jsx`, `constants.js`, `calc.js`.

---

## Task 1: Update ProgressDots to support left-alignment

**Files:**
- Modify: `src/components/ProgressDots.jsx`

- [ ] **Step 1: Add the `justify` prop**

Replace the entire file with:

```jsx
import {
  COLOR_ACCENT,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
} from '../constants';

function ProgressDots({ completedCount, currentIndex, total, justify = 'center' }) {
  const currentStepNumber = currentIndex === null ? total : currentIndex + 1;

  return (
    <div
      aria-label={`Progress: step ${currentStepNumber} of ${total}`}
      role="group"
      style={{ ...styles.row, justifyContent: justify }}
    >
      {Array.from({ length: total }, (_, index) => {
        const status =
          index < completedCount
            ? 'completed'
            : index === currentIndex
              ? 'current'
              : 'upcoming';
        const backgroundColor =
          index < completedCount
            ? COLOR_ACCENT
            : index === currentIndex
              ? COLOR_PRIMARY
              : COLOR_SECONDARY;

        return (
          <span
            aria-current={status === 'current' ? 'step' : undefined}
            aria-label={`Step ${index + 1} of ${total}, ${status}`}
            key={index}
            style={{ ...styles.dot, backgroundColor }}
          />
        );
      })}
    </div>
  );
}

const styles = {
  row: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '999px',
    display: 'inline-block',
  },
};

export default ProgressDots;
```

- [ ] **Step 2: Run existing tests to confirm nothing breaks**

```
cd workspaces/stages/04-build/output/pre-call-tool && npx vitest run
```

Expected: all existing tests pass (the default `justify='center'` preserves prior rendering).

- [ ] **Step 3: Commit**

```bash
git add workspaces/stages/04-build/output/pre-call-tool/src/components/ProgressDots.jsx
git commit -m "feat: add justify prop to ProgressDots for thread context"
```

---

## Task 2: Rewrite App.test.jsx for conversational behavior

**Files:**
- Modify: `src/App.test.jsx`

The existing tests check for `'Continue'` button text, `'Question 1 of 5'` label, and editable chip behavior — none of which exist in the new design. Replace the file entirely.

- [ ] **Step 1: Write the failing tests**

Replace `src/App.test.jsx` with:

```jsx
/* @vitest-environment jsdom */
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => {
  const createMotionComponent = (tag) =>
    React.forwardRef(
      ({ animate, exit, initial, transition, children, ...props }, ref) =>
        React.createElement(tag, { ...props, ref }, children),
    );

  return {
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      div: createMotionComponent('div'),
      form: createMotionComponent('form'),
      section: createMotionComponent('section'),
      span: createMotionComponent('span'),
      article: createMotionComponent('article'),
      button: createMotionComponent('button'),
    },
  };
});

import App from './App';

describe('App Phase 1 flow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('renders the conversational intro and first question', () => {
    render(<App />);

    expect(screen.getByText('Are We Okay?')).toBeTruthy();
    expect(screen.getByLabelText('Current age')).toBeTruthy();
    expect(screen.getByLabelText('Current age').getAttribute('placeholder')).toBe('e.g. 38');
    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();
    expect(screen.queryByText('Question 1 of 5')).toBeNull();
  });

  it('collects the five inputs, enters phase 2, and resets back to a blank first question', async () => {
    render(<App />);

    await completePhaseOne();

    expect(screen.getByText('Adjust Your Path')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

    expect(screen.getByText('Are We Okay?')).toBeTruthy();
    expect(screen.queryByText('Adjust Your Path')).toBeNull();

    const currentAgeInput = screen.getByLabelText('Current age');
    expect(currentAgeInput.getAttribute('value')).toBe('');
    expect(currentAgeInput.getAttribute('placeholder')).toBe('e.g. 38');
  });
});

function submitQuestion(label, value) {
  const input = screen.getByLabelText(label);
  fireEvent.change(input, { target: { value } });
  fireEvent.submit(input.closest('form'));
}

async function answerAndWait(label, value) {
  await act(async () => {
    submitQuestion(label, value);
    await vi.advanceTimersByTimeAsync(1600);
  });
}

async function completePhaseOne() {
  await answerAndWait('Current age', '40');
  await answerAndWait('Household income', '$180,000');
  await answerAndWait('Current savings', '$100,000');
  await answerAndWait('Monthly savings', '$1,500');
  await act(async () => {
    submitQuestion('Target retirement age', '65');
    await vi.runAllTimersAsync();
  });
}
```

- [ ] **Step 2: Run tests and confirm they fail**

```
cd workspaces/stages/04-build/output/pre-call-tool && npx vitest run src/App.test.jsx
```

Expected: FAIL — `'Are We Okay?'` heading exists but `queryByText('Question 1 of 5')` still finds it, and `input.closest('form')` will be null since the old CardFlow doesn't wrap in a form at that level.

---

## Task 3: Create CardFlow.test.jsx

**Files:**
- Create: `src/components/CardFlow.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/CardFlow.test.jsx`:

```jsx
/* @vitest-environment jsdom */
import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', () => {
  const createMotionComponent = (tag) =>
    React.forwardRef(
      ({ animate, exit, initial, transition, children, ...props }, ref) =>
        React.createElement(tag, { ...props, ref }, children),
    );

  return {
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      div: createMotionComponent('div'),
    },
  };
});

import CardFlow from './CardFlow';
import { CARD_REACTIONS } from '../copy';

describe('CardFlow conversational thread', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('renders Marcus avatar and first question on load', () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    expect(screen.getAllByText('M').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Current age')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();
  });

  it('shows user answer bubble immediately after submit', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('Current age');
    await act(async () => {
      fireEvent.change(input, { target: { value: '40' } });
      fireEvent.submit(input.closest('form'));
    });

    expect(screen.getByText('40')).toBeTruthy();
  });

  it('shows reaction text after 600ms', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('Current age');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.submit(input.closest('form'));

    expect(screen.queryByText(CARD_REACTIONS[0])).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });

    expect(screen.getByText(CARD_REACTIONS[0])).toBeTruthy();
  });

  it('advances to next question after 1600ms total', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('Current age');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.submit(input.closest('form'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    expect(screen.getByLabelText('Household income')).toBeTruthy();
  });

  it('reaction from first question stays visible after second question appears', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('Current age');
    fireEvent.change(input, { target: { value: '40' } });
    fireEvent.submit(input.closest('form'));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1600);
    });

    expect(screen.getByText(CARD_REACTIONS[0])).toBeTruthy();
    expect(screen.getByLabelText('Household income')).toBeTruthy();
  });

  it('calls onComplete with all answers after fifth question', async () => {
    const onComplete = vi.fn();
    render(<CardFlow isMobile={false} onComplete={onComplete} />);

    await submitAndAdvance('Current age', '40');
    await submitAndAdvance('Household income', '$180,000');
    await submitAndAdvance('Current savings', '$100,000');
    await submitAndAdvance('Monthly savings', '$1,500');

    await act(async () => {
      const input = screen.getByLabelText('Target retirement age');
      fireEvent.change(input, { target: { value: '65' } });
      fireEvent.submit(input.closest('form'));
      await vi.runAllTimersAsync();
    });

    expect(onComplete).toHaveBeenCalledWith({
      currentAge: 40,
      income: 180000,
      currentSavings: 100000,
      monthlySavings: 1500,
      targetRetirementAge: 65,
    });
  });

  it('shows inline validation error and does not advance on invalid input', async () => {
    render(<CardFlow isMobile={false} onComplete={vi.fn()} />);

    const input = screen.getByLabelText('Current age');
    await act(async () => {
      fireEvent.change(input, { target: { value: '10' } });
      fireEvent.submit(input.closest('form'));
    });

    expect(screen.getByText('Enter an age between 18 and 79.')).toBeTruthy();
    expect(screen.queryByLabelText('Household income')).toBeNull();
  });
});

async function submitAndAdvance(label, value) {
  await act(async () => {
    const input = screen.getByLabelText(label);
    fireEvent.change(input, { target: { value } });
    fireEvent.submit(input.closest('form'));
    await vi.advanceTimersByTimeAsync(1600);
  });
}
```

- [ ] **Step 2: Run tests and confirm they fail**

```
cd workspaces/stages/04-build/output/pre-call-tool && npx vitest run src/components/CardFlow.test.jsx
```

Expected: FAIL — `CardFlow` does not yet import from `../copy`, has no form wrapper at the right level, and `screen.getAllByText('M')` finds zero matches.

---

## Task 4: Rewrite CardFlow.jsx

**Files:**
- Modify: `src/components/CardFlow.jsx`

- [ ] **Step 1: Replace CardFlow.jsx entirely**

```jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import {
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_SURFACE,
  COLOR_TEXT,
  COLOR_TEXT_SECONDARY,
  FONT_BODY,
  FONT_HEADING,
} from '../constants';
import { CARD_REACTIONS } from '../copy';
import ProgressDots from './ProgressDots';
import { CARD_STEPS, validateStepValue } from './cardFlowConfig';

const AVATAR_SIZE = 28;
const AVATAR_GAP = 10;
const INDENT = AVATAR_SIZE + AVATAR_GAP;

function Avatar() {
  return <div style={styles.avatar}>M</div>;
}

function ThreadExchange({ label, displayValue, reaction, showReaction }) {
  return (
    <div style={styles.exchange}>
      <div style={styles.msgRow}>
        <Avatar />
        <div style={styles.questionBubble}>{label}</div>
      </div>
      <div style={styles.userRow}>
        <div style={styles.userBubble}>{displayValue}</div>
      </div>
      {showReaction && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={styles.msgRow}
        >
          <div style={styles.avatarSpacer} />
          <p style={styles.reactionText}>{reaction}</p>
        </motion.div>
      )}
    </div>
  );
}

function CardFlow({ isMobile, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [draftValue, setDraftValue] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [seqPhase, setSeqPhase] = useState('idle'); // 'idle' | 'user-bubble' | 'reaction'
  const [seqIndex, setSeqIndex] = useState(null);
  const [seqAnswers, setSeqAnswers] = useState({});
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const currentStep = CARD_STEPS[activeIndex];
  const validation = currentStep
    ? validateStepValue(currentStep.key, draftValue, answers)
    : { error: '', value: null };
  const visibleError = showValidation ? validation.error : '';

  useEffect(() => {
    if (seqPhase === 'idle') {
      inputRef.current?.focus();
    }
  }, [activeIndex, seqPhase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [seqPhase, activeIndex]);

  function handleSubmit() {
    if (!currentStep || seqPhase !== 'idle') return;
    if (validation.error) {
      setShowValidation(true);
      return;
    }

    const nextAnswers = { ...answers, [currentStep.key]: validation.value };
    const stepIndex = activeIndex;

    setSeqIndex(stepIndex);
    setSeqAnswers(nextAnswers);
    setSeqPhase('user-bubble');

    setTimeout(() => {
      setSeqPhase('reaction');
      setTimeout(() => {
        const nextIndex = stepIndex + 1;
        if (nextIndex >= CARD_STEPS.length) {
          onComplete(nextAnswers);
          return;
        }
        setAnswers(nextAnswers);
        setActiveIndex(nextIndex);
        setDraftValue('');
        setShowValidation(false);
        setSeqPhase('idle');
        setSeqIndex(null);
        setSeqAnswers({});
      }, 1000);
    }, 600);
  }

  const completedEnd = seqPhase === 'idle' ? activeIndex : seqIndex;

  return (
    <section style={styles.section}>
      <div style={isMobile ? styles.mobileColumn : styles.column}>
        <div style={styles.intro}>
          <h1 style={isMobile ? styles.mobileTitle : styles.title}>Are We Okay?</h1>
          <p style={styles.introText}>
            Five questions. About two minutes. Your answers help me prepare something
            useful before we meet — nothing goes anywhere without your say-so.
          </p>
        </div>

        <div style={styles.thread}>
          {CARD_STEPS.slice(0, completedEnd).map((step, i) => (
            <div key={step.key}>
              <ThreadExchange
                label={step.label}
                displayValue={formatDisplayValue(step, answers[step.key])}
                reaction={CARD_REACTIONS[i]}
                showReaction
              />
              <div style={styles.exchangeGap} />
            </div>
          ))}

          {seqPhase !== 'idle' && seqIndex !== null && (
            <ThreadExchange
              label={CARD_STEPS[seqIndex].label}
              displayValue={formatDisplayValue(
                CARD_STEPS[seqIndex],
                seqAnswers[CARD_STEPS[seqIndex].key],
              )}
              reaction={CARD_REACTIONS[seqIndex]}
              showReaction={seqPhase === 'reaction'}
            />
          )}

          {seqPhase === 'idle' && currentStep && (
            <div>
              <div style={styles.msgRow}>
                <Avatar />
                <div style={styles.activeQuestionBubble}>{currentStep.label}</div>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                style={styles.inputArea}
              >
                <div style={styles.inputRow}>
                  <input
                    ref={inputRef}
                    aria-describedby={visibleError ? `${currentStep.key}-error` : undefined}
                    aria-invalid={Boolean(visibleError)}
                    aria-label={currentStep.label}
                    autoComplete="off"
                    id={currentStep.key}
                    inputMode={currentStep.kind === 'currency' ? 'decimal' : 'numeric'}
                    onChange={(e) => {
                      setDraftValue(e.target.value);
                      setShowValidation(true);
                    }}
                    placeholder={currentStep.placeholder}
                    style={styles.input}
                    type={currentStep.kind === 'currency' ? 'text' : 'number'}
                    value={draftValue}
                  />
                  <button style={styles.sendBtn} type="submit">
                    →
                  </button>
                </div>
                <p
                  aria-atomic="true"
                  aria-live="polite"
                  id={`${currentStep.key}-error`}
                  role={visibleError ? 'alert' : undefined}
                  style={{
                    ...styles.errorText,
                    visibility: visibleError ? 'visible' : 'hidden',
                  }}
                >
                  {visibleError || 'Placeholder'}
                </p>
                <ProgressDots
                  completedCount={activeIndex}
                  currentIndex={activeIndex}
                  total={CARD_STEPS.length}
                  justify="flex-start"
                />
              </form>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </section>
  );
}

function formatDisplayValue(step, value) {
  if (step.kind === 'integer') return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

const styles = {
  section: {
    width: '100%',
  },
  column: {
    maxWidth: '560px',
    margin: '0 auto',
    display: 'grid',
    gap: '32px',
  },
  mobileColumn: {
    width: '100%',
    display: 'grid',
    gap: '24px',
  },
  intro: {
    display: 'grid',
    gap: '10px',
  },
  title: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: '42px',
    fontWeight: 600,
    lineHeight: 0.95,
  },
  mobileTitle: {
    margin: 0,
    color: COLOR_PRIMARY,
    fontFamily: FONT_HEADING,
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 0.95,
  },
  introText: {
    margin: 0,
    color: COLOR_TEXT,
    fontFamily: FONT_BODY,
    fontSize: '16px',
    lineHeight: 1.6,
  },
  thread: {
    display: 'grid',
    gap: '8px',
  },
  exchange: {
    display: 'grid',
    gap: '8px',
  },
  exchangeGap: {
    height: '8px',
  },
  msgRow: {
    display: 'flex',
    gap: `${AVATAR_GAP}px`,
    alignItems: 'flex-start',
  },
  avatar: {
    width: `${AVATAR_SIZE}px`,
    height: `${AVATAR_SIZE}px`,
    backgroundColor: COLOR_PRIMARY,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: FONT_HEADING,
    fontSize: '13px',
    fontWeight: 600,
    color: COLOR_SURFACE,
  },
  avatarSpacer: {
    width: `${AVATAR_SIZE}px`,
    flexShrink: 0,
  },
  questionBubble: {
    flex: 1,
    backgroundColor: COLOR_SURFACE,
    border: `1px solid ${COLOR_SECONDARY}`,
    padding: '10px 14px',
    fontFamily: FONT_HEADING,
    fontSize: '20px',
    fontWeight: 600,
    color: COLOR_PRIMARY,
    lineHeight: 1.15,
  },
  activeQuestionBubble: {
    flex: 1,
    backgroundColor: COLOR_SURFACE,
    border: `1px solid ${COLOR_PRIMARY}`,
    padding: '10px 14px',
    fontFamily: FONT_HEADING,
    fontSize: '20px',
    fontWeight: 600,
    color: COLOR_PRIMARY,
    lineHeight: 1.15,
  },
  userRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  userBubble: {
    backgroundColor: COLOR_PRIMARY,
    color: COLOR_SURFACE,
    padding: '9px 14px',
    fontFamily: FONT_BODY,
    fontSize: '16px',
    fontWeight: 600,
    maxWidth: '65%',
  },
  reactionText: {
    flex: 1,
    margin: 0,
    fontFamily: FONT_BODY,
    fontSize: '14px',
    fontStyle: 'italic',
    color: COLOR_TEXT_SECONDARY,
    lineHeight: 1.5,
    paddingLeft: '12px',
    paddingTop: '2px',
    paddingBottom: '2px',
    borderLeft: '2px solid #e0dbd3',
  },
  inputArea: {
    marginLeft: `${INDENT}px`,
    display: 'grid',
    gap: '8px',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    border: `1px solid ${COLOR_SECONDARY}`,
    backgroundColor: 'transparent',
    borderRadius: 0,
    fontFamily: FONT_BODY,
    fontSize: '16px',
    color: COLOR_TEXT,
    padding: '10px 12px',
    outline: 'none',
  },
  sendBtn: {
    border: 'none',
    backgroundColor: COLOR_PRIMARY,
    color: COLOR_SURFACE,
    fontFamily: FONT_BODY,
    fontSize: '16px',
    fontWeight: 600,
    padding: '10px 16px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  errorText: {
    margin: 0,
    minHeight: '20px',
    fontFamily: FONT_BODY,
    fontSize: '14px',
    color: COLOR_TEXT_SECONDARY,
    lineHeight: 1.4,
  },
};

export default CardFlow;
```

- [ ] **Step 2: Run both test files and confirm they pass**

```
cd workspaces/stages/04-build/output/pre-call-tool && npx vitest run src/components/CardFlow.test.jsx src/App.test.jsx
```

Expected: all tests PASS.

- [ ] **Step 3: Run the full test suite to catch any regressions**

```
cd workspaces/stages/04-build/output/pre-call-tool && npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add workspaces/stages/04-build/output/pre-call-tool/src/components/CardFlow.jsx \
        workspaces/stages/04-build/output/pre-call-tool/src/components/CardFlow.test.jsx \
        workspaces/stages/04-build/output/pre-call-tool/src/App.test.jsx
git commit -m "feat: replace card flow with conversational thread layout"
```

---

## Task 5: Fix App.jsx alignment for conversational layout

**Files:**
- Modify: `src/App.jsx:68-72`

The conversational layout grows downward from the top. Currently `App.jsx` vertically centers phase 1 content, which would push the thread down mid-page.

- [ ] **Step 1: Remove conditional alignItems**

In `src/App.jsx`, find this line:

```jsx
alignItems: visiblePhase >= 2 ? 'flex-start' : 'center',
```

Replace it with:

```jsx
alignItems: 'flex-start',
```

- [ ] **Step 2: Run the full test suite**

```
cd workspaces/stages/04-build/output/pre-call-tool && npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 3: Commit**

```bash
git add workspaces/stages/04-build/output/pre-call-tool/src/App.jsx
git commit -m "fix: align phase 1 content to top for conversational flow"
```

---

## Task 6: Delete CardStep.jsx

**Files:**
- Delete: `src/components/CardStep.jsx`

- [ ] **Step 1: Delete the file**

```bash
rm workspaces/stages/04-build/output/pre-call-tool/src/components/CardStep.jsx
```

- [ ] **Step 2: Run the full test suite to confirm nothing imports it**

```
cd workspaces/stages/04-build/output/pre-call-tool && npx vitest run
```

Expected: all tests PASS. If any test imports `CardStep` directly, remove that import — the file is gone.

- [ ] **Step 3: Commit**

```bash
git add -A workspaces/stages/04-build/output/pre-call-tool/src/components/CardStep.jsx
git commit -m "chore: remove CardStep — absorbed into CardFlow"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Thread structure (Q → user bubble → reaction) — Task 4
- ✅ Active question green border — Task 4 (`activeQuestionBubble` style)
- ✅ Reaction stays permanently in thread — `showReaction` always true for completed exchanges
- ✅ Reaction appears after 600ms, next question after 1000ms more — `handleSubmit` timers
- ✅ Progress dots left-aligned below input — Task 1 + Task 4 (`justify="flex-start"`)
- ✅ Intro heading reduced scale (42px desktop, 32px mobile) — Task 4 styles
- ✅ Editable chips removed — not present in new CardFlow
- ✅ Auto-scroll to keep input in view — `bottomRef.scrollIntoView` in Task 4
- ✅ `onComplete(answers)` signature unchanged — Task 4 `handleSubmit`
- ✅ Validation unchanged — `validateStepValue` used identically
- ✅ App alignment fix — Task 5
- ✅ CardStep deleted — Task 6

**Type consistency:**
- `CARD_REACTIONS` is `string[]` from `copy.js`, indexed by step index `i` — consistent in all usages
- `seqPhase` values `'idle' | 'user-bubble' | 'reaction'` used consistently in render conditions and `handleSubmit`
- `ProgressDots` props `completedCount`, `currentIndex`, `total`, `justify` — all passed correctly in Task 4
