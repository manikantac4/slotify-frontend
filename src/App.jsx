import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landingpage";
import Login from "./components/login";
import Details from "./components/details";
import Providerdashboard from "./components/Providerdashboard";
import Profile from "./components/profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details" element={<Details />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/providerdashboard" element={<Providerdashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

