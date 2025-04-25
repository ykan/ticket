'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button onClick={toggleTheme} variant="ghost" size="sm">
      {theme === 'dark' ? <Moon /> : <Sun />}
    </Button>
  )
}
