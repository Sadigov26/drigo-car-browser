import { Route, Routes } from 'react-router-dom'
import RequireAuth from '../components/auth/RequireAuth/RequireAuth'
import CarBrowser from '../pages/CarBrowser/CarBrowser'
import CarDetail from '../pages/CarDetail/CarDetail'
import MyBookings from '../pages/MyBookings/MyBookings'
import SignIn from '../pages/SignIn/SignIn'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CarBrowser />} />
      <Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route
        path="/bookings"
        element={
          <RequireAuth>
            <MyBookings />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default AppRouter
