// Profile labels, options and rules are shared by the form, summary and exports.
export const steps = [
  { id: 'identity', title: 'اطلاعات هویتی' },
  { id: 'contact', title: 'اطلاعات تماس' },
  { id: 'insurance', title: 'بیمه' },
  { id: 'medical', title: 'سوابق پزشکی' },
]
export const options = {
  nationality: [['iranian', 'ایرانی'], ['foreign', 'اتباع خارجی']],
  gender: [['female', 'زن'], ['male', 'مرد']],
  maritalStatus: [['single', 'مجرد'], ['married', 'متأهل']],
  emergencyRelation: [['spouse', 'همسر'], ['parent', 'پدر یا مادر'], ['child', 'فرزند'], ['sibling', 'خواهر یا برادر'], ['friend', 'دوست'], ['other', 'سایر']],
  basicInsurance: [['social', 'تأمین اجتماعی'], ['health', 'سلامت ایرانیان'], ['services', 'خدمات درمانی'], ['armed', 'نیروهای مسلح'], ['none', 'بدون بیمه (آزاد)']],
  supplementaryCompany: ['دانا', 'ایران', 'آسیا', 'البرز', 'دی', 'پارسیان', 'پاسارگاد', 'رازی', 'سینا', 'ملت', 'معلم', 'سایر'].map(v => [v, v]),
  bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'].map(v => [v, v === 'unknown' ? 'نمی‌دانم' : v]),
  conditions: [['diabetes', 'دیابت'], ['hypertension', 'فشار خون'], ['heart', 'بیماری قلبی'], ['asthma', 'آسم'], ['thyroid', 'اختلال تیروئید'], ['kidney', 'بیماری کلیوی'], ['liver', 'بیماری کبدی'], ['epilepsy', 'صرع'], ['none', 'هیچ‌کدام']],
  smoking: [['never', 'هرگز'], ['former', 'سابقاً مصرف می‌کردم'], ['current', 'در حال حاضر مصرف می‌کنم']],
}

export const blankProfile = {
  firstName: '', lastName: '', fatherName: '', nationality: 'iranian', nationalId: '', foreignId: '', birthDate: '', gender: '', maritalStatus: '',
  mobile: '', emergencyName: '', emergencyRelation: '', emergencyMobile: '',
  basicInsurance: '', hasSupplementary: false, supplementaryCompany: '', supplementaryOther: '',
  bloodType: '', heightCm: '', weightKg: '', conditions: [], hasDrugAllergy: false, drugAllergyText: '',
  medications: '', surgeries: '', familyHistory: '', smoking: '', updatedAt: '',
}

export const sections = [
  {title: 'اطلاعات هویتی', items: [['firstName', 'نام'], ['lastName', 'نام خانوادگی'], ['fatherName', 'نام پدر'], ['nationality', 'ملیت'], ['nationalId', 'کد ملی'], ['foreignId', 'شماره‌ی گذرنامه یا کد فراگیر'], ['birthDate', 'تاریخ تولد'], ['gender', 'جنسیت'], ['maritalStatus', 'وضعیت تأهل']]},
  {title: 'اطلاعات تماس', items: [['mobile', 'شماره‌ی موبایل'], ['emergencyName', 'نام فرد تماس اضطراری'], ['emergencyRelation', 'نسبت'], ['emergencyMobile', 'شماره‌ی موبایل فرد تماس اضطراری']]},
  {title: 'بیمه', items: [['basicInsurance', 'بیمه‌ی پایه'], ['hasSupplementary', 'بیمه‌ی تکمیلی'], ['supplementaryCompany', 'شرکت بیمه‌ی تکمیلی']]},
  {title: 'سوابق پزشکی', items: [['bloodType', 'گروه خونی'], ['heightCm', 'قد (سانتی‌متر)'], ['weightKg', 'وزن (کیلوگرم)'], ['conditions', 'بیماری‌های زمینه‌ای'], ['hasDrugAllergy', 'حساسیت دارویی'], ['drugAllergyText', 'نام دارو و علائم حساسیت'], ['medications', 'داروهای مصرفی همیشگی'], ['surgeries', 'سوابق جراحی'], ['familyHistory', 'سابقه‌ی بیماری در خانواده'], ['smoking', 'مصرف دخانیات']]},
]

