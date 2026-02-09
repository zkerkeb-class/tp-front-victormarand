import { Link } from 'react-router-dom';
import { Gamepad2, Heart, BarChart3, Zap, TrendingUp, Package } from 'lucide-react';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Gamepad2 size={24} />
          </div>
          <span className="brand-text">PokéManager</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/collection" className="nav-link collection-link">
            <Package size={18} />
            Collection
          </Link>
          <Link to="/trending" className="nav-link trending-link">
            <TrendingUp size={18} />
            Tendances
          </Link>
          <Link to="/statistics" className="nav-link stats-link">
            <BarChart3 size={18} />
            Stats
          </Link>
          <Link to="/comparison" className="nav-link compare-link">
            <Zap size={18} />
            Comparer
          </Link>
          <Link to="/favorites" className="nav-link favorites-link">
            <Heart size={18} />
            Favoris
          </Link>
          <Link to="/add" className="nav-link">Ajouter</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;