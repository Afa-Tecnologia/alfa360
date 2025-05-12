'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryStatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function CategoryStatsCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
}: CategoryStatsCardProps) {
  const variantStyles = {
    default: 'bg-card text-card-foreground',
    success: 'bg-green-500/10 text-green-700 border-green-200',
    warning: 'bg-orange-500/10 text-orange-700 border-orange-200',
    danger: 'bg-red-500/10 text-red-700 border-red-200',
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-green-600',
    warning: 'text-orange-600',
    danger: 'text-red-600',
  };

  return (
    <Card className={cn(variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('rounded-md p-2', iconStyles[variant])}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
