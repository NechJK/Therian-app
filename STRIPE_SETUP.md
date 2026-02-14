# 🔐 Configuración de Stripe para Pagos

Este documento explica cómo configurar Stripe para aceptar pagos de suscripciones en Kindred.

## 📋 Requisitos Previos

1. Cuenta de Stripe (crea una en https://stripe.com)
2. Acceso a Stripe Dashboard
3. Netlify o servidor para webhooks

---

## 🚀 Paso 1: Crear Productos en Stripe

1. Ve a **Stripe Dashboard** → **Products**
2. Crea 3 productos (uno por cada plan):

### **Kindred Plus**
- Name: `Kindred Plus`
- Price: `$9.99/month`
- Recurring: Monthly
- Copia el **Price ID** (ej: `price_1Abc...`)

### **Kindred Gold**
- Name: `Kindred Gold`
- Price: `$19.99/month`
- Recurring: Monthly
- Copia el **Price ID**

### **Kindred Platinum**
- Name: `Kindred Platinum`
- Price: `$29.99/month`
- Recurring: Monthly
- Copia el **Price ID**

---

## 🔑 Paso 2: Obtener API Keys

1. Ve a **Developers** → **API keys**
2. Copia tu **Publishable key** (empieza con `pk_test_` o `pk_live_`)
3. Copia tu **Secret key** (empieza con `sk_test_` o `sk_live_`)

---

## ⚙️ Paso 3: Configurar Variables de Entorno

Agrega a tu archivo `.env`:

```env
# Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui

# Price IDs
VITE_STRIPE_PRICE_PLUS=price_1Abc_plus_id
VITE_STRIPE_PRICE_GOLD=price_1Abc_gold_id
VITE_STRIPE_PRICE_PLATINUM=price_1Abc_platinum_id
```

---

## 📝 Paso 4: Actualizar Price IDs en el Código

Edita `src/utils/subscriptionPlans.js`:

```javascript
export const SUBSCRIPTION_PLANS = {
  // ...
  plus: {
    // ...
    stripePriceId: 'price_1Abc_plus_id', // Tu Price ID real
  },
  gold: {
    // ...
    stripePriceId: 'price_1Abc_gold_id', // Tu Price ID real
  },
  platinum: {
    // ...
    stripePriceId: 'price_1Abc_platinum_id', // Tu Price ID real
  }
}
```

---

## 💻 Paso 5: Instalar Stripe SDK

```bash
npm install @stripe/stripe-js
```

---

## 🔧 Paso 6: Crear Netlify Function para Checkout

Crea el archivo `netlify/functions/create-checkout.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { priceId, userId } = JSON.parse(event.body)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/subscription`,
      client_reference_id: userId,
      metadata: {
        userId: userId
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
```

---

## 🪝 Paso 7: Configurar Webhooks

### 7.1 Crear Webhook en Stripe

1. Ve a **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL: `https://tu-dominio.netlify.app/.netlify/functions/stripe-webhook`
4. Selecciona eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 7.2 Crear Netlify Function para Webhooks

Crea `netlify/functions/stripe-webhook.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ¡Service role key, no anon key!
)

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, webhookSecret)
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    }
  }

  // Manejar eventos
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object
      await handleCheckoutCompleted(session)
      break

    case 'customer.subscription.updated':
      const subscription = stripeEvent.data.object
      await handleSubscriptionUpdated(subscription)
      break

    case 'customer.subscription.deleted':
      const deletedSub = stripeEvent.data.object
      await handleSubscriptionDeleted(deletedSub)
      break
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) }
}

async function handleCheckoutCompleted(session) {
  const { client_reference_id: userId, subscription: stripeSubId } = session

  // Obtener detalles de la suscripción de Stripe
  const subscription = await stripe.subscriptions.retrieve(stripeSubId)
  const priceId = subscription.items.data[0].price.id

  // Determinar el plan según el Price ID
  let planType = 'free'
  if (priceId === process.env.VITE_STRIPE_PRICE_PLUS) planType = 'plus'
  if (priceId === process.env.VITE_STRIPE_PRICE_GOLD) planType = 'gold'
  if (priceId === process.env.VITE_STRIPE_PRICE_PLATINUM) planType = 'platinum'

  // Actualizar suscripción en Supabase
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      plan_type: planType,
      status: 'active',
      stripe_customer_id: session.customer,
      stripe_subscription_id: stripeSubId,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })

  // Registrar transacción
  await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      amount: session.amount_total / 100,
      currency: session.currency,
      status: 'completed',
      payment_method: 'stripe',
      stripe_payment_intent_id: session.payment_intent,
      description: `Suscripción a ${planType}`
    })
}

async function handleSubscriptionUpdated(subscription) {
  // Actualizar estado en Supabase
  await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription) {
  // Marcar como cancelada
  await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      plan_type: 'free'
    })
    .eq('stripe_subscription_id', subscription.id)
}
```

---

## 🎨 Paso 8: Actualizar UI para Usar Stripe

Edita `src/pages/Subscription.jsx`:

```javascript
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const handleSubscribe = async (planId) => {
  if (planId === 'free') {
    navigate('/discover')
    return
  }

  setLoading(true)

  try {
    const plan = SUBSCRIPTION_PLANS[planId]

    // Crear checkout session
    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: plan.stripePriceId,
        userId: user.id
      })
    })

    const { sessionId } = await response.json()

    // Redirigir a Stripe Checkout
    const stripe = await stripePromise
    const { error } = await stripe.redirectToCheckout({ sessionId })

    if (error) {
      alert('Error al procesar el pago: ' + error.message)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error al crear la sesión de pago')
  } finally {
    setLoading(false)
  }
}
```

---

## ✅ Paso 9: Verificar Integración

### Test Mode (Desarrollo)
Usa estas tarjetas de prueba:
- **Éxito**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Cualquier fecha futura y CVC

### Live Mode (Producción)
1. Activa tu cuenta en Stripe
2. Cambia las keys de test por las de producción
3. Actualiza webhooks con la URL de producción

---

## 📊 Monitoreo

- **Stripe Dashboard** → **Payments**: Ver todos los pagos
- **Developers** → **Webhooks**: Ver logs de webhooks
- **Customers**: Ver suscripciones activas

---

## 🔒 Seguridad

1. ✅ Nunca expongas `STRIPE_SECRET_KEY` en el frontend
2. ✅ Usa Netlify Functions para operaciones con Stripe
3. ✅ Verifica siempre las firmas de webhooks
4. ✅ Usa HTTPS en producción
5. ✅ Valida datos del lado del servidor

---

## 💡 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
