import './styles/tokens.css'
import './styles/global.css'
import './styles/buttons.css'
import ProfilePage from './profile/ProfilePage.jsx'
import ProfileForm from './profile/ProfileForm.jsx'
import ProfileGate from './profile/ProfileGate.jsx'
import { applySeed } from './profile/profileData.js'
import Header from './components/Header.jsx'
import TodayDoctors from './components/TodayDoctors.jsx'
import Stats from './components/Stats.jsx'
import Hero from './components/Hero.jsx'
import Specialties from './components/Specialties.jsx'
import Conditions from './components/Conditions.jsx'
import Footer from './components/Footer.jsx'
import Faq from './components/Faq.jsx'

function App() {
  const path = window.location.pathname
  if (path === '/profile' || path.startsWith('/profile/edit/') || path === '/book/start') applySeed()
  const isHome = path === '/'
  return (
    <div className="page" id={isHome ? "home" : undefined}>
      <Header />

      {isHome ? <main>
        <Hero />
        <Specialties />
        <Conditions />
        <TodayDoctors />
        <Stats />
        <Faq />
      </main> : path === '/profile' ? <ProfilePage />
        : path.startsWith('/profile/edit/') ? <ProfileForm />
        : path === '/book/start' ? <ProfileGate />
        : <main className="container profile-page"><div className="profile-panel profile-empty"><h1>این صفحه به‌زودی آماده می‌شود</h1><p>در حال حاضر می‌توانید پرونده‌ی خود را بسازید یا ویرایش کنید.</p><a href="/profile" className="ui-button ui-button--primary">رفتن به پرونده‌ی من</a></div></main>}

      <Footer />
    </div>
  )
}

export default App