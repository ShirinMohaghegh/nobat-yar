import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { dateFa, fa, normalizeDigits } from './profileData.js'

const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {year:'numeric', month:'numeric', day:'numeric'})
const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']
const weekdays = ['ش','ی','د','س','چ','پ','ج']
function jalaliParts(date) {
  const parts = fmt.formatToParts(date)
  const val = part => Number(normalizeDigits(parts.find(x => x.type === part)?.value || '0'))
  return {year:val('year'), month:val('month'), day:val('day')}
}
function toGregorian(year, month, day) {
  // The beginning of a Jalali year is near March 20 of Gregorian year + 621.
  const start = new Date(year+621, 2, 20, 12)
  const estimate = (month-1)*30 + day - 1
  for (let d = estimate-22; d <= estimate+22; d++) {
    const item = new Date(start)
    item.setDate(start.getDate()+d)
    const p = jalaliParts(item)
    if (p.year === year && p.month === month && p.day === day) return item
  }
  return null
}
const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
export default function JalaliDatePicker({value, onChange, invalid, name='birthDate'}) {
  const current = value ? jalaliParts(new Date(`${value}T12:00:00`)) : jalaliParts(new Date())
  const [open, setOpen] = useState(false)
  const [ym, setYm] = useState({year:current.year, month:current.month})
  const today = jalaliParts(new Date())
  const days = useMemo(() => {
    const first = toGregorian(ym.year, ym.month, 1)
    if (!first) return []
    const list = []
    for (let d = 1; d <= 31; d++) {
      const date = toGregorian(ym.year, ym.month, d)
      if (!date) break
      list.push({day:d, date, iso:iso(date)})
    }
    return [...Array((first.getDay()+1)%7).fill(null), ...list]
  }, [ym])
  const shift = delta => setYm(old => {
    const num = old.year*12+(old.month-1)+delta
    return {year:Math.floor(num/12), month:((num%12)+12)%12+1}
  })
  return (
    <div className="profile-date-field">
      <button type="button" name={name} className={`profile-date-trigger ${invalid?'is-invalid':''}`} onClick={()=>setOpen(o=>!o)} aria-expanded={open} aria-label="انتخاب تاریخ تولد">
        <CalendarDays size={19} aria-hidden="true" />
        <span>{value ? dateFa(value) : 'انتخاب تاریخ'}</span>
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      {open && <div className="profile-date-popover" role="group" aria-label="انتخاب تاریخ شمسی">
        <div className="profile-date-head">
          <button type="button" className="ui-icon-button ui-icon-button--sm" onClick={()=>shift(-1)} aria-label="ماه قبل"><ChevronRight size={18}/></button>
          <select aria-label="ماه" value={ym.month} onChange={e=>setYm(old=>({...old, month:Number(e.target.value)}))}>{months.map((month,i)=><option key={month} value={i+1}>{month}</option>)}</select>
          <select aria-label="سال" value={ym.year} onChange={e=>setYm(old=>({...old,year:Number(e.target.value)}))}>{Array.from({length:121}, (_,i)=>today.year-i).map(year=><option key={year} value={year}>{fa(year)}</option>)}</select>
          <button type="button" className="ui-icon-button ui-icon-button--sm" onClick={()=>shift(1)} disabled={ym.year>=today.year && ym.month>=today.month} aria-label="ماه بعد"><ChevronLeft size={18}/></button>
        </div>
        <div className="profile-date-grid profile-date-weekdays">{weekdays.map((v,i)=><span key={i}>{v}</span>)}</div>
        <div className="profile-date-grid">{days.map((item,i)=>item ? <button key={item.iso} type="button" disabled={item.date > new Date() || item.date < new Date(new Date().setFullYear(new Date().getFullYear()-120))} className={value===item.iso?'is-selected':''} onClick={()=>{onChange(item.iso);setOpen(false)}} aria-label={`${fa(item.day)} ${months[ym.month-1]}`}>{fa(item.day)}</button>:<span key={`e-${i}`} />)}</div>
        <div className="profile-date-bottom"><button type="button" className="ui-button ui-button--text ui-button--sm" onClick={()=>setOpen(false)}>بستن</button></div>
      </div>}
    </div>
  )
}
