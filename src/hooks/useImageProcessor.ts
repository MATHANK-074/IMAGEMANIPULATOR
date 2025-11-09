import { useState, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { OperationType, ImageStats } from '../types';
import {
  getImageStats,
  adjustContrast,
  applyThreshold,
  applyBlur,
  applySharpen,
  invertColors,
  detectEdges,
  convertToGrayscale,
  generateHistogram,
} from '../utils/imageProcessing';

export function useImageProcessor(userId: string) {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageStats, setImageStats] = useState<ImageStats | null>(null);
  const [histogram, setHistogram] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const logOperation = async (
    operationType: OperationType,
    parameters: Record<string, unknown>,
    executionTime: number
  ) => {
    await supabase.from('operation_logs').insert({
      user_id: userId,
      operation_type: operationType,
      parameters,
      timestamp: new Date().toISOString(),
      execution_time_ms: executionTime,
    });
  };

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalImage(dataUrl);
      setCurrentImage(dataUrl);

      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setImageStats(getImageStats(ctx.getImageData(0, 0, canvas.width, canvas.height), canvas));
            setHistogram(generateHistogram(canvas));
          }
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = useCallback(
    async (operation: OperationType, params: Record<string, unknown> = {}) => {
      if (!canvasRef.current) return;

      setProcessing(true);
      const startTime = performance.now();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      switch (operation) {
        case 'contrast':
          imageData = adjustContrast(imageData, params.factor as number || 1.5);
          break;
        case 'threshold':
          imageData = applyThreshold(imageData, params.threshold as number || 128);
          break;
        case 'blur':
          imageData = applyBlur(imageData, params.radius as number || 2);
          break;
        case 'sharpen':
          imageData = applySharpen(imageData);
          break;
        case 'invert':
          imageData = invertColors(imageData);
          break;
        case 'edge-detection':
          imageData = detectEdges(imageData);
          break;
        case 'grayscale':
          imageData = convertToGrayscale(imageData);
          break;
        case 'rotate':
          const angle = params.angle as number || 90;
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.height;
          tempCanvas.height = canvas.width;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
            tempCtx.rotate((angle * Math.PI) / 180);
            tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
            canvas.width = tempCanvas.width;
            canvas.height = tempCanvas.height;
            ctx.drawImage(tempCanvas, 0, 0);
          }
          break;
        case 'flip-horizontal':
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(canvas, 0, 0);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          break;
        case 'flip-vertical':
          ctx.translate(0, canvas.height);
          ctx.scale(1, -1);
          ctx.drawImage(canvas, 0, 0);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          break;
      }

      if (operation !== 'rotate' && operation !== 'flip-horizontal' && operation !== 'flip-vertical') {
        ctx.putImageData(imageData, 0, 0);
      }

      const newDataUrl = canvas.toDataURL();
      setCurrentImage(newDataUrl);
      setImageStats(getImageStats(ctx.getImageData(0, 0, canvas.width, canvas.height), canvas));
      setHistogram(generateHistogram(canvas));

      const executionTime = Math.round(performance.now() - startTime);
      await logOperation(operation, params, executionTime);

      setProcessing(false);
    },
    [userId]
  );

  const resetImage = useCallback(() => {
    if (originalImage && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setCurrentImage(originalImage);
          setImageStats(getImageStats(ctx.getImageData(0, 0, canvas.width, canvas.height), canvas));
          setHistogram(generateHistogram(canvas));
        }
      };
      img.src = originalImage;
    }
  }, [originalImage]);

  const downloadImage = useCallback(() => {
    if (currentImage) {
      const link = document.createElement('a');
      link.download = `processed-${Date.now()}.png`;
      link.href = currentImage;
      link.click();
    }
  }, [currentImage]);

  return {
    currentImage,
    imageStats,
    histogram,
    processing,
    canvasRef,
    loadImage,
    processImage,
    resetImage,
    downloadImage,
  };
}
