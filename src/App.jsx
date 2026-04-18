import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landingpage";
import Login from "./components/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

