export default function DetailItem({ 
    icon, 
    label, 
    value 
  }: { 
    icon: React.ReactNode, 
    label: string, 
    value: string 
  }) {
    return (
      <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    );
  }