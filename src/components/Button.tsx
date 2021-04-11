import { ButtonHTMLAttributes } from 'react'
import { useTheme } from '../lib/theme'

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const theme = useTheme()
  return (
    <button className="btn" type="button" style={theme.button} {...props} />
  )
}
