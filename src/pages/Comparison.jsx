import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { X, Users, Swords, Search } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const Comparison = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pokemons, setPokemons] = useState([]);
  const [mode, setMode] = useState('duel');
  const [selected, setSelected] = useState([null, null]);
  const [search, setSearch] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [teamAIds] = useState(() => {
    const saved = localStorage.getItem('pokemonTeam');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map(item => (typeof item === 'string' ? item : item._id)).filter(Boolean);
  });
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamFiltered, setTeamFiltered] = useState([]);

  useEffect(() => {
    fetchAllPokemons();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get('mode');
    if (modeParam === 'team') {
      setMode('team');
    }
  }, [location.search]);

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

  useEffect(() => {
    if (mode !== 'team') return;
    if (teamSearch.trim()) {
      const filtered = pokemons.filter(p =>
        p.name.english.toLowerCase().includes(teamSearch.toLowerCase())
      );
      setTeamFiltered(filtered.slice(0, 10));
    } else {
      setTeamFiltered([]);
    }
  }, [teamSearch, pokemons, mode]);

  useEffect(() => {
    if (mode !== 'team' || teamAIds.length === 0) {
      setTeamA([]);
      return;
    }
    fetchTeamMembers(teamAIds).then(setTeamA);
  }, [mode, teamAIds]);

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

  const fetchTeamMembers = async (ids) => {
    const team = [];
    for (const id of ids) {
      try {
        const response = await fetch(`${API_URL}/pokemons/${id}`);
        if (response.ok) {
          const data = await response.json();
          team.push(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    return team;
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

  const addToTeamB = (pokemon) => {
    setTeamB(prev => {
      if (prev.some(member => member._id === pokemon._id)) return prev;
      if (prev.length >= 3) {
        toast.error('Equipe limitee a 3 Pokemons');
        return prev;
      }
      return [...prev, pokemon];
    });
    setTeamSearch('');
    setTeamFiltered([]);
  };

  const removeFromTeamB = (id) => {
    setTeamB(prev => prev.filter(member => member._id !== id));
  };

  const clearTeamB = () => {
    setTeamB([]);
  };

  const getTeamStats = (team) => {
    const totals = team.reduce(
      (acc, p) => {
        acc.hp += p.base.HP;
        acc.atk += p.base.Attack;
        acc.def += p.base.Defense;
        acc.spa += p.base.SpecialAttack;
        acc.spd += p.base.SpecialDefense;
        acc.spe += p.base.Speed;
        return acc;
      },
      { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    );
    const totalPower = totals.hp + totals.atk + totals.def + totals.spa + totals.spd + totals.spe;
    return { ...totals, totalPower };
  };

  const TeamStatComparison = ({ label, value1, value2 }) => {
    const diff = value1 - value2;
    const winner = diff > 0 ? 'left' : diff < 0 ? 'right' : 'tie';
    return (
      <div className="stat-comparison-row">
        <div className="stat-column">
          <span className={`stat-winner ${winner === 'left' ? 'active' : ''}`}>
            {value1}
          </span>
        </div>
        <div className="stat-label">{label}</div>
        <div className="stat-column">
          <span className={`stat-winner ${winner === 'right' ? 'active' : ''}`}>
            {value2}
          </span>
        </div>
      </div>
    );
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
        <p className="page-subtitle">Comparez des duels ou des equipes entieres</p>
      </div>

      <div className="comparison-mode">
        <button
          className={`mode-btn ${mode === 'duel' ? 'active' : ''}`}
          onClick={() => setMode('duel')}
        >
          <Swords size={18} /> Duel 1v1
        </button>
        <button
          className={`mode-btn ${mode === 'team' ? 'active' : ''}`}
          onClick={() => setMode('team')}
        >
          <Users size={18} /> Equipe 3v3
        </button>
      </div>

      {mode === 'duel' && (
        <>
          <div className="comparison-selection">
            {[0, 1].map(index => (
              <div key={index} className="selection-slot">
                {!selected[index] ? (
                  <div
                    className="slot-placeholder"
                    onClick={() => setActiveSlot(index)}
                  >
                    <div className="placeholder-icon"><Search size={40} /></div>
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

              <div className="comparison-winner">
                {selected[0].base.Attack > selected[1].base.Attack ? (
                  <span className="winner-text">🏆 {selected[0].name.english} est plus fort!</span>
                ) : selected[1].base.Attack > selected[0].base.Attack ? (
                  <span className="winner-text">🏆 {selected[1].name.english} est plus fort!</span>
                ) : (
                  <span className="winner-text">⚖️ Égalité parfaite!</span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {mode === 'team' && (
        <>
          <div className="team-battle-grid">
            <div className="team-panel">
              <div className="team-panel-header">
                <div>
                  <h3>Mon equipe</h3>
                  <p>{teamA.length}/3 depuis l accueil</p>
                </div>
              </div>
              {teamA.length === 0 ? (
                <div className="team-empty">Ajoutez 3 Pokemons dans l accueil</div>
              ) : (
                <div className="team-panel-list">
                  {teamA.map(member => (
                    <div key={member._id} className="team-card">
                      <img src={member.image} alt={member.name.english} />
                      <div className="team-card-content">
                        <h4>{member.name.english}</h4>
                        <div className="team-card-types">
                          {member.type.map((type, idx) => (
                            <span key={idx} className={`type-badge type-${type.toLowerCase()}`}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="team-panel">
              <div className="team-panel-header">
                <div>
                  <h3>Equipe adverse</h3>
                  <p>{teamB.length}/3 selectionnes</p>
                </div>
                {teamB.length > 0 && (
                  <button className="team-clear-btn" onClick={clearTeamB}>Vider</button>
                )}
              </div>
              <div className="team-search-container">
                <input
                  type="text"
                  placeholder="Chercher un Pokemon pour l equipe adverse..."
                  value={teamSearch}
                  onChange={e => setTeamSearch(e.target.value)}
                  className="comparison-search-input"
                />
                {teamFiltered.length > 0 && (
                  <div className="comparison-dropdown">
                    {teamFiltered.map(pokemon => (
                      <div
                        key={pokemon._id}
                        className="dropdown-item"
                        onClick={() => addToTeamB(pokemon)}
                      >
                        <img src={pokemon.image} alt={pokemon.name.english} />
                        <span>{pokemon.name.english}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {teamB.length === 0 ? (
                <div className="team-empty">Selectionnez 1 a 3 Pokemons</div>
              ) : (
                <div className="team-panel-list">
                  {teamB.map(member => (
                    <div key={member._id} className="team-card">
                      <img src={member.image} alt={member.name.english} />
                      <div className="team-card-content">
                        <h4>{member.name.english}</h4>
                        <div className="team-card-types">
                          {member.type.map((type, idx) => (
                            <span key={idx} className={`type-badge type-${type.toLowerCase()}`}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        className="team-remove-btn"
                        onClick={() => removeFromTeamB(member._id)}
                        title="Retirer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {teamA.length > 0 && teamB.length > 0 && (
            <div className="comparison-results team-results">
              <h2 className="comparison-title">Comparaison des equipes</h2>
              {(() => {
                const teamStatsA = getTeamStats(teamA);
                const teamStatsB = getTeamStats(teamB);
                const winner = teamStatsA.totalPower > teamStatsB.totalPower
                  ? 'A'
                  : teamStatsB.totalPower > teamStatsA.totalPower
                    ? 'B'
                    : 'tie';
                return (
                  <>
                    <div className="comparison-table">
                      <TeamStatComparison label="Total HP" value1={teamStatsA.hp} value2={teamStatsB.hp} />
                      <TeamStatComparison label="Total ATK" value1={teamStatsA.atk} value2={teamStatsB.atk} />
                      <TeamStatComparison label="Total DEF" value1={teamStatsA.def} value2={teamStatsB.def} />
                      <TeamStatComparison label="Total SPD" value1={teamStatsA.spe} value2={teamStatsB.spe} />
                      <TeamStatComparison label="Puissance totale" value1={teamStatsA.totalPower} value2={teamStatsB.totalPower} />
                    </div>
                    <div className="comparison-winner team-winner">
                      {winner === 'A' ? (
                        <span className="winner-text">🏆 Ton equipe prend l avantage!</span>
                      ) : winner === 'B' ? (
                        <span className="winner-text">🏆 L equipe adverse est plus forte!</span>
                      ) : (
                        <span className="winner-text">⚖️ Egalite parfaite!</span>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comparison;
