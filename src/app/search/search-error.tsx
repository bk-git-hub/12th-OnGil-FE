'use client';

export function SearchError({ error }: { error: Error }) {
  return (
    <div className="flex h-60 flex-col items-center justify-center gap-4">
      <div className="text-red-500">{error.message}</div>
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-black px-4 py-2 text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
