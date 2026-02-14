import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../config/supabase'
import { ArrowLeft, X, Upload, Trash2, Save } from 'lucide-react'
import { THERIOTYPES, GENDERS, CONNECTION_INTENTIONS, MIN_AGE, MAX_AGE } from '../utils/constants'
import './EditProfile.css'

const EditProfile = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)

  // Form fields
  const [name, setName] = useState('')
  const [age, setAge] = useState(MIN_AGE)
  const [gender, setGender] = useState('')
  const [theriotype, setTheriotype] = useState('')
  const [bio, setBio] = useState('')
  const [intentions, setIntentions] = useState([])
  const [photos, setPhotos] = useState([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setName(data.name)
      setAge(data.age)
      setGender(data.gender)
      setTheriotype(data.theriotype)
      setBio(data.bio || '')
      setIntentions(data.intentions || [])
      setPhotos(data.photos || [])
      setLoading(false)
    } catch (error) {
      console.error('Error cargando perfil:', error)
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Límite de 6 fotos
    if (photos.length + files.length > 6) {
      alert('Máximo 6 fotos permitidas')
      return
    }

    setUploadingPhotos(true)

    try {
      const uploadedUrls = []

      for (const file of files) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert('Solo se permiten imágenes')
          continue
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Las imágenes deben ser menores a 5MB')
          continue
        }

        // Crear nombre único para el archivo
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `profiles/${fileName}`

        // Subir a Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, file)

        if (uploadError) {
          console.error('Error subiendo foto:', uploadError)
          alert('Error subiendo foto: ' + uploadError.message)
          continue
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      setPhotos([...photos, ...uploadedUrls])
    } catch (error) {
      console.error('Error en upload:', error)
      alert('Error subiendo fotos')
    } finally {
      setUploadingPhotos(false)
    }
  }

  const handleDeletePhoto = async (index) => {
    if (!confirm('¿Eliminar esta foto?')) return

    try {
      const photoUrl = photos[index]

      // Extraer path del URL
      const urlParts = photoUrl.split('/photos/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]

        // Eliminar de storage
        const { error } = await supabase.storage
          .from('photos')
          .remove([`profiles/${filePath}`])

        if (error) {
          console.error('Error eliminando de storage:', error)
        }
      }

      // Eliminar del array
      const newPhotos = photos.filter((_, i) => i !== index)
      setPhotos(newPhotos)
    } catch (error) {
      console.error('Error eliminando foto:', error)
      alert('Error eliminando foto')
    }
  }

  const toggleIntention = (intention) => {
    if (intentions.includes(intention)) {
      setIntentions(intentions.filter(i => i !== intention))
    } else {
      setIntentions([...intentions, intention])
    }
  }

  const handleSave = async () => {
    // Validaciones
    if (!name.trim()) {
      alert('El nombre es requerido')
      return
    }

    if (age < MIN_AGE || age > MAX_AGE) {
      alert(`La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años`)
      return
    }

    if (photos.length === 0) {
      alert('Debes tener al menos una foto')
      return
    }

    if (!gender) {
      alert('Selecciona tu género')
      return
    }

    if (!theriotype) {
      alert('Selecciona tu theriotype')
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          age: parseInt(age),
          gender,
          theriotype,
          bio: bio.trim(),
          intentions,
          photos,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error

      alert('Perfil actualizado exitosamente')
      navigate('/profile')
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      alert('Error guardando cambios: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="edit-profile-page">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-container">
        <div className="edit-header">
          <button className="back-button" onClick={() => navigate('/profile')}>
            <ArrowLeft size={24} />
          </button>
          <h1>Editar Perfil</h1>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : <Save size={24} />}
          </button>
        </div>

        {/* Fotos */}
        <div className="edit-section">
          <h2>Fotos ({photos.length}/6)</h2>
          <div className="photos-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img src={photo} alt={`Foto ${index + 1}`} />
                <button
                  className="delete-photo-btn"
                  onClick={() => handleDeletePhoto(index)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            {photos.length < 6 && (
              <label className="upload-photo-btn">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhotos}
                  style={{ display: 'none' }}
                />
                <Upload size={32} />
                <span>{uploadingPhotos ? 'Subiendo...' : 'Agregar foto'}</span>
              </label>
            )}
          </div>
          <p className="helper-text">Mínimo 1 foto, máximo 6. Tamaño máximo 5MB por foto.</p>
        </div>

        {/* Nombre */}
        <div className="edit-section">
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            maxLength={50}
          />
        </div>

        {/* Edad */}
        <div className="edit-section">
          <label>Edad</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min={MIN_AGE}
            max={MAX_AGE}
          />
        </div>

        {/* Género */}
        <div className="edit-section">
          <label>Género</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Selecciona...</option>
            {GENDERS.map(g => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* Theriotype */}
        <div className="edit-section">
          <label>Theriotype</label>
          <select value={theriotype} onChange={(e) => setTheriotype(e.target.value)}>
            <option value="">Selecciona...</option>
            {THERIOTYPES.map(t => (
              <option key={t.id} value={t.id}>
                {t.emoji} {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div className="edit-section">
          <label>Sobre mí</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cuéntanos sobre ti..."
            maxLength={500}
            rows={4}
          />
          <p className="helper-text">{bio.length}/500 caracteres</p>
        </div>

        {/* Intenciones */}
        <div className="edit-section">
          <label>¿Qué buscas?</label>
          <div className="intentions-grid">
            {CONNECTION_INTENTIONS.map(intention => (
              <button
                key={intention.id}
                className={`intention-btn ${intentions.includes(intention.id) ? 'selected' : ''}`}
                onClick={() => toggleIntention(intention.id)}
              >
                {intention.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botón guardar grande */}
        <button
          className="btn-primary btn-large"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Guardando cambios...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

export default EditProfile
