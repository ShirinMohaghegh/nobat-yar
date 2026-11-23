import Button from './Button.jsx'
import { HeartPulse, ArrowLeft, ShieldCheck, Clock3 } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">

          <div className="footer-brand">
            <a href="/#home" className="footer-logo">
              <HeartPulse size={29} strokeWidth={1.8} />
              <span>نوبت‌یار</span>
            </a>

            <p>
              راهی ساده‌تر برای پیدا کردن پزشک موردنظرتان
              و دریافت نوبت آنلاین؛ سریع، آسان و مطمئن.
            </p>

            <div className="footer-trust">
              <ShieldCheck size={20} />
              <span>همراه شما در مسیر سلامتی</span>
            </div>
          </div>

          <div className="footer-column">
            <h3>دسترسی سریع</h3>
            <a href="/#home">صفحه اصلی</a>
            <a href="/#specialties">تخصص‌های پزشکی</a>
            <a href="/#stats">آمار نوبت‌یار</a>
          </div>

          <div className="footer-column">
            <h3>خدمات نوبت‌یار</h3>
            <a href="/#specialties">پیدا کردن پزشک</a>
            <a href="/#specialties">انتخاب تخصص</a>
            <a href="/#doctors">پزشکان دارای نوبت امروز</a>
            <span>رزرو آسان و سریع</span>
          </div>

          <div className="footer-column footer-help">
            <h3>همراه شما هستیم</h3>
            <p>
              برای شروع، تخصص موردنظرتان را انتخاب کنید
              و پزشک مناسب خود را پیدا کنید.
            </p>

            <Button href="/#specialties" variant="ghost" inverse className="footer-cta">
              پیدا کردن پزشک
              <ArrowLeft size={16} />
            </Button>

            <div className="footer-mini-feature">
              <Clock3 size={16} />
              <span>صرفه‌جویی در زمان</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© تمامی حقوق این وب‌سایت محفوظ است.</span>
          <span className="footer-bottom-brand">نوبت‌یار 💚</span>
        </div>
      </div>
    </footer>
  )
}