import { ArrowUpRight, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ScrollBar } from '../ui/scroll-area';
import { formatCurrency } from '@/utils/formatters';
import { useOrdersManagement } from '@/hooks/useOrdersManagement';
import { formatDateTime } from '../pages/clientes/format-data-time';
import { Skeleton } from '../ui/skeleton';

export function CardsVendas() {
  const { orders, loading } = useOrdersManagement({
    initialFilters: {
      limit: 10,
      startDate: new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    },
  });


  return loading ? (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Últimas Vendas</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Vendas mais recentes realizadas</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <div className="space-y-4">
            {orders?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center pb-3 border-b"
              >
                <div>
                  <p className="font-medium">{item.vendorName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDateTime(item.createdAt)}</span>
                    <span>•</span>
                    <span>status: {item.status}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">
                    {formatCurrency(item.total)}
                  </span>
                  <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
