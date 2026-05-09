import { useState, useCallback, useEffect, useRef } from 'react'
import {
  processMonth, applyEvent, getRank, RANKS, RI, PARTNER_TYPES,
  fmtNum, fmtUsdt, nextPartnerId, getPkg
} from '../engine.js'
import EventModal from './EventModal.jsx'
import PartnerCard from './PartnerCard.jsx'

// ── NOTIFICATION TOAST ───────────────────────────────────────
function Toast({ notif }) {
  const colors = {
    rank:   { bg: '#e8b02033', border: '#e8b020', text: '#e8b020' },
    good:   { bg: '#26d68a22', border: '#26d68a', text: '#26d68a' },
    bad:    { bg: '#e8385822', border: '#e83858', text: '#e83858' },
    warn:   { bg: '#ff803022', border: '#ff8030', text: '#ff8030' },
    lock:   { bg: '#b050f022', border: '#b050f0', text: '#b050f0' },
    info:   { bg: '#5090ff22', border: '#5090ff', text: '#5090ff' },
  }
  const c = colors[notif.type] ?? colors.info
  return (
    <div className="notif-anim" style={{
      padding: '8px 14px',
      borderRadius: '8px',
      border: `1px solid ${c.border}`,
      background: c.bg,
      fontSize: '12px',
      fontWeight: 600,
      color: c.text,
      fontFamily: "'Inter', sans-serif",
      boxShadow: `0 4px 20px ${c.border}22`,
      whiteSpace: 'nowrap',
    }}>
      {notif.type === 'rank' && '🏆 '}{notif.text}{notif.bonus ? ` +${notif.bonus.toLocaleString()} USDT` : ''}
    </div>
  )
}

// ── STAT CARD ────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: '#0e0e20',
      border: `1px solid ${color}33`,
      borderRadius: '10px',
      padding: '10px 6px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span style={{ color: '#666688', fontSize: '9px', fontFamily: "'Orbitron', monospace", letterSpacing: '1px' }}>
        {label.toUpperCase()}
      </span>
      <span style={{ color, fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '13px' }}>
        {value}
      </span>
    </div>
  )
}

// ── SECTION TITLE ────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: "'Orbitron', monospace",
      fontSize: '10px',
      letterSpacing: '2px',
      color: '#555577',
      marginBottom: '10px',
      textTransform: 'uppercase',
      borderLeft: '2px solid #333366',
      paddingLeft: '8px',
    }}>
      {children}
    </div>
  )
}

