export default function LocaleLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="w-[40px] h-[40px] border-2 border-brown/[0.2] border-t-brown rounded-full animate-spin" />
      <p className="mt-[1.5rem] text-[13px] tracking-[1px] uppercase text-muted">
        Loading...
      </p>
    </div>
  );
}
