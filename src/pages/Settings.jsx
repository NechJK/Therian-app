import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Globe, Bell, Eye, MapPin, Languages, Moon } from 'lucide-react'
import { supabase } from '../config/supabase'
import { useAuth } from '../hooks/useAuth'
import './Settings.css'

const Settings = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    country: 'EC',
    language: 'es',
    notifications: {
      newMatches: true,
      messages: true,
      likes: true,
      superLikes: true
    },
    privacy: {
      showOnline: true,
      showDistance: true,
      showAge: true
    },
    theme: 'dark'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.log('No previous settings found, using defaults')
    }
  }

  const saveSettings = async (newSettings) => {
    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          settings: newSettings
        })
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handleCountryChange = (country) => {
    const newSettings = { ...settings, country }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleLanguageChange = (language) => {
    const newSettings = { ...settings, language }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleNotificationToggle = (key) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handlePrivacyToggle = (key) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key]
      }
    }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const handleThemeChange = (theme) => {
    const newSettings = { ...settings, theme }
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  const countries = [
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
    { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'ES', name: 'España', flag: '🇪🇸' },
    { code: 'PE', name: 'Perú', flag: '🇵🇪' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' }
  ]

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' }
  ]

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Configuración</h1>
      </div>

      <div className="settings-container">
        {/* Región y Idioma */}
        <div className="settings-section">
          <h2 className="section-title">
            <Globe size={20} />
            Región e Idioma
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <MapPin size={20} color="var(--text-secondary)" />
              <div>
                <h3>País</h3>
                <p>Selecciona tu ubicación</p>
              </div>
            </div>
            <select
              value={settings.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="setting-select"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <Languages size={20} color="var(--text-secondary)" />
              <div>
                <h3>Idioma</h3>
                <p>Idioma de la aplicación</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="setting-select"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="settings-section">
          <h2 className="section-title">
            <Bell size={20} />
            Notificaciones
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Nuevos matches</h3>
                <p>Cuando hagas match con alguien</p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.newMatches}
                onChange={() => handleNotificationToggle('newMatches')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Mensajes</h3>
                <p>Cuando recibas un nuevo mensaje</p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.messages}
                onChange={() => handleNotificationToggle('messages')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Likes</h3>
                <p>Cuando alguien te de like</p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.likes}
                onChange={() => handleNotificationToggle('likes')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Super Likes</h3>
                <p>Cuando recibas un Super Like</p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.superLikes}
                onChange={() => handleNotificationToggle('superLikes')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Privacidad */}
        <div className="settings-section">
          <h2 className="section-title">
            <Eye size={20} />
            Privacidad
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Mostrar estado en línea</h3>
                <p>Otros usuarios verán cuando estés activo</p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.privacy.showOnline}
                onChange={() => handlePrivacyToggle('showOnline')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Mostrar distancia</h3>
                <p>Mostrar tu distancia a otros usuarios</p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.privacy.showDistance}
                onChange={() => handlePrivacyToggle('showDistance')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Mostrar edad</h3>
                <p>Mostrar tu edad en tu perfil</p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.privacy.showAge}
                onChange={() => handlePrivacyToggle('showAge')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Apariencia */}
        <div className="settings-section">
          <h2 className="section-title">
            <Moon size={20} />
            Apariencia
          </h2>

          <div className="setting-item">
            <div className="setting-info">
              <div>
                <h3>Tema</h3>
                <p>Personaliza el aspecto de la app</p>
              </div>
            </div>
            <select
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="setting-select"
            >
              <option value="dark">Oscuro</option>
              <option value="light">Claro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
        </div>

        {/* Cuenta */}
        <div className="settings-section danger-zone">
          <h2 className="section-title">Cuenta</h2>

          <button
            className="danger-btn"
            onClick={() => navigate('/delete-account')}
          >
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
