import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokemonFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [pokemonsFavoris, setPokemonsFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoritePokemons();
  }, [favorites]);

  const fetchFavoritePokemons = async () => {
    setLoading(true);
    try {
      const pokemons = [];
      for (const id of favorites) {
        const response = await fetch(`${API_URL}/pokemons/${id}`);
        if (response.ok) {
          const data = await response.json();
          pokemons.push(data.data);
        }
      }
      setPokemonsFavoris(pokemons);
    } catch (error) {
      toast.error('Erreur lors du chargement des favoris');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (pokemonId) => {
    const updated = favorites.filter(id => id !== pokemonId);
    setFavorites(updated);
    localStorage.setItem('pokemonFavorites', JSON.stringify(updated));
    setPokemonsFavoris(pokemonsFavoris.filter(p => p._id !== pokemonId));
    toast.success('Retiré des favoris');
  };

  const clearAllFavorites = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider tous vos favoris ?')) {
      setFavorites([]);
      setPokemonsFavoris([]);
      localStorage.setItem('pokemonFavorites', JSON.stringify([]));
      toast.success('Tous les favoris ont été supprimés');
    }
  };

  return (
    <div className="favorites-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="page-header">
        <h1 className="page-title">Mes Favoris ❤️</h1>
        <p className="page-subtitle">{pokemonsFavoris.length} Pokémon{pokemonsFavoris.length > 1 ? 's' : ''} en favori</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des favoris...</p>
        </div>
      ) : pokemonsFavoris.length === 0 ? (
        <div className="empty-state">
          <p>Aucun Pokémon en favori pour le moment</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Explorez la Pokédex
          </Link>
        </div>
      ) : (
        <>
          <div className="pokemon-grid">
            {pokemonsFavoris.map((pokemon) => (
              <div key={pokemon._id} className="pokemon-card-wrapper">
                <button
                  className="favorite-btn active"
                  onClick={() => removeFavorite(pokemon._id)}
                  title="Retirer des favoris"
                >
                  <Heart size={20} />
                </button>
                <Link
                  to={`/pokemon/${pokemon._id}`}
                  className="pokemon-card-link"
                >
                  <div className="pokemon-card">
                    <div className="pokemon-image-container">
                      <img
                        src={pokemon.picture}
                        alt={pokemon.name}
                        className="pokemon-image"
                      />
                    </div>
                    <div className="pokemon-card-content">
                      <h3 className="pokemon-name">{pokemon.name}</h3>
                      <div className="pokemon-types">
                        {pokemon.types.map((type, idx) => (
                          <span key={idx} className={`type-badge type-${type.toLowerCase()}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                      <div className="pokemon-stats">
                        <div className="stat">
                          <span className="stat-label">HP</span>
                          <span className="stat-value">{pokemon.hp}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">CP</span>
                          <span className="stat-value">{pokemon.cp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  className="remove-favorite-btn"
                  onClick={() => removeFavorite(pokemon._id)}
                  title="Supprimer des favoris"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {pokemonsFavoris.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                className="btn btn-danger"
                onClick={clearAllFavorites}
              >
                <Trash2 size={18} />
                Vider tous les favoris
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
