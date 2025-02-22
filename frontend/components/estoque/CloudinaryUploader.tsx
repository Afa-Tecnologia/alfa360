'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { UploadCloud, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { gerarNotificacao } from '@/utils/toast';
import { useProductStore } from '@/stores/createProductStore';
import { Product } from '@/types/product';

interface IImageUploaderProps {
  imageUrl?: string;
  product?: Product | any;
}
export default function ImageUploader(props: IImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    props.product?.image_url || null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { setImageUrl, imageUrl } = useProductStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
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
      console.log('URL da Imagem:', response.data.secure_url);
      setImageUrl(response.data.secure_url);
      handleRemoveImage();
    } catch (error) {
      gerarNotificacao('error', 'Falha ao enviar a imagem.');
      console.error('Erro ao enviar a imagem:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 mb-4">
      <div>
        <Label className="  text-base font-semibold">Imagem do produto</Label>
      </div>

      {imageUrl && (
        <div className="relative group">
        <Image
          src={imageUrl}
          alt="Pré-visualização"
          width={300}
          height={300}
          className="rounded-lg object-cover transition-opacity duration-300 group-hover:opacity-75"
        />
        <Button
          variant="ghost"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => setImageUrl(null)}
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </Button>
      </div>
      )}
      <div>
        {/** Quando o preview tiver preenchido e o estado da imagem vier vazio eu mostro o botao de upload */}
        {previewUrl && imageUrl == null ? (
          <div className="relative group">
            <Image
              src={previewUrl}
              alt="Pré-visualização"
              width={300}
              height={300}
              className="rounded-lg object-cover transition-opacity duration-300 group-hover:opacity-75"
            />
            <Button
              variant="ghost"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={handleRemoveImage}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
          </div>
        ) : imageUrl == null && (
          <div className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg">
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <Label htmlFor="imageUpload" className="cursor-pointer">
              Selecione uma imagem
            </Label>
            <Input
              type="file"
              id="imageUpload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}
      </div>
      {selectedImage && (
        <CardFooter className="flex flex-col gap-2">
          {uploading && <Progress value={uploadProgress} className="w-full" />}
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Enviando...' : 'Enviar Imagem'}
          </Button>
        </CardFooter>
      )}
    </div>
  );
}
