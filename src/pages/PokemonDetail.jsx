import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, Edit2, Check, X, Globe } from 'lucide-react';
import StatsRadar from '../components/StatsRadar.jsx';
import DeleteModal from '../components/modals/DeleteModal';
import '../components/stats-radar.css';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const PokemonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeNameTab, setActiveNameTab] = useState('english');

  useEffect(() => {
    fetchPokemon();
  }, [id]);

  const fetchPokemon = async () => {
    try {
      const response = await fetch(`${API_URL}/pokemons/${id}`);
      if (!response.ok) throw new Error('Pokémon introuvable');
      
      const data = await response.json();
      setPokemon(data.data);
      setEditData(data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getPokemonName = () => {
    if (!pokemon) return '';
    if (pokemon.name && typeof pokemon.name === 'object') {
      return pokemon.name[activeNameTab] || pokemon.name.english || 'Unnamed';
    }
    return pokemon.name || 'Unnamed';
  };

  const getImageUrl = () => {
    return pokemon?.image || pokemon?.picture || 'https://via.placeholder.com/300';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  const handleBaseStatChange = (statName, value) => {
    setEditData({
      ...editData,
      base: {
        ...editData.base,
        [statName]: parseInt(value) || 0
      }
    });
  };

  const handleNameChange = (lang, value) => {
    setEditData({
      ...editData,
      name: {
        ...editData.name,
        [lang]: value
      }
    });
  };

  const handleTypeChange = (index, value) => {
    const newTypes = [...editData.type];
    newTypes[index] = value;
    setEditData({ ...editData, type: newTypes });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/pokemons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (!response.ok) throw new Error('Erreur de mise à jour');

      const data = await response.json();
      setPokemon(data.data);
      setIsEditing(false);
      toast.success('Pokémon mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/pokemons/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur de suppression');

      toast.success('Pokémon supprimé avec succès');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="detail-page">
        <div className="empty-state">
          <p>Pokémon non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="detail-container">
        <div className="detail-image-section">
          <div className="detail-image-wrapper">
            <img src={pokemon.picture} alt={pokemon.name} className="detail-image" />
          </div>
        </div>

        <div className="detail-content-section">
          {!isEditing ? (
            <>
              <h1 className="detail-title">{getPokemonName()}</h1>
              
              {typeof pokemon.name === 'object' && (
                <div className="pokemon-names-section">
                  <h3 className="names-title">
                    <Globe size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Noms dans le monde
                  </h3>
                  <div className="names-grid">
                    <div className="name-card">
                      <span className="name-card-lang">English</span>
                      <span className="name-card-text">{pokemon.name.english}</span>
                    </div>
                    <div className="name-card">
                      <span className="name-card-lang">日本語</span>
                      <span className="name-card-text">{pokemon.name.japanese || '-'}</span>
                    </div>
                    <div className="name-card">
                      <span className="name-card-lang">中文</span>
                      <span className="name-card-text">{pokemon.name.chinese || '-'}</span>
                    </div>
                    <div className="name-card">
                      <span className="name-card-lang">Français</span>
                      <span className="name-card-text">{pokemon.name.french || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="detail-types">
                {(pokemon.type || []).map((type, idx) => (
                  <span key={idx} className={`type-badge type-${type.toLowerCase()}`}>
                    {type}
                  </span>
                ))}
              </div>

              {pokemon.base && pokemon.base.HP !== undefined && (
                <StatsRadar stats={pokemon.base} />
              )}

              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={18} />
                  Modifier
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </div>
            </>
          ) : (
            <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <h2 className="form-title">Modifier le Pokémon</h2>
              
              {typeof editData.name === 'object' && (
                <div className="form-group">
                  <label>Noms</label>
                  <div className="names-edit-grid">
                    {['english', 'japanese', 'chinese', 'french'].map(lang => (
                      <div key={lang} className="form-group">
                        <label className="text-uppercase text-sm">{lang}</label>
                        <input
                          type="text"
                          value={editData.name?.[lang] || ''}
                          onChange={(e) => handleNameChange(lang, e.target.value)}
                          className="form-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Types</label>
                <div className="types-inputs">
                  {editData.type?.map((type, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={type}
                      onChange={(e) => handleTypeChange(idx, e.target.value)}
                      className="form-input type-input"
                      placeholder={`Type ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editData.image || ''}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Statistiques</label>
                <div className="stats-edit-grid">
                  {['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'].map(stat => (
                    <div key={stat} className="form-group">
                      <label className="text-sm">{stat}</label>
                      <input
                        type="number"
                        value={editData.base?.[stat] || 0}
                        onChange={(e) => handleBaseStatChange(stat, e.target.value)}
                        className="form-input"
                        min="0"
                        max="150"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-success">
                  <Check size={18} />
                  Sauvegarder
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(pokemon);
                  }}
                >
                  <X size={18} />
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          pokemonName={getPokemonName()}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default PokemonDetail;
