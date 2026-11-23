import Button from './Button.jsx'
import { ArrowLeft } from 'lucide-react'
import { doctors } from '../data/mock.js'
import DoctorCard from './DoctorCard.jsx'
import './TodayDoctors.css'

export default function TodayDoctors() {
  return (
    <section id="doctors" className="today-doctors">
      <div className="container">
        <div className="section-heading">
          <h2>پزشکان دارای نوبت امروز</h2>

          <Button href="#doctors" variant="secondary" className="section-more">
            <span>مشاهده پزشکان بیشتر</span>
            <ArrowLeft
              size={20}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </Button>
        </div>

        <div className="doctors-grid">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  )
}