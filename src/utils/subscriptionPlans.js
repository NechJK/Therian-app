// Planes de suscripción disponibles (tipo Tinder)

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Gratis',
    price: 0,
    currency: 'USD',
    interval: 'forever',
    features: {
      dailyLikes: 100,
      dailySuperLikes: 1,
      dailyRewinds: 0,
      seeWhoLikedYou: false,
      unlimitedLikes: false,
      boosts: 0,
      adFree: false,
      prioritySupport: false
    },
    limits: {
      likes: '100 likes diarios',
      superLikes: '1 Super Like diario',
      rewinds: 'Sin Rewind',
      features: 'Funciones básicas'
    },
    badge: null
  },

  plus: {
    id: 'plus',
    name: 'Kindred Plus',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_kindred_plus_monthly', // Reemplazar con tu ID de Stripe
    popular: true,
    features: {
      dailyLikes: 999999,
      dailySuperLikes: 5,
      dailyRewinds: 3,
      seeWhoLikedYou: false,
      unlimitedLikes: true,
      boosts: 1,
      adFree: true,
      prioritySupport: false
    },
    limits: {
      likes: 'Likes ilimitados',
      superLikes: '5 Super Likes diarios',
      rewinds: '3 Rewinds diarios',
      features: 'Sin anuncios + 1 Boost mensual'
    },
    badge: {
      text: 'PLUS',
      color: '#60A5FA'
    }
  },

  gold: {
    id: 'gold',
    name: 'Kindred Gold',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_kindred_gold_monthly', // Reemplazar con tu ID de Stripe
    features: {
      dailyLikes: 999999,
      dailySuperLikes: 10,
      dailyRewinds: 5,
      seeWhoLikedYou: true,
      unlimitedLikes: true,
      boosts: 2,
      adFree: true,
      prioritySupport: true
    },
    limits: {
      likes: 'Likes ilimitados',
      superLikes: '10 Super Likes diarios',
      rewinds: '5 Rewinds diarios',
      features: 'Ver quién te dio like + 2 Boosts mensuales'
    },
    badge: {
      text: 'GOLD',
      color: '#C8A96E'
    }
  },

  platinum: {
    id: 'platinum',
    name: 'Kindred Platinum',
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    stripePriceId: 'price_kindred_platinum_monthly', // Reemplazar con tu ID de Stripe
    features: {
      dailyLikes: 999999,
      dailySuperLikes: 999999,
      dailyRewinds: 999999,
      seeWhoLikedYou: true,
      unlimitedLikes: true,
      boosts: 5,
      adFree: true,
      prioritySupport: true,
      exclusiveFeatures: true
    },
    limits: {
      likes: 'Likes ilimitados',
      superLikes: 'Super Likes ilimitados',
      rewinds: 'Rewinds ilimitados',
      features: 'Todo incluido + 5 Boosts + Prioridad en matches'
    },
    badge: {
      text: 'PLATINUM',
      color: '#E5E7EB'
    }
  }
}

// Características detalladas de cada plan
export const PLAN_FEATURES = [
  {
    category: 'Likes',
    features: [
      {
        name: 'Likes diarios',
        free: '100',
        plus: 'Ilimitados',
        gold: 'Ilimitados',
        platinum: 'Ilimitados'
      },
      {
        name: 'Super Likes diarios',
        free: '1',
        plus: '5',
        gold: '10',
        platinum: 'Ilimitados'
      }
    ]
  },
  {
    category: 'Funciones Premium',
    features: [
      {
        name: 'Rewind (deshacer swipe)',
        free: false,
        plus: '3 diarios',
        gold: '5 diarios',
        platinum: 'Ilimitados'
      },
      {
        name: 'Ver quién te dio like',
        free: false,
        plus: false,
        gold: true,
        platinum: true
      },
      {
        name: 'Boosts mensuales',
        free: false,
        plus: '1',
        gold: '2',
        platinum: '5'
      },
      {
        name: 'Sin anuncios',
        free: false,
        plus: true,
        gold: true,
        platinum: true
      }
    ]
  },
  {
    category: 'Soporte',
    features: [
      {
        name: 'Soporte prioritario',
        free: false,
        plus: false,
        gold: true,
        platinum: true
      },
      {
        name: 'Badge exclusivo',
        free: false,
        plus: 'Plus',
        gold: 'Gold',
        platinum: 'Platinum'
      }
    ]
  }
]

// Función para obtener el plan del usuario
export const getUserPlan = (subscription) => {
  if (!subscription || subscription.status !== 'active') {
    return SUBSCRIPTION_PLANS.free
  }
  return SUBSCRIPTION_PLANS[subscription.plan_type] || SUBSCRIPTION_PLANS.free
}

// Función para verificar si el usuario puede usar una característica
export const canUseFeature = (subscription, feature) => {
  const plan = getUserPlan(subscription)
  return plan.features[feature] || false
}

// Función para obtener límites del usuario
export const getUserLimits = (subscription) => {
  const plan = getUserPlan(subscription)
  return plan.features
}
