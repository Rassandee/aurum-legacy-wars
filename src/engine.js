// ═══════════════════════════════════════════════════════════════
// AURUM LEGACY WARS — Game Engine
// Echte AURUM-Formeln als Spiellogik
// ═══════════════════════════════════════════════════════════════

export const BOT_RATE = 0.175; // 17.5% monatlich

// ── BOT PACKAGES ────────────────────────────────────────────
export const PACKAGES = [
  { id: 'basic',    label: 'Basic',    min: 100,   max: 249.99,  client: 0.60, company: 0.40, yield: 10.50, color: '#6090d8' },
  { id: 'standard', label: 'Standard', min: 250,   max: 999.99,  client: 0.65, company: 0.35, yield: 11.37, color: '#3a78e0' },
  { id: 'comfort',  label: 'Comfort',  min: 1000,  max: 2499.99, client: 0.70, company: 0.30, yield: 12.25, color: '#26d68a' },
  { id: 'optimal',  label: 'Optimal',  min: 2500,  max: 4999.99, client: 0.75, company: 0.25, yield: 13.12, color: '#c8961e' },
  { id: 'business', label: 'Business', min: 5000,  max: 9999.99, client: 0.80, company: 0.20, yield: 14.00, color: '#ff8030' },
  { id: 'vip',      label: 'VIP',      min: 10000, max: 24999.99,client: 0.85, company: 0.15, yield: 14.88, color: '#b050f0' },
  { id: 'luxury',   label: 'Luxury',   min: 25000, max: 49999.99,client: 0.90, company: 0.10, yield: 15.75, color: '#e83858' },
  { id: 'ultimate', label: 'Ultimate', min: 50000, max: 999999,  client: 0.95, company: 0.05, yield: 16.62, color: '#e8b800' },
];

export const getPkg = (d) =>
  PACKAGES.find((p) => d >= p.min && d <= p.max) || (d >= 50000 ? PACKAGES[7] : null);

// ── RANG-SYSTEM ──────────────────────────────────────────────
export const RANKS = [
  { id: 'nova',        label: 'Nova',        emoji: '⭐', minLV: 0,       minInvest: 0,     ref: 3,    ps: 0,    bonus: 0,      color: '#5090ff', legs: [] },
  { id: 'voyager',     label: 'Voyager',     emoji: '🚀', minLV: 3000,    minInvest: 100,   ref: 5,    ps: 5,    bonus: 100,    color: '#26d68a', legs: [{ rank: 'nova', count: 2 }] },
  { id: 'vanguard',    label: 'Vanguard',    emoji: '🛡️', minLV: 10000,   minInvest: 300,   ref: 7,    ps: 7.5,  bonus: 500,    color: '#c8961e', legs: [{ rank: 'voyager', count: 2 }] },
  { id: 'vanguard_pro',label: 'Vanguard PRO',emoji: '⚔️', minLV: 25000,   minInvest: 750,   ref: 9,    ps: 10,   bonus: 1000,   color: '#e8b020', legs: [{ rank: 'vanguard', count: 2 }] },
  { id: 'nexus',       label: 'Nexus',       emoji: '🔮', minLV: 50000,   minInvest: 1500,  ref: 10.5, ps: 12.5, bonus: 2000,   color: '#ff8030', legs: [{ rank: 'vanguard', count: 2 }] },
  { id: 'oracle',      label: 'Oracle',      emoji: '👁️', minLV: 100000,  minInvest: 3000,  ref: 12,   ps: 15,   bonus: 5000,   color: '#b050f0', legs: [{ rank: 'vanguard_pro', count: 2 }] },
  { id: 'prime',       label: 'Prime',       emoji: '💎', minLV: 250000,  minInvest: 6000,  ref: 13.5, ps: 17.5, bonus: 10000,  color: '#e83858', legs: [{ rank: 'nexus', count: 2 }] },
  { id: 'elite',       label: 'Elite',       emoji: '🔥', minLV: 500000,  minInvest: 8000,  ref: 14.5, ps: 19,   bonus: 20000,  color: '#ff50a0', legs: [{ rank: 'oracle', count: 2 }] },
  { id: 'magnat',      label: 'Magnat',      emoji: '👑', minLV: 1000000, minInvest: 15000, ref: 15.5, ps: 20.5, bonus: 50000,  color: '#20d8d0', legs: [{ rank: 'prime', count: 1 }] },
];

export const RI = (id) => RANKS.findIndex((r) => r.id === id);
export const getRank = (id) => RANKS.find((r) => r.id === id) || RANKS[0];

