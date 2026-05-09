import { getPkg, PARTNER_TYPES, fmtUsdt } from '../engine.js'

const S = {
  card: {
    background: '#0e0e20',
    border: '1px solid #1a1a2e',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '8px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  name: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: '13px',
  },
  pkgBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '4px',
    background: '#1a1a30',
    fontFamily: "'Orbitron', monospace",
  },
  bottomRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  energyWrap: {
    flex: 1,
    height: '5px',
    background: '#1a1a2e',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  energyLabel: {
    fontSize: '10px',
    color: '#666688',
    minWidth: '28px',
    textAlign: 'right',
    fontFamily: "'Orbitron', monospace",
  },
  reinvestBtn: (on) => ({
    padding: '4px 10px',
    border: `1px solid ${on ? '#26d68a' : '#e83858'}`,
    borderRadius: '6px',
    background: on ? '#26d68a18' : '#e8385818',
    color: on ? '#26d68a' : '#e83858',
    cursor: 'pointer',
    fontSize: '10px',
    fontFamily: "'Orbitron', monospace",
    fontWeight: 600,
    flexShrink: 0,
    letterSpacing: '0.5px',
  }),
  deposit: {
    fontSize: '11px',
    color: '#8888aa',
    fontFamily: "'Orbitron', monospace",
    minWidth: '60px',
    textAlign: 'right',
  },
}

export default function PartnerCard({ partner, onToggleReinvest }) {
  const pkg = getPkg(partner.deposit)
  const pt = PARTNER_TYPES.find(t => t.id === partner.type)
  const energyColor = partner.energy > 50 ? '#26d68a' : partner.energy > 25 ? '#e8b020' : '#e83858'

  return (
    <div style={{ ...S.card, borderColor: (pt?.color ?? '#1a1a2e') + '33' }}>
      <div style={S.topRow}>
        <span style={{ ...S.name, color: pt?.color ?? '#ccccee' }}>{partner.name}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {pkg && (
            <span style={{ ...S.pkgBadge, color: pkg.color, borderColor: pkg.color + '44', border: '1px solid' }}>
              {pkg.label}
            </span>
          )}
          <span style={{ ...S.deposit }}>{fmtUsdt(partner.deposit)} $</span>
        </div>
      </div>
      <div style={S.bottomRow}>
        <div style={S.energyWrap}>
          <div style={{ width: `${partner.energy}%`, height: '100%', background: energyColor, borderRadius: '3px', transition: 'width 0.4s' }} />
        </div>
        <span style={S.energyLabel}>{Math.round(partner.energy)}%</span>
        <button style={S.reinvestBtn(partner.reinvest)} onClick={() => onToggleReinvest(partner.id)}>
          {partner.reinvest ? '♻ REINVEST' : '💸 AUSZAHLEN'}
        </button>
      </div>
    </div>
  )
}