export const normalizeDigits = (value) => String(value ?? '').replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
export const fa = (value) => String(value ?? '').replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])
export const dateFa = (value) => {
  if (!value) return '—'
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('fa-IR-u-ca-persian', {year: 'numeric', month: 'long', day: 'numeric'}).format(date)
}
export const optionLabel = (key, value) => options[key]?.find(([id]) => id === value)?.[1] ?? value
export function displayValue(profile, key) {
  if (key === 'nationalId' && profile.nationality === 'foreign') return null
  if (key === 'foreignId' && profile.nationality !== 'foreign') return null
  if (key === 'supplementaryCompany' && !profile.hasSupplementary) return null
  if (key === 'drugAllergyText' && !profile.hasDrugAllergy) return null
  const value = profile[key]
  if (key === 'birthDate') return dateFa(value)
  if (key === 'hasSupplementary' || key === 'hasDrugAllergy') return value ? 'بله' : 'خیر'
  if (key === 'supplementaryCompany' && value === 'سایر') return profile.supplementaryOther || 'سایر'
  if (key === 'conditions') return Array.isArray(value) && value.length ? value.map(v => optionLabel('conditions', v)).join('، ') : '—'
  if (!value && value !== 0) return '—'
  return fa(optionLabel(key, value))
}
export function displaySections(profile) {
  return sections.map(section => ({...section, rows: section.items.map(([key, label]) => ({key, label, value: displayValue(profile, key)})).filter(row => row.value !== null)}))
}

const required = 'این فیلد الزامی است'
const persianName = /^[آ-یءئؤإأۀة\s\u200c]{2,40}$/u
const phone = /^09[0-9]{9}$/
function checkId(raw) {
  const code = normalizeDigits(raw)
  if (!/^\d{10}$/.test(code) || /^(\d)\1{9}$/.test(code)) return false
  const sum = [...code.slice(0, 9)].reduce((total, n, i) => total + Number(n) * (10-i), 0)
  const r = sum % 11
  return Number(code[9]) === (r < 2 ? r : 11-r)
}
const fieldSteps = {
  identity: ['firstName', 'lastName', 'fatherName', 'nationality', 'nationalId', 'foreignId', 'birthDate', 'gender', 'maritalStatus'],
  contact: ['mobile', 'emergencyName', 'emergencyRelation', 'emergencyMobile'],
  insurance: ['basicInsurance', 'hasSupplementary', 'supplementaryCompany', 'supplementaryOther'],
  medical: ['bloodType', 'heightCm', 'weightKg', 'conditions', 'hasDrugAllergy', 'drugAllergyText', 'smoking'],
}
export function validateField(profile, key) {
  const val = profile[key]
  const text = String(val ?? '').trim()
  if (['firstName','lastName','fatherName'].includes(key)) return !text ? required : !persianName.test(text) ? 'فقط از حروف فارسی استفاده کنید' : ''
  if (key === 'nationalId') return profile.nationality !== 'iranian' ? '' : !text ? required : !checkId(text) ? 'کد ملی معتبر نیست' : ''
  if (key === 'foreignId') return profile.nationality !== 'foreign' ? '' : !text ? required : !/^[A-Za-z0-9]{6,15}$/.test(text) ? 'شماره‌ی گذرنامه یا کد فراگیر معتبر نیست' : ''
  if (key === 'birthDate') {
    if (!text) return required
    const date = new Date(`${text}T12:00:00`)
    if (Number.isNaN(date.getTime())) return required
    if (date > new Date()) return 'تاریخ تولد نمی‌تواند در آینده باشد'
    if (date < new Date(new Date().setFullYear(new Date().getFullYear()-120))) return 'تاریخ تولد معتبر نیست'
    return ''
  }
  if (key === 'mobile' || key === 'emergencyMobile') return !text ? required : !phone.test(normalizeDigits(text)) ? 'شماره‌ی موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود' : ''
  if (key === 'emergencyName') return !text ? required : !persianName.test(text) ? 'فقط از حروف فارسی استفاده کنید' : ''
  if (key === 'supplementaryCompany') return profile.hasSupplementary && !text ? required : ''
  if (key === 'supplementaryOther') return profile.hasSupplementary && profile.supplementaryCompany === 'سایر' && !text ? required : ''
  if (key === 'heightCm') return !text ? required : !(Number(normalizeDigits(text)) >= 50 && Number(normalizeDigits(text)) <= 250) ? 'قد باید بین ۵۰ تا ۲۵۰ سانتی‌متر باشد' : ''
  if (key === 'weightKg') return !text ? required : !(Number(normalizeDigits(text)) >= 2 && Number(normalizeDigits(text)) <= 300) ? 'وزن باید بین ۲ تا ۳۰۰ کیلوگرم باشد' : ''
  if (key === 'conditions') return Array.isArray(val) && val.length ? '' : 'حداقل یک گزینه را انتخاب کنید (یا «هیچ‌کدام»)' 
  if (key === 'drugAllergyText') return profile.hasDrugAllergy && !text ? required : ''
  if (['hasSupplementary', 'hasDrugAllergy'].includes(key)) return ''
  return !text ? required : ''
}
export function validateStep(profile, step) {
  return Object.fromEntries((fieldSteps[step] ?? []).map(k => [k, validateField(profile, k)]).filter(([,message]) => message))
}
export const isComplete = profile => Boolean(profile && steps.every(step => Object.keys(validateStep(profile, step.id)).length === 0))

