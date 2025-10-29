import React, { useState } from 'react';
import { useCatContext } from '../contexts/CatContext';
import { Cat, Plus, Edit, Trash2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import PhotoGallery from '../components/PhotoGallery';

const CatProfiles: React.FC = () => {
  const { state, addCat, updateCat, deleteCat } = useCatContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [showPhotoGallery, setShowPhotoGallery] = useState<string | null>(null);
  // Load saved form data from localStorage
  const getSavedFormData = () => {
    const saved = localStorage.getItem('catFormData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log('Failed to parse saved cat form data');
      }
    }
    return {
      name: '',
      breed: '',
      customBreed: '',
      age: '',
      weight: '',
      color: '',
      microchip: '',
    };
  };

  const [formData, setFormData] = useState(getSavedFormData());

  // Save form data to localStorage whenever it changes
  const updateFormData = (newData: Partial<typeof formData>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    localStorage.setItem('catFormData', JSON.stringify(updatedData));
  };

  // Common cat breeds for dropdown
  const catBreeds = [
    'Persian',
    'Maine Coon',
    'Siamese',
    'Ragdoll',
    'British Shorthair',
    'Abyssinian',
    'Russian Blue',
    'Bengal',
    'Sphynx',
    'Norwegian Forest Cat',
    'American Shorthair',
    'Scottish Fold',
    'Birman',
    'Oriental Shorthair',
    'Exotic Shorthair',
    'Turkish Van',
    'Himalayan',
    'Burmese',
    'Chartreux',
    'Somali',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.age || !formData.weight || !formData.color) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Use custom breed if "Other" is selected
    const finalBreed = formData.breed === 'Other' ? formData.customBreed : formData.breed;
    
    if (formData.breed === 'Other' && !formData.customBreed.trim()) {
      toast.error('Please specify the breed name');
      return;
    }

    addCat({
      name: formData.name,
      breed: finalBreed,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      color: formData.color,
      microchip: formData.microchip || undefined,
    });

    // Clear saved form data after successful submission
    localStorage.removeItem('catFormData');
    setFormData({
      name: '',
      breed: '',
      customBreed: '',
      age: '',
      weight: '',
      color: '',
      microchip: '',
    });
    setShowAddForm(false);
    toast.success('Cat profile created successfully!');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteCat(id);
      toast.success('Cat profile deleted successfully!');
    }
  };

  const handleEdit = (cat: any) => {
    setEditingCat(cat.id);
    setFormData({
      name: cat.name,
      breed: cat.breed,
      customBreed: '',
      age: cat.age.toString(),
      weight: cat.weight.toString(),
      color: cat.color,
      microchip: cat.microchip || '',
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.age || !formData.weight || !formData.color) {
      toast.error('Please fill in all required fields');
      return;
    }

    const finalBreed = formData.breed === 'Other' ? formData.customBreed : formData.breed;
    
    if (formData.breed === 'Other' && !formData.customBreed.trim()) {
      toast.error('Please specify the breed name');
      return;
    }

    const cat = state.cats.find(c => c.id === editingCat);
    if (!cat) return;

    updateCat({
      ...cat,
      name: formData.name,
      breed: finalBreed,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      color: formData.color,
      microchip: formData.microchip || undefined,
    });

    setEditingCat(null);
    setFormData({
      name: '',
      breed: '',
      customBreed: '',
      age: '',
      weight: '',
      color: '',
      microchip: '',
    });
    toast.success('Cat profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      breed: '',
      customBreed: '',
      age: '',
      weight: '',
      color: '',
      microchip: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cat Profiles</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your cat's information and details</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cat</span>
        </button>
      </div>

      {/* Add Cat Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Cat</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="input-field"
                  placeholder="Enter cat's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breed *
                </label>
                <select
                  value={formData.breed}
                  onChange={(e) => updateFormData({ breed: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select a breed</option>
                  {catBreeds.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
              </div>

              {formData.breed === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specify Breed Name *
                  </label>
                  <input
                    type="text"
                    value={formData.customBreed}
                    onChange={(e) => updateFormData({ customBreed: e.target.value })}
                    className="input-field"
                    placeholder="Enter the breed name"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age (years) *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData({ age: e.target.value })}
                    className="input-field"
                    placeholder="Age"
                    min="0"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.weight}
                    onChange={(e) => updateFormData({ weight: e.target.value })}
                    className="input-field"
                    placeholder="Weight"
                    min="0"
                    max="20"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => updateFormData({ color: e.target.value })}
                  className="input-field"
                  placeholder="Enter color"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Microchip Number
                </label>
                <input
                  type="text"
                  value={formData.microchip}
                  onChange={(e) => updateFormData({ microchip: e.target.value })}
                  className="input-field"
                  placeholder="Microchip number (optional)"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add Cat
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cat Cards */}
      {state.cats.length === 0 ? (
        <div className="text-center py-12">
          <Cat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cats yet</h3>
          <p className="text-gray-500 mb-4">Add your first cat to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Cat
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.cats.map((cat) => (
            <div key={cat.id} className="card">
              {editingCat === cat.id ? (
                // Edit form inline
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Cat Profile</h3>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field w-full"
                      placeholder="Enter cat's name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Breed *
                    </label>
                    <select
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      className="input-field w-full"
                    >
                      <option value="">Select a breed</option>
                      {catBreeds.map((breed) => (
                        <option key={breed} value={breed}>
                          {breed}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.breed === 'Other' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specify Breed Name *
                      </label>
                      <input
                        type="text"
                        value={formData.customBreed}
                        onChange={(e) => setFormData({ ...formData, customBreed: e.target.value })}
                        className="input-field w-full"
                        placeholder="Enter the breed name"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age (years) *
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="input-field w-full"
                        placeholder="Age"
                        min="0"
                        max="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg) *
                      </label>
                      <input
                      type="number"
                      step="any"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="input-field w-full"
                        placeholder="Weight"
                        min="0"
                        max="20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color *
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="input-field w-full"
                      placeholder="Enter color"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Microchip Number
                    </label>
                    <input
                      type="text"
                      value={formData.microchip}
                      onChange={(e) => setFormData({ ...formData, microchip: e.target.value })}
                      className="input-field w-full"
                      placeholder="Microchip number (optional)"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      Update Cat
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // Display mode
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Cat className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                        <p className="text-sm text-gray-500">{cat.breed}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setShowPhotoGallery(cat.id)}
                        className="p-1 text-gray-400 hover:text-green-600"
                        title="Photo Gallery"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(cat)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit Cat"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Delete Cat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Age:</span>
                      <span className="text-sm font-medium">{cat.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Weight:</span>
                      <span className="text-sm font-medium">{cat.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Color:</span>
                      <span className="text-sm font-medium">{cat.color}</span>
                    </div>
                    {cat.microchip && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Microchip:</span>
                        <span className="text-sm font-medium">{cat.microchip}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Photo Gallery Modal */}
      {showPhotoGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Photo Gallery
              </h2>
              <button
                onClick={() => setShowPhotoGallery(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            {(() => {
              const cat = state.cats.find(c => c.id === showPhotoGallery);
              if (!cat) return null;
              
              return (
                <PhotoGallery
                  catId={cat.id}
                  catName={cat.name}
                  photos={cat.photos || []}
                  onPhotosChange={(photos) => {
                    updateCat({ ...cat, photos });
                  }}
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatProfiles; 