// ── MAIN GAME SCREEN ─────────────────────────────────────────
export default function GameScreen({ gs, setGs, onMenu, onReset }) {
  const [showPartners, setShowPartners] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const [addingPartner, setAddingPartner] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const notifTimerRef = useRef({})

  const rank = getRank(gs.rankId)
  const nextRank = RANKS[RI(gs.rankId) + 1]
  const lvProgress = nextRank ? Math.min(100, (gs.totalLV / nextRank.minLV) * 100) : 100
  const activePartners = gs.partners.filter(p => p.active)

  // Clear notifications after 3s
  useEffect(() => {
    if (gs.notifications.length > 0) {
      const t = setTimeout(() => {
        setGs(prev => ({ ...prev, notifications: [] }))
      }, 3200)
      return () => clearTimeout(t)
    }
  }, [gs.notifications, setGs])

  const advanceMonth = useCallback(() => {
    if (gs.actionsLeft > 0) {
      setGs(prev => ({
        ...prev,
        notifications: [{ type: 'warn', text: `Nutze noch ${prev.actionsLeft} Aktion(en)!` }],
      }))
      return
    }
    setGs(prev => processMonth(prev))
  }, [gs.actionsLeft, setGs])

  const addPartner = useCallback((typeId) => {
    setGs(prev => {
      const pt = PARTNER_TYPES.find(t => t.id === typeId)
      if (!pt) return prev

      // Freemium gate
      if (pt.locked && RI(prev.rankId) < RI(pt.unlockRank ?? 'vanguard_pro')) {
        return {
          ...prev,
          notifications: [{ type: 'lock', text: `🔒 Freischalten ab ${pt.unlockRank ?? 'Vanguard PRO'}` }],
        }
      }

      if (prev.actionsLeft < pt.actionCost) {
        return {
          ...prev,
          notifications: [{ type: 'warn', text: `Braucht ${pt.actionCost} Aktion(en) — nur ${prev.actionsLeft} übrig` }],
        }
      }

      const onboardingCost = pt.avgDeposit * 0.10
      if (prev.capital < onboardingCost) {
        return {
          ...prev,
          notifications: [{ type: 'warn', text: `Zu wenig Kapital! Brauche ${onboardingCost.toFixed(0)} USDT` }],
        }
      }

      const np = {
        id: nextPartnerId(),
        name: `${pt.emoji} ${pt.label} #${prev.partners.length + 1}`,
        type: typeId,
        deposit: pt.avgDeposit,
        reinvest: true,
        active: true,
        energy: 85,
        legRank: 'nova',
      }
      const topUpLV = np.deposit * 0.4

      return {
        ...prev,
        partners: [...prev.partners, np],
        capital: prev.capital - onboardingCost,
        totalLV: prev.totalLV + topUpLV,
        actionsLeft: prev.actionsLeft - pt.actionCost,
        log: [`➕ ${np.name} beigetreten! +${topUpLV.toFixed(0)} LV sofort. (-${onboardingCost.toFixed(0)} USDT Onboarding)`, ...prev.log.slice(0, 29)],
        notifications: [{ type: 'good', text: `+${topUpLV.toFixed(0)} LV sofort!` }],
      }
    })
    setAddingPartner(false)
  }, [setGs])

  const toggleReinvest = useCallback((id) => {
    setGs(prev => ({
      ...prev,
      partners: prev.partners.map(p => p.id === id ? { ...p, reinvest: !p.reinvest } : p),
    }))
  }, [setGs])

  const resolveEvent = useCallback((event, choice) => {
    setGs(prev => applyEvent(prev, event, choice))
  }, [setGs])

  return (
    <div style={{ minHeight: '100vh', background: '#080814', maxWidth: '480px', margin: '0 auto', position: 'relative' }}>

      {/* Ambient BG */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 20% 10%, ${rank.color}08 0%, transparent 50%)`,
      }} />

      {/* Toasts */}
      <div style={{ position: 'fixed', top: '64px', right: '12px', zIndex: 200, display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '240px' }}>
        {gs.notifications.map((n, i) => <Toast key={i} notif={n} />)}
      </div>

      {/* Event Modal */}
      {gs.pendingEvent && (
        <EventModal event={gs.pendingEvent} onResolve={resolveEvent} />
      )}

      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: '#0c0c1a',
        borderBottom: '1px solid #1a1a2e',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          onClick={onMenu}
          style={{ background: 'none', border: '1px solid #2a2a4a', borderRadius: '6px', color: '#6666aa', fontSize: '11px', padding: '5px 10px', fontFamily: "'Orbitron', monospace" }}
        >
          ← Menu
        </button>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '13px', color: '#e8b020' }}>
          MONAT {gs.month}
        </div>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '13px', color: '#26d68a' }}>
          💵 {fmtUsdt(gs.capital)}
        </div>
      </div>

      {/* ── RANK BAR ── */}
      <div style={{
        padding: '10px 14px', background: '#0a0a18',
        borderBottom: '1px solid #1a1a2e',
        display: 'flex', gap: '12px', alignItems: 'center', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          border: `2px solid ${rank.color}`,
          borderRadius: '8px',
          padding: '6px 12px',
          fontFamily: "'Orbitron', monospace",
          fontWeight: 700,
          fontSize: '12px',
          color: rank.color,
          flexShrink: 0,
          boxShadow: `0 0 12px ${rank.color}33`,
        }}>
          {rank.emoji} {rank.label}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '4px', fontFamily: "'Orbitron', monospace" }}>
            <span style={{ color: '#8888aa' }}>LV: {fmtNum(gs.totalLV)}</span>
            {nextRank && <span style={{ color: '#555577' }}>→ {nextRank.emoji} {nextRank.label}: {fmtNum(nextRank.minLV)}</span>}
          </div>
          <div style={{ height: '5px', background: '#1a1a2e', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: `${lvProgress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${rank.color}88, ${rank.color})`,
              borderRadius: '3px',
              transition: 'width 0.6s ease',
              boxShadow: `0 0 8px ${rank.color}`,
            }} />
          </div>
          <div style={{ fontSize: '9px', color: '#444466', marginTop: '3px', fontFamily: "'Orbitron', monospace" }}>
            {lvProgress.toFixed(1)}% zum nächsten Rang
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', padding: '10px 14px', position: 'relative', zIndex: 1 }}>
        <StatCard label="Partner"   value={activePartners.length}            icon="👥" color="#ec4899" />
        <StatCard label="Monatlich" value={`${fmtUsdt(gs.monthlyIncome)}$`}  icon="📈" color="#26d68a" />
        <StatCard label="Gesamt"    value={`${fmtNum(gs.totalEarned)}$`}     icon="💰" color="#e8b020" />
        <StatCard label="Aktionen"  value={`${gs.actionsLeft}/${gs.actionsPerMonth}`} icon="⚡" color="#5090ff" />
      </div>

      {/* ── MARKET BANNER ── */}
      {gs.marketMultiplier !== 1.0 && (
        <div style={{
          margin: '0 14px 10px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: `1px solid ${gs.marketMultiplier > 1 ? '#26d68a' : '#e83858'}`,
          background: gs.marketMultiplier > 1 ? '#26d68a18' : '#e8385818',
          fontSize: '12px',
          textAlign: 'center',
          color: gs.marketMultiplier > 1 ? '#26d68a' : '#e83858',
          fontFamily: "'Orbitron', monospace",
          fontWeight: 600,
        }}>
          {gs.marketMultiplier > 1 ? '📈 BULL MARKET' : '📉 BEAR MARKET'} ×{gs.marketMultiplier.toFixed(2)} — noch {gs.marketMonthsLeft} Monat(e)
        </div>
      )}

      {/* ── MAIN ACTIONS ── */}
      <div style={{ padding: '4px 14px 12px', position: 'relative', zIndex: 1 }}>
        <SectionTitle>⚡ Aktionen — Monat {gs.month} ({gs.actionsLeft} übrig)</SectionTitle>

        {!addingPartner ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setAddingPartner(true)}
              style={{
                padding: '13px 16px',
                border: '1px solid #5090ff',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#9999ff',
                cursor: 'pointer',
                background: '#5090ff18',
                fontFamily: "'Orbitron', monospace",
                fontWeight: 600,
                letterSpacing: '1px',
                opacity: gs.actionsLeft === 0 ? 0.5 : 1,
              }}
            >
              ➕ Partner hinzufügen
            </button>

            <button
              onClick={() => setShowPartners(v => !v)}
              style={{
                padding: '13px 16px',
                border: '1px solid #ec4899',
                borderRadius: '10px',
                fontSize: '13px',
                color: '#ec4899',
                cursor: 'pointer',
                background: '#ec489918',
                fontFamily: "'Orbitron', monospace",
                fontWeight: 600,
                letterSpacing: '1px',
              }}
            >
              👥 Netzwerk verwalten ({activePartners.length} Partner)
            </button>

            <button
              onClick={advanceMonth}
              disabled={gs.actionsLeft > 0}
              style={{
                padding: '14px 16px',
                border: `1px solid ${gs.actionsLeft > 0 ? '#333355' : '#26d68a'}`,
                borderRadius: '10px',
                fontSize: '13px',
                color: gs.actionsLeft > 0 ? '#444466' : '#26d68a',
                cursor: gs.actionsLeft > 0 ? 'not-allowed' : 'pointer',
                background: gs.actionsLeft > 0 ? 'transparent' : '#26d68a18',
                fontFamily: "'Orbitron', monospace",
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              {gs.actionsLeft > 0
                ? `⏳ Nutze noch ${gs.actionsLeft} Aktion(en)`
                : '⏭ Nächster Monat →'}
            </button>
          </div>
        ) : (
          /* Partner picker */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <SectionTitle>Partner-Typ wählen ({gs.actionsLeft} Aktionen übrig)</SectionTitle>
            {PARTNER_TYPES.map(pt => {
              const isLocked = pt.locked && RI(gs.rankId) < RI(pt.unlockRank ?? 'vanguard_pro')
              const canAfford = gs.capital >= pt.avgDeposit * 0.10
              const hasActions = gs.actionsLeft >= pt.actionCost
              const disabled = isLocked || !canAfford || !hasActions

              return (
                <button
                  key={pt.id}
                  onClick={() => !disabled && addPartner(pt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    border: `1px solid ${disabled ? '#222244' : pt.color + '66'}`,
                    borderRadius: '10px',
                    background: disabled ? '#0a0a18' : pt.color + '10',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    color: '#ccccee',
                    opacity: disabled ? 0.4 : 1,
                    transition: 'opacity 0.2s, background 0.2s',
                  }}
                >
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{pt.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: isLocked ? '#666688' : pt.color, fontWeight: 700, fontSize: '13px', fontFamily: "'Orbitron', monospace" }}>
                      {pt.label} {isLocked ? '🔒' : ''}
                    </div>
                    <div style={{ color: '#8888aa', fontSize: '11px', marginTop: '2px' }}>{pt.description}</div>
                    <div style={{ color: '#666688', fontSize: '10px', marginTop: '2px', fontFamily: "'Orbitron', monospace" }}>
                      Bot: {pt.avgDeposit.toLocaleString()} USDT · {pt.actionCost} Aktion · -{Math.round(pt.avgDeposit * 0.10)} USDT Onboarding
                    </div>
                  </div>
                  <div style={{ color: '#26d68a', fontFamily: "'Orbitron', monospace", fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                    +{(pt.avgDeposit * 0.4).toFixed(0)} LV
                  </div>
                </button>
              )
            })}
            <button
              onClick={() => setAddingPartner(false)}
              style={{
                padding: '10px',
                border: '1px solid #2a2a4a',
                borderRadius: '8px',
                background: 'transparent',
                color: '#555577',
                cursor: 'pointer',
                fontFamily: "'Orbitron', monospace",
                fontSize: '11px',
              }}
            >
              ✕ Abbrechen
            </button>
          </div>
        )}
      </div>

      {/* ── PARTNER LIST ── */}
      {showPartners && (
        <div style={{ padding: '0 14px 12px', position: 'relative', zIndex: 1 }}>
          <SectionTitle>👥 Dein Netzwerk ({activePartners.length} aktiv)</SectionTitle>
          {activePartners.length === 0 ? (
            <div style={{ color: '#444466', fontSize: '12px', textAlign: 'center', padding: '20px', fontFamily: "'Orbitron', monospace" }}>
              Noch keine Partner — füge deinen ersten hinzu!
            </div>
          ) : (
            activePartners.map(p => (
              <PartnerCard key={p.id} partner={p} onToggleReinvest={toggleReinvest} />
            ))
          )}
        </div>
      )}

      {/* ── RANG ROADMAP ── */}
      <div style={{ padding: '0 14px 12px', position: 'relative', zIndex: 1 }}>
        <SectionTitle>🗺 Rang-Roadmap</SectionTitle>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
          {RANKS.map((r, i) => {
            const done = RI(gs.rankId) >= i
            const current = gs.rankId === r.id
            return (
              <div
                key={r.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '10px 8px',
                  border: `1px solid ${done ? r.color + '88' : '#1a1a2e'}`,
                  borderRadius: '10px',
                  minWidth: '76px',
                  flexShrink: 0,
                  background: current ? r.color + '18' : 'transparent',
                  boxShadow: current ? `0 0 14px ${r.color}33` : 'none',
                  transition: 'background 0.4s',
                }}
              >
                <span style={{ fontSize: '18px' }}>{done ? '✅' : r.emoji}</span>
                <div style={{ color: done ? r.color : '#444466', fontWeight: 700, fontSize: '10px', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}>
                  {r.label}
                </div>
                <div style={{ color: '#333355', fontSize: '9px', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}>
                  {r.minLV >= 1000 ? `${(r.minLV / 1000).toFixed(0)}k` : r.minLV} LV
                </div>
                {r.bonus > 0 && (
                  <div style={{ color: '#555544', fontSize: '9px' }}>
                    +{r.bonus >= 1000 ? `${r.bonus / 1000}k` : r.bonus}$
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── ACTIVITY LOG ── */}
      <div style={{ padding: '0 14px 16px', position: 'relative', zIndex: 1 }}>
        <button
          onClick={() => setShowLog(v => !v)}
          style={{
            width: '100%',
            padding: '9px',
            background: '#0e0e20',
            border: '1px solid #1a1a2e',
            borderRadius: '8px',
            color: '#555577',
            cursor: 'pointer',
            fontFamily: "'Orbitron', monospace",
            fontSize: '10px',
            letterSpacing: '1px',
          }}
        >
          📋 ACTIVITY LOG {showLog ? '▲' : '▼'}
        </button>
        {showLog && (
          <div style={{
            background: '#080814',
            border: '1px solid #1a1a2e',
            borderRadius: '0 0 8px 8px',
            padding: '10px 12px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
            {gs.log.slice(0, 15).map((l, i) => (
              <div key={i} style={{
                color: i === 0 ? '#9999cc' : '#444466',
                fontSize: '11px',
                padding: '4px 0',
                borderBottom: '1px solid #111122',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.5,
              }}>
                {l}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SETTINGS / RESET ── */}
      <div style={{ padding: '0 14px 32px', position: 'relative', zIndex: 1 }}>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            style={{
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: '1px solid #1a1a2e',
              borderRadius: '8px',
              color: '#333355',
              cursor: 'pointer',
              fontFamily: "'Orbitron', monospace",
              fontSize: '10px',
            }}
          >
            ⚙ Einstellungen
          </button>
        ) : (
          <div style={{
            background: '#0e0e20',
            border: '1px solid #e8385844',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ color: '#e83858', fontSize: '12px', fontFamily: "'Orbitron', monospace", textAlign: 'center' }}>
              Spiel zurücksetzen?
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={onReset}
                style={{ flex: 1, padding: '10px', background: '#e8385822', border: '1px solid #e83858', borderRadius: '8px', color: '#e83858', cursor: 'pointer', fontFamily: "'Orbitron', monospace", fontSize: '11px' }}
              >
                ✓ Reset
              </button>
              <button
                onClick={() => setShowReset(false)}
                style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #2a2a4a', borderRadius: '8px', color: '#666688', cursor: 'pointer', fontFamily: "'Orbitron', monospace", fontSize: '11px' }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
