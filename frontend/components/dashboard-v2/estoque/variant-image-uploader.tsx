'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { UploadCloud, Trash2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface VariantImageUploaderProps {
  initialImages?: string[];
  onChange: (urls: string[]) => void;
}

export function VariantImageUploader({
  initialImages = [],
  onChange,
}: VariantImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const { toast } = useToast();

  // Gerar um ID único para este uploader
  const uploaderId = useCallback(
    () => `imageUpload-${Math.random().toString(36).substr(2, 9)}`,
    []
  )();

  // Inicializa as imagens quando o componente é montado ou as imagens iniciais mudam
  useEffect(() => {
    let normalizedImages = [];
    
    // Verifica se initialImages existe e é um array
    if (initialImages) {
      if (Array.isArray(initialImages)) {
        normalizedImages = initialImages;
      } else if (typeof initialImages === 'string') {
        try {
          // Tenta fazer parse se for string JSON
          const parsed = JSON.parse(initialImages);
          normalizedImages = Array.isArray(parsed) ? parsed : [initialImages];
        } catch (e) {
          // Se não conseguir fazer parse, trata como uma única URL
          normalizedImages = [initialImages];
        }
      }
    }
    
    // Filtra valores null/undefined e strings vazias
    normalizedImages = normalizedImages.filter(img => img && img.trim() !== '');
    
    setImages(normalizedImages);
  }, [initialImages]);

  // Limpa objetos URL quando o componente é desmontado
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
    const updatedImages = images.filter((img) => img !== imageUrl);
    setImages(updatedImages);
    onChange(updatedImages);
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

      const newImageUrl = response.data.secure_url;

      // Atualiza o estado local e notifica o componente pai
      const updatedImages = [...images, newImageUrl];
      setImages(updatedImages);
      onChange(updatedImages);

      toast({
        title: 'Imagem carregada',
        description: 'A imagem foi enviada com sucesso.',
      });

      // Limpa o preview
      handleCancelPreview();
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      toast({
        title: 'Erro ao enviar imagem',
        description: 'Não foi possível enviar a imagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {images.map((imageUrl, index) => (
          <div
            key={`${index}-${imageUrl.slice(-8)}`}
            className="relative group"
          >
            <Image
              src={imageUrl}
              alt={`Imagem ${index + 1}`}
              width={100}
              height={100}
              className="rounded-lg object-cover w-full h-24"
              unoptimized
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {!selectedImage ? (
          <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <Label htmlFor={uploaderId} className="cursor-pointer">
                <Plus className="mx-auto h-6 w-6 text-muted-foreground" />
                <span className="sr-only">Adicionar imagem</span>
              </Label>
              <Input
                type="file"
                id={uploaderId}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative h-24 rounded-lg overflow-hidden">
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <div className="absolute top-1 right-1 flex space-x-1">
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6"
                onClick={handleCancelPreview}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploading ? (
              <div className="mt-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-center mt-1">{uploadProgress}%</p>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleUpload}
                className="w-full mt-2 flex items-center gap-1"
              >
                <UploadCloud className="h-4 w-4" />
                Enviar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