export function computeRank(totalLV, totalInvest, legs) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (totalLV < r.minLV) break;
    if (totalInvest < r.minInvest) break;
    if (r.legs.length > 0) {
      const ok = r.legs.every((req) => {
        const legIdx = RI(req.rank);
        return legs.filter((l) => RI(l.rank) >= legIdx).length >= req.count;
      });
      if (!ok) break;
    }
    rank = r;
  }
  return rank;
}

// ── PARTNER-TYPEN ────────────────────────────────────────────
export const PARTNER_TYPES = [
  {
    id: 'low',
    label: 'Low Investor',
    emoji: '✏️',
    color: '#22d3ee',
    avgDeposit: 200,
    churnRate: 0.06,
    energyDrain: 5,
    actionCost: 1,
    description: 'Kleines Investment, stabile Breite',
    lvGain: 80,
    locked: false,
  },
  {
    id: 'mid',
    label: 'Mid Investor',
    emoji: '💼',
    color: '#26d68a',
    avgDeposit: 1000,
    churnRate: 0.04,
    energyDrain: 8,
    actionCost: 2,
    description: 'Solides Comfort-Paket, gute LV',
    lvGain: 400,
    locked: false,
  },
  {
    id: 'high',
    label: 'High Investor',
    emoji: '💲',
    color: '#f59e0b',
    avgDeposit: 5000,
    churnRate: 0.03,
    energyDrain: 12,
    actionCost: 3,
    description: 'Business-Paket, maximaler LV-Schub',
    lvGain: 2000,
    locked: false,
  },
  {
    id: 'vip',
    label: 'VIP Investor',
    emoji: '👑',
    color: '#b050f0',
    avgDeposit: 10000,
    churnRate: 0.02,
    energyDrain: 15,
    actionCost: 4,
    description: 'VIP-Paket — maximale Rendite',
    lvGain: 4000,
    locked: true,
    unlockRank: 'vanguard_pro',
  },
  {
    id: 'networker',
    label: 'Networker',
    emoji: '👥',
    color: '#ec4899',
    avgDeposit: 500,
    churnRate: 0.05,
    energyDrain: 10,
    actionCost: 2,
    description: 'Baut eigene Linie → passive LV-Tiefe',
    lvGain: 200,
    locked: false,
  },
];

// ── RANDOM EVENTS ────────────────────────────────────────────
export const EVENTS = [
  { id: 'bull',     type: 'good',   emoji: '📈', title: 'Crypto Bull Run!',           desc: 'Bot-Performance +25% für 2 Monate.',         effect: 'bull_market',   weight: 8 },
  { id: 'bear',     type: 'bad',    emoji: '📉', title: 'Market Correction',          desc: 'Bot-Performance -20% für 1 Monat.',           effect: 'bear_market',   weight: 10 },
  { id: 'lead',     type: 'choice', emoji: '🤝', title: 'Spontaner Lead!',            desc: 'Jemand mit 3.000 USDT fragt an — annehmen?',  effect: 'bonus_partner', weight: 12 },
  { id: 'promo',    type: 'good',   emoji: '🎯', title: 'AURUM Promo Week',           desc: 'Referral-Income +50% diesen Monat.',          effect: 'promo_referral',weight: 10 },
  { id: 'churn',    type: 'choice', emoji: '😤', title: 'Partner verliert Motivation',desc: 'Ein Partner droht inaktiv zu werden.',         effect: 'energy_crisis', weight: 15 },
  { id: 'upgrade',  type: 'choice', emoji: '⬆️', title: 'Package Upgrade möglich',   desc: 'Dein größter Partner kann sein Paket verdoppeln.', effect: 'pkg_upgrade', weight: 12 },
  { id: 'fee',      type: 'info',   emoji: '💸', title: 'Ecosystem Fee fällig',       desc: 'Jährliche Gebühr: -19.99 USDT pro Account.',  effect: 'eco_fee',       weight: 8 },
  { id: 'viral',    type: 'good',   emoji: '✨', title: 'Viraler Moment!',            desc: '+2 neue Partner treten sofort bei.',          effect: 'bonus_leads',   weight: 8 },
];

