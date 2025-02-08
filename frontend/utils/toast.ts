import { toast } from 'react-toastify';
export function gerarNotificacao(tipo: string, msg: string) {
  const toastId = 'toast-sucess-id';
  if (tipo == 'success') {
    toast.success(msg, {
      toastId: toastId,
      position: 'top-center',
      autoClose: 2000,
    });
  }
  if (tipo == 'error') {
    toast.error(msg, {
      toastId: toastId,
      position: 'top-center',
      autoClose: 2000,
    });
  }
}
