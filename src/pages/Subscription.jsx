import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { SUBSCRIPTION_PLANS, PLAN_FEATURES } from '../utils/subscriptionPlans'
import { ArrowLeft, Check, Crown, Star, Zap } from 'lucide-react'
import './Subscription.css'

const Subscription = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { subscription, plan: currentPlan } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState('plus')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      navigate('/discover')
      return
    }

    setLoading(true)

    try {
      // TODO: Integrar con Stripe
      // Por ahora, solo mostramos un alert
      alert(`Próximamente: Suscripción a ${SUBSCRIPTION_PLANS[planId].name}`)

      // Aquí iría la lógica de Stripe:
      // 1. Crear checkout session
      // 2. Redirigir a Stripe
      // 3. Webhook para actualizar subscription en BD

    } catch (error) {
      console.error('Error al suscribirse:', error)
      alert('Error al procesar la suscripción')
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'plus':
        return <Star size={24} />
      case 'gold':
        return <Crown size={24} />
      case 'platinum':
        return <Zap size={24} />
      default:
        return null
    }
  }

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        {/* Header */}
        <div className="subscription-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h1>Mejora tu experiencia</h1>
        </div>

        {/* Current Plan Badge */}
        {subscription && (
          <div className="current-plan-badge">
            <span>Plan actual: </span>
            <strong>{currentPlan.name}</strong>
          </div>
        )}

        {/* Plans Grid */}
        <div className="plans-grid">
          {Object.values(SUBSCRIPTION_PLANS).filter(p => p.id !== 'free').map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.popular ? 'popular' : ''} ${
                currentPlan.id === plan.id ? 'current' : ''
              }`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <Star size={16} fill="currentColor" />
                  <span>Más popular</span>
                </div>
              )}

              <div className="plan-header">
                <div className="plan-icon" style={{ color: plan.badge.color }}>
                  {getPlanIcon(plan.id)}
                </div>
                <h2>{plan.name}</h2>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  <span className="interval">/{plan.interval === 'month' ? 'mes' : 'año'}</span>
                </div>
              </div>

              <div className="plan-features">
                <div className="feature-item">
                  <Check size={20} className="check-icon" />
                  <span>{plan.limits.likes}</span>
                </div>
                <div className="feature-item">
                  <Check size={20} className="check-icon" />
                  <span>{plan.limits.superLikes}</span>
                </div>
                <div className="feature-item">
                  <Check size={20} className="check-icon" />
                  <span>{plan.limits.rewinds}</span>
                </div>
                <div className="feature-item">
                  <Check size={20} className="check-icon" />
                  <span>{plan.limits.features}</span>
                </div>
              </div>

              <button
                className={`plan-button ${currentPlan.id === plan.id ? 'current-plan' : ''}`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || currentPlan.id === plan.id}
              >
                {currentPlan.id === plan.id ? 'Plan Actual' : `Elegir ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison Table */}
        <div className="features-comparison">
          <h2>Comparación de planes</h2>

          {PLAN_FEATURES.map((category) => (
            <div key={category.category} className="feature-category">
              <h3>{category.category}</h3>
              {category.features.map((feature, idx) => (
                <div key={idx} className="feature-row">
                  <div className="feature-name">{feature.name}</div>
                  <div className="feature-plans">
                    <div className="plan-value">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? <Check size={18} color="#4ade80" /> : '—'
                      ) : (
                        feature.free
                      )}
                    </div>
                    <div className="plan-value">
                      {typeof feature.plus === 'boolean' ? (
                        feature.plus ? <Check size={18} color="#4ade80" /> : '—'
                      ) : (
                        feature.plus
                      )}
                    </div>
                    <div className="plan-value">
                      {typeof feature.gold === 'boolean' ? (
                        feature.gold ? <Check size={18} color="#4ade80" /> : '—'
                      ) : (
                        feature.gold
                      )}
                    </div>
                    <div className="plan-value">
                      {typeof feature.platinum === 'boolean' ? (
                        feature.platinum ? <Check size={18} color="#4ade80" /> : '—'
                      ) : (
                        feature.platinum
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Free Plan Option */}
        <div className="free-plan-section">
          <p>¿Prefieres continuar gratis?</p>
          <button
            className="btn-secondary"
            onClick={() => navigate('/discover')}
          >
            Continuar con plan gratuito
          </button>
        </div>

        {/* Footer Info */}
        <div className="subscription-footer">
          <p className="footer-note">
            • Puedes cancelar en cualquier momento<br />
            • Sin compromisos a largo plazo<br />
            • Renovación automática mensual
          </p>
        </div>
      </div>
    </div>
  )
}

export default Subscription
