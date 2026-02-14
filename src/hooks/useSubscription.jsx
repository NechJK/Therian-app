import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../config/supabase'
import { getUserPlan, getUserLimits } from '../utils/subscriptionPlans'

const SubscriptionContext = createContext({})

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [dailyUsage, setDailyUsage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSubscription()
      loadDailyUsage()
    } else {
      setSubscription(null)
      setDailyUsage(null)
      setLoading(false)
    }
  }, [user])

  const loadSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setSubscription(data)
    } catch (error) {
      console.error('Error loading subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDailyUsage = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('daily_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setDailyUsage(data || {
        likes_count: 0,
        super_likes_count: 0,
        rewinds_count: 0,
        boosts_count: 0
      })
    } catch (error) {
      console.error('Error loading daily usage:', error)
    }
  }

  const canLike = async () => {
    const plan = getUserPlan(subscription)
    const limits = getUserLimits(subscription)

    // Si tiene likes ilimitados
    if (limits.unlimitedLikes) {
      return true
    }

    // Verificar límite diario
    const likesUsed = dailyUsage?.likes_count || 0
    return likesUsed < limits.dailyLikes
  }

  const canSuperLike = async () => {
    const limits = getUserLimits(subscription)
    const superLikesUsed = dailyUsage?.super_likes_count || 0

    if (limits.dailySuperLikes === 999999) {
      return true // Ilimitados
    }

    return superLikesUsed < limits.dailySuperLikes
  }

  const canRewind = async () => {
    const limits = getUserLimits(subscription)
    const rewindsUsed = dailyUsage?.rewinds_count || 0

    if (limits.dailyRewinds === 999999) {
      return true // Ilimitados
    }

    return rewindsUsed < limits.dailyRewinds
  }

  const incrementLikeCount = async () => {
    try {
      await supabase.rpc('increment_like_count', {
        p_user_id: user.id
      })
      await loadDailyUsage()
    } catch (error) {
      console.error('Error incrementing like count:', error)
    }
  }

  const incrementSuperLikeCount = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      await supabase
        .from('daily_usage')
        .upsert({
          user_id: user.id,
          date: today,
          super_likes_count: (dailyUsage?.super_likes_count || 0) + 1
        }, {
          onConflict: 'user_id,date'
        })

      await loadDailyUsage()
    } catch (error) {
      console.error('Error incrementing super like count:', error)
    }
  }

  const incrementRewindCount = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      await supabase
        .from('daily_usage')
        .upsert({
          user_id: user.id,
          date: today,
          rewinds_count: (dailyUsage?.rewinds_count || 0) + 1
        }, {
          onConflict: 'user_id,date'
        })

      await loadDailyUsage()
    } catch (error) {
      console.error('Error incrementing rewind count:', error)
    }
  }

  const getPlan = () => getUserPlan(subscription)

  const getLimits = () => getUserLimits(subscription)

  const getRemainingLikes = () => {
    const limits = getUserLimits(subscription)
    if (limits.unlimitedLikes) return 'Ilimitados'

    const used = dailyUsage?.likes_count || 0
    const remaining = limits.dailyLikes - used
    return Math.max(0, remaining)
  }

  const getRemainingSuperLikes = () => {
    const limits = getUserLimits(subscription)
    if (limits.dailySuperLikes === 999999) return 'Ilimitados'

    const used = dailyUsage?.super_likes_count || 0
    const remaining = limits.dailySuperLikes - used
    return Math.max(0, remaining)
  }

  const getRemainingRewinds = () => {
    const limits = getUserLimits(subscription)
    if (limits.dailyRewinds === 999999) return 'Ilimitados'

    const used = dailyUsage?.rewinds_count || 0
    const remaining = limits.dailyRewinds - used
    return Math.max(0, remaining)
  }

  const value = {
    subscription,
    dailyUsage,
    loading,
    plan: getPlan(),
    limits: getLimits(),
    canLike,
    canSuperLike,
    canRewind,
    incrementLikeCount,
    incrementSuperLikeCount,
    incrementRewindCount,
    getRemainingLikes,
    getRemainingSuperLikes,
    getRemainingRewinds,
    refresh: loadSubscription
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}
