import { ChevronDown, MessageCircleQuestion } from 'lucide-react'
import './Faq.css'

const questions = [
  {
    question: 'چطور پزشک مناسب خودم را پیدا کنم؟',
    answer: 'می‌توانید پزشکان را بر اساس تخصص و شهر انتخاب کنید و اطلاعات، امتیاز و نظرات آن‌ها را بررسی کنید.'
  },
  {
    question: 'از کجا بفهمم پزشک چه تخصصی دارد؟',
    answer: 'تخصص هر پزشک در کارت معرفی او نمایش داده می‌شود تا بتوانید راحت‌تر پزشک موردنظر خود را انتخاب کنید.'
  },
  {
    question: 'امتیاز و نظرات بیماران چه کمکی می‌کند؟',
    answer: 'امتیازها و نظرات به شما کمک می‌کنند تجربه دیگران را بررسی کنید و با آگاهی بیشتری تصمیم بگیرید.'
  },
  {
    question: 'بعد از انتخاب پزشک چه کاری باید انجام دهم؟',
    answer: 'با انتخاب پزشک و بررسی زمان‌های مراجعه، می‌توانید مراحل دریافت نوبت را دنبال کنید.'
  },
  {
    question: 'اگر زمان مناسبی برای مراجعه پیدا نکردم چه کنم؟',
    answer: 'می‌توانید پزشک دیگری با تخصص مشابه را بررسی کنید یا در زمان دیگری دوباره زمان‌های مراجعه را ببینید.'
  },
  {
    question: 'آیا امکان تغییر یا لغو نوبت وجود دارد؟',
    answer: 'شرایط تغییر یا لغو نوبت به قوانین و امکانات سامانه رزرو بستگی دارد. پیش از ثبت نهایی، اطلاعات مربوط به نوبت را بررسی کنید.'
  }
]

export default function Faq() {
  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-heading">
          <span>پاسخ پرسش‌های شما</span>
          <h2>سؤالات متداول</h2>
          <p>هر آنچه برای استفاده راحت‌تر از نوبت‌یار نیاز دارید بدانید.</p>
        </div>

        <div className="faq-list">
          {questions.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span className="faq-question-icon">
                  <MessageCircleQuestion size={20} />
                </span>
                <span className="faq-question">{item.question}</span>
                <ChevronDown className="faq-chevron" size={20} />
              </summary>
              <div className="faq-answer">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}