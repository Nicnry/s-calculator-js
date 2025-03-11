import Link from "next/link";

export default function CreateNew({ href, title }: { href: string, title: string }) {
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