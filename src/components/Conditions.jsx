import Button from './Button.jsx'
import {
  Activity,
  Bone,
  Brain,
  Droplets,
  Flower2,
  HeartPulse,
  Moon,
  ScanFace,
  Soup,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react'
import './Conditions.css'

const conditions = [
  { name: 'سردرد و میگرن', icon: Brain, tone: 'violet' },
  { name: 'ریزش مو', icon: Waves, tone: 'peach' },
  { name: 'جوش و آکنه', icon: ScanFace, tone: 'pink' },
  { name: 'دیابت', icon: Droplets, tone: 'blue' },
  { name: 'آلرژی', icon: Flower2, tone: 'green' },
  { name: 'کمردرد', icon: Bone, tone: 'sand' },
  { name: 'مشکلات گوارشی', icon: Soup, tone: 'peach' },
  { name: 'تیروئید', icon: Activity, tone: 'blue' },
  { name: 'سرماخوردگی', icon: Thermometer, tone: 'pink' },
  { name: 'اضطراب', icon: HeartPulse, tone: 'violet' },
  { name: 'مشکلات خواب', icon: Moon, tone: 'sand' },
  { name: 'مشکلات تنفسی', icon: Wind, tone: 'green' },
]

export default function Conditions() {
  return (
    <section className="conditions-section" aria-labelledby="conditions-heading" id="conditions">
      <div className="container">
        <div className="conditions-panel">
          <header className="conditions-header">
            <div className="conditions-heading-content">
              <span className="conditions-eyebrow">از مشکل‌تان شروع کنید</span>
              <h2 id="conditions-heading">بیماری‌ها و مشکلات رایج</h2>
              <p>نمی‌دانید به چه پزشکی مراجعه کنید؟ از موضوع موردنظرتان شروع کنید.</p>
            </div>
          </header>

          <div className="conditions-grid">
            {conditions.map(({ name, icon: Icon, tone }) => (
              <div
                className={`conditions-item conditions-item--${tone}`}
                key={name}
              >
                <span className="conditions-icon" aria-hidden="true">
                  <Icon size={29} strokeWidth={1.65} />
                </span>
                <span className="conditions-name">{name}</span>
              </div>
            ))}
          </div>
          <div className="conditions-footer">
            <Button href="#conditions" variant="text" size="sm" className="conditions-more">
              مشاهده موارد بیشتر <span aria-hidden="true">←</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
