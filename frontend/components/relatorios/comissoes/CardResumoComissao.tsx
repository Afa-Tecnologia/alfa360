'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface CardResumoComissaoProps {
  title: string;
  description: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  titleColor: string;
  descriptionColor: string;
  valueColor: string;
  subtitleColor: string;
}

export function CardResumoComissao({
  title,
  description,
  value,
  subtitle,
  icon,
  gradientFrom,
  gradientTo,
  borderColor,
  titleColor,
  descriptionColor,
  valueColor,
  subtitleColor,
}: CardResumoComissaoProps) {
  return (
    <Card
      className={`bg-gradient-to-br from-${gradientFrom} to-${gradientTo} border-${borderColor}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`${titleColor} text-sm font-medium`}>
              {title}
            </CardTitle>
            <CardDescription className={descriptionColor}>
              {description}
            </CardDescription>
          </div>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <p className={`text-xs ${subtitleColor} mt-1`}>{subtitle}</p>
      </CardContent>
    </Card>
  );
}
