import Link from "next/link";

export default function CreateNew({ href, title }: CreateNewProps) {
  return (
  <Link 
    href={href} 
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    title={title}
  >
      {title}
  </Link>
  );
}

type CreateNewProps = {
  href: string;
  title: string;
};