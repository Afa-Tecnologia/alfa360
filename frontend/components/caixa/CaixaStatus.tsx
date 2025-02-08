import { useCaixaStore } from '@/stores/caixaStore';

export function CaixaStatus() {
  const { status } = useCaixaStore();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Status do Caixa</h2>

      {status.isOpen ? (
        <p className=" text-green-700 text-2xl">
          Caixa aberto (ID: ${status.id})
        </p>
      ) : (
        <p className=" text-red-600 text-2xl">Caixa Fechado</p>
      )}
    </div>
  );
}
