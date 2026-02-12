import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Loader, Heart, Filter, ArrowUpDown, Sparkles, Swords, Shuffle } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
  'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
];

const Home = () => {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [shinyMode, setShinyMode] = useState(false);
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('pokemonTeam');
    return saved ? JSON.parse(saved) : [];
  });
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

  const toggleTeam = (pokemon) => {
    setTeam(prev => {
      const exists = prev.some(member => member._id === pokemon._id);
      if (exists) {
        const updated = prev.filter(member => member._id !== pokemon._id);
        localStorage.setItem('pokemonTeam', JSON.stringify(updated));
        return updated;
      }
      if (prev.length >= 3) {
        toast.error('L equipe est limitee a 3 Pokemons');
        return prev;
      }
      const updated = [...prev, { _id: pokemon._id, name: pokemon.name.english, image: pokemon.image }];
      localStorage.setItem('pokemonTeam', JSON.stringify(updated));
      return updated;
    });
  };

  const clearTeam = () => {
    setTeam([]);
    localStorage.setItem('pokemonTeam', JSON.stringify([]));
  };

  const handleRandomPick = () => {
    if (pokemons.length === 0) {
      toast.error('Aucun Pokemon charge');
      return;
    }
    const pick = pokemons[Math.floor(Math.random() * pokemons.length)];
    navigate(`/pokemon/${pick._id}`);
  };

  const getShinyImage = (url) => {
    if (!url) return url;
    return url.includes('/assets/pokemons/')
      ? url.replace('/assets/pokemons/', '/assets/pokemons/shiny/')
      : url;
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
        <h1 className="page-title">Pokédex</h1>
        <p className="page-subtitle">Gérez votre collection de Pokémons</p>
      </div>

      <div className="trainer-hub">
        <div className="trainer-card">
          <div>
            <p className="trainer-kicker">Tableau du Dresseur</p>
            <h2 className="trainer-title">Forge ton equipe et explore la Pokedex</h2>
          </div>
          <div className="trainer-metrics">
            <div className="trainer-metric">
              <span className="metric-label">Favoris</span>
              <span className="metric-value">{favorites.length}</span>
            </div>
            <div className="trainer-metric">
              <span className="metric-label">Collection</span>
              <span className="metric-value">{collection.length}</span>
            </div>
            <div className="trainer-metric">
              <span className="metric-label">Equipe</span>
              <span className="metric-value">{team.length}/3</span>
            </div>
          </div>
        </div>
        <div className="trainer-actions">
          <button
            className={`trainer-toggle ${shinyMode ? 'active' : ''}`}
            onClick={() => setShinyMode(!shinyMode)}
          >
            <Sparkles size={18} />
            Mode Shiny
          </button>
          <button className="trainer-toggle secondary" onClick={handleRandomPick}>
            <Shuffle size={18} />
            Surprise
          </button>
        </div>
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
                <Link
                  key={pokemon._id}
                  to={`/pokemon/${pokemon._id}`}
                  className="pokemon-card-link"
                >
                  <div className="pokemon-card">
                    <div className="pokemon-image-container">
                      <img
                        src={shinyMode ? getShinyImage(pokemon.image) : pokemon.image}
                        alt={pokemon.name.english}
                        className="pokemon-image"
                        onError={(event) => {
                          if (shinyMode) {
                            event.currentTarget.src = pokemon.image;
                          }
                        }}
                      />
                    </div>
                    <div className="pokemon-actions-row">
                      <button
                        type="button"
                        className={`favorite-btn ${favorites.includes(pokemon._id) ? 'active' : ''}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavorite(pokemon._id);
                        }}
                        title="Ajouter aux favoris"
                        aria-pressed={favorites.includes(pokemon._id)}
                      >
                        <Heart size={18} />
                      </button>
                      <button
                        type="button"
                        className={`collection-btn ${collection.includes(pokemon._id) ? 'active' : ''}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleCollection(pokemon._id);
                        }}
                        title="Ajouter a ma collection"
                        aria-pressed={collection.includes(pokemon._id)}
                      >
                        📦
                      </button>
                      <button
                        type="button"
                        className={`team-btn ${team.some(member => member._id === pokemon._id) ? 'active' : ''}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleTeam(pokemon);
                        }}
                        title="Ajouter a l equipe"
                        aria-pressed={team.some(member => member._id === pokemon._id)}
                      >
                        <Swords size={18} />
                      </button>
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

          {team.length > 0 && (
            <div className="team-dock">
              <div className="team-dock-header">
                <div>
                  <span className="team-title">Equipe Express</span>
                  <span className="team-subtitle">Selection rapide pour le duel</span>
                </div>
                <button className="team-clear-btn" onClick={clearTeam}>Vider</button>
              </div>
              <div className="team-dock-list">
                {team.map(member => (
                  <Link key={member._id} to={`/pokemon/${member._id}`} className="team-chip">
                    <img src={member.image} alt={member.name} />
                    <span>{member.name}</span>
                  </Link>
                ))}
                <Link to="/comparison?mode=team" className="team-compare-btn">
                  Comparer
                </Link>
              </div>
            </div>
          )}

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
