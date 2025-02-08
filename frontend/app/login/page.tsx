'use client';
import { GalleryVerticalEnd } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário já estiver autenticado, redireciona para o dashboard
    if (isAuthenticated) {
      router.push('/dashboard'); // Redireciona para o dashboard
    }
  }, [isAuthenticated]);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            ALFA MANAGER V1.0
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block bg-[url('@/components/images/loginimage.jpg')] lg:bg-cover"></div>
    </div>
  );
}
