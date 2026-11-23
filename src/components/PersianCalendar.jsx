import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, ChevronLeft, CalendarDays } from 'lucide-react'
import { jalaliDateKey, loadHolidaysForYear, localHolidayMap1405 } from './IranHolidays.js'
import './PersianCalendar.css'

const persianDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'long',
})

const weekdayFormatter = new Intl.DateTimeFormat('fa-IR', {
  weekday: 'short',
  timeZone: 'Asia/Tehran',
})

const dayFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  day: 'numeric',
  timeZone: 'Asia/Tehran',
})

const weekdayNames = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

function toLatinDigits(value = '') {
  return value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
}

function getPersianParts(date) {
  const parts = persianDateFormatter.formatToParts(date)
  const read = (type) => parts.find((part) => part.type === type)?.value || '0'
  return {
    year: Number(toLatinDigits(read('year'))),
    month: Number(toLatinDigits(read('month'))),
    day: Number(toLatinDigits(read('day'))),
  }
}

function getMonthDays(anchorDate) {
  const target = getPersianParts(anchorDate)
  const firstOfMonth = new Date(anchorDate)
  firstOfMonth.setHours(12, 0, 0, 0)

  // Find the first Gregorian date belonging to the selected Persian month.
  const cursor = new Date(firstOfMonth)
  cursor.setDate(cursor.getDate() - 40)

  const dates = []
  for (let i = 0; i < 100; i += 1) {
    const date = new Date(cursor)
    date.setDate(cursor.getDate() + i)
    const parts = getPersianParts(date)
    if (parts.year === target.year && parts.month === target.month) {
      dates.push({ date, ...parts })
    }
  }
  return dates
}

function shiftPersianMonth(anchorDate, direction) {
  const days = getMonthDays(anchorDate)
  if (!days.length) return anchorDate

  const boundary = direction > 0
    ? days[days.length - 1].date
    : days[0].date

  const shifted = new Date(boundary)
  shifted.setDate(shifted.getDate() + (direction > 0 ? 1 : -1))
  return shifted
}

function getSaturdayFirstIndex(date) {
  // JS: Sunday=0 ... Saturday=6; Persian calendar starts on Saturday.
  return (date.getDay() + 1) % 7
}

export default function PersianCalendar() {
  const [monthAnchor, setMonthAnchor] = useState(() => {
    const now = new Date()
    now.setHours(12, 0, 0, 0)
    return now
  })

  const today = useMemo(() => {
    const now = new Date()
    now.setHours(12, 0, 0, 0)
    return getPersianParts(now)
  }, [])

  const monthDays = useMemo(() => getMonthDays(monthAnchor), [monthAnchor])
  const displayedYear = monthDays[0]?.year
  const [holidayState, setHolidayState] = useState({ year: 1405, dates: localHolidayMap1405 })

  useEffect(() => {
    if (!displayedYear) return undefined
    if (displayedYear === 1405) {
      setHolidayState({ year: 1405, dates: localHolidayMap1405 })
      return undefined
    }

    const controller = new AbortController()
    setHolidayState({ year: displayedYear, dates: null })
    loadHolidaysForYear(displayedYear, controller.signal)
      .then((dates) => {
        if (!controller.signal.aborted) {
          setHolidayState({ year: displayedYear, dates })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setHolidayState({ year: displayedYear, dates: null })
        }
      })
    return () => controller.abort()
  }, [displayedYear])

  const holidays = holidayState.year === displayedYear ? holidayState.dates : null
  const firstOffset = monthDays.length ? getSaturdayFirstIndex(monthDays[0].date) : 0
  const cells = [...Array(firstOffset).fill(null), ...monthDays]
  while (cells.length < 42) cells.push(null)

  const monthLabel = monthDays.length
    ? monthFormatter.format(monthDays[0].date)
    : monthFormatter.format(monthAnchor)

  return (
    <section className="persian-calendar" aria-label="تقویم شمسی">
      <div className="persian-calendar__header">
        <div className="persian-calendar__heading">
          <span className="persian-calendar__icon">
            <CalendarDays size={20} strokeWidth={1.8} />
          </span>
          <div>
            <h2>{monthLabel}</h2>
          </div>
        </div>

        <div className="persian-calendar__controls" aria-label="تغییر ماه">
          <button
            type="button"
            className="ui-icon-button ui-icon-button--sm"
            onClick={() => setMonthAnchor((current) => shiftPersianMonth(current, -1))}
            aria-label="ماه قبل"
          >
            <ChevronRight size={20} />
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date()
              now.setHours(12, 0, 0, 0)
              setMonthAnchor(now)
            }}
            className="persian-calendar__today-button"
          >
            امروز
          </button>
          <button
            type="button"
            className="ui-icon-button ui-icon-button--sm"
            onClick={() => setMonthAnchor((current) => shiftPersianMonth(current, 1))}
            aria-label="ماه بعد"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div className="persian-calendar__weekdays" aria-hidden="true">
        {weekdayNames.map((day) => (
          <span key={day} className={day === 'جمعه' ? 'is-friday' : ''}>
            {day.slice(0, 1)}
          </span>
        ))}
      </div>

      <div className="persian-calendar__grid">
        {cells.map((item, index) => {
          if (!item) {
            return <span className="persian-calendar__empty" key={`empty-${index}`} />
          }

          const isToday =
            item.year === today.year &&
            item.month === today.month &&
            item.day === today.day
          const isFriday = item.date.getDay() === 5
          const holidayTitle = holidays?.get(jalaliDateKey(item.year, item.month, item.day))
          const isHoliday = Boolean(holidayTitle)

          return (
            <span
              key={`${item.year}-${item.month}-${item.day}`}
              className={[
                'persian-calendar__day',
                isFriday ? 'is-friday' : '',
                isHoliday ? 'is-holiday' : '',
                isToday ? 'is-today' : '',
              ].filter(Boolean).join(' ')}
              aria-label={`${dayFormatter.format(item.date)} ${weekdayFormatter.format(item.date)}${holidayTitle ? `، تعطیل رسمی: ${holidayTitle}` : isFriday ? '، جمعه' : ''}`}
              title={holidayTitle || (isFriday ? 'جمعه' : undefined)}
              aria-current={isToday ? 'date' : undefined}
            >
              {dayFormatter.format(item.date)}
            </span>
          )
        })}
      </div>
    </section>
  )
}
