import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteClientProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  clientId: number;
  handleDelete: (clientId: number) => void;
}

export function DeleteClient({ isOpen, setIsOpen, clientId, handleDelete }: DeleteClientProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja deletar esse cliente?</AlertDialogTitle>
          <AlertDialogDescription>
          Esta ação não pode ser desfeita. Isso excluirá permanentemente a conta e removerá os dados dele no banco de dados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-800"
            onClick={() => {
              handleDelete(clientId); 
            }}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
