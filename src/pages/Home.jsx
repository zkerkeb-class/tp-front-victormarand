import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Loader, Heart, Filter, ArrowUpDown } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
  'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokemonFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [collection, setCollection] = useState(() => {
    const saved = localStorage.getItem('pokemonCollection');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchPokemons = async (page = 1, search = '', types = []) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      if (search) params.append('name', search);
      
      const response = await fetch(`${API_URL}/pokemons?${params}`);
      if (!response.ok) throw new Error('Erreur API');
      
      let data = await response.json();
      let pokemonArray = data.data;

      if (types.length > 0) {
        pokemonArray = pokemonArray.filter(p =>
          types.some(t => p.type.map(pt => pt.toLowerCase()).includes(t.toLowerCase()))
        );
      }

      pokemonArray = sortPokemons(pokemonArray);
      
      setPokemons(pokemonArray);
      setCurrentPage(page);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Erreur lors du chargement des Pokémons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortPokemons = (arr) => {
    const sorted = [...arr];
    sorted.sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'name') {
        aVal = a.name.english.toLowerCase();
        bVal = b.name.english.toLowerCase();
      } else if (sortBy === 'hp') {
        aVal = a.base.HP;
        bVal = b.base.HP;
      } else if (sortBy === 'cp') {
        aVal = a.base.Attack;
        bVal = b.base.Attack;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  useEffect(() => {
    fetchPokemons(1, searchTerm, selectedTypes);
  }, [searchTerm, selectedTypes, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleFavorite = (pokemonId) => {
    setFavorites(prev => {
      const updated = prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId];
      localStorage.setItem('pokemonFavorites', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleCollection = (pokemonId) => {
    setCollection(prev => {
      const updated = prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId];
      localStorage.setItem('pokemonCollection', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchPokemons(currentPage + 1, searchTerm, selectedTypes);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchPokemons(currentPage - 1, searchTerm, selectedTypes);
    }
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <h1 className="page-title">Pokédex Manager</h1>
        <p className="page-subtitle">Gérez votre collection de Pokémons</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="filters-controls">
        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} />
          Filtres & Tri
        </button>

        <div className={`filters-panel ${showFilters ? 'active' : ''}`}>
          <div className="filter-section">
            <h3 className="filter-title">Types</h3>
            <div className="types-filter-grid">
              {POKEMON_TYPES.map(type => (
                <button
                  key={type}
                  className={`type-filter-btn type-${type.toLowerCase()} ${
                    selectedTypes.includes(type) ? 'active' : ''
                  }`}
                  onClick={() => toggleType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Tri</h3>
            <div className="sort-controls">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Nom</option>
                <option value="hp">HP</option>
                <option value="cp">CP</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
              >
                <ArrowUpDown size={18} />
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          {(selectedTypes.length > 0 || sortBy !== 'name') && (
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSelectedTypes([]);
                setSortBy('name');
                setSortOrder('asc');
              }}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <Loader className="loading-spinner" />
          <p>Chargement des Pokémons...</p>
        </div>
      ) : pokemons.length === 0 ? (
        <div className="empty-state">
          <p>Aucun Pokémon trouvé avec ces critères</p>
        </div>
      ) : (
        <>
          <div className="pokemon-grid">
            {pokemons.map((pokemon) => (
              <div key={pokemon._id} className="pokemon-card-wrapper">
                <div className="card-action-buttons">
                  <button
                    className={`favorite-btn ${favorites.includes(pokemon._id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(pokemon._id)}
                    title="Ajouter aux favoris"
                  >
                    <Heart size={20} />
                  </button>
                  <button
                    className={`collection-btn ${collection.includes(pokemon._id) ? 'active' : ''}`}
                    onClick={() => toggleCollection(pokemon._id)}
                    title="Ajouter à ma collection"
                  >
                    📦
                  </button>
                </div>
                <Link
                  key={pokemon._id}
                  to={`/pokemon/${pokemon._id}`}
                  className="pokemon-card-link"
                >
                  <div className="pokemon-card">
                    <div className="pokemon-image-container">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name.english}
                        className="pokemon-image"
                      />
                    </div>
                    <div className="pokemon-card-content">
                      <h3 className="pokemon-name">{pokemon.name.english}</h3>
                      <div className="pokemon-types">
                        {pokemon.type.map((type, idx) => (
                          <span key={idx} className={`type-badge type-${type.toLowerCase()}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                      <div className="pokemon-stats">
                        <div className="stat">
                          <span className="stat-label">HP</span>
                          <span className="stat-value">{pokemon.base.HP}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">ATK</span>
                          <span className="stat-value">{pokemon.base.Attack}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <ChevronLeft size={20} />
              Précédent
            </button>
            
            <div className="pagination-info">
              Page <span className="page-number">{currentPage}</span> sur <span className="page-number">{totalPages}</span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Suivant
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
