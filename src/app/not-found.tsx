import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell flex min-h-[100svh] flex-col justify-center py-24">
      <p className="eyebrow text-signal">404</p>
      <h1 className="headline-lg mt-6 text-paper">Deze pagina bestaat niet.</h1>
      <Link href="/" className="btn-primary mt-10 self-start">
        Naar de homepage
      </Link>
    </main>
  );
}
