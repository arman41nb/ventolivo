import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#F5F0E8] text-[#3D2B1F] font-sans">
        <p className="font-serif text-[72px] text-[#6B4F3A] mb-[0.5rem]">404</p>
        <h2 className="font-serif text-[28px] text-[#2C1F14] mb-[1rem]">
          Page not found
        </h2>
        <p className="text-[14px] text-[#9A8878] mb-[2rem] max-w-[400px] text-center">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-[#6B4F3A] text-white border border-[#6B4F3A] px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-[#2C1F14] transition-colors no-underline"
        >
          Back to Home
        </Link>
      </body>
    </html>
  );
}
