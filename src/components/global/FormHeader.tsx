type FormHeaderProps = {
  title: string;
};

export function FormHeader({ title }: FormHeaderProps) {
  const mainTitle = title.split(':')[0];
  const subTitle = title.includes(':') ? title.split(':')[1].trim() : '';

  return (
    <div className="bg-blue-50 px-6 py-8 flex flex-col items-center">
      <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-4xl font-bold mb-4">
        {mainTitle.charAt(0).toUpperCase()}
      </div>
      <h1 className="text-2xl font-bold text-gray-800">{mainTitle}</h1>
      {subTitle && <p className="text-gray-500 mb-4">{subTitle}</p>}
    </div>
  );
}