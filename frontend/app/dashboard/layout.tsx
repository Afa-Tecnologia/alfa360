'use client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

import { AppSidebar } from '@/components/app-sidebar';
import "../globals.css";
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import useAuthStore from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { Header } from '@/components/pages/header';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastContainer } from 'react-toastify';

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
const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
 <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          
          
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-col h-full w-full">{children}</div>
      </SidebarInset>
      <ToastContainer />
    </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>




  );
}
