import {
  COLOR_ACCENT,
  COLOR_PRIMARY,
  COLOR_SECONDARY,
} from '../constants';

function ProgressDots({
  completedCount,
  currentIndex,
  justify = 'center',
  total,
}) {
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
            style={{
              ...styles.dot,
              backgroundColor,
            }}
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
