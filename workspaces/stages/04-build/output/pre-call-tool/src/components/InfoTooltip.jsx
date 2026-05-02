function InfoTooltip({ body, id, isMobile, title }) {
  const tooltipStyle = isMobile
    ? {
        ...styles.tooltip,
        ...styles.mobileTooltip,
      }
    : {
        ...styles.tooltip,
        ...styles.desktopTooltip,
      };

  return (
    <div
      aria-live="polite"
      id={id}
      role="tooltip"
      style={tooltipStyle}
    >
      {!isMobile ? <div style={styles.arrow} /> : null}
      {title ? <div style={styles.title}>{title}</div> : null}
      <div style={styles.body}>{body}</div>
    </div>
  );
}

const styles = {
  tooltip: {
    zIndex: 20,
    backgroundColor: '#FFFDF8',
    border: '1px solid #E4D3C2',
    borderRadius: '14px',
    padding: '14px 14px 12px',
    boxShadow: '0 18px 32px rgba(60, 45, 30, 0.16)',
    textAlign: 'left',
  },
  desktopTooltip: {
    position: 'absolute',
    right: '0',
    bottom: 'calc(100% + 12px)',
    width: 'min(320px, calc(100vw - 64px))',
    maxWidth: '100%',
  },
  mobileTooltip: {
    position: 'absolute',
    top: '36px',
    right: '0',
    width: 'min(220px, calc(100vw - 48px))',
    maxWidth: 'calc(100vw - 48px)',
  },
  arrow: {
    position: 'absolute',
    right: '14px',
    bottom: '-7px',
    width: '14px',
    height: '14px',
    backgroundColor: '#FFFDF8',
    borderRight: '1px solid #E4D3C2',
    borderBottom: '1px solid #E4D3C2',
    transform: 'rotate(45deg)',
  },
  title: {
    marginBottom: '8px',
    color: '#B84F34',
    fontSize: '13px',
    fontWeight: 700,
    lineHeight: '1.35',
  },
  body: {
    color: '#1F252B',
    fontSize: '12px',
    lineHeight: '1.5',
    overflowWrap: 'anywhere',
  },
};

export default InfoTooltip;
