type FormHeaderProps = {
  title: string;
};

export function FormHeader({ title }: FormHeaderProps) {
  const mainTitle = title.split(':')[0];
  const subTitle = title.includes(':') ? title.split(':')[1].trim() : '';

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">{mainTitle}</h1>
      {subTitle && <p className="text-gray-500 mb-4">{subTitle}</p>}
    </div>
  );
}