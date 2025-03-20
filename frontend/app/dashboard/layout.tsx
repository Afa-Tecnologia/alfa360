'use client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { AppSidebar } from '@/components/app-sidebar';

import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import useAuthStore from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Header } from '@/components/pages/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// export const metadata: Metadata = {
//   title: 'Alfa Manager - Alfa Tecnologia',
//   description: 'Software de gestão de vendas desenvolvido por alfa tecnologia',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true); // Defina que estamos no cliente
  // }, []);
  // const user = useAuthStore.getState().user;
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <Header/>
        <div className="flex flex-col h-full w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
