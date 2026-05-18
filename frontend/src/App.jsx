import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import { Home, Auth, Orders } from './pages'
import Header from './components/shared/Header'
import Tables from './pages/Tables'
import Menu from './pages/Menu'
import { useSelector } from 'react-redux'
import useLoadData from './hooks/useLoadData'
import FullScreenLoader from './components/shared/FullScreenLoader'
import Dashboard from './pages/Dashboard'
import History from './pages/History'

function Layout() {

  const location = useLocation();
  const isLoading = useLoadData();
  const hideHeaderRoutes = ["/auth"]
  const { isAuth } = useSelector(state => state.user);

  if (isLoading) return <FullScreenLoader />


  return (
    <>
      {/* <Header /> */}

      {!hideHeaderRoutes.includes(location.pathname) && <Header />}


      <Routes>

        <Route path='/' element={
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        } />

        <Route path='/auth' element={isAuth ? <Navigate to="/" /> : <Auth />} />

        <Route path='/orders' element={
          <ProtectedRoutes>
            <Orders />
          </ProtectedRoutes>
        } />

        <Route path='/tables' element={
          <ProtectedRoutes>
            <Tables />
          </ProtectedRoutes>
        } />

        <Route path='/menu' element={
          <ProtectedRoutes>
            <Menu />
          </ProtectedRoutes>

        } />

        <Route path='/dashboard' element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>

        } />

        <Route path='/history' element={
          <ProtectedRoutes>
            <History />
          </ProtectedRoutes>

        } />

      </Routes>

    </>
  )

}


function ProtectedRoutes({ children }) {

  const { isAuth } = useSelector(state => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" />
  }
  return children;
}

const App = () => {


  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App