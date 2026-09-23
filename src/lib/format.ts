export const fmtT = (n: number) => `${Math.round(n).toLocaleString('en-US')} t`
export const fmtNum = (n: number) => Math.round(n).toLocaleString('en-US')
export const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n)}`)
export const fmtPct = (n: number, digits = 0) => `${n.toFixed(digits)}%`
export const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
