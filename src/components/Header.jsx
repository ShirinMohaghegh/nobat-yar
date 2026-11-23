import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'
import {
  HeartPulse, Search, MapPin, ChevronDown, User,
  CalendarDays, FolderOpen, Settings, LogOut
} from 'lucide-react'
import './Header.css'

const menuItems = [
  { label: 'نوبت‌های من', icon: CalendarDays, href: '/appointments' },
  { label: 'پرونده‌ی من', icon: FolderOpen, href: '/profile' },
  { label: 'تنظیمات', icon: Settings, href: null },
]

function SearchField({ id }) {
  return (
    <div className="header-search-field">
      <Search size={20} strokeWidth={1.75} aria-hidden="true" />
      <input
        id={id}
        type="search"
        aria-label="جست‌وجوی پزشک یا تخصص"
        placeholder="نام پزشک یا تخصص"
      />
    </div>
  )
}

export default function Header() {
  const [city, setCity] = useState(() => localStorage.getItem('city') || 'تهران')
  const [searchOpen, setSearchOpen] = useState(false)
  const isHome = window.location.pathname === '/'

  return (
    <div className="header-shell container">
      <header className="site-header glass">
        <a className="header-brand" href="/#home">
          <HeartPulse size={20} strokeWidth={1.75} aria-hidden="true" />
          <span>نوبت‌یار</span>
        </a>

        <nav className="header-nav" aria-label="ناوبری اصلی">
          <a className={isHome ? "active" : undefined} href="/#home" aria-current={isHome ? "page" : undefined}>خانه</a>
          <a href="/#specialties">تخصص‌ها</a>
          <a href="/#faq">سؤالات متداول</a>
        </nav>

        <div className="header-search-desktop">
          <SearchField id="desktop-doctor-search" />
        </div>

        <button
          type="button"
          className="header-mobile-search ui-icon-button"
          aria-label="جست‌وجو"
          aria-expanded={searchOpen}
          aria-controls="mobile-doctor-search-row"
          onClick={() => setSearchOpen((value) => !value)}
        >
          <Search size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <Popover.Root>
          <Popover.Trigger asChild>
            <button type="button" className="header-city" aria-label={`انتخاب شهر، ${city}`}>
              <MapPin size={20} strokeWidth={1.75} aria-hidden="true" />
              <span>{city}</span>
              <ChevronDown size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="header-popup city-popup"
              dir="rtl"
              align="start"
              sideOffset={8}
              collisionPadding={16}
            >
              {['تهران', 'کرج'].map((name) => (
                <Popover.Close asChild key={name}>
                  <button
                    type="button"
                    className="city-option"
                    onClick={() => { setCity(name); localStorage.setItem('city', name) }}
                  >
                    {name}
                  </button>
                </Popover.Close>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <DropdownMenu.Root dir="rtl" modal={false}>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="header-profile ui-icon-button"
              aria-label="منوی کاربر"
            >
              <User size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="header-popup profile-popup"
              align="end"
              sideOffset={8}
              collisionPadding={16}
            >
              <nav className="profile-mobile-links" aria-label="ناوبری موبایل">
                <DropdownMenu.Item asChild>
                  <a href="/#home">خانه</a>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <a href="/#specialties">تخصص‌ها</a>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <a href="/#faq">سؤالات متداول</a>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="profile-separator" />
              </nav>

              {menuItems.map(({ label, icon: Icon, href }) => (
                <DropdownMenu.Item className="profile-item" key={label} asChild={Boolean(href)} onSelect={href ? undefined : (event) => event.preventDefault()}>
                  {href ? <a href={href}><Icon size={20} strokeWidth={1.75} aria-hidden="true" /><span>{label}</span></a> : <><Icon size={20} strokeWidth={1.75} aria-hidden="true" /><span>{label}</span></>}
                </DropdownMenu.Item>
              ))}

              <DropdownMenu.Separator className="profile-separator" />
              <DropdownMenu.Item className="profile-item logout-item" onSelect={() => {
                if (!window.confirm('از حساب کاربری خارج می‌شوید؟\nپرونده، نوبت‌ها و اطلاعات ذخیره‌شده‌ی شما از این مرورگر پاک می‌شود.')) return
                for (const key of ['profile', 'appointments']) localStorage.removeItem(key)
                for (const key of ['profileDraft', 'bookingDraft']) sessionStorage.removeItem(key)
                window.location.assign('/')
              }}>
                <LogOut size={20} strokeWidth={1.75} aria-hidden="true" />
                <span>خروج از حساب کاربری</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </header>

      <div
        id="mobile-doctor-search-row"
        className="header-search-mobile-row"
        hidden={!searchOpen}
      >
        <SearchField id="mobile-doctor-search" />
      </div>
    </div>
  )
}