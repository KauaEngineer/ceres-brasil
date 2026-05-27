import Image from 'next/image';
import Link from 'next/link';

/**
 * Layout das páginas de autenticação — card centralizado sobre fundo creme.
 * (auth) é route group: não aparece na URL.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Ceres Brasil — página inicial">
            <Image
              src="/logo-ceres.png"
              alt="Ceres Brasil"
              width={120}
              height={120}
              priority
              className="h-20 w-auto"
            />
          </Link>
        </div>
        <div className="rounded-3xl border border-ceres-sand-soft bg-white p-8 shadow-sm md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
