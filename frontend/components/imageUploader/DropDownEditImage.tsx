import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { gerarNotificacao } from '@/utils/toast';
import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { HiOutlinePencilSquare } from 'react-icons/hi2';

interface ResultsNextImage {
  info?: object;
  event?: string;
  uw_event?: boolean;
  data?: object;
}

export default function DropDownEditImage({ ...props }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ResultsNextImage>({});

  const updateUrlImages = (images: string[]) => {

  };

  const handleImageUpload = (data) => {
    setImageUrl(data?.secure_url);
    if(data?.event === 'success'){
      gerarNotificacao('success', 'Imagem enviada com sucesso')
    }
    if(data?.event === 'fail'){
      gerarNotificacao('error', 'Erro ao enviar imagem')
    }
  }

  useEffect(() =>{
    console.log('RESULTADO: '+ JSON.stringify(result))
    handleImageUpload(result);
  }, [result]);

  return (
    <CldUploadWidget uploadPreset="lesamis" onSuccess={() => gerarNotificacao('success', 'Imagem enviada com sucesso')}>
      {({ open, results }) => {
       setResult(results as ResultsNextImage);
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <HiOutlinePencilSquare size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Upload de imagens</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className=" text-blue-700" onClick={() => open()}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className=" text-red-600">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    </CldUploadWidget>
  );
}
