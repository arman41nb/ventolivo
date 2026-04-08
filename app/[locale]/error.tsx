"use client";

export default function LocaleError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-[2.5rem] text-center">
      <h2 className="font-serif text-[36px] text-dark mb-[1rem]">Something went wrong</h2>
      <p className="text-[14px] text-muted mb-[2rem] max-w-[400px]">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="bg-brown text-white border border-brown px-[2rem] py-[0.8rem] font-sans text-[13px] tracking-[1px] cursor-pointer hover:bg-dark hover:border-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
