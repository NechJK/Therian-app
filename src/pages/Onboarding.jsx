import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../config/supabase'
import { THERIOTYPES, CONNECTION_INTENTIONS, GENDERS, LIMITS } from '../utils/constants'
import { Upload, X, Check } from 'lucide-react'
import './Onboarding.css'

const Onboarding = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Datos del perfil
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    theriotype: '',
    customTheriotype: '',
    photos: [],
    bio: '',
    intentions: [],
    gender: 'non-binary',
    location: null
  })

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)

    if (formData.photos.length + files.length > LIMITS.MAX_PHOTOS) {
      alert(`Máximo ${LIMITS.MAX_PHOTOS} fotos permitidas`)
      return
    }

    setLoading(true)

    try {
      const uploadedPhotos = []

      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = `profiles/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath)

        uploadedPhotos.push(publicUrl)
      }

      setFormData({
        ...formData,
        photos: [...formData.photos, ...uploadedPhotos]
      })
    } catch (error) {
      alert('Error al subir fotos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const removePhoto = (index) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    })
  }

  const handleIntentionToggle = (intentionId) => {
    const intentions = formData.intentions.includes(intentionId)
      ? formData.intentions.filter(i => i !== intentionId)
      : [...formData.intentions, intentionId]

    setFormData({ ...formData, intentions })
  }

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error)
        }
      )
    }
  }

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.name || !formData.age || !formData.theriotype) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    if (formData.photos.length < LIMITS.MIN_PHOTOS) {
      alert(`Necesitas al menos ${LIMITS.MIN_PHOTOS} foto`)
      return
    }

    if (formData.intentions.length === 0) {
      alert('Selecciona al menos una intención de conexión')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          name: formData.name,
          age: parseInt(formData.age),
          theriotype: formData.theriotype === 'other' ? formData.customTheriotype : formData.theriotype,
          photos: formData.photos,
          bio: formData.bio,
          intentions: formData.intentions,
          gender: formData.gender,
          location: formData.location,
          is_active: true
        })

      if (error) throw error

      navigate('/discover')
    } catch (error) {
      alert('Error al crear perfil: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container fade-in">
        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        {/* Step 1: Nombre y edad */}
        {step === 1 && (
          <div className="onboarding-step">
            <h2>¿Cómo te llamas?</h2>
            <p className="step-description">Tu nombre será visible en tu perfil</p>

            <input
              type="text"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="onboarding-input"
            />

            <input
              type="number"
              placeholder="Tu edad"
              min={LIMITS.MIN_AGE}
              max={LIMITS.MAX_AGE}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="onboarding-input"
            />

            <div className="input-group">
              <label>Género</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="onboarding-select"
              >
                {GENDERS.map(gender => (
                  <option key={gender.id} value={gender.id}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!formData.name || !formData.age}
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Theriotype */}
        {step === 2 && (
          <div className="onboarding-step">
            <h2>¿Cuál es tu theriotype?</h2>
            <p className="step-description">El animal con el que te identificas</p>

            <div className="theriotype-grid">
              {THERIOTYPES.map(type => (
                <div
                  key={type.id}
                  className={`theriotype-card ${formData.theriotype === type.id ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, theriotype: type.id })}
                >
                  <span className="theriotype-emoji">{type.emoji}</span>
                  <span className="theriotype-name">{type.name}</span>
                </div>
              ))}
            </div>

            {formData.theriotype === 'other' && (
              <input
                type="text"
                placeholder="Escribe tu theriotype"
                value={formData.customTheriotype}
                onChange={(e) => setFormData({ ...formData, customTheriotype: e.target.value })}
                className="onboarding-input"
              />
            )}

            <div className="button-group">
              <button className="btn-secondary" onClick={handleBack}>
                Atrás
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={!formData.theriotype || (formData.theriotype === 'other' && !formData.customTheriotype)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Fotos */}
        {step === 3 && (
          <div className="onboarding-step">
            <h2>Agrega tus fotos</h2>
            <p className="step-description">Mínimo 1 foto, máximo {LIMITS.MAX_PHOTOS}</p>

            <div className="photos-grid">
              {formData.photos.map((photo, index) => (
                <div key={index} className="photo-preview">
                  <img src={photo} alt={`Foto ${index + 1}`} />
                  <button
                    className="remove-photo"
                    onClick={() => removePhoto(index)}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}

              {formData.photos.length < LIMITS.MAX_PHOTOS && (
                <label className="photo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={loading}
                    style={{ display: 'none' }}
                  />
                  <Upload size={32} />
                  <span>Subir foto</span>
                </label>
              )}
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={handleBack}>
                Atrás
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={formData.photos.length < LIMITS.MIN_PHOTOS || loading}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Bio e intenciones */}
        {step === 4 && (
          <div className="onboarding-step">
            <h2>Cuéntanos sobre ti</h2>
            <p className="step-description">Máximo {LIMITS.MAX_BIO_LENGTH} caracteres</p>

            <textarea
              placeholder="Escribe algo sobre ti..."
              value={formData.bio}
              onChange={(e) => {
                if (e.target.value.length <= LIMITS.MAX_BIO_LENGTH) {
                  setFormData({ ...formData, bio: e.target.value })
                }
              }}
              className="onboarding-textarea"
              rows="6"
            />
            <p className="char-counter">
              {formData.bio.length}/{LIMITS.MAX_BIO_LENGTH}
            </p>

            <div className="input-group">
              <label>¿Qué buscas en Kindred?</label>
              <div className="intentions-grid">
                {CONNECTION_INTENTIONS.map(intention => (
                  <div
                    key={intention.id}
                    className={`intention-card ${formData.intentions.includes(intention.id) ? 'selected' : ''}`}
                    onClick={() => handleIntentionToggle(intention.id)}
                  >
                    {formData.intentions.includes(intention.id) && (
                      <Check className="check-icon" size={20} />
                    )}
                    {intention.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={handleBack}>
                Atrás
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={formData.intentions.length === 0}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Ubicación */}
        {step === 5 && (
          <div className="onboarding-step">
            <h2>Casi listo</h2>
            <p className="step-description">
              Comparte tu ubicación para encontrar therians cerca de ti
            </p>

            <div className="location-info">
              <p>📍 Tu ubicación exacta nunca se mostrará</p>
              <p>Solo la distancia aproximada será visible</p>
            </div>

            {formData.location ? (
              <div className="location-granted">
                <Check size={48} color="var(--like)" />
                <p>Ubicación activada</p>
              </div>
            ) : (
              <button className="btn-secondary" onClick={requestLocation}>
                Activar ubicación
              </button>
            )}

            <div className="button-group">
              <button className="btn-secondary" onClick={handleBack}>
                Atrás
              </button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creando perfil...' : 'Comenzar'}
              </button>
            </div>

            <p className="skip-text" onClick={handleSubmit}>
              Saltar por ahora
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Onboarding
