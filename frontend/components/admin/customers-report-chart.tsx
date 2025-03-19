"use client"

import { useEffect, useRef } from "react"

export function CustomersReportChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Dados de exemplo para o gráfico
    const data = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Novos Clientes",
          data: [15, 18, 22, 25, 28, 32],
          backgroundColor: "hsl(221.2, 83.2%, 53.3%)",
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

      // Desenhar barras
      const barWidth = 50
      const step = 500 / data.labels.length

      data.datasets[0].data.forEach((value, i) => {
        const x = 50 + i * step + (step - barWidth) / 2
        const height = (value / 35) * 230
        const y = 250 - height

        ctx.fillStyle = data.datasets[0].backgroundColor
        ctx.fillRect(x, y, barWidth, height)
      })

      // Desenhar labels
      ctx.fillStyle = "#6b7280"
      ctx.font = "12px sans-serif"
      data.labels.forEach((label, i) => {
        const x = 50 + i * step + step / 2
        ctx.fillText(label, x - 10, 270)
      })
    }
  }, [])

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} width={600} height={300} className="max-w-full h-auto" />
    </div>
  )
}

