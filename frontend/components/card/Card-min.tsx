import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ICardMin {
    children?: React.ReactElement;
    title?: string;
    value?: number;
    valueStyle?: string;
}

export default function CardMin(props: ICardMin) {
  return (
    <Card className=' min-w-[200px]'>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl ${props.valueStyle}`}>R$ {props.value}</p>
      </CardContent>
    </Card>
  );
};
