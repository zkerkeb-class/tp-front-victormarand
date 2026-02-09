import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
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
          <Link to="/add" className="nav-link">Ajouter</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;