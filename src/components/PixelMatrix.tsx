import { useEffect, useState } from 'react';
import { Grid } from 'lucide-react';

interface PixelMatrixProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  matrixSize?: number; // Size of the matrix to display (e.g., 5 for 5x5)
}

export function PixelMatrix({ canvasRef, matrixSize = 5 }: PixelMatrixProps) {
  const [pixelMatrix, setPixelMatrix] = useState<number[][][]>([]);

  useEffect(() => {
    updatePixelMatrix();
  }, [canvasRef.current]);

  const updatePixelMatrix = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the center of the image
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);

    // Calculate the starting point to sample pixels
    const startX = centerX - Math.floor(matrixSize / 2);
    const startY = centerY - Math.floor(matrixSize / 2);

    // Get the pixel data
    const imageData = ctx.getImageData(
      startX,
      startY,
      matrixSize,
      matrixSize
    ).data;

    // Convert the pixel data into a 2D matrix
    const matrix: number[][][] = [];
    for (let y = 0; y < matrixSize; y++) {
      const row: number[][] = [];
      for (let x = 0; x < matrixSize; x++) {
        const i = (y * matrixSize + x) * 4;
        row.push([
          imageData[i],     // R
          imageData[i + 1], // G
          imageData[i + 2], // B
          imageData[i + 3]  // A
        ]);
      }
      matrix.push(row);
    }

    setPixelMatrix(matrix);
  };

  // Add an observer to watch for canvas changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const observer = new MutationObserver(updatePixelMatrix);
    observer.observe(canvasRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [canvasRef.current]);

  if (pixelMatrix.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Grid className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">IMAGE PIXEL IN 2D MATRIX</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <tbody>
            {pixelMatrix.map((row, y) => (
              <tr key={y}>
                {row.map((pixel, x) => (
                  <td
                    key={x}
                    className="border border-gray-200 p-2 text-xs font-mono"
                    style={{
                      backgroundColor: `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${
                        pixel[3] / 255
                      })`,
                    }}
                  >
                    <div className="flex flex-col text-center backdrop-blur-sm bg-white/30">
                      <span>R: {pixel[0]}</span>
                      <span>G: {pixel[1]}</span>
                      <span>B: {pixel[2]}</span>
                      <span>A: {pixel[3]}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}