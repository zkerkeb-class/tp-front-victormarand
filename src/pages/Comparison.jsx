import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { X, Zap, Heart } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const Comparison = () => {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState([null, null]);
  const [search, setSearch] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const filtered = pokemons.filter(p =>
        p.name.english.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPokemons(filtered.slice(0, 10));
    } else {
      setFilteredPokemons([]);
    }
  }, [search, pokemons]);

  const fetchAllPokemons = async () => {
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

      setPokemons(allPokemons);
    } catch (error) {
      toast.error('Erreur lors du chargement des Pokémons');
      console.error(error);
    }
  };

  const selectPokemon = (pokemon) => {
    if (activeSlot !== null) {
      setSelected(prev => {
        const newSelected = [...prev];
        newSelected[activeSlot] = pokemon;
        return newSelected;
      });
      setSearch('');
      setFilteredPokemons([]);
      setActiveSlot(null);
    }
  };

  const removePokemon = (index) => {
    setSelected(prev => {
      const newSelected = [...prev];
      newSelected[index] = null;
      return newSelected;
    });
  };

  const getStatDifference = (stat1, stat2) => {
    const diff = stat1 - stat2;
    return {
      value: Math.abs(diff),
      winner: diff > 0 ? 'left' : diff < 0 ? 'right' : 'tie'
    };
  };

  const StatComparison = ({ label, value1, value2 }) => {
    const diff = getStatDifference(value1, value2);
    return (
      <div className="stat-comparison-row">
        <div className="stat-column">
          <span className={`stat-winner ${diff.winner === 'left' ? 'active' : ''}`}>
            {value1}
          </span>
        </div>
        <div className="stat-label">{label}</div>
        <div className="stat-column">
          <span className={`stat-winner ${diff.winner === 'right' ? 'active' : ''}`}>
            {value2}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="comparison-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Retour
      </button>

      <div className="page-header">
        <h1 className="page-title">⚔️ Comparateur Pokémons</h1>
        <p className="page-subtitle">Comparez deux Pokémons côte à côte</p>
      </div>

      {/* POKEMON SELECTION */}
      <div className="comparison-selection">
        {[0, 1].map(index => (
          <div key={index} className="selection-slot">
            {!selected[index] ? (
              <div
                className="slot-placeholder"
                onClick={() => setActiveSlot(index)}
              >
                <div className="placeholder-icon">🔍</div>
                <p>Sélectionner Pokémon {index + 1}</p>
              </div>
            ) : (
              <div className="selected-pokemon-preview">
                <img
                  src={selected[index].image}
                  alt={selected[index].name.english}
                  className="preview-image"
                />
                <h3>{selected[index].name.english}</h3>
                <button
                  className="remove-slot-btn"
                  onClick={() => removePokemon(index)}
                  title="Retirer"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SEARCH DROPDOWN */}
      {activeSlot !== null && (
        <div className="comparison-search-container">
          <input
            type="text"
            placeholder="Rechercher un Pokémon..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="comparison-search-input"
            autoFocus
          />
          {filteredPokemons.length > 0 && (
            <div className="comparison-dropdown">
              {filteredPokemons.map(pokemon => (
                <div
                  key={pokemon._id}
                  className="dropdown-item"
                  onClick={() => selectPokemon(pokemon)}
                >
                  <img src={pokemon.image} alt={pokemon.name.english} />
                  <span>{pokemon.name.english}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COMPARISON RESULTS */}
      {selected[0] && selected[1] && (
        <div className="comparison-results">
          <h2 className="comparison-title">Comparaison des stats</h2>
          
          <div className="comparison-table">
            <StatComparison
              label="HP"
              value1={selected[0].base.HP}
              value2={selected[1].base.HP}
            />
            <StatComparison
              label="ATK"
              value1={selected[0].base.Attack}
              value2={selected[1].base.Attack}
            />

            {/* TYPES COMPARISON */}
            <div className="stat-comparison-row types-row">
              <div className="stat-column">
                <div className="types-comparison">
                  {selected[0].type.map((type, i) => (
                    <span key={i} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="stat-label">Types</div>
              <div className="stat-column">
                <div className="types-comparison">
                  {selected[1].type.map((type, i) => (
                    <span key={i} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* WINNER BADGE */}
          <div className="comparison-winner">
            {selected[0].base.Attack > selected[1].base.Attack ? (
              <>
                <span className="winner-text">🏆 {selected[0].name.english} est plus fort!</span>
              </>
            ) : selected[1].base.Attack > selected[0].base.Attack ? (
              <>
                <span className="winner-text">🏆 {selected[1].name.english} est plus fort!</span>
              </>
            ) : (
              <span className="winner-text">⚖️ Égalité parfaite!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comparison;
