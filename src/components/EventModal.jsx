const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#00000099',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#0e0e20',
    border: '2px solid #e8b020',
    borderRadius: '20px',
    padding: '32px 24px',
    maxWidth: '360px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 0 60px #e8b02044',
    animation: 'slideInFade 0.3s ease',
  },
  emoji: { fontSize: '52px', marginBottom: '14px', display: 'block' },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontWeight: 700,
    fontSize: '17px',
    color: '#e8b020',
    marginBottom: '10px',
  },
  desc: {
    color: '#9999cc',
    fontSize: '14px',
    lineHeight: 1.7,
    marginBottom: '20px',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  btn: (c) => ({
    flex: 1,
    padding: '12px 14px',
    border: `1px solid ${c}`,
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#eeeeff',
    fontFamily: "'Orbitron', monospace",
    fontWeight: 600,
    background: c + '22',
    letterSpacing: '0.5px',
    transition: 'background 0.2s',
  }),
}

export default function EventModal({ event, onResolve }) {
  if (!event) return null

  const renderButtons = () => {
    switch (event.effect) {
      case 'bonus_partner':
        return (
          <div style={S.btnRow}>
            <button style={S.btn('#26d68a')} onClick={() => onResolve(event, 'accept')}>✅ Annehmen</button>
            <button style={S.btn('#e83858')} onClick={() => onResolve(event, 'decline')}>❌ Ablehnen</button>
          </div>
        )
      case 'energy_crisis':
        return (
          <div style={S.btnRow}>
            <button style={S.btn('#26d68a')} onClick={() => onResolve(event, 'invest')}>💪 Investiere -50 USDT</button>
            <button style={S.btn('#e83858')} onClick={() => onResolve(event, 'ignore')}>🤷 Ignorieren</button>
          </div>
        )
      case 'pkg_upgrade':
        return (
          <div style={S.btnRow}>
            <button style={S.btn('#26d68a')} onClick={() => onResolve(event, 'upgrade')}>⬆️ Paket verdoppeln</button>
            <button style={S.btn('#666688')} onClick={() => onResolve(event, 'skip')}>⏭ Überspringen</button>
          </div>
        )
      default:
        return (
          <button style={{ ...S.btn('#5090ff'), flex: 'unset', minWidth: '160px' }} onClick={() => onResolve(event, null)}>
            Verstanden ✓
          </button>
        )
    }
  }

  const typeColor = event.type === 'good' ? '#26d68a' : event.type === 'bad' ? '#e83858' : '#e8b020'

  return (
    <div style={S.overlay}>
      <div style={{ ...S.card, borderColor: typeColor, boxShadow: `0 0 60px ${typeColor}33` }}>
        <span style={S.emoji}>{event.emoji}</span>
        <div style={{ ...S.title, color: typeColor }}>{event.title}</div>
        <div style={S.desc}>{event.desc}</div>
        {renderButtons()}
      </div>
    </div>
  )
}
