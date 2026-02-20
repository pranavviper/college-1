import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import CourseManagement from './pages/CourseManagement';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudentList from './pages/AdminStudentList';
import AdminFacultyList from './pages/AdminFacultyList';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import CreditTransfer from './pages/CreditTransfer';
import OD from './pages/OD';
import Events from './pages/Events';
import Achievements from './pages/Achievements';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-slate-900 flex flex-col md:flex-row font-sans">
          <Navbar />
          <div className="flex-1 w-full md:ml-72 transition-all duration-300">
            <TopBar />
            <div className="px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/passwordreset/:resetToken" element={<ResetPassword />} />
                <Route path="/change-password" element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                } />
                <Route path="/credit-transfer" element={
                  <ProtectedRoute>
                    <CreditTransfer />
                  </ProtectedRoute>
                } />
                <Route path="/od" element={
                  <ProtectedRoute>
                    <OD />
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                } />
                <Route path="/achievements" element={
                  <ProtectedRoute>
                    <Achievements />
                  </ProtectedRoute>
                } />

                <Route path="/student" element={
                  <ProtectedRoute role="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/faculty" element={
                  <ProtectedRoute role="faculty">
                    <FacultyDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/faculty/courses" element={
                  <ProtectedRoute role="faculty">
                    <CourseManagement />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/students" element={
                  <ProtectedRoute role="admin">
                    <AdminStudentList />
                  </ProtectedRoute>
                } />
                <Route path="/admin/faculty" element={
                  <ProtectedRoute role="admin">
                    <AdminFacultyList />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
