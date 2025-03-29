// Declarações de módulos sem tipagens adequadas
declare module 'jspdf' {
  class jsPDF {
    constructor(options?: any);
    setFillColor(r: number, g: number, b: number): this;
    setTextColor(r: number, g: number, b: number): this;
    setDrawColor(r: number, g: number, b: number): this;
    setLineWidth(width: number): this;
    setFontSize(size: number): this;
    setFont(fontName: string, fontStyle: string): this;
    text(text: string, x: number, y: number, options?: any): this;
    line(x1: number, y1: number, x2: number, y2: number): this;
    rect(x: number, y: number, w: number, h: number, style: string): this;
    save(filename: string): void;
    internal: { pageSize: { width: number; height: number } };
  }

  export default jsPDF;
}

declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: any;
    theme?: string;
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: any;
    tableLineColor?: number[] | number;
    tableLineWidth?: number;
    cellWidth?: string | number | 'auto' | 'wrap';
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;

  export default autoTable;
}
