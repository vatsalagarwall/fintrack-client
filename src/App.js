import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ReactGA from 'react-ga';
import { Analytics } from "@vercel/analytics/react"

ReactGA.initialize('G-HPG4WBW6VK');

function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<ProtectedRoutes> <HomePage /> </ProtectedRoutes>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Analytics />
      </Routes>
    </>
  );
}


export function ProtectedRoutes(props) {
  if (localStorage.getItem('user')) {
    return props.children
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;
