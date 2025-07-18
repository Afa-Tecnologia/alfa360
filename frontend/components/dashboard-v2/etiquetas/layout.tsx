import React from 'react';

export default function EtiquetasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ maxWidth: 900, margin: '0 auto' }}>{children}</div>;
}
