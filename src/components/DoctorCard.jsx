import Button from './Button.jsx'
import DoctorAvatar from './DoctorAvatar.jsx'
import Stars from './Stars.jsx'
import './DoctorCard.css'

export default function DoctorCard({ doctor }) {
  return (
    <article className="doctor-card">
      <div className="doctor-card-image">
        {doctor.today && (
          <span className="doctor-today-badge">
            <span className="doctor-today-dot" aria-hidden="true" />
            امروز نوبت دارد
          </span>
        )}

        <DoctorAvatar photo={doctor.photo} name={doctor.name} />
      </div>

      <div className="doctor-card-body">
        <h3 className="doctor-card-name">{doctor.name}</h3>
        <p className="doctor-card-specialty">{doctor.specialty}</p>

        <div className="doctor-card-rating">
          <Stars count={doctor.stars} />
          <span>
            {doctor.rating} از {doctor.reviews} نظر
          </span>
        </div>

        <Button href="#" variant="primary" block className="doctor-card-button">
          دریافت نوبت
        </Button>
      </div>
    </article>
  )
}