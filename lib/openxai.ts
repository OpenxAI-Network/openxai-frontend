export function formatNumber(number: string | number) {
  let n = typeof number === "string" ? parseFloat(number) : number

  return n.toLocaleString("en-us", { maximumFractionDigits: 2 })
}
