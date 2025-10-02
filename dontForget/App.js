import './App.css';
import * as Pages from './pages';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Pages.Accueil />} />
          <Route path="/signup" element={<Pages.Signup />} />
          <Route path="/login" element={<Pages.Login />} />
          <Route path="/forget-password" element={<Pages.ForgotPassword />} />
          <Route path="/reset-password" element={<Pages.ResetPassword />} />
          <Route path="/confirmation" element={<Pages.Confirmation />} />
          <Route path="/dashboard" element={<Pages.DashboardUser />} />
          <Route path="/profil" element={<Pages.Profil />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
