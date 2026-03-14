import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm shadow-banana-dark/30">
      <h1 className="text-xl font-bold text-slate-900">Lost in the jungle?</h1>
      <p className="mt-2 text-sm text-slate-700">
        That page doesn’t exist. Let’s get you back to the hunt.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-full bg-jungle px-4 py-2 text-sm font-semibold text-white"
      >
        Go home
      </Link>
    </div>
  );
}

