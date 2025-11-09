import { useEffect, useRef } from 'react';

interface HistogramProps {
  data: number[];
}

export function Histogram({ data }: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const maxValue = Math.max(...data);

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(0, 0, width, height);

    const barWidth = width / 256;

    ctx.fillStyle = '#3b82f6';
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * height;
      const x = index * barWidth;
      const y = height - barHeight;
      ctx.fillRect(x, y, barWidth, barHeight);
    });

    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Intensity Histogram
      </h3>
      <canvas
        ref={canvasRef}
        width={512}
        height={150}
        className="w-full border border-gray-200 rounded"
      />
    </div>
  );
}
