import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const AddPokemon = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    hp: '',
    cp: '',
    picture: '',
    types: ['']
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'hp' || name === 'cp' ? (value === '' ? '' : parseInt(value)) : value
    });
  };

  const handleTypeChange = (index, value) => {
    const newTypes = [...formData.types];
    newTypes[index] = value;
    setFormData({ ...formData, types: newTypes });
  };

  const addTypeField = () => {
    setFormData({
      ...formData,
      types: [...formData.types, '']
    });
  };

  const removeTypeField = (index) => {
    if (formData.types.length > 1) {
      const newTypes = formData.types.filter((_, i) => i !== index);
      setFormData({ ...formData, types: newTypes });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.hp || !formData.cp || !formData.picture || formData.types.some(t => !t)) {
      toast.error('Complétez tous les champs');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pokemons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la création');

      toast.success('Pokémon créé avec succès!');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la création du Pokémon');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Retour
      </button>

      <div className="add-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h1 className="form-main-title">Créer un nouveau Pokémon</h1>
            <p className="form-subtitle">Remplissez les informations ci-dessous</p>
          </div>

          <form onSubmit={handleSubmit} className="add-form">
            <div className="form-group">
              <label className="form-label">Nom du Pokémon</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Pikachu"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">HP</label>
                <input
                  type="number"
                  name="hp"
                  value={formData.hp}
                  onChange={handleInputChange}
                  placeholder="Ex: 100"
                  className="form-input"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">CP</label>
                <input
                  type="number"
                  name="cp"
                  value={formData.cp}
                  onChange={handleInputChange}
                  placeholder="Ex: 500"
                  className="form-input"
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">URL de l'image</label>
              <input
                type="text"
                name="picture"
                value={formData.picture}
                onChange={handleInputChange}
                placeholder="https://example.com/image.png"
                className="form-input"
              />
              {formData.picture && (
                <div className="image-preview">
                  <img src={formData.picture} alt="Aperçu" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Types</label>
              <div className="types-container">
                {formData.types.map((type, index) => (
                  <div key={index} className="type-input-group">
                    <input
                      type="text"
                      value={type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                      placeholder={`Type ${index + 1}`}
                      className="form-input"
                    />
                    {formData.types.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTypeField(index)}
                        className="btn-remove-type"
                        title="Supprimer ce type"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addTypeField}
                className="btn btn-secondary btn-add-type"
              >
                <Plus size={18} />
                Ajouter un type
              </button>
            </div>

            <div className="form-buttons-main">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-large"
              >
                {loading ? 'Création...' : 'Créer le Pokémon'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPokemon;
