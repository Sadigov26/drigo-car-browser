import ToastContainer from './components/feedback/ToastContainer/ToastContainer'
import AppProvider from './context/AppContext/AppProvider'
import AppRouter from './router/AppRouter'

const App = () => {
  return (
    <AppProvider>
      <div>
        <AppRouter />
        <ToastContainer />
      </div>
    </AppProvider>
  )
}

export default App