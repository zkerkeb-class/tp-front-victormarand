import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const Statistics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPokemons: 0,
    averageHP: 0,
    averageCP: 0,
    typesCount: {},
    topPokemons: [],
    loading: true
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const pokemons = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`${API_URL}/pokemons?page=${page}`);
        if (!response.ok) throw new Error('Erreur API');
        
        const data = await response.json();
        pokemons.push(...data.data);
        
        if (page >= data.totalPages) hasMore = false;
        page++;
      }

      const totalPokemons = pokemons.length;
      const averageHP = Math.round(pokemons.reduce((sum, p) => sum + p.hp, 0) / totalPokemons);
      const averageCP = Math.round(pokemons.reduce((sum, p) => sum + p.cp, 0) / totalPokemons);

      const typesCount = {};
      pokemons.forEach(p => {
        p.types.forEach(type => {
          typesCount[type] = (typesCount[type] || 0) + 1;
        });
      });

      const topPokemons = [...pokemons]
        .sort((a, b) => b.cp - a.cp)
        .slice(0, 5);

      setStats({
        totalPokemons,
        averageHP,
        averageCP,
        typesCount,
        topPokemons,
        loading: false
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
      console.error(error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const sortedTypes = Object.entries(stats.typesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxTypeCount = Math.max(...Object.values(stats.typesCount), 1);

  return (
    <div className="stats-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Retour
      </button>

      <div className="page-header">
        <h1 className="page-title">📊 Statistiques Pokédex</h1>
        <p className="page-subtitle">Analyse complète de votre collection</p>
      </div>

      {stats.loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Calcul des statistiques...</p>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon">
                <Users size={32} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Pokémons</p>
                <p className="stat-value">{stats.totalPokemons}</p>
              </div>
            </div>

            <div className="stat-card stat-card-secondary">
              <div className="stat-icon">
                <BarChart3 size={32} />
              </div>
              <div className="stat-content">
                <p className="stat-label">HP Moyen</p>
                <p className="stat-value">{stats.averageHP}</p>
              </div>
            </div>

            <div className="stat-card stat-card-tertiary">
              <div className="stat-icon">
                <Zap size={32} />
              </div>
              <div className="stat-content">
                <p className="stat-label">CP Moyen</p>
                <p className="stat-value">{stats.averageCP}</p>
              </div>
            </div>

            <div className="stat-card stat-card-quaternary">
              <div className="stat-icon">
                <TrendingUp size={32} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Types Différents</p>
                <p className="stat-value">{Object.keys(stats.typesCount).length}</p>
              </div>
            </div>
          </div>

          {/* TYPES DISTRIBUTION */}
          <div className="stats-container">
            <h2 className="section-title">Types les plus courants</h2>
            <div className="types-distribution">
              {sortedTypes.map(([type, count]) => (
                <div key={type} className="type-distribution-item">
                  <div className="type-header">
                    <span className={`type-badge type-${type.toLowerCase()}`}>{type}</span>
                    <span className="type-count">{count}</span>
                  </div>
                  <div className="type-bar-container">
                    <div
                      className="type-bar"
                      style={{
                        width: `${(count / maxTypeCount) * 100}%`,
                        background: `linear-gradient(90deg, #4f46e5, #7c3aed)`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP POKEMONS */}
          <div className="stats-container">
            <h2 className="section-title">🏆 Top 5 Pokémons (CP)</h2>
            <div className="top-pokemons-list">
              {stats.topPokemons.map((pokemon, idx) => (
                <div key={pokemon._id} className="top-pokemon-item">
                  <div className="rank-badge">{idx + 1}</div>
                  <div className="pokemon-info">
                    <h4 className="pokemon-rank-name">{pokemon.name}</h4>
                    <div className="pokemon-rank-types">
                      {pokemon.types.map((type, i) => (
                        <span key={i} className={`type-badge type-${type.toLowerCase()}`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pokemon-rank-stats">
                    <div className="rank-stat">
                      <span className="rank-stat-label">HP</span>
                      <span className="rank-stat-value">{pokemon.hp}</span>
                    </div>
                    <div className="rank-stat">
                      <span className="rank-stat-label">CP</span>
                      <span className="rank-stat-value">{pokemon.cp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
