'use client';
import React, { useEffect, useState, useCallback } from 'react';
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

export default function ImageUploader({
  variantId,
  images = [],
  onUpload,
}: IImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedImages, setProcessedImages] = useState<string[]>([]);

  const normalizeImages = useCallback((inputImages: any): string[] => {
    if (Array.isArray(inputImages)) {
      return inputImages;
    } else if (typeof inputImages === 'string') {
      try {
        // Tenta fazer parse se for string JSON
        const parsed = JSON.parse(inputImages);
        return Array.isArray(parsed) ? parsed : [inputImages];
      } catch (e) {
        // Se não conseguir fazer parse, trata como uma única URL
        return [inputImages];
      }
    }
    return [];
  }, []);

  // Inicializa as imagens processadas quando o componente é montado ou as imagens mudam
  useEffect(() => {
    const normalizedImages = normalizeImages(images);
    console.log(
      `CloudinaryUploader (ID: ${variantId}) - Inicializando imagens:`,
      normalizedImages
    );
    setProcessedImages(normalizedImages);
  }, [images, variantId, normalizeImages]);

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
    const updatedImages = processedImages.filter((img) => img !== imageUrl);
    setProcessedImages(updatedImages);
    onUpload(variantId, updatedImages);
    console.log(
      `Notificação enviada ao componente pai - Novas imagens:`,
      updatedImages
    );
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

      // Atualiza o estado local primeiro com a nova imagem
      const updatedImages = [...processedImages, newImageUrl];
      console.log(
        `CloudinaryUploader (ID: ${variantId}) - Adicionando nova imagem:`,
        newImageUrl
      );
      console.log(`Imagens após adição:`, updatedImages);

      setProcessedImages(updatedImages);

      // Notifica o componente pai
      setTimeout(() => {
        onUpload(variantId, updatedImages);
        console.log(
          `Notificação enviada ao componente pai após upload - Novas imagens:`,
          updatedImages
        );
        gerarNotificacao('success', 'Imagem enviada com sucesso!');
      }, 0);

      // Limpa o preview
      handleCancelPreview();
    } catch (error) {
      console.error('Erro ao enviar a imagem:', error);
      gerarNotificacao('error', 'Falha ao enviar a imagem.');
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
        {Array.isArray(processedImages) &&
          processedImages.map((imageUrl, index) => {
            const cleanedUrl = cleanUrl(imageUrl) || '';
            return (
              <div
                key={`${index}-${cleanedUrl.slice(-8)}`}
                className="relative group"
              >
                <Image
                  src={cleanedUrl}
                  alt={`Produto ${index + 1}`}
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
            );
          })}
        {!selectedImage && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-center">
              <Label
                htmlFor={`imageUpload-${variantId}`}
                className="cursor-pointer"
              >
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
              unoptimized
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
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? 'Enviando...' : 'Confirmar Upload'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelPreview}
              disabled={uploading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
