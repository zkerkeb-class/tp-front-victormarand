import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TrendingUp, Zap, Heart } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const Trending = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchTrendingPokemons();
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorite_pokemons');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const fetchTrendingPokemons = async () => {
    try {
      let allPokemons = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`${API_URL}/pokemons?page=${page}`);
        if (!response.ok) throw new Error('Erreur API');
        
        const data = await response.json();
        allPokemons = allPokemons.concat(data.data);
        
        if (page >= data.totalPages) hasMore = false;
        page++;
      }

      const trendingList = [...allPokemons]
        .sort((a, b) => b.cp - a.cp)
        .slice(0, 12);

      setTrending(trendingList);
    } catch (error) {
      toast.error('Erreur lors du chargement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (pokemonId) => {
    const newFavorites = favorites.includes(pokemonId)
      ? favorites.filter(id => id !== pokemonId)
      : [...favorites, pokemonId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorite_pokemons', JSON.stringify(newFavorites));
  };

  return (
    <div className="trending-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Retour
      </button>

      <div className="page-header">
        <h1 className="page-title">🔥 Pokémons Tendances</h1>
        <p className="page-subtitle">Les plus puissants de votre Pokédex</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des tendances...</p>
        </div>
      ) : (
        <div className="trending-grid">
          {trending.map((pokemon, idx) => (
            <div key={pokemon._id} className="trending-card" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="trending-rank">#{idx + 1}</div>
              
              <div className="trending-image">
                <img src={pokemon.picture} alt={pokemon.name} />
                <div className="trending-glow"></div>
              </div>

              <div className="trending-content">
                <h3 className="trending-name">{pokemon.name}</h3>
                
                <div className="trending-types">
                  {pokemon.types.map((type, i) => (
                    <span key={i} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>

                <div className="trending-stats-row">
                  <div className="trending-stat">
                    <span className="trending-stat-icon">❤️</span>
                    <span className="trending-stat-value">{pokemon.hp}</span>
                  </div>
                  <div className="trending-stat">
                    <span className="trending-stat-icon">⚡</span>
                    <span className="trending-stat-value">{pokemon.cp}</span>
                  </div>
                </div>

                <div className="trending-footer">
                  <Link 
                    to={`/pokemon/${pokemon._id}`}
                    className="trending-link"
                  >
                    Voir plus →
                  </Link>
                  <button
                    className={`trending-fav-btn ${favorites.includes(pokemon._id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(pokemon._id)}
                    title={favorites.includes(pokemon._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Heart
                      size={20}
                      fill={favorites.includes(pokemon._id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
