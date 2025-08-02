import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: number;
  label: string;
}

interface MultiSelectVariantsProps {
  options: Option[];
  value: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
}

export const MultiSelectVariants: React.FC<MultiSelectVariantsProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const selectedLabels = options
    .filter((opt) => value.includes(opt.value))
    .map((opt) => opt.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">
            {selectedLabels.length > 0
              ? selectedLabels.join(', ')
              : placeholder || 'Selecione...'}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto max-w-[90vw] p-2">
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-muted"
            >
              <Checkbox
                checked={value.includes(opt.value)}
                onCheckedChange={() => handleToggle(opt.value)}
              />
              <span className="truncate">{opt.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
