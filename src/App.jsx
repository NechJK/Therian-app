import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { SubscriptionProvider } from './hooks/useSubscription'
import BottomNav from './components/BottomNav'
import ProfileCheck from './components/ProfileCheck'

// Pages
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Discover from './pages/Discover'
import Matches from './pages/Matches'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Subscription from './pages/Subscription'

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

// Public route wrapper (redirect to discover if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return !user ? children : <Navigate to="/discover" />
}

// Layout with bottom navigation
const AppLayout = ({ children }) => {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          <Route path="/discover" element={
            <ProtectedRoute>
              <ProfileCheck>
                <AppLayout>
                  <Discover />
                </AppLayout>
              </ProfileCheck>
            </ProtectedRoute>
          } />

          <Route path="/matches" element={
            <ProtectedRoute>
              <ProfileCheck>
                <AppLayout>
                  <Matches />
                </AppLayout>
              </ProfileCheck>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileCheck>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </ProfileCheck>
            </ProtectedRoute>
          } />

          <Route path="/edit-profile" element={
            <ProtectedRoute>
              <ProfileCheck>
                <EditProfile />
              </ProfileCheck>
            </ProtectedRoute>
          } />

          <Route path="/chat/:matchId" element={
            <ProtectedRoute>
              <ProfileCheck>
                <Chat />
              </ProfileCheck>
            </ProtectedRoute>
          } />

          <Route path="/subscription" element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
