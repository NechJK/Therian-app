import { useNavigate, useLocation } from 'react-router-dom'
import { Compass, MessageCircle, User } from 'lucide-react'
import './BottomNav.css'

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${isActive('/discover') ? 'active' : ''}`}
        onClick={() => navigate('/discover')}
      >
        <Compass size={24} />
        <span>Descubrir</span>
      </button>

      <button
        className={`nav-item ${isActive('/matches') ? 'active' : ''}`}
        onClick={() => navigate('/matches')}
      >
        <MessageCircle size={24} />
        <span>Matches</span>
      </button>

      <button
        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <User size={24} />
        <span>Perfil</span>
      </button>
    </nav>
  )
}

export default BottomNav
