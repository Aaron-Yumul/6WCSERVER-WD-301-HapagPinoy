// Extra information shown when a dish is opened on the Menu page. It is stored with each dish in MongoDB (`details`).
// Shape of `details`:
//
// serves    = [fewest, most] people one order feeds
// portion   = what one order is (pieces, glass size ...)
// amount    = [number, unit] weight in grams ("g") or volume in millilitres ("ml") of one order
// protein / carbs / fat = grams per order (ESTIMATES for a typical kitchen recipe)
// kcal is NOT stored: it is worked out from the macros in getNutrition() so the numbers always agree
// prep      = minutes from order to table
// spice     = 0 not spicy, 1 mild, 2 medium, 3 hot
// allergens = from: Gluten, Egg, Milk, Soy, Peanuts, Fish, Crustaceans, Molluscs
// caffeine  = mg per order (drinks only)
// main      = the main ingredient, shown as a tag
// tip       = a short "good to know" line

export const allergenList = ['Gluten', 'Egg', 'Milk', 'Soy', 'Peanuts', 'Fish', 'Crustaceans', 'Molluscs']

export const spiceLabels = ['Not spicy', 'Mild', 'Medium', 'Hot']

// Calories are derived from the macros (4 kcal per g of protein and carbs, 9 kcal per g of fat),
// rounded to the nearest 5, so the numbers on screen always add up.
export function getNutrition(details) {
  const d = details
  if (!d || !d.serves || !d.amount) return null
  const kcal = Math.round((d.protein * 4 + d.carbs * 4 + d.fat * 9) / 5) * 5
  const [minServes, maxServes] = d.serves
  return {
    ...d,
    kcal,
    kcalEach: [Math.round(kcal / maxServes / 5) * 5, Math.round(kcal / minServes / 5) * 5],
    dailyPercent: Math.round((kcal / 2000) * 100),
  }
}
