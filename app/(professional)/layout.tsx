import Link from "next/link";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/corner">Switch to Personal Site</Link>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}
