/**
 * Verified Iranian public holidays for Jalali 1405 (Fridays are calculated in the UI).
 * Source: University of Tehran Calendar Center, cross-checked by FarsiUI.
 * https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/calendar/years/1405/holidays.json
 * Data license: CC0-1.0.
 *
 * A dated list is essential: lunar Islamic holidays move between Jalali years.
 * Never reuse one year's lunar holidays for a different year.
 */
const holidays1405 = [
  ['01-01', 'آغاز نوروز؛ عید سعید فطر'],
  ['01-02', 'عید نوروز؛ تعطیل عید فطر'],
  ['01-03', 'عید نوروز'],
  ['01-04', 'عید نوروز'],
  ['01-12', 'روز جمهوری اسلامی ایران'],
  ['01-13', 'روز طبیعت'],
  ['01-25', 'شهادت امام جعفر صادق'],
  ['03-06', 'عید سعید قربان'],
  ['03-14', 'عید سعید غدیر؛ رحلت امام خمینی'],
  ['03-15', 'قیام ۱۵ خرداد'],
  ['04-03', 'تاسوعای حسینی'],
  ['04-04', 'عاشورای حسینی'],
  ['05-13', 'اربعین حسینی'],
  ['05-21', 'رحلت رسول اکرم؛ شهادت امام حسن مجتبی'],
  ['05-22', 'شهادت امام رضا'],
  ['05-30', 'شهادت امام حسن عسکری'],
  ['06-08', 'میلاد رسول اکرم و امام جعفر صادق'],
  ['08-22', 'شهادت حضرت فاطمه زهرا'],
  ['10-02', 'ولادت امام علی و روز پدر'],
  ['10-16', 'مبعث رسول اکرم'],
  ['11-04', 'نیمه شعبان؛ ولادت حضرت قائم'],
  ['11-22', 'پیروزی انقلاب اسلامی'],
  ['12-09', 'شهادت امام علی'],
  ['12-19', 'عید سعید فطر'],
  ['12-20', 'تعطیل عید سعید فطر'],
  ['12-29', 'روز ملی شدن صنعت نفت'],
]

export const localHolidayMap1405 = new Map(
  holidays1405.map(([day, title]) => [`1405-${day}`, title]),
)

export function jalaliDateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// FarsiUI currently publishes 1383 through 1405, not 1406 or later.
// Other published years are loaded on demand; the current year works offline.
export async function loadHolidaysForYear(year, signal) {
  if (year === 1405) return localHolidayMap1405
  if (year < 1383 || year > 1405) return null

  const url = `https://raw.githubusercontent.com/MiladJoodi/FarsiUI/main/calendar/years/${year}/holidays.json`
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Holiday data unavailable: ${response.status}`)
  const data = await response.json()
  if (!Array.isArray(data.items) || data.year !== year) throw new Error('Invalid holiday data')

  const holidays = new Map()
  for (const item of data.items) {
    if (item.isHoliday !== true || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) continue
    const title = item.title?.fa || 'تعطیل رسمی'
    holidays.set(item.date, holidays.has(item.date) ? `${holidays.get(item.date)}؛ ${title}` : title)
  }
  return holidays
}
