import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import './pages.css';

const API_URL = 'http://localhost:3000/api';

const AddPokemon = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: {
      english: '',
      japanese: '',
      chinese: '',
      french: ''
    },
    type: [''],
    base: {
      HP: '',
      Attack: '',
      Defense: '',
      SpecialAttack: '',
      SpecialDefense: '',
      Speed: ''
    },
    image: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('name_')) {
      const lang = name.split('_')[1];
      setFormData({
        ...formData,
        name: { ...formData.name, [lang]: value }
      });
    } else if (name.startsWith('base_')) {
      const stat = name.split('_')[1];
      setFormData({
        ...formData,
        base: { ...formData.base, [stat]: value === '' ? '' : parseInt(value) }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTypeChange = (index, value) => {
    const newTypes = [...formData.type];
    newTypes[index] = value;
    setFormData({ ...formData, type: newTypes });
  };

  const addTypeField = () => {
    setFormData({
      ...formData,
      type: [...formData.type, '']
    });
  };

  const removeTypeField = (index) => {
    if (formData.type.length > 1) {
      const newTypes = formData.type.filter((_, i) => i !== index);
      setFormData({ ...formData, type: newTypes });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.english || !formData.base.HP || !formData.base.Attack || !formData.image || formData.type.some(t => !t)) {
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
            <fieldset className="form-fieldset">
              <legend className="form-fieldset-legend">Noms Multilingues</legend>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Anglais</label>
                  <input
                    type="text"
                    name="name_english"
                    value={formData.name.english}
                    onChange={handleInputChange}
                    placeholder="Ex: Pikachu"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Japonais</label>
                  <input
                    type="text"
                    name="name_japanese"
                    value={formData.name.japanese}
                    onChange={handleInputChange}
                    placeholder="Ex: ピカチュウ"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chinois</label>
                  <input
                    type="text"
                    name="name_chinese"
                    value={formData.name.chinese}
                    onChange={handleInputChange}
                    placeholder="Ex: 皮卡丘"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Français</label>
                  <input
                    type="text"
                    name="name_french"
                    value={formData.name.french}
                    onChange={handleInputChange}
                    placeholder="Ex: Pikachu"
                    className="form-input"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="form-fieldset">
              <legend className="form-fieldset-legend">Statistiques de Base</legend>
              <div className="stats-grid">
                <div className="form-group">
                  <label className="form-label">HP</label>
                  <input
                    type="number"
                    name="base_HP"
                    value={formData.base.HP}
                    onChange={handleInputChange}
                    placeholder="Ex: 35"
                    className="form-input"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Attaque</label>
                  <input
                    type="number"
                    name="base_Attack"
                    value={formData.base.Attack}
                    onChange={handleInputChange}
                    placeholder="Ex: 55"
                    className="form-input"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Défense</label>
                  <input
                    type="number"
                    name="base_Defense"
                    value={formData.base.Defense}
                    onChange={handleInputChange}
                    placeholder="Ex: 40"
                    className="form-input"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Atk. Spé</label>
                  <input
                    type="number"
                    name="base_SpecialAttack"
                    value={formData.base.SpecialAttack}
                    onChange={handleInputChange}
                    placeholder="Ex: 50"
                    className="form-input"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Déf. Spé</label>
                  <input
                    type="number"
                    name="base_SpecialDefense"
                    value={formData.base.SpecialDefense}
                    onChange={handleInputChange}
                    placeholder="Ex: 50"
                    className="form-input"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Vitesse</label>
                  <input
                    type="number"
                    name="base_Speed"
                    value={formData.base.Speed}
                    onChange={handleInputChange}
                    placeholder="Ex: 90"
                    className="form-input"
                    min="1"
                  />
                </div>
              </div>
            </fieldset>

            <div className="form-group">
              <label className="form-label">URL de l'image</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.png"
                className="form-input"
              />
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Aperçu" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Types</label>
              <div className="types-container">
                {formData.type.map((type, index) => (
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
