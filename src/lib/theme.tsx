import { createContext, ReactNode, useMemo } from 'react'

export interface TokenSets {
  card: ComponentTokens
  paragraph: ComponentTokens
  body: ComponentTokens
  [key: string]: ComponentTokens
}

export interface ComponentTokens {
  margin?: string
  padding?: string
  color?: string
  backgroundColor?: string
  borderRadius?: number
  [key: string]: string | number | undefined
}

export const neutral = {
  base: { borderRadius: 6, color: 'white', backgroundColor: '#222f42' },
  card: { borderRadius: 6, color: 'white', backgroundColor: '#77777733' },
}

export const selected = inherit(neutral, {
  card: { backgroundColor: '#ffffff44' },
})

export const positive = inherit(neutral, {
  card: { backgroundColor: '#ffffff44' },
})

export const Theme = createContext(neutral)

export function ThemeProvider({
  override,
  children,
}: {
  override: Partial<TokenSets>
  children: ReactNode
}) {
  const merged = useMemo(() => Object.assign({}, neutral, override), [override])
  return <Theme.Provider value={merged}>{children}</Theme.Provider>
}

export function CardTheme({
  selected: s,
  children,
}: {
  selected: boolean
  children: ReactNode
}) {
  return <ThemeProvider override={s ? selected : {}}>{children}</ThemeProvider>
}

function inherit(base: Partial<TokenSets>, override: Partial<TokenSets>) {
  for (const component in base) {
    override[component] = Object.assign(
      {},
      base[component],
      override[component]
    )
  }
  for (const component in override) {
    override[component] = Object.assign(
      {},
      base[component],
      override[component]
    )
  }
  return override
}
