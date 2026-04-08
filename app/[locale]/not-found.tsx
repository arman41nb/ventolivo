import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-[2.5rem] text-center">
      <p className="font-serif text-[72px] text-brown mb-[0.5rem]">404</p>
      <h2 className="font-serif text-[28px] text-dark mb-[1rem]">Page not found</h2>
      <p className="text-[14px] text-muted mb-[2rem] max-w-[400px]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-brown text-white border border-brown px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-dark hover:border-dark transition-colors no-underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
