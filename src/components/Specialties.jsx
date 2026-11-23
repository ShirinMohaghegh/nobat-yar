import Button from './Button.jsx'
import {
  Stethoscope,
  Heart,
  Eye,
  Bone,
  Brain,
  Baby,
} from 'lucide-react'
import './Specialties.css'

const specialties = [
  { id: 1, name: 'پزشکی عمومی', icon: Stethoscope, className: 'general', count: 'مراقبت‌های عمومی' },
  { id: 2, name: 'قلب و عروق', icon: Heart, className: 'heart', count: 'سلامت قلب' },
  { id: 3, name: 'چشم‌پزشکی', icon: Eye, className: 'eye', count: 'مراقبت از چشم' },
  { id: 4, name: 'ارتوپدی', icon: Bone, className: 'bone', count: 'استخوان و مفاصل' },
  { id: 5, name: 'مغز و اعصاب', icon: Brain, className: 'brain', count: 'سلامت سیستم عصبی' },
  { id: 6, name: 'کودکان', icon: Baby, className: 'baby', count: 'سلامت کودکان' },
]

export default function Specialties() {
  return (
    <section className="specialties-section" id="specialties">
      <div className="container">
        <div className="specialties-header">
          <div>
            <span className="specialties-eyebrow">انتخاب تخصص</span>
            <h2 className="specialties-heading">تخصص‌های پزشکی</h2>
            <p className="specialties-description">
              از میان تخصص‌های مختلف، پزشک موردنظرتان را پیدا کنید.
            </p>
          </div>
          <Button href="#specialties" variant="secondary" className="specialties-more">مشاهده همه تخصص‌ها <span aria-hidden="true">←</span></Button>
        </div>

        <div className="specialties-grid" id="specialties-grid">
          {specialties.map(({ id, name, icon: Icon, className, count }) => (
            <article
              key={id}
              className={`specialty-tile specialty-${className}`}
            >
              <div className="specialty-icon">
                <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
              </div>

              <div className="specialty-content">
                <h3>{name}</h3>
                <span>{count}</span>
              </div>

              <span className="specialty-arrow" aria-hidden="true">←</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}