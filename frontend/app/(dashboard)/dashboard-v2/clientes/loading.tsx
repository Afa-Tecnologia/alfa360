import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div>
          <Skeleton className="h-7 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-9 w-28 mb-4" />
      </div>

      <div className="space-y-6">
        {/* Estatísticas skeleton */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-12 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Conteúdo principal skeleton */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-6 w-36" />
            </CardTitle>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-9 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>

            {/* Tabela skeleton */}
            <div className="rounded-md border">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {Array(6)
                        .fill(null)
                        .map((_, i) => (
                          <th key={i} className="p-3">
                            <Skeleton className="h-4 w-full" />
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array(5)
                      .fill(null)
                      .map((_, i) => (
                        <tr key={i} className="border-b">
                          {Array(6)
                            .fill(null)
                            .map((_, j) => (
                              <td key={j} className="p-3">
                                <Skeleton className="h-5 w-full" />
                                {j === 0 && (
                                  <Skeleton className="h-3 w-12 mt-1" />
                                )}
                              </td>
                            ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
