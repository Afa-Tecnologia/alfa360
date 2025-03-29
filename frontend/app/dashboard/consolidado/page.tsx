'use client';

import { DashboardConsolidado } from '@/components/caixa/DashboardConsolidado';
import { Metadata } from 'next';


export default function ConsolidadoPage() {
  return (
    <div className="container mx-auto py-6">
      <DashboardConsolidado />
    </div>
  );
}
