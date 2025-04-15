import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function CurrencyInput({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  description?: string;
}) {
  const [displayValue, setDisplayValue] = useState<string>('0,00');

  // Converte o valor do formato interno (123.45) para o formato de exibição (123,45)
  const formatToDisplay = (value: number): string => {
    return value.toFixed(2).replace('.', ',');
  };


  useEffect(() => {
    // Inicialização do valor local
    if (typeof value === 'number' && !isNaN(value)) {
      setDisplayValue(formatToDisplay(value));
    } else {
      setDisplayValue('0,00');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Obtém apenas os dígitos da entrada
    const digits = e.target.value.replace(/\D/g, '');

    // Converte para centavos (multiplicado por 0.01 para obter o valor em reais)
    const valueInCents = parseInt(digits || '0');
    const valueInReais = valueInCents * 0.01;

    // Formata o número para ter sempre duas casas decimais
    const formattedValue = formatToDisplay(valueInReais);

    // Atualiza o estado e notifica o componente pai
    setDisplayValue(formattedValue);
    onChange(valueInReais);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-base font-semibold">{label}</Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          R$
        </span>
        <Input
          type="text"
          className="pl-8"
          value={displayValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
