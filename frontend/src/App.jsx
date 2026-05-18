// import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
// import { Home, Auth, Orders } from './pages'
// import Header from './components/shared/Header'
// import Tables from './pages/Tables'
// import Menu from './pages/Menu'
// import { useSelector } from 'react-redux'
// import useLoadData from './hooks/useLoadData'
// import FullScreenLoader from './components/shared/FullScreenLoader'
// import Dashboard from './pages/Dashboard'
// import History from './pages/History'

// function Layout() {

//   const location = useLocation();
//   const isLoading = useLoadData();
//   const hideHeaderRoutes = ["/auth"]
//   const { isAuth } = useSelector(state => state.user);

//   if (isLoading) return <FullScreenLoader />


//   return (
//     <>
//       {/* <Header /> */}

//       {!hideHeaderRoutes.includes(location.pathname) && <Header />}


//       <Routes>

//         <Route path='/' element={
//           <ProtectedRoutes>
//             <Home />
//           </ProtectedRoutes>
//         } />

//         <Route path='/auth' element={isAuth ? <Navigate to="/" /> : <Auth />} />

//         <Route path='/orders' element={
//           <ProtectedRoutes>
//             <Orders />
//           </ProtectedRoutes>
//         } />

//         <Route path='/tables' element={
//           <ProtectedRoutes>
//             <Tables />
//           </ProtectedRoutes>
//         } />

//         <Route path='/menu' element={
//           <ProtectedRoutes>
//             <Menu />
//           </ProtectedRoutes>

//         } />

//         <Route path='/dashboard' element={
//           <ProtectedRoutes>
//             <Dashboard />
//           </ProtectedRoutes>

//         } />

//         <Route path='/history' element={
//           <ProtectedRoutes>
//             <History />
//           </ProtectedRoutes>

//         } />

//       </Routes>

//     </>
//   )

// }


// function ProtectedRoutes({ children }) {

//   const { isAuth } = useSelector(state => state.user);
//   if (!isAuth) {
//     return <Navigate to="/auth" />
//   }
//   return children;
// }

// const App = () => {


//   return (
//     <Router>
//       <Layout />
//     </Router>
//   )
// }

// export default App

import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, startTransition, useEffect, useState } from 'react'
import Header from './components/shared/Header'
import { useSelector } from 'react-redux'
import useLoadData from './hooks/useLoadData'
import FullScreenLoader from './components/shared/FullScreenLoader'

// Prefetch critical routes on hover/mouseover
const prefetchRoute = (routePath) => {
  const routeMap = {
    '/': () => import('./pages/Home'),
    '/orders': () => import('./pages/Orders'),
    '/tables': () => import('./pages/Tables'),
    '/menu': () => import('./pages/Menu'),
    '/dashboard': () => import('./pages/Dashboard'),
    '/history': () => import('./pages/History'),
  }

  const importer = routeMap[routePath];
  if (importer) {
    importer();
  }
};

// Lazy load components with preload hints
const Home = lazy(() => import(/* webpackPrefetch: true */ './pages/Home'))
const Auth = lazy(() => import(/* webpackChunkName: "auth" */ './pages/Auth'))
const Orders = lazy(() => import(/* webpackPrefetch: true */ './pages/Orders'))
const Tables = lazy(() => import('./pages/Tables'))
const Menu = lazy(() => import('./pages/Menu'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const History = lazy(() => import('./pages/History'))

// Optimized PageLoader with delay to avoid flash
const PageLoader = () => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return showLoader ? <FullScreenLoader /> : null;
};

// Cache loaded components
const routeCache = new Map();

function Layout() {
  const location = useLocation();
  const isLoading = useLoadData();
  const hideHeaderRoutes = ["/auth"]
  const { isAuth } = useSelector(state => state.user);

  // Prefetch adjacent routes
  useEffect(() => {
    const currentPath = location.pathname;
    const routesToPrefetch = [];

    // Prefetch routes based on current location
    if (currentPath === '/') {
      routesToPrefetch.push('/menu', '/tables');
    } else if (currentPath === '/orders') {
      routesToPrefetch.push('/history', '/dashboard');
    } else if (currentPath === '/menu') {
      routesToPrefetch.push('/orders');
    }

    // Prefetch in idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        routesToPrefetch.forEach(route => prefetchRoute(route));
      });
    } else {
      setTimeout(() => {
        routesToPrefetch.forEach(route => prefetchRoute(route));
      }, 1000);
    }
  }, [location.pathname]);

  if (isLoading) return <FullScreenLoader />

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          } />

          <Route path='/auth' element={isAuth ? <Navigate to="/" replace /> : <Auth />} />

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
      </Suspense>
    </>
  )
}

// Memoized ProtectedRoutes to prevent unnecessary re-renders
import { memo } from 'react';
const ProtectedRoutes = memo(({ children }) => {
  const { isAuth } = useSelector(state => state.user);
  if (!isAuth) {
    return <Navigate to="/auth" replace />;
  }
  return children;
});

// Optimized App with React.memo
const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App