'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  color?: 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'red';
  className?: string;
  index?: number;
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  isLoading = false,
  color = 'default',
  className,
  index = 0,
}: MetricCardProps) {
  // Definições de cores baseadas no parâmetro color
  const colorStyles = {
    default: '',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    green:
      'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    orange:
      'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    purple:
      'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  // Definições para o ícone de tendência
  const trendIconColor = trend?.isPositive
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className={cn('p-2 rounded-full', colorStyles[color])}>
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-7 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">{value}</div>

              {trend && (
                <Badge
                  variant="outline"
                  className={cn(
                    'ml-2 flex items-center gap-0.5',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {Math.abs(trend.value)}%
                </Badge>
              )}
            </div>
          )}

          {description && (
            <CardDescription className="mt-1 text-xs">
              {description}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
