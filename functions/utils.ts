export const isNotNull = <T>(v: T | null): v is T => v !== null

export const insertNbspIntoName = (name: string) => {
  return name.replace(/(?:(?<=^|\s)(и|с|из)|(\d+)) /gi, "$1\u00A0")
}

export const createArray = (length: number) => Array(length).fill("")
