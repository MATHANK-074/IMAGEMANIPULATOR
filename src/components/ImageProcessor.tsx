import { useAuth } from '../contexts/AuthContext';
import { useImageProcessor } from '../hooks/useImageProcessor';
import { ImageUpload } from './ImageUpload';
import { OperationControls } from './OperationControls';
import { ImageStats } from './ImageStats';
import { Histogram } from './Histogram';
import { OperationHistory } from './OperationHistory';
import { ApplicationInfo } from './ApplicationInfo';
import { Download, RotateCcw, LogOut } from 'lucide-react';
import { PixelMatrix } from './PixelMatrix';

export function ImageProcessor() {
  const { user, signOut } = useAuth();
  const {
    currentImage,
    imageStats,
    histogram,
    processing,
    canvasRef,
    loadImage,
    processImage,
    resetImage,
    downloadImage,
  } = useImageProcessor(user!.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            IMAGE PIXEL MANIPULATOR
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!currentImage ? (
          <div className="space-y-8">
            <ImageUpload onImageLoad={loadImage} />
            <ApplicationInfo />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Image Preview
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={resetImage}
                      disabled={processing}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={downloadImage}
                      disabled={processing}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  {processing && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  <img
                    src={currentImage}
                    alt="Processed"
                    className="w-full h-auto"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>
              <PixelMatrix canvasRef={canvasRef} matrixSize={5} />

              <Histogram data={histogram} />
              <ApplicationInfo />
            </div>

            <div className="space-y-6">
              <OperationControls
                onOperation={processImage}
                processing={processing}
              />
              <ImageStats stats={imageStats} />
              <OperationHistory userId={user!.id} key={processing.toString()} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
