import { Stethoscope, Grid2X2, CalendarDays } from 'lucide-react'
import { stats } from '../data/mock.js'
import './Stats.css'

const icons = {
  stethoscope: Stethoscope,
  grid: Grid2X2,
  calendar: CalendarDays,
}

export default function Stats() {
  return (
    <section id="stats" className="stats-section">
      <div className="container">
        <div className="stats-heading">
          <span>آشنایی بیشتر با نوبت‌یار</span>
          <h2>نوبت‌یار در یک نگاه</h2>
          <p>تلاش ما، ساده‌تر کردن مسیر دسترسی شما به خدمات پزشکی</p>
        </div>

        <div className="stats-panel">
          {stats.map((item) => {
            const Icon = icons[item.icon]

            return (
              <div className="stat-item" key={item.icon}>
                <div className="stat-icon">
                  <Icon size={24} strokeWidth={1.7} />
                </div>

                <div className="stat-content">
                  <strong>
                    {item.value.toLocaleString('fa-IR')}
                    {item.suffix}
                  </strong>
                  <span>{item.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}