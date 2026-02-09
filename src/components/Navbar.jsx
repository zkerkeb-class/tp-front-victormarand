import { Link, NavLink } from 'react-router-dom';
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
          <span className="brand-text">Pokédex</span>
        </Link>
        
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Accueil</NavLink>
          <NavLink to="/collection" className={({ isActive }) => `nav-link collection-link ${isActive ? 'active' : ''}`}>
            <Package size={18} />
            Collection
          </NavLink>
          <NavLink to="/trending" className={({ isActive }) => `nav-link trending-link ${isActive ? 'active' : ''}`}>
            <TrendingUp size={18} />
            Tendances
          </NavLink>
          <NavLink to="/statistics" className={({ isActive }) => `nav-link stats-link ${isActive ? 'active' : ''}`}>
            <BarChart3 size={18} />
            Stats
          </NavLink>
          <NavLink to="/comparison" className={({ isActive }) => `nav-link compare-link ${isActive ? 'active' : ''}`}>
            <Zap size={18} />
            Comparer
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `nav-link favorites-link ${isActive ? 'active' : ''}`}>
            <Heart size={18} />
            Favoris
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Ajouter</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;