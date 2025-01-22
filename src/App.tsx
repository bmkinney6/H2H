import NavBar from './Components/NavBar.tsx';
import about from './Pages/about.tsx';
import home from './Pages/home.tsx';
import players from './Pages/players.tsx';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css'

function App() {
  return (
      <Router>
          <div>
              <NavBar />
              <div className="content">
                  <Routes>
                      <Route path="/" element={home()} />
                      <Route path="/about" element={about()} />
                      <Route path="/players" element={players()} />
                  </Routes>
              </div>
          </div>
      </Router>
  );
}

export default App