const parse = (value, fallback) => {try{return value ? JSON.parse(value) : fallback}catch{return fallback}}
export const readProfile = () => parse(localStorage.getItem('profile'), null)
export const readDraft = () => parse(sessionStorage.getItem('profileDraft'), null)
export const saveDraft = value => sessionStorage.setItem('profileDraft', JSON.stringify(value))
export function saveProfile(profile) {
  const result = {...profile, updatedAt: new Date().toISOString()}
  localStorage.setItem('profile', JSON.stringify(result))
  sessionStorage.removeItem('profileDraft')
  return result
}
// Opt-in demo data for portfolio review; never created silently.
export function applySeed() {
  const mode = new URLSearchParams(location.search).get('seed')
  if (!['0','1'].includes(mode)) return
  if (mode === '0') {
    for (const key of ['profile', 'appointments']) localStorage.removeItem(key)
    for (const key of ['profileDraft', 'bookingDraft']) sessionStorage.removeItem(key)
  } else {
    const demo = {...blankProfile, firstName:'نرگس', lastName:'خاتون', fatherName:'محمد', nationality:'iranian', nationalId:'0079058195', birthDate:'1998-05-18', gender:'female', maritalStatus:'single', mobile:'09123456789', emergencyName:'مریم خاتون', emergencyRelation:'parent', emergencyMobile:'09123456789', basicInsurance:'social', hasSupplementary:true, supplementaryCompany:'دانا', bloodType:'A+', heightCm:'164', weightKg:'61', conditions:['none'], smoking:'never', updatedAt:new Date().toISOString()}
    // Set a known-valid demo national code computed with the same rule.
    let code = '001354278'
    const sum = [...code].reduce((total,n,i)=>total+Number(n)*(10-i),0); const r = sum % 11
    code += String(r < 2 ? r : 11-r)
    demo.nationalId = code
    localStorage.setItem('profile', JSON.stringify(demo))
    localStorage.setItem('appointments', JSON.stringify([]))
    sessionStorage.removeItem('profileDraft')
  }
  history.replaceState(null, '', location.pathname + location.hash)
}
