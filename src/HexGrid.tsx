import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export const STONE_WIDTH = 50
export const STONE_MARGIN = 5

// Computed
export const STONE_HEIGHT = (STONE_WIDTH * 200) / 174
export const STONE_HEIGHT_M = STONE_HEIGHT + STONE_MARGIN
export const STONE_WIDTH_M = STONE_WIDTH + STONE_MARGIN

export interface HexContext {
  effect: (x: number, y: number) => () => void
  tokens: Set<Token>
}

export interface Token {
  x: number
  y: number
}

const initial: HexContext = {
  effect(x: number, y: number) {
    const token = { x, y }
    initial.tokens.add(token)
    return () => {
      initial.tokens.delete(token)
    }
  },
  tokens: new Set(),
}

export const Context = createContext<HexContext>(initial)

export function useToken(x: number, y: number) {
  const { effect } = useContext(Context)
  useEffect(() => effect(x, y), [x, y, effect])
}

export function useGrid() {
  const { tokens } = useContext(Context)
  console.log('t', tokens)
  return {
    center: getCenter(Array.from(tokens.values())),
    width: 100,
    height: 100,
  }
}

/** Tracks the tokens inside it which allows to calculate the center/zoom */
export function HexGrid(props: any) {
  const [s, setS] = useState(0)
  const [tokens, setTokens] = useState(() => new Set<Token>())
  const effect = useCallback(
    (x: number, y: number) => {
      const token = { x, y }
      tokens.add(token)
      setS((s) => s + 1)
      return () => {
        tokens.delete(token)
      }
    },
    [tokens, setS]
  )
  return <Context.Provider {...props} value={{ effect, tokens }} />
}

function getCenter(stones: Token[]) {
  if (!stones.length) {
    stones = [{ x: 0, y: 0 }]
  }
  let topMax = -Infinity
  let leftMax = -Infinity
  let topMin = Infinity
  let leftMin = Infinity
  for (const stone of stones) {
    const { top, left } = toField(stone)
    if (top > topMax) topMax = top
    if (left > leftMax) leftMax = left
    if (top < topMin) topMin = top
    if (left < leftMin) leftMin = left
  }
  // Add stone size
  topMax += STONE_HEIGHT_M
  leftMax += STONE_WIDTH_M
  // Add ghost stones
  topMin -= (STONE_HEIGHT_M * 5) / 6
  leftMin -= STONE_WIDTH_M + STONE_MARGIN
  topMax += (STONE_HEIGHT_M * 5) / 6
  leftMax += STONE_WIDTH_M
  return {
    topMax,
    leftMax,
    topMin,
    leftMin,
    height: topMax - topMin,
    width: leftMax - leftMin,
  }
}

// Token placement

export function toField({ x, y }: { x: number; y: number }) {
  return {
    top: (y * STONE_HEIGHT_M * 2 * 200) / 174 / 3,
    left: (x + parseInt('' + y / 2) + (y % 2) / 2) * STONE_WIDTH_M,
  }
}
