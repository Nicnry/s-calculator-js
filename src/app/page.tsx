import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bienvenue sur notre application Next.js</h1>
      <p>Consultez la liste des utilisateurs en cliquant sur le lien ci-dessous :</p>
      <Link href="/users/">Voir les utilisateurs</Link>
    </div>
  );
}
