import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SalesStatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'blue' | 'purple';
}

export function SalesStatsCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
}: SalesStatsCardProps) {
  const variantStyles = {
    default: 'bg-card',
    success: 'bg-green-500/10',
    warning: 'bg-amber-500/10',
    danger: 'bg-red-500/10',
    blue: 'bg-blue-500/10',
    purple: 'bg-purple-500/10',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-green-500/20 text-green-600',
    warning: 'bg-amber-500/20 text-amber-600',
    danger: 'bg-red-500/20 text-red-600',
    blue: 'bg-blue-500/20 text-blue-600',
    purple: 'bg-purple-500/20 text-purple-600',
  };

  return (
    <Card className={cn('overflow-hidden', variantStyles[variant])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-1">
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            </div>
          </div>
          <div className={cn('p-2 rounded-full', iconStyles[variant])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
