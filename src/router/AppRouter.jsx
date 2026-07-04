import { Route, Routes } from 'react-router-dom'
import CarBrowser from '../pages/CarBrowser/CarBrowser'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CarBrowser />} />
    </Routes>
  )
}

export default AppRouter
