import { Card } from '../ui/card';
import { TbNotebookOff } from 'react-icons/tb';

interface INodata {
  name: string;
}

export default function NoData(props: INodata) {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <Card className="p-6 flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-col gap-2 items-center justify-center">
          <p className="font-bold text-lg">
            Nenhum(a) {props.name} cadastrado(a) ainda
          </p>
          <p>Cadastre um novo(a) {props.name}</p>
        </div>
        <TbNotebookOff size={96} />
      </Card>
    </div>
  );
}
