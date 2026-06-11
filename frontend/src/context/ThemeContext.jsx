import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      root.style.backgroundColor = '#0f172a'
      root.style.color = '#e2e8f0'
    } else {
      root.classList.remove('dark')
      root.style.backgroundColor = ''
      root.style.color = ''
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleDark = () => setDark((d) => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
