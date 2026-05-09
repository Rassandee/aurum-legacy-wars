# 🔱 AURUM Legacy Wars

**Idle Strategy Game mit echten AURUM-Mechaniken**

Baue ein MLM-Netzwerk, steige von Nova bis Alpha auf und verdiene passives Einkommen — mit denselben Formeln wie das echte AURUM Partner Programm.

## 🎮 Gameplay

- **3 Aktionen pro Monat** — Partner hinzufügen, Reinvest-Strategie wählen
- **Idle Progression** — Bots generieren monatliche Yields automatisch
- **8 Random Events** — Bull/Bear Markets, Promo-Weeks, Partner-Churn
- **9 Ränge** (Nova → Magnat im MVP) mit echten LV-Anforderungen
- **Freemium Gate** — Free bis Vanguard PRO

## ⚙️ Echte AURUM-Formeln

```
Bot-Yield:        deposit × 17.5% / Monat
LV Top-Up:        deposit × 40%
Reinvest-LV:      clientProfit × 40% (monatlich compounding)
Referral Income:  clientProfit × referralPct%
ProfitShare:      companyProfit × profitshare%
```

## 🚀 Setup

```bash
npm install
npm run dev       # Entwicklung: http://localhost:5173
npm run build     # Production build → /dist
npm run preview   # Preview des Builds
```

## 📁 Struktur

```
src/
├── engine.js              # Spiellogik — alle AURUM-Formeln
├── App.jsx                # Root — Save/Load via localStorage
├── index.css              # Global styles + Animationen
├── main.jsx               # React entry point
└── components/
    ├── MenuScreen.jsx     # Hauptmenü
    ├── GameScreen.jsx     # Hauptspiel-UI
    ├── EventModal.jsx     # Random Event Dialoge
    └── PartnerCard.jsx    # Partner-Karte mit Energie + Reinvest
```

## 🌐 Deploy auf Vercel

1. Repo auf GitHub pushen
2. Auf [vercel.com](https://vercel.com) → "New Project" → GitHub Repo importieren
3. Framework: **Vite** (wird automatisch erkannt)
4. Deploy klicken — fertig!

Die `vercel.json` ist bereits konfiguriert.

## 🔓 Freemium-Roadmap

| Feature | Free | Pro (4.99$/Mo) |
|---------|------|----------------|
| Ränge Nova → Vanguard PRO | ✅ | ✅ |
| Nexus → Magnat | ❌ | ✅ |
| VIP Investor Partner | ❌ | ✅ |
| Speed-Mode (5 Aktionen/Mo) | ❌ | ✅ |
| Statistik-Detailansicht | ❌ | ✅ |

## 🛠 Tech Stack

- **React 18** + **Vite 5**
- **Pure CSS-in-JS** — keine externen UI-Libraries
- **localStorage** für Save/Load
- **Orbitron Font** (Google Fonts) für den Sci-Fi Look

## 🔗 Links

- Live-Simulator: [legacypath.pro](https://legacypath.pro)
- AURUM Partner Programm: [aurum.io](https://aurum.io)
