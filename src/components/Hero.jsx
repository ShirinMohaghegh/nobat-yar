import Button from './Button.jsx'
import { sampleAppointment } from '../data/mock.js'
import {
  CalendarDays,
  Clock3,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import PersianCalendar from './PersianCalendar.jsx'
import './Hero.css'

export default function Hero() {
  const appointment = sampleAppointment

  return (
    <section className="hero-section">
      <div className="container hero-inner">
        <div className="hero-visual">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <div className="hero-float-card">
            <div className="hero-floating-note">
              <ShieldCheck size={20} />
              <span>رزرو مطمئن و آسان</span>
            </div>

            <div className="hero-medical-symbol">
              <HeartPulse size={34} strokeWidth={1.5} />
            </div>

            <div className="hero-card-top">
              <div>
                <span className="hero-card-eyebrow">نوبت آینده شما</span>
                <h3>یادآوری نوبت</h3>
              </div>
              <span className="hero-status">
                <span />
                تأیید شده
              </span>
            </div>

            <div className="hero-doctor">
              <div className="hero-doctor-icon">
                <Stethoscope size={24} />
              </div>
              <div className="hero-doctor-info">
                <strong>{appointment.doctor}</strong>
                <span>{appointment.specialty}</span>
              </div>
            </div>

            <div className="hero-appointment-details">
              <div className="hero-detail">
                <span>
                  <CalendarDays size={16} />
                  تاریخ نوبت
                </span>
                <strong>{appointment.dateLabel}</strong>
              </div>
              <div className="hero-detail">
                <span>
                  <Clock3 size={16} />
                  ساعت مراجعه
                </span>
                <strong>{appointment.time}</strong>
              </div>
            </div>

            <div className="hero-card-footer">
              <span>کد پیگیری</span>
              <strong>{appointment.code}</strong>
            </div>
          </div>
        </div>

        <div className="hero-copy">
          <h1>
            سلامتتان، <span>بدون معطلی</span>
          </h1>
          <div className="hero-intro-row">
            <p>پزشک مناسب را پیدا کنید و نوبتتان را آنلاین رزرو کنید.</p>
            <div className="hero-actions">
              <Button href="#specialties" variant="ghost" size="sm" className="hero-primary-button">
                پیدا کردن پزشک
                <span aria-hidden="true">←</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="hero-calendar-slot">
          <PersianCalendar />
        </div>

        <div className="hero-benefits">
          <div className="hero-benefit">
            <div className="hero-benefit-icon">
              <Stethoscope size={20} />
            </div>
            <div>
              <strong>پزشکان متخصص</strong>
              <span>انتخاب آگاهانه پزشک</span>
            </div>
          </div>

          <div className="hero-benefit">
            <div className="hero-benefit-icon">
              <Clock3 size={20} />
            </div>
            <div>
              <strong>صرفه‌جویی در زمان</strong>
              <span>دریافت نوبت در چند دقیقه</span>
            </div>
          </div>

          <div className="hero-benefit">
            <div className="hero-benefit-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>رزرو آسان و مطمئن</strong>
              <span>مدیریت ساده نوبت‌ها</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
