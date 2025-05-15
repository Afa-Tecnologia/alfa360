'use client';

import { LoginFormV3 } from '@/components/login-form-v3';
import { motion } from 'framer-motion';

export default function LoginPageV3() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-600 opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-500 opacity-10 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={
          {
            backgroundImage:
              'linear-gradient(var(--grid-size) var(--grid-size), transparent var(--grid-size), transparent)',
            backgroundSize: 'var(--grid-size) var(--grid-size)',
            '--grid-size': '20px',
          } as any
        }
      />

      {/* Content */}
      <div className="container relative z-10 flex min-h-svh items-center justify-center px-4 py-10 md:px-8">
        <div className="w-full max-w-screen-xl grid gap-0 backdrop-blur-sm rounded-2xl overflow-hidden bg-background/5 shadow-2xl md:grid-cols-2">
          {/* Left: Branding & Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative hidden md:flex md:flex-col justify-between p-8 text-white"
          >
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-12">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                  <svg
                    className="size-6 text-slate-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">ALFA MANAGER</span>
              </div>

              {/* Hero content */}
              <div className="mt-10">
                <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
                  Sistema Inteligente <br />
                  para seu Negócio
                </h1>
                <p className="text-white/70 mb-8 max-w-md">
                  Gerencie seu PDV de forma rápida, simples e eficiente. Tenha
                  controle total sobre suas vendas.
                </p>

                {/* Features */}
                <div className="space-y-4 mt-8">
                  {[
                    'Controle de estoque avançado',
                    'Relatórios detalhados em tempo real',
                    'Interface intuitiva e moderna',
                    'Suporte técnico especializado',
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="size-5 text-emerald-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-white/80">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-80" />
          </motion.div>

          {/* Right: Login Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/70"
          >
            <LoginFormV3 redirectTo="/dashboard-v2" />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-white/50 text-xs">
        <p>
          ALFA MANAGER v1.0 &copy; 2023-{new Date().getFullYear()} - Todos os
          direitos reservados
        </p>
      </div>
    </div>
  );
}
