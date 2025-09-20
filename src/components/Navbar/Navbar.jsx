  import { useContext, useMemo, useState } from 'react'
  import { useSelector, useDispatch } from 'react-redux'
  import { useNavigate, Link } from 'react-router-dom'
  import { motion, AnimatePresence } from 'framer-motion'
  import toast from 'react-hot-toast'
  import { isLogoutRedux } from '../../redux/userSlice'
  import './Navbar.scss'
  import AppContext from '../../context/AppContext'
  import { logoutService } from '../../service/apiService'
  import { FaUser, FaSignOutAlt, FaCog, FaBell, FaHome } from 'react-icons/fa'

  function getInitial(name) {
    if (!name) return 'U'
    const t = name.trim()
    return t ? t[0].toUpperCase() : 'U'
  }

  function colorFromString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    const hue = Math.abs(hash) % 360
    return `hsl(${hue} 85% 55%)`
  }

  const Navbar = () => {
    const {isLoading,setIsLoading,resetAllState} =useContext(AppContext)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useSelector((s) => s.user)
    const [open, setOpen] = useState(false)
    const profile = useMemo(() => {
      const fallbackName = localStorage.getItem('userName') || 'User'
      const avatarUrl = user?.avatarUrl || localStorage.getItem('avatarUrl') || ''
      const displayName = user?.name || fallbackName
      const email = user?.email || localStorage.getItem('email') || ''
      return { displayName, email, avatarUrl }
    }, [user])

    const handleLogout =async () => {
      if(isLoading) return;
      setIsLoading(true)
      const res= await logoutService()
      if(res && res.success)
      {
      dispatch(isLogoutRedux())
      localStorage.removeItem('access_token')
      resetAllState()
      }
      setIsLoading(false)
      
      setOpen(false)
      navigate('/auth')
    }

    const avatarStyle = !profile.avatarUrl
      ? { background: colorFromString(profile.displayName), color: 'white' }
      : {}

    return (
      
      <div className="navbar__component">
        <div className="navbar__inner">
          <Link to={isAuthenticated ? '/' : '/auth'} className="brand">
            <img src="/logo.webp" alt="Task" />
            <span>Task Magnagement</span>
          </Link>

          <div className="spacer" />

          <div className="user">
            <button className="avatar" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.displayName} />
              ) : (
                <span className="initial" style={avatarStyle}>
                  {getInitial(profile.displayName)}
                </span>
              )}
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  className="dropdown1"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                >
                  <div className="me">
                    <div className="me__avatar">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt={profile.displayName} />
                      ) : (
                        <span className="initial" style={avatarStyle}>
                          {getInitial(profile.displayName)}
                        </span>
                      )}
                    </div>
                    <div className="me__info d-flex flex-column">
                      <strong>{profile.displayName}</strong>
                      {profile.email && <small>{profile.email}</small>}
                    </div>
                  </div>

                  <div className="menu">
                    <button className="menu-item" onClick={() => { navigate('/'); setOpen(false) }}>
                      <FaHome className="menu-icon" />
                      <span>Trang chủ</span>
                    </button>
                    {/* <button className="menu-item" onClick={() => { navigate('/account'); setOpen(false) }}>
                      <FaUser className="menu-icon" />
                      <span>Thông tin tài khoản</span>
                    </button> */}
                    <button className="menu-item" onClick={() => { navigate('/settings'); setOpen(false) }}>
                      <FaCog className="menu-icon" />
                      <span>Cài đặt</span>
                    </button>
                    {/* <button className="menu-item" onClick={() => { navigate('/notifications'); setOpen(false) }}>
                      <FaBell className="menu-icon" />
                      <span>Thông báo</span>
                    </button> */}
                    <div className="menu-divider"></div>
                    <button className="menu-item danger" onClick={handleLogout}>
                      <FaSignOutAlt className="menu-icon" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    )
  }

  export default Navbar


