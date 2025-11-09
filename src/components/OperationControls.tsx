import { useState } from 'react';
import { OperationType } from '../types';
import {
  Contrast,
  Split,
  Droplets,
  Sparkles,
  Palette,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Scan,
  Circle,
} from 'lucide-react';

interface OperationControlsProps {
  onOperation: (operation: OperationType, params?: Record<string, unknown>) => void;
  processing: boolean;
}

export function OperationControls({ onOperation, processing }: OperationControlsProps) {
  const [contrastValue, setContrastValue] = useState(1.5);
  const [thresholdValue, setThresholdValue] = useState(128);
  const [blurRadius, setBlurRadius] = useState(2);

  const operations = [
    {
      name: 'Contrast',
      type: 'contrast' as OperationType,
      icon: Contrast,
      color: 'bg-blue-500',
      hasParams: true,
    },
    {
      name: 'Threshold',
      type: 'threshold' as OperationType,
      icon: Split,
      color: 'bg-green-500',
      hasParams: true,
    },
    {
      name: 'Blur',
      type: 'blur' as OperationType,
      icon: Droplets,
      color: 'bg-cyan-500',
      hasParams: true,
    },
    {
      name: 'Sharpen',
      type: 'sharpen' as OperationType,
      icon: Sparkles,
      color: 'bg-amber-500',
    },
    {
      name: 'Invert',
      type: 'invert' as OperationType,
      icon: Palette,
      color: 'bg-pink-500',
    },
    {
      name: 'Grayscale',
      type: 'grayscale' as OperationType,
      icon: Circle,
      color: 'bg-gray-500',
    },
    {
      name: 'Rotate 90°',
      type: 'rotate' as OperationType,
      icon: RotateCw,
      color: 'bg-violet-500',
    },
    {
      name: 'Flip H',
      type: 'flip-horizontal' as OperationType,
      icon: FlipHorizontal,
      color: 'bg-indigo-500',
    },
    {
      name: 'Flip V',
      type: 'flip-vertical' as OperationType,
      icon: FlipVertical,
      color: 'bg-purple-500',
    },
    {
      name: 'Edge Detect',
      type: 'edge-detection' as OperationType,
      icon: Scan,
      color: 'bg-red-500',
    },
  ];

  const handleOperation = (operation: OperationType) => {
    let params = {};
    if (operation === 'contrast') params = { factor: contrastValue };
    if (operation === 'threshold') params = { threshold: thresholdValue };
    if (operation === 'blur') params = { radius: blurRadius };
    if (operation === 'rotate') params = { angle: 90 };
    onOperation(operation, params);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Image Operations
      </h3>

      <div className="space-y-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contrast Factor: {contrastValue.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={contrastValue}
            onChange={(e) => setContrastValue(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Threshold Value: {thresholdValue}
          </label>
          <input
            type="range"
            min="0"
            max="255"
            step="1"
            value={thresholdValue}
            onChange={(e) => setThresholdValue(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blur Radius: {blurRadius}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={blurRadius}
            onChange={(e) => setBlurRadius(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {operations.map((op) => (
          <button
            key={op.type}
            onClick={() => handleOperation(op.type)}
            disabled={processing}
            className={`${op.color} text-white p-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            <op.icon className="w-4 h-4" />
            {op.name}
          </button>
        ))}
      </div>
    </div>
  );
}
