import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { OperationLog } from '../types';
import { Clock, Activity } from 'lucide-react';

interface OperationHistoryProps {
  userId: string;
  onRefresh?: () => void;
}

export function OperationHistory({ userId }: OperationHistoryProps) {
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Load logs initially and set up periodic refresh
  useEffect(() => {
    loadLogs();
    
    // Set up polling every 2 seconds
    const intervalId = setInterval(loadLogs, 2000);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [userId]);

  const loadLogs = useCallback(async () => {
    const { data } = await supabase
      .from('operation_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(20);

    if (data) {
      setLogs(data);
    }
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Operation History
        </h3>
      </div>

      {logs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No operations yet. Start processing images!
        </p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <div className="font-medium text-gray-800 capitalize">
                  {log.operation_type.replace('-', ' ')}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {log.execution_time_ms}ms
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
