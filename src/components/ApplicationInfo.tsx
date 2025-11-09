import { Microscope, Satellite, FileText, Camera } from 'lucide-react';

export function ApplicationInfo() {
  const applications = [
    {
      icon: Microscope,
      title: 'Medical Imaging',
      description: 'Enhance X-rays, MRIs, and CT scans for better diagnosis',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      icon: Satellite,
      title: 'Satellite Analysis',
      description: 'Process satellite imagery for environmental monitoring',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: FileText,
      title: 'Document Enhancement',
      description: 'Improve scanned documents and text recognition',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Camera,
      title: 'Photography',
      description: 'Professional photo editing and enhancement',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Real-World Applications
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map((app) => (
          <div
            key={app.title}
            className={`${app.bg} p-4 rounded-lg transition-transform hover:scale-105`}
          >
            <app.icon className={`w-8 h-8 ${app.color} mb-2`} />
            <h4 className="font-semibold text-gray-800 mb-1">{app.title}</h4>
            <p className="text-sm text-gray-600">{app.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
