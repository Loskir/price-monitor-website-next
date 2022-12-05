export const getShopName = (shopType: string): string => {
  if (shopType === "globus") return "Глобус"
  if (shopType === "lenta") return "Лента"
  if (shopType === "auchan") return "Ашан"
  if (shopType === "perekrestok") return "Перекрёсток"
  return "?"
}
