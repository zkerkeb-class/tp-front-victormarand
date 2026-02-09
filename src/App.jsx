import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import './App.css';
import Home from './pages/Home.jsx';
import PokemonDetail from './pages/PokemonDetail.jsx';
import AddPokemon from './pages/AddPokemon.jsx';
import Favorites from './pages/Favorites.jsx';
import Statistics from './pages/Statistics.jsx';
import Comparison from './pages/Comparison.jsx';
import Trending from './pages/Trending.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/add" element={<AddPokemon />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/trending" element={<Trending />} />
          </Routes>
        </main>
        <footer className="app-footer">
          © 2025 PokéManager - Projet Étudiant
        </footer>
      </div>
    </Router>
  );
}

export default App;