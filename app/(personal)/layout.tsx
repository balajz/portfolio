import Link from "next/link";

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/">Switch to Professional Site</Link>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}
