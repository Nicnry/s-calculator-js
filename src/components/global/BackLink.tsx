import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink({ href = "/", title = "Retour" }: BackLinkProps) {
  return (
    <Link href={href} className="flex items-center text-gray-700 hover:text-black">
      <ArrowLeft className="w-6 h-6" />
      <span className="ml-2">{title}</span>
    </Link>
  );
}

type BackLinkProps = {
  href?: string;
  title?: string;
};