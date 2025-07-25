import { toast } from 'react-toastify';
export function gerarNotificacao(tipo: string, msg: string, time?: any) {
  const toastId = 'toast-sucess-id';
  if (tipo == 'success') {
    toast.success(msg, {
      toastId: toastId,
      position: 'top-center',
      autoClose: time || 2000,
    });
  }
  if (tipo == 'error') {
    toast.error(msg, {
      toastId: toastId,
      position: 'top-center',
      autoClose: time || 2000,
    });
  }
}
