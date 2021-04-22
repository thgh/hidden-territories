import { useContext, createContext, ReactNode, useMemo } from 'react'

export interface TokenSets {
  card: ComponentTokens
  paragraph: ComponentTokens
  body: ComponentTokens
  button: ComponentTokens
  [key: string]: ComponentTokens
}

export interface ComponentTokens {
  margin?: string
  padding?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  [key: string]: string | number | undefined
}

export const neutral = {
  base: { borderRadius: 6, color: 'white', backgroundColor: '#222f42' },
  button: {
    borderRadius: 6,
    color: 'white',
    backgroundColor: '#ffffff08',
    borderColor: '#00000044',
  },
  card: { borderRadius: 6, color: 'white', backgroundColor: '#77777733' },
}

export const selected = inherit(neutral, {
  card: { backgroundColor: '#ffffff44' },
})

export const positive = inherit(neutral, {
  card: { color: '#0f0', backgroundColor: '#006600' },
})

export const disabled = inherit(neutral, {
  card: { color: '#0f0', backgroundColor: '#006600' },
  button: { color: '#ffffff66' },
})

export const action = inherit(neutral, {
  button: {
    color: '#fff',
    backgroundColor: 'rgb(24, 64, 156)',
    borderColor: 'rgb(22, 47, 82)',
  },
})

export const Theme = createContext(neutral)

export function useTheme() {
  return useContext(Theme)
}

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

// Theme override helpers

// export function DynamicTheme({
//   a,
//   children,
// }: {
//   a: Function
//   children: ReactNode
// }) {
//   const parent = useTheme()
//   return <ThemeProvider override={a(parent)}>{children}</ThemeProvider>
// }

// function TestCopoent(params:type) {
//   return <DynamicTheme a={parent => {...parent, color: contrast(parent.backgroundColor)}}>
//     <Card></Card>
//   </DynamicTheme>
// }

export function ButtonTheme({
  action: act,
  disabled: dis,
  children,
}: {
  action?: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <ThemeProvider override={dis ? disabled : act ? action : {}}>
      {children}
    </ThemeProvider>
  )
}

export function CardTheme({
  selected: sel,
  positive: pos,
  children,
}: {
  selected?: boolean
  positive?: boolean
  children: ReactNode
}) {
  return (
    <ThemeProvider override={sel ? selected : pos ? positive : {}}>
      {children}
    </ThemeProvider>
  )
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
