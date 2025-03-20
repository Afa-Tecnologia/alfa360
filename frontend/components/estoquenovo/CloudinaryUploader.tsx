
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import axios from 'axios';
// import { UploadCloud, Trash2, Plus, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Progress } from '@/components/ui/progress';
// import { gerarNotificacao } from '@/utils/toast';
// import { cleanUrl } from './utils/replaceImagesUrl';

// interface IImageUploaderProps {
//   images?: string[];
//   onUpload: (urls: string[]) => void;
// }

// export default function ImageUploader({ images = [], onUpload }: IImageUploaderProps) {
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [productImages, setProductImages] = useState(images)

//   useEffect(() =>{
//     console.log('images no form'+images)
//   },[images])

//   useEffect(() => {
//     // Cleanup preview URL when component unmounts or when selected image changes
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedImage(file);
//       // Create preview URL for the selected image
//       const preview = URL.createObjectURL(file);
//       setPreviewUrl(preview);
//     }
//   };

//   const handleRemoveImage = (imageUrl: string) => {
//     const updatedImages = images.filter(img => img !== imageUrl);
//     onUpload(updatedImages);
//   };

//   const handleCancelPreview = () => {
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//     }
//     setSelectedImage(null);
//     setPreviewUrl(null);
//     setUploadProgress(0);
//   };

//   const handleUpload = async () => {
//     if (!selectedImage) return;
//     setUploading(true);

//     const formData = new FormData();
//     formData.append('file', selectedImage);
//     formData.append(
//       'upload_preset',
//       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
//     );

//     try {
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round(
//               (progressEvent.loaded * 100) / (progressEvent.total || 1)
//             );
//             setUploadProgress(progress);
//           },
//         }
//       );
//       gerarNotificacao('success', 'Imagem enviada com sucesso!');
//       const newImageUrl = response.data.secure_url;
//       console.log('URL IMAGEM FEITA UPLOAD ' +newImageUrl)
//       onUpload([...images, newImageUrl]);
//       handleCancelPreview();
//     } catch (error) {
//       gerarNotificacao('error', 'Falha ao enviar a imagem.');
//       console.error('Erro ao enviar a imagem:', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="w-full space-y-4">
//       <div className="flex items-center gap-2">
//         <Label className="text-sm font-medium">Imagens do produto</Label>
//       </div>

//       <div className="grid grid-cols-4 gap-2">
//         {Array.isArray(images) && images.map((imageUrl, index) => (
//           <div key={index} className="relative group">
//             <Image
//               src={cleanUrl(imageUrl)}
//               alt={`Produto ${index + 1}`}
//               width={100}
//               height={100}
//               className="rounded-lg object-cover w-full h-24"
//             />
//             <Button
//               variant="destructive"
//               size="icon"
//               className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
//               onClick={() => handleRemoveImage(cleanUrl(imageUrl))}
//             >
//               <Trash2 className="h-4 w-4" />
//             </Button>
//           </div>
//         ))}
//         {!selectedImage && (
//           <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
//             <div className="text-center">
//               <Label htmlFor="imageUpload" className="cursor-pointer">
//                 <Plus className="mx-auto h-6 w-6 text-muted-foreground" />
//                 <span className="sr-only">Adicionar imagem</span>
//               </Label>
//               <Input
//                 type="file"
//                 id="imageUpload"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedImage && previewUrl && (
//         <div className="space-y-4">
//           <div className="relative">
//             <Image
//               src={previewUrl}
//               alt="Preview"
//               width={200}
//               height={200}
//               className="rounded-lg object-cover w-full h-40"
//             />
//             <Button
//               variant="destructive"
//               size="icon"
//               className="absolute top-2 right-2 h-6 w-6"
//               onClick={handleCancelPreview}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//           {uploading && <Progress value={uploadProgress} className="w-full" />}
//           <div className="flex gap-2">
//             <Button onClick={handleUpload} disabled={uploading} className="flex-1">
//               {uploading ? 'Enviando...' : 'Confirmar Upload'}
//             </Button>
//             <Button variant="outline" onClick={handleCancelPreview} disabled={uploading}>
//               Cancelar
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { UploadCloud, Trash2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { gerarNotificacao } from '@/utils/toast';
import { cleanUrl } from './utils/replaceImagesUrl';

interface IImageUploaderProps {
  variantId: number;
  images?: string[];
  onUpload: (variantId: number, urls: string[]) => void;
}

export default function ImageUploader({ variantId, images = [], onUpload }: IImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    const updatedImages = images.filter(img => img !== imageUrl);
    onUpload(variantId, updatedImages);
  };

  const handleCancelPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(progress);
          },
        }
      );
      gerarNotificacao('success', 'Imagem enviada com sucesso!');
      const newImageUrl = response.data.secure_url;
      onUpload(variantId, [...images, newImageUrl]);
      handleCancelPreview();
    } catch (error) {
      gerarNotificacao('error', 'Falha ao enviar a imagem.');
      console.error('Erro ao enviar a imagem:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">Imagens do produto</Label>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Array.isArray(images) && images.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <Image
              src={cleanUrl(imageUrl)}
              alt={`Produto ${index + 1}`}
              width={100}
              height={100}
              className="rounded-lg object-cover w-full h-24"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(cleanUrl(imageUrl))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {!selectedImage && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <Label htmlFor={`imageUpload-${variantId}`} className="cursor-pointer">
                <Plus className="mx-auto h-6 w-6 text-muted-foreground" />
                <span className="sr-only">Adicionar imagem</span>
              </Label>
              <Input
                type="file"
                id={`imageUpload-${variantId}`}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        )}
      </div>

      {selectedImage && previewUrl && (
        <div className="space-y-4">
          <div className="relative">
            <Image
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full h-40"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleCancelPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {uploading && <Progress value={uploadProgress} className="w-full" />}
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={uploading} className="flex-1">
              {uploading ? 'Enviando...' : 'Confirmar Upload'}
            </Button>
            <Button variant="outline" onClick={handleCancelPreview} disabled={uploading}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}