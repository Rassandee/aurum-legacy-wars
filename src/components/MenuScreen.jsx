import { RANKS, RI } from '../engine.js'

const S = {
  root: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 50% 30%, #0d0d2e 0%, #050510 70%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'fixed',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, #e8b02022 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'glow 3s ease-in-out infinite',
  },
  card: {
    background: '#0e0e20',
    border: '1px solid #2a2a4a',
    borderRadius: '24px',
    padding: '36px 28px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    boxShadow: '0 0 80px #e8b02018, 0 20px 60px #00000080',
  },
  logoA: {
    display: 'block',
    fontFamily: "'Orbitron', monospace",
    fontSize: '46px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #e8b020, #ff8030, #e83858)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '8px',
    lineHeight: 1,
  },
  logoSub: {
    display: 'block',
    fontFamily: "'Orbitron', monospace",
    fontSize: '12px',
    letterSpacing: '6px',
    color: '#6666aa',
    marginTop: '4px',
    marginBottom: '4px',
  },
  logoLine: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #e8b020, transparent)',
    margin: '14px auto',
    width: '180px',
  },
  desc: {
    color: '#8888aa',
    fontSize: '13px',
    lineHeight: 1.7,
    marginBottom: '24px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '28px',
  },
  feature: {
    background: '#1a1a30',
    border: '1px solid #2a2a4a',
    borderRadius: '10px',
    padding: '10px 8px',
    fontSize: '12px',
    color: '#9999cc',
    fontFamily: "'Inter', sans-serif",
  },
  btnPrimary: {
    width: '100%',
    padding: '15px 0',
    background: 'linear-gradient(135deg, #e8b020, #ff8030)',
    border: 'none',
    borderRadius: '12px',
    fontFamily: "'Orbitron', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#080814',
    cursor: 'pointer',
    letterSpacing: '2px',
    marginBottom: '10px',
    transition: 'transform 0.1s, box-shadow 0.2s',
  },
  btnSecondary: {
    width: '100%',
    padding: '13px 0',
    background: 'transparent',
    border: '1px solid #3a3a6a',
    borderRadius: '12px',
    fontFamily: "'Orbitron', monospace",
    fontSize: '12px',
    fontWeight: 600,
    color: '#9999cc',
    cursor: 'pointer',
    letterSpacing: '1px',
    marginBottom: '10px',
    transition: 'border-color 0.2s',
  },
  savedGame: {
    background: '#121228',
    border: '1px solid #26d68a44',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '16px',
    fontSize: '12px',
    color: '#26d68a',
    fontFamily: "'Orbitron', monospace",
  },
  freemium: {
    color: '#44445a',
    fontSize: '11px',
    marginTop: '16px',
    lineHeight: 1.5,
  },
  rankPreview: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  rankDot: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
}

export default function MenuScreen({ hasSave, savedMonth, savedRank, onNewGame, onContinue }) {
  const savedRankData = RANKS.find(r => r.id === savedRank)

  return (
    <div style={S.root}>
      <div style={S.glow} />
      <div style={S.card}>
        {/* Logo */}
        <div style={{ marginBottom: '20px' }}>
          <span style={S.logoA}>AURUM</span>
          <span style={S.logoSub}>LEGACY WARS</span>
          <div style={S.logoLine} />
        </div>

        {/* Rank preview dots */}
        <div style={S.rankPreview}>
          {RANKS.slice(0, 9).map(r => (
            <div
              key={r.id}
              title={r.label}
              style={{ ...S.rankDot, borderColor: r.color + '88', color: r.color }}
            >
              {r.emoji}
            </div>
          ))}
        </div>

        <p style={S.desc}>
          Baue dein MLM-Netzwerk mit <strong style={{ color: '#e8b020' }}>echten AURUM-Mechaniken</strong>.
          Treffe strategische Entscheidungen, reagiere auf Events — von Nova zum Alpha.
        </p>

        <div style={S.features}>
          {[
            '⚡ Echte LV-Formeln',
            '📈 8 Bot-Packages',
            '🎲 8 Random Events',
            '🏆 9 Ränge (MVP)',
            '💾 Auto-Save',
            '🔓 Freemium Gates',
          ].map(f => (
            <div key={f} style={S.feature}>{f}</div>
          ))}
        </div>

        {/* Saved game info */}
        {hasSave && savedRankData && (
          <div style={S.savedGame}>
            💾 Gespeicherter Stand: Monat {savedMonth} · {savedRankData.emoji} {savedRankData.label}
          </div>
        )}

        {/* Buttons */}
        {hasSave && (
          <button style={S.btnSecondary} onClick={onContinue}>
            ▶ WEITER SPIELEN
          </button>
        )}
        <button style={S.btnPrimary} onClick={onNewGame}>
          {hasSave ? '🔄 NEUES SPIEL' : '▶ SPIEL STARTEN'}
        </button>

        <p style={S.freemium}>
          🔓 Free bis Vanguard PRO · Vollversion 4.99 $/Mo<br />
          Echte AURUM-Mechaniken — simuliere dein Netzwerk
        </p>
      </div>
    </div>
  )
}
