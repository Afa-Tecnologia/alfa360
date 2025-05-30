import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@/components/theme-provider';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Alfa Manager - Alfa Tecnologia',
  description: 'Software de gestão de vendas desenvolvido por alfa tecnologia',
};
const inter = Inter({ subsets: ['latin'] });

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastContainer />
          {children}
        </ThemeProvider>
 
  );
}
