import { ImageStats as ImageStatsType } from '../types';
import { Image, Layers, Database } from 'lucide-react';

interface ImageStatsProps {
  stats: ImageStatsType | null;
}

export function ImageStats({ stats }: ImageStatsProps) {
  if (!stats) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Image Statistics
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">Dimensions</span>
          </div>
          <span className="text-gray-900 font-semibold">
            {stats.width} × {stats.height}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700">Total Pixels</span>
          </div>
          <span className="text-gray-900 font-semibold">
            {stats.totalPixels.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-amber-600" />
            <span className="font-medium text-gray-700">Memory Usage</span>
          </div>
          <span className="text-gray-900 font-semibold">
            {stats.memoryUsage}
          </span>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Average RGB Values
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">Red</div>
              <div className="font-bold text-red-600">{stats.avgRed}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">Green</div>
              <div className="font-bold text-green-600">{stats.avgGreen}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-xs text-gray-600 mb-1">Blue</div>
              <div className="font-bold text-blue-600">{stats.avgBlue}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
