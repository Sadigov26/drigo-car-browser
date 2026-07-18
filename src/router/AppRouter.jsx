import { Route, Routes } from 'react-router-dom'
import CarBrowser from '../pages/CarBrowser/CarBrowser'
import CarDetail from '../pages/CarDetail/CarDetail'
import MyBookings from '../pages/MyBookings/MyBookings'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CarBrowser />} />
      <Route path="/cars/:id" element={<CarDetail />} />
      <Route path="/bookings" element={<MyBookings />} />
    </Routes>
  )
}

export default AppRouter
