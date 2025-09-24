import React, { useState } from 'react';
import { X, Upload, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

interface PhotoGalleryProps {
  catId: string;
  catName: string;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  catName,
  photos,
  onPhotosChange
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const newPhotos: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }
        
        // Convert to base64 for storage
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        newPhotos.push(base64);
      }
      
      if (newPhotos.length > 0) {
        onPhotosChange([...photos, ...newPhotos]);
        toast.success(`${newPhotos.length} photo(s) added successfully!`);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    toast.success('Photo removed');
  };

  const openPhotoModal = (index: number) => {
    // Create a simple modal for viewing photos
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="relative max-w-4xl max-h-full p-4">
        <button class="absolute top-4 right-4 text-white hover:text-gray-300 z-10" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img src="${photos[index]}" alt="${catName}" class="max-w-full max-h-full object-contain rounded-lg">
        <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
          <p class="text-lg font-medium">${catName}</p>
          <p class="text-sm opacity-75">Photo ${index + 1} of ${photos.length}</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Photo Gallery
        </h3>
        <label className="btn-primary flex items-center space-x-2 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Add Photos</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No photos yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click "Add Photos" to upload images of {catName}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`${catName} photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openPhotoModal(index)}
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view full size
              </div>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-primary-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span>Uploading photos...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
