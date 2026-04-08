"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#F5F0E8] text-[#3D2B1F] font-sans">
        <h2 className="font-serif text-[36px] text-[#2C1F14] mb-[1rem]">Something went wrong</h2>
        <p className="text-[14px] text-[#9A8878] mb-[2rem]">A critical error occurred.</p>
        <button
          onClick={reset}
          className="bg-[#6B4F3A] text-white border border-[#6B4F3A] px-[2rem] py-[0.8rem] text-[13px] tracking-[1px] cursor-pointer hover:bg-[#2C1F14] transition-colors"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
