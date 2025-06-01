"use client";

import { Users, ArrowDown, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState, useMemo } from "react";
import { userService } from "@/services/userService";

export default function CardMetricClientActives() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const usersData = await userService.getAll();
        setUsers(usersData);
      } catch (err) {
        setError("Ocorreu um erro ao carregar os usuários");
        console.error("Erro ao carregar usuários:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const trend = useMemo(() => {
    return {
      isPositive: true,
      value: 8.3,
    };
  }, []);

  const MetricsLoading = () => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32" />
      </CardContent>
    </Card>
  );

  if (isLoading) return <MetricsLoading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("overflow-hidden")}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Usuários Ativos
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold">{users.length}</div>

            {trend && (
              <Badge
                variant="outline"
                className={cn(
                  "ml-2 flex items-center gap-0.5",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {trend.value}%
              </Badge>
            )}
          </div>
          <CardDescription className="mt-1 text-xs">
            Total de usuários ativos
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
