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
import UserProfile from './pages/UserProfile'
import VolunteerDashboard from './pages/VolunteerDashboard'
import About from './pages/About'
import Adopt from './pages/Adopt'
import AdoptionForm from './pages/AdoptionForm'
import Contact from './pages/Contact'
import EmergencyReport from './pages/EmergencyReport'
import Donation from './pages/Donation'
import Volunteer from './pages/Volunteer'
import VolunteerForm from './pages/VolunteerForm'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageAnimals from './pages/admin/ManageAnimals'
import ManageAdoptions from './pages/admin/ManageAdoptions'
import ManageRescues from './pages/admin/ManageRescues'
import AdminLiveMap from './pages/admin/AdminLiveMap'
import ManageVolunteers from './pages/admin/ManageVolunteers'
import ManageDonations from './pages/admin/ManageDonations'
import ManageEvents from './pages/admin/ManageEvents'
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
              <Route path="/emergency-report" element={<EmergencyReport />} />
              <Route path="/donate" element={<Donation />} />
              <Route path="/volunteer-dashboard" element={<PrivateRoute><VolunteerDashboard /></PrivateRoute>} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<Login />} />

              {/* Admin nested routes */}
              <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="animals" element={<ManageAnimals />} />
                <Route path="add-animal" element={<AdminAddAnimal />} />
                <Route path="adoptions" element={<ManageAdoptions />} />
                <Route path="rescues" element={<ManageRescues />} />
                <Route path="map" element={<AdminLiveMap />} />
                <Route path="events" element={<ManageEvents />} />
                <Route path="volunteers" element={<ManageVolunteers />} />
                <Route path="donations" element={<ManageDonations />} />
                {/* Default admin redirect to dashboard */}
                <Route index element={<AdminDashboard />} />
              </Route>

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
