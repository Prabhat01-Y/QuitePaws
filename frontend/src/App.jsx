import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Auth
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Adopt from './pages/Adopt'
import AdoptionForm from './pages/AdoptionForm'
import Contact from './pages/Contact'
import Donation from './pages/Donation'
import Volunteer from './pages/Volunteer'
import VolunteerForm from './pages/VolunteerForm'
import AdminLogin from './pages/AdminLogin'
import AdminAddAnimal from './pages/AdminAddAnimal'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/adopt" element={<Adopt />} />
              <Route path="/adoption-form/:id" element={<AdoptionForm />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/register-volunteer" element={<VolunteerForm />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donation />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/add-animal"
                element={
                  <PrivateRoute>
                    <AdminAddAnimal />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
