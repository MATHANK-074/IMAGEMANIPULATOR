export interface ImageData {
  id: string;
  user_id: string;
  original_name: string;
  file_size: number;
  width: number;
  height: number;
  format: string;
  image_data: string;
  created_at: string;
}

export interface OperationLog {
  id: string;
  user_id: string;
  image_id: string | null;
  operation_type: string;
  parameters: Record<string, unknown>;
  timestamp: string;
  execution_time_ms: number;
}

export interface ImageStats {
  width: number;
  height: number;
  memoryUsage: string;
  totalPixels: number;
  avgRed: number;
  avgGreen: number;
  avgBlue: number;
}

export type OperationType =
  | 'contrast'
  | 'threshold'
  | 'blur'
  | 'sharpen'
  | 'invert'
  | 'rotate'
  | 'flip-horizontal'
  | 'flip-vertical'
  | 'edge-detection'
  | 'grayscale';
