import RouteFocusManager from './components/accessibility/RouteFocusManager/RouteFocusManager'
import GlobalErrorBoundary from './components/feedback/GlobalErrorBoundary/GlobalErrorBoundary'
import ToastContainer from './components/feedback/ToastContainer/ToastContainer'
import AppProvider from './context/AppContext/AppProvider'
import AppRouter from './router/AppRouter'

const App = () => {
  return (
    <GlobalErrorBoundary>
      <AppProvider>
        <div>
          <RouteFocusManager />
          <AppRouter />
          <ToastContainer />
        </div>
      </AppProvider>
    </GlobalErrorBoundary>
  )
}

export default App