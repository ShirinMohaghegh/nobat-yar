import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowLeft, Check, ChevronLeft, Save } from 'lucide-react'
import Button from '../components/Button.jsx'
import JalaliDatePicker from './JalaliDatePicker.jsx'
import { steps, options, blankProfile, readProfile, readDraft, saveDraft, saveProfile, normalizeDigits, fa, validateField, validateStep } from './profileData.js'
import './profile.css'

const stepIdFromPath = () => location.pathname.split('/').pop()
const digits = ['nationalId','mobile','emergencyMobile','heightCm','weightKg']
const smallOptions = (key) => options[key] || []

function Field({label, id, value, onChange, onBlur, error, children, hint}) {
  return <div className={`profile-field ${error?'has-error':''}`}>
    <label className="profile-field-label" htmlFor={id}>{label}</label>
    {children ?? <input id={id} name={id} value={value??''} onChange={e=>onChange(e.target.value)} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error?`${id}-error`:undefined} />}
    {hint && <small className="profile-field-hint">{hint}</small>}
    {error && <small className="profile-field-error" id={`${id}-error`} role="alert">{error}</small>}
  </div>
}
function RadioChoices({id, value, choices, onChange}) {
  return <div className="profile-choice-row" role="radiogroup" aria-label={id}>
    {choices.map(([key,text])=><button key={key} type="button" role="radio" aria-checked={value===key} data-selected={value===key} className="profile-choice" onClick={()=>onChange(key)}>{value===key && <Check size={15}/>} {text}</button>)}
  </div>
}
function ProfileSwitch({id,checked,onChange}) {
  return <button type="button" name={id} role="switch" aria-checked={checked} className="profile-switch-row" onClick={()=>onChange(!checked)}><span>{id==='hasSupplementary'?'بیمه‌ی تکمیلی دارم':'حساسیت دارویی دارم'}</span><span className={`profile-switch ${checked?'is-on':''}`}><span/></span></button>
}
export default function ProfileForm() {
  const [step,setStep] = useState(()=>steps.some(s=>s.id===stepIdFromPath())?stepIdFromPath():'identity')
  const [data,setData] = useState(()=>({...blankProfile,...readProfile(),...readDraft()}))
  const [errors,setErrors] = useState({})
  const [visited,setVisited] = useState(()=>steps.findIndex(s=>s.id===stepIdFromPath()))
  const dirty = useRef(false)
  const initial = useRef(JSON.stringify(data))
  const returnTo = new URLSearchParams(location.search).get('returnTo')
  const current = steps.findIndex(s=>s.id===step)

  useEffect(()=>{
    const pop=()=>{const next=stepIdFromPath();if(steps.some(s=>s.id===next))setStep(next)}
    window.addEventListener('popstate',pop)
    const guard=e=>{if(dirty.current){e.preventDefault();e.returnValue=''}}
    window.addEventListener('beforeunload',guard)
    return ()=>{window.removeEventListener('popstate',pop);window.removeEventListener('beforeunload',guard)}
  },[])
  const change=(key,value)=>{
    const cleaned=digits.includes(key)?normalizeDigits(value):value
    setData(old=>{const updated={...old,[key]:cleaned};saveDraft(updated);dirty.current=JSON.stringify(updated)!==initial.current;return updated})
    setErrors(old=>({...old,[key]:''}))
  }
  // Fill only the current step with sample data. Navigation and saving remain manual.
  const fillCurrentStep = () => {
    const samples = {
      identity: {
        firstName: 'سارا', lastName: 'محمدی', fatherName: 'علی',
        nationality: 'iranian', nationalId: '0013542788', foreignId: '',
        birthDate: '1998-05-18', gender: 'female', maritalStatus: 'single',
      },
      contact: {
        mobile: '09123456789', emergencyName: 'مریم رضایی',
        emergencyRelation: 'parent', emergencyMobile: '09123456788',
      },
      insurance: {
        basicInsurance: 'social', hasSupplementary: true,
        supplementaryCompany: 'دانا', supplementaryOther: '',
      },
      medical: {
        bloodType: 'A+', heightCm: '164', weightKg: '61',
        conditions: ['none'], hasDrugAllergy: false, drugAllergyText: '',
        medications: 'داروی همیشگی مصرف نمی‌کنم',
        surgeries: 'سابقه جراحی ندارم',
        familyHistory: 'موردی گزارش نشده است', smoking: 'never',
      },
    }
    setData(previous => {
      const updated = {...previous, ...samples[step]}
      saveDraft(updated)
      dirty.current = JSON.stringify(updated) !== initial.current
      return updated
    })
    setErrors({})
  }
  const touch = key => setErrors(old=>({...old,[key]:validateField(data,key)}))
  const goto = (next) => {
    const stepName=steps[next]?.id
    if(!stepName)return
    const suffix=returnTo?`?returnTo=${encodeURIComponent(returnTo)}`:''
    history.pushState(null,'',`/profile/edit/${stepName}${suffix}`)
    setStep(stepName);setErrors({});setVisited(v=>Math.max(v,next));window.scrollTo({top:0,behavior:'smooth'})
  }
  const focusFirst=messages=>{
    const name=Object.keys(messages)[0]
    const target=document.querySelector(`[name="${name}"], #${name}, [aria-label="${name}"]`)
    target?.focus?.();target?.scrollIntoView?.({behavior:'smooth',block:'center'})
  }
  const next=()=>{
    const result=validateStep(data,step)
    if(Object.keys(result).length){setErrors(result);focusFirst(result);return}
    if(current<3){goto(current+1);return}
    for(const item of steps){const invalid=validateStep(data,item.id);if(Object.keys(invalid).length){goto(steps.indexOf(item));setErrors(invalid);return}}
    saveProfile(data);dirty.current=false
    const dest=returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/profile'
    window.location.assign(dest)
  }
  const input=(key,label,extra={})=><Field key={key} id={key} label={label} value={data[key]} onChange={v=>change(key,v)} onBlur={()=>touch(key)} error={errors[key]}><input id={key} name={key} type="text" inputMode={digits.includes(key)?'numeric':undefined} dir={digits.includes(key)?'ltr':'rtl'} value={digits.includes(key)?fa(data[key]):data[key]??''} onChange={e=>change(key,e.target.value)} onBlur={()=>touch(key)} aria-invalid={Boolean(errors[key])} maxLength={extra.maxLength} placeholder={extra.placeholder}/></Field>
  const radio=(key,label)=><Field key={key} id={key} label={label} error={errors[key]}><RadioChoices id={key} value={data[key]} choices={smallOptions(key)} onChange={v=>change(key,v)}/></Field>
  const select=(key,label)=><Field key={key} id={key} label={label} error={errors[key]}><span className="profile-select-wrap"><select id={key} name={key} value={data[key]||''} onChange={e=>change(key,e.target.value)} onBlur={()=>touch(key)} aria-invalid={Boolean(errors[key])}><option value="">انتخاب کنید</option>{smallOptions(key).map(([id,caption])=><option key={id} value={id}>{caption}</option>)}</select><ChevronLeft size={19} className="profile-select-chevron" aria-hidden="true" /></span></Field>
  const area=(key,label,placeholder)=><Field key={key} id={key} label={label} error={errors[key]}><textarea id={key} name={key} rows="3" placeholder={placeholder||'در صورت نیاز توضیح دهید'} value={data[key]||''} onChange={e=>change(key,e.target.value)} onBlur={()=>touch(key)}/></Field>
  const toggleCondition = id => {
    const previous=data.conditions||[]
    change('conditions', id==='none'?['none']:previous.includes(id)?previous.filter(k=>k!==id):[...previous.filter(k=>k!=='none'),id])
  }
  return <main className="profile-page profile-page--edit container">
    <div className="profile-navigation">
      <nav className="profile-breadcrumb" aria-label="مسیر صفحه">
        <a href="/">خانه</a><ChevronLeft size={15}/>
        <a href="/profile">پرونده‌ی من</a><ChevronLeft size={15}/>
        <span>ویرایش پرونده</span>
      </nav>
      <a href="/profile" className="profile-back"><ArrowRight size={18}/> بازگشت</a>
    </div>
    <div className="profile-form-header">
      <h1>{readProfile()?'ویرایش پرونده':'ساخت پرونده‌ی من'}</h1>
    </div>
    <div className="profile-form-layout">
      <nav className="profile-stepper" aria-label="مراحل پرونده">
        {steps.map((s,i)=>i>visited ? <span className="profile-step is-upcoming" key={s.id}><span className="profile-step-number">{fa(i+1)}</span><span>{s.title}</span></span> : <button type="button" key={s.id} className={`profile-step ${i===current?'is-current':''} ${i<current?'is-done':''}`} aria-current={i===current?'step':undefined} onClick={()=>goto(i)}><span className="profile-step-number">{i<current?<Check size={18}/>:fa(i+1)}</span><span>{s.title}</span></button>)}
      </nav>
      <section className="profile-panel profile-form-card">
        <div className="profile-form-card-title"><span className="profile-panel-index">{fa(current+1).padStart(2,'۰')}</span><div><h2>{steps[current].title}</h2><p>موارد ضروری را تکمیل کنید تا به مرحله بعد بروید.</p></div><Button as="button" type="button" variant="ghost" size="sm" className="profile-demo-fill" onClick={fillCurrentStep}>پر کردن اطلاعات تستی</Button></div>
        <form noValidate onSubmit={e=>{e.preventDefault();next()}}>
          <div className="profile-fields-grid">
            {step==='identity' && <>
              {input('firstName','نام')}{input('lastName','نام خانوادگی')}{input('fatherName','نام پدر')}
              {radio('nationality','ملیت')}
              {data.nationality==='iranian'?input('nationalId','کد ملی',{maxLength:10,placeholder:'کد ملی ۱۰ رقمی'}):input('foreignId','شماره‌ی گذرنامه یا کد فراگیر',{maxLength:15})}
              <Field id="birthDate" label="تاریخ تولد" error={errors.birthDate}><JalaliDatePicker value={data.birthDate} onChange={v=>change('birthDate',v)} invalid={Boolean(errors.birthDate)} /></Field>
              {radio('gender','جنسیت')}{radio('maritalStatus','وضعیت تأهل')}
            </>}
            {step==='contact' && <>
              {input('mobile','شماره‌ی موبایل',{maxLength:11,placeholder:'۰۹۱۲۳۴۵۶۷۸۹'})}
              {input('emergencyName','نام فرد تماس اضطراری')}
              {select('emergencyRelation','نسبت')}
              {input('emergencyMobile','شماره‌ی موبایل فرد تماس اضطراری',{maxLength:11,placeholder:'۰۹۱۲۳۴۵۶۷۸۹'})}
            </>}
            {step==='insurance' && <>
              {select('basicInsurance','بیمه‌ی پایه')}
              <div className="profile-field profile-full"><ProfileSwitch id="hasSupplementary" checked={data.hasSupplementary} onChange={v=>change('hasSupplementary',v)}/></div>
              {data.hasSupplementary && select('supplementaryCompany','شرکت بیمه‌ی تکمیلی')}
              {data.hasSupplementary && data.supplementaryCompany==='سایر' && input('supplementaryOther','نام شرکت را بنویسید')}
            </>}
            {step==='medical' && <>
              <Field id="bloodType" label="گروه خونی" error={errors.bloodType}><div className="profile-toggle-grid" role="radiogroup" aria-label="گروه خونی">{options.bloodType.map(([id,label])=><button type="button" key={id} name="bloodType" role="radio" aria-checked={data.bloodType===id} data-selected={data.bloodType===id} className="profile-choice" onClick={()=>change('bloodType',id)}>{label}</button>)}</div></Field>
              {input('heightCm','قد (سانتی‌متر)')}{input('weightKg','وزن (کیلوگرم)')}
              <div className="profile-field profile-full"><span className="profile-field-label">بیماری‌های زمینه‌ای</span><div className="profile-toggle-grid" role="group" aria-label="بیماری‌های زمینه‌ای">{options.conditions.map(([id,label])=><button type="button" key={id} name="conditions" aria-pressed={(data.conditions||[]).includes(id)} data-selected={(data.conditions||[]).includes(id)} className="profile-choice" onClick={()=>toggleCondition(id)}>{label}</button>)}</div>{errors.conditions&&<small className="profile-field-error" role="alert">{errors.conditions}</small>}</div>
              <div className="profile-field profile-full"><ProfileSwitch id="hasDrugAllergy" checked={data.hasDrugAllergy} onChange={v=>change('hasDrugAllergy',v)}/></div>
              {data.hasDrugAllergy && area('drugAllergyText','نام دارو و علائم حساسیت')}
              {area('medications','داروهای مصرفی همیشگی')}{area('surgeries','سوابق جراحی')}{area('familyHistory','سابقه‌ی بیماری در خانواده')}
              {radio('smoking','مصرف دخانیات')}
            </>}
          </div>
          <div className="profile-form-actions">
            <Button as="button" type="button" variant="secondary" size="lg" onClick={()=>current>0?goto(current-1):window.location.assign('/profile')}><ArrowRight size={18}/> بازگشت</Button>
            <Button as="button" type="submit" variant="primary" size="lg">{current===3?<><Save size={19}/> ذخیره‌ی پرونده</>:<>مرحله‌ی بعد <ArrowLeft size={18}/></>}</Button>
          </div>
        </form>
      </section>
    </div>
  </main>
}
