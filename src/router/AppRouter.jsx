import { Route, Routes } from 'react-router-dom'
import CarBrowser from '../pages/CarBrowser/CarBrowser'
import CarDetail from '../pages/CarDetail/CarDetail'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CarBrowser />} />
      <Route path="/cars/:id" element={<CarDetail />} />
    </Routes>
  )
}

export default AppRouter
