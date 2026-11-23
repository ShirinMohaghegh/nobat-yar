import { useState } from 'react'
import { ArrowRight, FilePenLine, FileSpreadsheet, FileText, FolderHeart, ChevronLeft } from 'lucide-react'
import Button from '../components/Button.jsx'
import { readProfile, isComplete, displaySections, dateFa, applySeed } from './profileData.js'
import { downloadProfileXlsx } from './xlsxExport.js'
import './profile.css'

export default function ProfilePage() {
  // Runs before first read so /profile?seed=1 is an intentional preview shortcut.
  const [profile] = useState(() => {applySeed();return readProfile()})
  const sections = profile ? displaySections(profile) : []
  const printProfile = () => {
    const title = document.title
    document.title = 'پرونده بیمار - نوبت‌یار'
    // Restore the browser title only once the print dialog has closed.
    const restoreTitle = () => { document.title = title; window.removeEventListener('afterprint', restoreTitle) }
    window.addEventListener('afterprint', restoreTitle)
    requestAnimationFrame(() => window.print())
  }
  return (
    <main className="profile-page container" id="profile">
      <div className="profile-navigation">
        <nav className="profile-breadcrumb" aria-label="مسیر صفحه"><a href="/">خانه</a><ChevronLeft size={15}/><span>پرونده‌ی من</span></nav>
        <a href="/" className="profile-back"><ArrowRight size={18}/> بازگشت</a>
      </div>
      {!profile ? <section className="profile-empty profile-panel">
        <div className="profile-empty-icon"><FolderHeart size={40} strokeWidth={1.5}/></div>
        <h1>پرونده‌ی من</h1>
        <p>هنوز پرونده‌ای نساخته‌اید.</p>
        <p className="profile-muted">با ساخت یک پرونده، اطلاعات شما برای نوبت‌های بعدی آماده می‌ماند.</p>
        <Button href="/profile/edit/identity" variant="primary" size="lg"><FilePenLine size={18}/> ساخت پرونده</Button>
      </section> : <>
        <div className="profile-print-brand" dir="rtl">نوبت‌یار · پرونده‌ی بیمار</div>
        <div className="profile-titlebar">
          <div>
            <span className="profile-eyebrow">اطلاعات شخصی و پزشکی</span>
            <h1>پرونده‌ی من</h1>
            <div className="profile-meta"><span className={`profile-status ${isComplete(profile)?'is-complete':'is-incomplete'}`}>{isComplete(profile)?'کامل':'ناقص'}</span><span>آخرین به‌روزرسانی: {dateFa(profile.updatedAt?.slice(0,10))}</span></div>
          </div>
          <div className="profile-actions">
            <Button href="/profile/edit/identity" variant="primary"><FilePenLine size={18}/> ویرایش پرونده</Button>
            <Button as="button" type="button" variant="secondary" onClick={printProfile}><FileText size={18}/> خروجی PDF</Button>
            <Button as="button" type="button" variant="secondary" onClick={()=>downloadProfileXlsx(profile)}><FileSpreadsheet size={18}/> خروجی Excel</Button>
          </div>
        </div>
        <div className="profile-summary-grid">
          {sections.map((section, i) => <section className="profile-panel profile-summary-panel" key={section.title}>
            <div className="profile-panel-heading"><span className="profile-panel-index">{['۰۱','۰۲','۰۳','۰۴'][i]}</span><h2>{section.title}</h2></div>
            <table className="profile-table"><tbody>{section.rows.map(row=><tr key={row.key}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table>
          </section>)}
        </div>
        <footer className="profile-print-footer">نوبت‌یار · پرونده‌ی بیمار · تاریخ خروجی: {dateFa(new Date().toISOString().slice(0,10))}</footer>
      </>}
    </main>
  )
}
