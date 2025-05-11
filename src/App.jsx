import './index.css';
import Navbar from './components/core/Navbar/Navbar';
import Sidebar from './components/core/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import Roadmap from './pages/RoadmapViewer/Roadmap';
import Resources from './pages/Resources/Resources';
import Footer from './pages/Home/Footer';
import { Route, Routes } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roadmap/:skill" element={<Roadmap />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;