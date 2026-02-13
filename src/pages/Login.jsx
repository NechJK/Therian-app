import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, Chrome } from 'lucide-react'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/discover')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        <div className="auth-header">
          <h1 className="text-gold">Bienvenido de vuelta</h1>
          <p className="text-secondary">Ingresa a tu manada</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <button
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <Chrome size={20} />
          Continuar con Google
        </button>

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <span className="link" onClick={() => navigate('/register')}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
