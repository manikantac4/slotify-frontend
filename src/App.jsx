import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landingpage";
import Login from "./components/login";
import Details from "./components/details";
import Providerdashboard from "./components/Providerdashboard";
import Profile from "./components/profile";
import Customerdashboard from "./components/customerdashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details" element={<Details />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/providerdashboard" element={<Providerdashboard />} />
        <Route path="/customer-dashboard" element={<Customerdashboard />} />
      </Routes>
    </Router>
  );
}

export default App;