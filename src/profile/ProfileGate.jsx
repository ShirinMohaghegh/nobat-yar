import { useEffect } from 'react'
import { ArrowRight, FolderHeart, ArrowLeft } from 'lucide-react'
import Button from '../components/Button.jsx'
import { readProfile, isComplete } from './profileData.js'
import './profile.css'

export default function ProfileGate() {
  const doctor = new URLSearchParams(location.search).get('doctor')
  const schedule = `/book/schedule${doctor?`?doctor=${encodeURIComponent(doctor)}`:''}`
  useEffect(()=>{if(isComplete(readProfile())) location.replace(schedule)},[schedule])
  const edit = `/profile/edit/identity?returnTo=${encodeURIComponent(schedule)}`
  return <main className="profile-page container">
    <nav className="profile-breadcrumb"><a href="/">خانه</a><span>/</span><span>تکمیل پرونده</span></nav>
    <div className="profile-topline"><a className="profile-back" href={doctor?`/doctors/${doctor}`:'/profile'}><ArrowRight size={18}/> بازگشت</a></div>
    <section className="profile-panel profile-empty">
      <div className="profile-empty-icon"><FolderHeart size={40} strokeWidth={1.5}/></div>
      <span className="profile-eyebrow">گام اول رزرو نوبت</span>
      <h1>قبل از شروع، پرونده‌ی شما را تکمیل کنیم</h1>
      <p>اطلاعات پرونده فقط یک‌بار پر می‌شود و برای همه‌ی نوبت‌های بعدی استفاده می‌شود. این کار حدود ۲ دقیقه زمان می‌برد.</p>
      <div className="profile-gate-actions"><Button href={edit} variant="primary" size="lg">تکمیل پرونده <ArrowLeft size={18}/></Button><Button href={doctor?`/doctors/${doctor}`:'/profile'} variant="secondary">بازگشت</Button></div>
    </section>
  </main>
}
