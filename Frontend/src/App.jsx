import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Datasets from './pages/Datasets';
import ItemDetails from './pages/ItemDetails';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/ToastProvider';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { AnimatePresence } from 'framer-motion';
import MotionPage from './components/MotionPage';
import './App.css'

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MotionPage><Landing /></MotionPage>} />
        <Route path="/about" element={<MotionPage><About /></MotionPage>} />
        <Route path="/contact" element={<MotionPage><Contact /></MotionPage>} />
        <Route path="/auth" element={<MotionPage><Auth /></MotionPage>} />
        <Route path="/datasets" element={<MotionPage><Datasets /></MotionPage>} />
        <Route path="/item/:id" element={<MotionPage><ItemDetails /></MotionPage>} />
        <Route path="/dashboard" element={<ProtectedRoute><MotionPage><Home /></MotionPage></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><MotionPage><Favorites /></MotionPage></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><MotionPage><Admin /></MotionPage></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [data, setData] = useState(null)

  return (
    <AuthProvider>
      <ToastProvider>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Navbar />
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
