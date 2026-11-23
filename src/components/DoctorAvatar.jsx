export default function DoctorAvatar({ photo = null, name = '' }) {
  if (photo) {
    return (
      <img
        className="doctor-avatar"
        src={photo}
        alt={name}
      />
    )
  }

  return (
    <svg
      className="doctor-avatar"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <circle cx="50" cy="38" r="16" fill="currentColor" />
      <path
        d="M18 100C18 74 34 64 50 64C66 64 82 74 82 100Z"
        fill="currentColor"
      />
    </svg>
  )
}