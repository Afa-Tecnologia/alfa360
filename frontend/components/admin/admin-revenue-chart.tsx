"use client"

import { useEffect, useRef } from "react"

export function AdminRevenueChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Dados de exemplo para o gráfico
    const data = {
      labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
      datasets: [
        {
          label: "Receita (R$)",
          data: [150, 300, 450, 600, 750, 1200, 1800, 2350],
          borderColor: "hsl(221.2, 83.2%, 53.3%)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    }

    // Simulação de renderização de gráfico
    // Em um projeto real, você usaria uma biblioteca como Chart.js
    const ctx = canvasRef.current.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      // Desenhar eixos
      ctx.beginPath()
      ctx.moveTo(50, 20)
      ctx.lineTo(50, 250)
      ctx.lineTo(550, 250)
      ctx.strokeStyle = "#e5e7eb"
      ctx.stroke()

      // Desenhar linha de dados
      ctx.beginPath()
      const points = data.datasets[0].data
      const step = 500 / (points.length - 1)

      points.forEach((point, i) => {
        const x = 50 + i * step
        const y = 250 - (point / 2500) * 230

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.strokeStyle = data.datasets[0].borderColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Preencher área sob a linha
      ctx.lineTo(50 + (points.length - 1) * step, 250)
      ctx.lineTo(50, 250)
      ctx.fillStyle = data.datasets[0].backgroundColor
      ctx.fill()

      // Desenhar pontos de dados
      points.forEach((point, i) => {
        const x = 50 + i * step
        const y = 250 - (point / 2500) * 230

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = data.datasets[0].borderColor
        ctx.fill()
      })

      // Desenhar labels
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px sans-serif"
      data.labels.forEach((label, i) => {
        const x = 50 + i * step
        ctx.fillText(label, x - 15, 270)
      })
    }
  }, [])

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} width={600} height={300} className="max-w-full h-auto" />
    </div>
  )
}