export function pickRandomEvent() {
  const pool = EVENTS.reduce((a, e) => [...a, ...Array(e.weight).fill(e)], []);
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── INITIAL STATE ────────────────────────────────────────────
let _partnerId = 1;
export const nextPartnerId = () => _partnerId++;

export function initState() {
  _partnerId = 1;
  return {
    month: 1,
    capital: 500,
    totalLV: 0,
    totalIncome: 0,
    actionsLeft: 3,
    actionsPerMonth: 3,
    partners: [],
    legs: [],
    rankId: 'nova',
    marketMultiplier: 1.0,
    marketMonthsLeft: 0,
    promoActive: false,
    log: [
      '🎮 Willkommen bei AURUM Legacy Wars!',
      '💡 Du startest als ⭐ Nova mit 500 USDT Kapital.',
      '➡️ Füge deinen ersten Partner hinzu und nutze alle Aktionen. Dann: Nächster Monat.',
    ],
    achievements: [],
    notifications: [],
    gameOver: false,
    pendingEvent: null,
    monthlyIncome: 0,
    totalEarned: 0,
  };
}

// ── MONAT VERARBEITEN ────────────────────────────────────────
export function processMonth(state) {
  if (state.gameOver || state.pendingEvent) return state;

  let s = {
    ...state,
    partners: state.partners.map((p) => ({ ...p })),
    log: [...state.log],
    notifications: [],
    achievements: [...state.achievements],
  };

  const rate = BOT_RATE * s.marketMultiplier;

  // 1. Bot-Yields + Energie berechnen
  let monthlyYield = 0;
  let monthlyLVGain = 0;
  const curRank = getRank(s.rankId);

  const updatedPartners = s.partners.map((p) => {
    if (!p.active || p.deposit < 100) return p;
    const pkg = getPkg(p.deposit);
    if (!pkg) return p;

    const gross = p.deposit * rate * (s.promoActive ? 1.5 : 1.0);
    const clientProfit = gross * pkg.client;
    const companyProfit = gross * pkg.company;

    // Spieler-Einnahmen (echte AURUM-Formel)
    const referralIncome = clientProfit * (curRank.ref / 100);
    const psIncome = companyProfit * (curRank.ps / 100);
    monthlyYield += referralIncome + psIncome;

    // Reinvest-Compound
    let newDeposit = p.deposit;
    if (p.reinvest) {
      newDeposit += clientProfit;
      monthlyLVGain += clientProfit * 0.4;
    }

    const pt = PARTNER_TYPES.find((t) => t.id === p.type);
    const newEnergy = Math.max(0, p.energy - (pt?.energyDrain ?? 8));

    return { ...p, deposit: newDeposit, energy: newEnergy };
  });

  // 2. Churn-Check
  const survivedPartners = updatedPartners.filter((p) => {
    if (!p.active) return true;
    const pt = PARTNER_TYPES.find((t) => t.id === p.type);
    const churnRoll = Math.random();
    if (p.energy <= 5 || churnRoll < (pt?.churnRate ?? 0.05)) {
      s.log = [`📉 Monat ${s.month}: ${p.name} ist inaktiv geworden.`, ...s.log.slice(0, 29)];
      s.notifications = [...s.notifications, { type: 'bad', text: `${p.name} churned!` }];
      return false;
    }
    return true;
  });

  // 3. LV + Rang berechnen
  const totalLV = s.totalLV + monthlyLVGain;
  const totalInvest = survivedPartners.reduce((sum, p) => sum + (p.active ? p.deposit : 0), 0);
  const legs = survivedPartners
    .filter((p) => p.type === 'networker' && p.active)
    .map((p) => ({ rank: p.legRank ?? 'nova', lvContrib: p.deposit * 0.4 }));

  const newRank = computeRank(totalLV, totalInvest, legs);

  // Rang-Aufstieg?
  if (RI(newRank.id) > RI(s.rankId)) {
    monthlyYield += newRank.bonus;
    s.log = [
      `🏆 RANG-AUFSTIEG! Du bist jetzt ${newRank.emoji} ${newRank.label}! +${newRank.bonus.toLocaleString()} USDT Bonus!`,
      ...s.log.slice(0, 29),
    ];
    s.notifications = [
      ...s.notifications,
      { type: 'rank', text: `${newRank.emoji} ${newRank.label} erreicht!`, bonus: newRank.bonus },
    ];
    if (!s.achievements.includes(newRank.id)) {
      s.achievements = [...s.achievements, newRank.id];
    }
  }

  // 4. Market-Effekt countdown
  let newMult = s.marketMultiplier;
  let newMktMonths = s.marketMonthsLeft;
  if (newMktMonths > 0) {
    newMktMonths--;
    if (newMktMonths === 0) newMult = 1.0;
  }

  // 5. Monatlicher Log-Eintrag
  s.log = [
    `💰 Monat ${s.month}: +${monthlyYield.toFixed(2)} USDT | LV: ${fmtNum(totalLV)} | ${newRank.emoji} ${newRank.label}`,
    ...s.log.slice(0, 29),
  ];

  // 6. Random Event (22% Chance, ab Monat 2)
  let pendingEvent = null;
  if (s.month >= 2 && Math.random() < 0.22) {
    pendingEvent = pickRandomEvent();
  }

  return {
    ...s,
    month: s.month + 1,
    capital: s.capital + monthlyYield,
    totalLV,
    totalIncome: s.totalIncome + monthlyYield,
    totalEarned: s.totalEarned + monthlyYield,
    monthlyIncome: monthlyYield,
    partners: survivedPartners,
    legs,
    rankId: newRank.id,
    actionsLeft: s.actionsPerMonth,
    marketMultiplier: newMult,
    marketMonthsLeft: newMktMonths,
    promoActive: false,
    pendingEvent,
  };
}

// ── EVENT AUFLÖSEN ───────────────────────────────────────────
export function applyEvent(state, event, choice) {
  let s = { ...state, pendingEvent: null };
  if (!event) return s;

  switch (event.effect) {
    case 'bull_market':
      s.marketMultiplier = 1.25;
      s.marketMonthsLeft = 2;
      s.log = ['📈 Bull Market aktiv! Yields ×1.25 für 2 Monate.', ...s.log.slice(0, 29)];
      break;

    case 'bear_market':
      s.marketMultiplier = 0.80;
      s.marketMonthsLeft = 1;
      s.log = ['📉 Bear Market! Yields ×0.80 für 1 Monat.', ...s.log.slice(0, 29)];
      break;

    case 'bonus_partner':
      if (choice === 'accept') {
        const np = {
          id: nextPartnerId(),
          name: `🤝 Lead-Partner`,
          type: 'high',
          deposit: 3000,
          reinvest: true,
          active: true,
          energy: 80,
          legRank: 'nova',
        };
        s.partners = [...s.partners, np];
        s.totalLV += np.deposit * 0.4;
        s.log = ['🤝 Neuer High Investor (3.000$) beigetreten! +1.200 LV sofort.', ...s.log.slice(0, 29)];
      } else {
        s.log = ['❌ Du hast den spontanen Lead abgelehnt.', ...s.log.slice(0, 29)];
      }
      break;

    case 'promo_referral':
      s.promoActive = true;
      s.capital += s.monthlyIncome * 0.5;
      s.log = ['🎯 AURUM Promo aktiv! +50% Referral-Income für diesen Monat.', ...s.log.slice(0, 29)];
      break;

    case 'energy_crisis':
      if (choice === 'invest' && s.partners.length > 0) {
        const weakest = [...s.partners].filter(p => p.active).sort((a, b) => a.energy - b.energy)[0];
        if (weakest) {
          s.partners = s.partners.map((p) =>
            p.id === weakest.id ? { ...p, energy: Math.min(100, p.energy + 35) } : p
          );
          s.capital = Math.max(0, s.capital - 50);
          s.log = ['💪 In Beziehung investiert (-50 USDT). Energie des schwächsten Partners +35.', ...s.log.slice(0, 29)];
        }
      } else {
        s.log = ['😤 Kein Eingriff — Partner verliert weiter Motivation.', ...s.log.slice(0, 29)];
      }
      break;

    case 'pkg_upgrade':
      if (choice === 'upgrade' && s.partners.length > 0) {
        const eligible = s.partners.filter((p) => p.active && p.deposit < 50000);
        if (eligible.length > 0) {
          const target = eligible.sort((a, b) => b.deposit - a.deposit)[0];
          const newDep = Math.min(target.deposit * 2, 50000);
          const lvDiff = (newDep - target.deposit) * 0.4;
          s.partners = s.partners.map((p) =>
            p.id === target.id ? { ...p, deposit: newDep } : p
          );
          s.totalLV += lvDiff;
          s.log = [
            `⬆️ ${target.name} Paket verdoppelt: ${target.deposit.toLocaleString()} → ${newDep.toLocaleString()} USDT. +${lvDiff.toFixed(0)} LV.`,
            ...s.log.slice(0, 29),
          ];
        }
      } else {
        s.log = ['⏭ Package Upgrade übersprungen.', ...s.log.slice(0, 29)];
      }
      break;

    case 'eco_fee':
      s.capital = Math.max(0, s.capital - 19.99 * Math.max(1, s.partners.length));
      s.log = [`💸 Ecosystem Fees bezahlt: -${(19.99 * Math.max(1, s.partners.length)).toFixed(2)} USDT.`, ...s.log.slice(0, 29)];
      break;

    case 'bonus_leads':
      for (let i = 0; i < 2; i++) {
        const np = {
          id: nextPartnerId(),
          name: `✨ Viral-Lead`,
          type: 'low',
          deposit: 200,
          reinvest: true,
          active: true,
          energy: 90,
          legRank: 'nova',
        };
        s.partners = [...s.partners, np];
        s.totalLV += np.deposit * 0.4;
      }
      s.log = ['✨ 2 neue Low Investors durch viralen Moment! +160 LV sofort.', ...s.log.slice(0, 29)];
      break;

    default:
      break;
  }
  return s;
}

// ── UTILS ────────────────────────────────────────────────────
export const fmtNum = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return Math.round(n).toLocaleString();
};

export const fmtUsdt = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'k';
  return n.toFixed(2);
};
