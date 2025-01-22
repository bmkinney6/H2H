import NavBar from './Components/NavBar.tsx';
import about from './Pages/about.tsx';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'

function App() {
  return (
      <Router>
          <div>
              <NavBar />
              <div className="content">
                  <Routes>
                      <Route path="/" element={<h1>Welcome Home</h1>} />
                      <Route path="/about" element={about()} />
                      <Route path="/contact" element={<h1>Contact Page</h1>} />
                  </Routes>
              </div>
          </div>
      </Router>
  );
}

export default App
