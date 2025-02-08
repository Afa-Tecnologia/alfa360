// components/image-uploader.tsx
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { gerarNotificacao } from '@/utils/toast';
import { CldUploadWidget } from 'next-cloudinary';

interface VariantImages {
  [variantId: string]: {
    publicId: string;
    url: string;
  }[];
}

interface ImageUploaderProps {
  onUpload: (imagesData: VariantImages) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [variants, setVariants] = useState<VariantImages>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [currentVariant, setCurrentVariant] = useState<string>('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.webp', '.jpg'],
    },
    multiple: true,
    onDrop: async (acceptedFiles) => {
      if (!currentVariant) {
        gerarNotificacao(
          'error',
          'Selecione uma variante antes de enviar imagens'
        );
        return;
      }

      const uploadedUrls = [];
      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          // formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

          // const response = await axios.post(
          //   `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          //   formData,
          //   {
          //     auth: {
          //       username:process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? '',
          //       password:process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET ?? ''
          //     },
          //     onUploadProgress: (progressEvent) => {
          //       const percentCompleted = Math.round(
          //         (progressEvent.loaded * 100) / (progressEvent.total || 1)
          //       )
          //       setUploadProgress(percentCompleted)
          //     }
          //   }
          // )

          const response = uploadCloudinary(formData);

          uploadedUrls.push({
            publicId: response.data?.public_id,
            url: response.data?.secure_url,
          });
        } catch (error) {
          gerarNotificacao(
            'error',
            `Erro no upload da imagem ${(error as Error).message}`
          );
        }
      }

      setVariants((prev) => ({
        ...prev,
        [currentVariant]: [...(prev[currentVariant] || []), ...uploadedUrls],
      }));

      onUpload({
        ...variants,
        [currentVariant]: [
          ...(variants[currentVariant] || []),
          ...uploadedUrls,
        ],
      });
    },
  });

  const removeImage = (variantId: string, publicId: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantId]: prev[variantId].filter((img) => img.publicId !== publicId),
    }));
  };

  async function uploadCloudinary(image: FormData) {
    // Configuration
    cloudinary.config({
      cloud_name: 'delwujvnn',
      api_key: '945789625285179',
      api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRE, // Click 'View API Keys' above to copy your API secret
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(
        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
        {
          public_id: 'shoes',
        }
      )
      .catch((error) => {
        console.log(error);
      });

    console.log(uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
      fetch_format: 'auto',
      quality: 'auto',
    });

    console.log(optimizeUrl);

    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    console.log(autoCropUrl);
  }

  return (
    <Card className="border-none shadow-none">
      {/* <CardHeader>
        <CardTitle className="text-lg">Gerenciamento de Imagens</CardTitle>
      </CardHeader> */}

      <CardContent>
        <div className="space-y-6">
          {/* Variant Selector */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant={currentVariant === 'default' ? 'default' : 'outline'}
              onClick={() => setCurrentVariant('default')}
            >
              Variante Padrão
            </Button>
            <Button
              type="button"
              variant={currentVariant === 'color' ? 'default' : 'outline'}
              onClick={() => setCurrentVariant('color')}
            >
              Por Cor
            </Button>
          </div>

          {/* Upload Zone */}
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors "
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="font-medium">
                Arraste imagens ou clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground">
                Formatos suportados: JPEG, PNG, WEBP (Máx. 10MB por imagem)
              </p>
            </div>

            {uploadProgress > 0 && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm mt-2">Enviando... {uploadProgress}%</p>
              </div>
            )}
          </div>

          {/* Preview Grid
          <ScrollArea className="h-96 rounded-md border p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {variants[currentVariant]?.map((image) => (
                <div key={image.publicId} className="relative group">
                  <Image
                    src={image.url}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover aspect-square"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(currentVariant, image.publicId)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea> */}
        </div>
      </CardContent>
    </Card>
  );
}
