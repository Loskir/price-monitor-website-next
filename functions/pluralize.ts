export function pluralize(n: number, a: string, b: string, c: string): string {
  if (n % 10 === 1 && n % 100 !== 11) {
    return a
  }
  return n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c
}
