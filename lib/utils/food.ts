export const FOOD_CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat",
  "Fish",
  "Grains",
  "Beverages",
  "Condiments",
  "Frozen",
  "Other",
] as const

export const STORAGE_LOCATIONS = ["Fridge", "Freezer", "Pantry", "Counter"] as const

export const UNITS = ["piece", "kg", "g", "lbs", "oz", "liter", "ml", "cup", "tbsp", "tsp"] as const

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getExpiryStatus(expiryDate: string): "fresh" | "expiring_soon" | "expired" {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate)

  if (daysUntilExpiry < 0) return "expired"
  if (daysUntilExpiry <= 3) return "expiring_soon"
  return "fresh"
}

export function getExpiryColor(status: "fresh" | "expiring_soon" | "expired"): string {
  switch (status) {
    case "fresh":
      return "text-green-600 bg-green-50"
    case "expiring_soon":
      return "text-yellow-600 bg-yellow-50"
    case "expired":
      return "text-red-600 bg-red-50"
  }
}
