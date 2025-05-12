'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface UserStatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'blue' | 'purple' | 'danger';
}

export function UserStatsCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
}: UserStatsCardProps) {
  const variantStyles = {
    default: 'bg-card text-card-foreground',
    success: 'bg-green-500/10 text-green-700 border-green-200',
    blue: 'bg-blue-500/10 text-blue-700 border-blue-200',
    purple: 'bg-purple-500/10 text-purple-700 border-purple-200',
    danger: 'bg-red-500/10 text-red-700 border-red-200',
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
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
