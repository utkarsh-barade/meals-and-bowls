import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customerService';
import Button from './Button';
import { Camera } from 'lucide-react';

export default function PhotoUpload({ customerId, currentPhotoUrl }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentPhotoUrl || null);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (fileToUpload) => customerService.uploadPhoto(customerId, fileToUpload),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['customer', customerId]);
      queryClient.invalidateQueries(['customers']);
      setPreview(data.data.photoUrl);
      setFile(null);
      setError(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to upload photo');
    },
  });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const photoSrc = preview 
    ? (preview.startsWith('blob:') ? preview : `${import.meta.env.VITE_API_BASE_URL || ''}${preview}`)
    : null;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative h-32 w-32 rounded-full border-4 border-white bg-surface-muted shadow-md overflow-hidden flex items-center justify-center">
        {photoSrc ? (
          <img src={photoSrc} alt="Customer" className="h-full w-full object-cover" />
        ) : (
          <Camera className="h-8 w-8 text-text-placeholder" />
        )}
      </div>

      <div className="flex flex-col items-center w-full space-y-2">
        <input
          type="file"
          accept="image/*"
          id="photo-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => document.getElementById('photo-upload').click()}
            disabled={uploadMutation.isPending}
          >
            Select Photo
          </Button>
          {file && (
            <Button
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          )}
        </div>
        
        {error && <p className="text-danger text-caption">{error}</p>}
      </div>
    </div>
  );
}
