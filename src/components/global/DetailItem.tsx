export default function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

type DetailItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};