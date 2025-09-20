import { useContext, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Auth.scss'
import AppContext from '../../context/AppContext';
import { loginService, registerService } from '../../service/apiService';
import toast from 'react-hot-toast';
import { isLoginSuccessRedux } from '../../redux/userSlice';

const tabs = [
  { key: 'login', label: 'Đăng nhập' },
  { key: 'register', label: 'Đăng ký' },
]

function Auth() {
  const {setIsLoading,isLoading,dispatch,navigate} = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('login')
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => {
    const e = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (activeTab === 'register') {
      if (!formValues.name.trim()) e.name = 'Vui lòng nhập tên'
    }
    if (!formValues.email.trim()) e.email = 'Vui lòng nhập email'
    else if (!emailRegex.test(formValues.email)) e.email = 'Email không hợp lệ'
    if (!formValues.password) e.password = 'Vui lòng nhập mật khẩu'
    else if (formValues.password.length < 6) e.password = 'Ít nhất 6 ký tự'
    return e
  }, [formValues, activeTab])

  const showError = (field) => touched[field] && errors[field]
  const resetForm=()=>{
    setFormValues({
      name: '',
      email: '',
      password: '',
    })
  }
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit =async (e) => {
    e.preventDefault()
    if(isLoading) return
    setTouched({ name: true, email: true, password: true })
    if (Object.keys(errors).length) return

    if (activeTab === 'login') {
      // TODO: Call login API
      setIsLoading(true)
      const res = await loginService({email:formValues.email,password:formValues.password});
      if(res.success){
        setIsLoading(false)
        localStorage.setItem("access_token",res.data)
        dispatch(isLoginSuccessRedux(res.data))
        resetForm()
    
      }else{
        setIsLoading(false)
        toast.error(res.message)
      }
    
      // alert('Đăng nhập thành công (demo)')
    } else {
      setIsLoading(true)
      const res=await registerService(formValues);
      if(res && res.success)
      {
        toast.success(res.message);
        setActiveTab("login");
        resetForm()
      }
      else 
      {
        toast.error(res.message)
      }
      setIsLoading(false);
      // alert('Đăng ký thành công (demo)') 
    }
  }

  return (
    <div className="auth">
      <motion.div className="auth__card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="auth__brand">
          <motion.img
            src="/logo.webp"
            alt="brand"
            initial={{ rotate: -8, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
          />
          <div className="auth__brand-text">
            <h1>Task Manager</h1>
            <p>Quản lý công việc thông minh</p>
          </div>
        </div>

        <div className="auth__tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`auth__tab ${activeTab === t.key ? 'is-active' : ''}`}
              onClick={() => {setActiveTab(t.key);setFormValues({
                name: '',
                email: '',
                password: '',
              })}}
              type="button"
            >
              {t.label}
              {activeTab === t.key && (
                <motion.span layoutId="pill" className="auth__pill" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={activeTab}
            onSubmit={handleSubmit}
            className="auth__form"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            noValidate
          >
            {activeTab === 'register' && (
              <div className={`field ${showError('name') ? 'has-error' : ''}`}>
                <label htmlFor="name">Họ và tên</label>
                <input id="name" name="name" placeholder="Nguyễn Văn A" value={formValues.name} onChange={handleChange} onBlur={handleBlur} />
                {showError('name') && <span className="error-text">{errors.name}</span>}
              </div>
            )}

            <div className={`field ${showError('email') ? 'has-error' : ''}`}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="name@example.com" value={formValues.email} onChange={handleChange} onBlur={handleBlur} />
              {showError('email') && <span className="error-text">{errors.email}</span>}
            </div>

            <div className={`field ${showError('password') ? 'has-error' : ''}`}>
              <label htmlFor="password">Mật khẩu</label>
              <input id="password" name="password" type="password" placeholder="••••••" value={formValues.password} onChange={handleChange} onBlur={handleBlur} />
              {showError('password') && <span className="error-text">{errors.password}</span>}
            </div>

            <button className="submit" type="submit">
              {activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>

            {activeTab === 'login' ? (
              <p className="helper">
                Chưa có tài khoản?{' '}
                <button type="button" className="link" onClick={() => setActiveTab('register')}>Đăng ký</button>
              </p>
            ) : (
              <p className="helper">
                Đã có tài khoản?{' '}
                <button type="button" className="link" onClick={() => setActiveTab('login')}>Đăng nhập</button>
              </p>
            )}
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Auth


