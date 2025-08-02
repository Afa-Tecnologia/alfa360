'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellIcon, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../theme-toggle';

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
  title?: string;
}

export function Header({
  toggleSidebar,
  isMobile,
  title = 'Dashboard',
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScrolled, setIsScrolled] = useState(false);

  // Atualiza o horário a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Detecta o scroll para adicionar efeito de sombra ao header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Formata o horário atual
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Formata a data atual
  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
       <motion.header
      className={cn(
        'sticky top-0 left-0 right-0 z-40 flex h-16 items-center justify-between  border-b border-opacity-5 bg-background/95 px-4 backdrop-blur transition-shadow duration-200',
        isScrolled && 'shadow-md'
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="hidden md:flex items-center">
        <div className="relative mx-4 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-8 w-[240px] bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium">{formattedTime}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {formattedDate}
          </p>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        <ThemeToggle/>
      </div>
    </motion.header>
  );
}
