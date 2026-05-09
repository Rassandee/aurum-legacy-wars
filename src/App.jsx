import { useState, useEffect, useCallback, useRef } from 'react'
import MenuScreen from './components/MenuScreen.jsx'
import GameScreen from './components/GameScreen.jsx'
import { initState } from './engine.js'

const SAVE_KEY = 'aurum_legacy_wars_v1'

export default function App() {
  const [screen, setScreen] = useState('menu')
  const [gs, setGs] = useState(null)

  // Load saved game on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.month && parsed?.rankId) {
          setGs({ ...parsed, notifications: [], pendingEvent: parsed.pendingEvent ?? null })
        }
      }
    } catch (e) {
      console.warn('Could not load save:', e)
    }
  }, [])

  // Auto-save whenever game state changes
  useEffect(() => {
    if (gs && screen === 'game') {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gs))
      } catch (e) {
        console.warn('Could not save:', e)
      }
    }
  }, [gs, screen])

  const handleNewGame = useCallback(() => {
    const fresh = initState()
    setGs(fresh)
    setScreen('game')
  }, [])

  const handleContinue = useCallback(() => {
    setScreen('game')
  }, [])

  const handleMenu = useCallback(() => {
    setScreen('menu')
  }, [])

  const handleReset = useCallback(() => {
    localStorage.removeItem(SAVE_KEY)
    const fresh = initState()
    setGs(fresh)
    setScreen('menu')
  }, [])

  const hasSave = Boolean(gs?.month > 1)

  return (
    <>
      {screen === 'menu' && (
        <MenuScreen
          hasSave={hasSave}
          savedMonth={gs?.month}
          savedRank={gs?.rankId}
          onNewGame={handleNewGame}
          onContinue={handleContinue}
        />
      )}
      {screen === 'game' && gs && (
        <GameScreen
          gs={gs}
          setGs={setGs}
          onMenu={handleMenu}
          onReset={handleReset}
        />
      )}
    </>
  )
}
