export const isNotNull = <T>(v: T | null): v is T => v !== null

export const insertNbspIntoName = (title: string) => {
  return title.replace(/(\d+) ([а-я]+)$/g, "$1\u00A0$2")
}
