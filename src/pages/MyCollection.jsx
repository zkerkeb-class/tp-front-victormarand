import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, Package } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const MyCollection = () => {
  const navigate = useNavigate();
  const [collection, setCollection] = useState(() => {
    const saved = localStorage.getItem('pokemonCollection');
    return saved ? JSON.parse(saved) : [];
  });
  const [collectionPokemons, setCollectionPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPokemons: 0,
    averageHP: 0,
    averageAttack: 0,
    totalStats: 0
  });

  useEffect(() => {
    fetchCollectionPokemons();
  }, [collection]);

  const fetchCollectionPokemons = async () => {
    setLoading(true);
    try {
      const pokemons = [];
      for (const id of collection) {
        const response = await fetch(`${API_URL}/pokemons/${id}`);
        if (response.ok) {
          const data = await response.json();
          pokemons.push(data.data);
        }
      }
      setCollectionPokemons(pokemons);
      calculateStats(pokemons);
    } catch (error) {
      toast.error('Erreur lors du chargement de la collection');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (pokemons) => {
    if (pokemons.length === 0) {
      setStats({
        totalPokemons: 0,
        averageHP: 0,
        averageAttack: 0,
        totalStats: 0
      });
      return;
    }

    const totalHP = pokemons.reduce((sum, p) => sum + p.base.HP, 0);
    const totalAttack = pokemons.reduce((sum, p) => sum + p.base.Attack, 0);
    const totalStats = pokemons.reduce((sum, p) => {
      return sum + p.base.HP + p.base.Attack + p.base.Defense + 
             p.base.SpecialAttack + p.base.SpecialDefense + p.base.Speed;
    }, 0);

    setStats({
      totalPokemons: pokemons.length,
      averageHP: Math.round(totalHP / pokemons.length),
      averageAttack: Math.round(totalAttack / pokemons.length),
      totalStats: totalStats
    });
  };

  const removeFromCollection = (pokemonId) => {
    const updated = collection.filter(id => id !== pokemonId);
    setCollection(updated);
    localStorage.setItem('pokemonCollection', JSON.stringify(updated));
    toast.success('Retiré de la collection');
  };

  const clearCollection = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vider votre collection complète ?')) {
      setCollection([]);
      setCollectionPokemons([]);
      localStorage.setItem('pokemonCollection', JSON.stringify([]));
      toast.success('Collection vidée');
    }
  };

  return (
    <div className="collection-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="page-header">
        <h1 className="page-title">📦 Ma Collection Pokédex</h1>
        <p className="page-subtitle">{collectionPokemons.length} Pokémon{collectionPokemons.length > 1 ? 's' : ''} dans ma collection</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de la collection...</p>
        </div>
      ) : collectionPokemons.length === 0 ? (
        <div className="empty-state">
          <Package size={64} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <p>Votre collection est vide</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Ajoutez des Pokémons à votre collection en cliquant sur le bouton 📦 sur chaque Pokémon</p>
        </div>
      ) : (
        <>
          {/* COLLECTION STATS */}
          <div className="collection-stats-grid">
            <div className="collection-stat-card stat-card-primary">
              <div className="stat-label">Pokémons</div>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{stats.totalPokemons}</div>
            </div>
            <div className="collection-stat-card stat-card-secondary">
              <div className="stat-label">HP Moyen</div>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{stats.averageHP}</div>
            </div>
            <div className="collection-stat-card stat-card-tertiary">
              <div className="stat-label">Attaque Moyenne</div>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{stats.averageAttack}</div>
            </div>
            <div className="collection-stat-card stat-card-quaternary">
              <div className="stat-label">Stats Totales</div>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>{stats.totalStats}</div>
            </div>
          </div>

          {/* COLLECTION GRID */}
          <div className="collection-container">
            <h2 className="section-title">Mes Pokémons</h2>
            <div className="collection-grid">
              {collectionPokemons.map((pokemon) => (
                <div key={pokemon._id} className="collection-card">
                  <div className="collection-card-image">
                    <img src={pokemon.image} alt={pokemon.name.english} />
                  </div>
                  <div className="collection-card-content">
                    <h3 className="collection-pokemon-name">{pokemon.name.english}</h3>
                    <div className="collection-pokemon-types">
                      {pokemon.type.map((type, idx) => (
                        <span key={idx} className={`type-badge type-${type.toLowerCase()}`}>
                          {type}
                        </span>
                      ))}
                    </div>
                    <div className="collection-pokemon-stats">
                      <div className="collection-stat">
                        <span className="label">HP</span>
                        <span className="value">{pokemon.base.HP}</span>
                      </div>
                      <div className="collection-stat">
                        <span className="label">ATK</span>
                        <span className="value">{pokemon.base.Attack}</span>
                      </div>
                      <div className="collection-stat">
                        <span className="label">DEF</span>
                        <span className="value">{pokemon.base.Defense}</span>
                      </div>
                    </div>
                    <button
                      className="remove-collection-btn"
                      onClick={() => removeFromCollection(pokemon._id)}
                      title="Retirer de la collection"
                    >
                      <Trash2 size={18} />
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {collectionPokemons.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                className="btn btn-danger"
                onClick={clearCollection}
              >
                <Trash2 size={18} />
                Vider ma collection
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCollection;
