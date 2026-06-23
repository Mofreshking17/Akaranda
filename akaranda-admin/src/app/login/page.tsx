import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">AKARANDA</h1>
          <p className="text-sm text-neutral-500 mt-1">Admin Dashboard</p>
        </div>

        <form action={signIn} className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4 shadow-sm">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-neutral-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white rounded-md py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Accounts are created by a Super Admin. Contact your administrator for access.
        </p>
      </div>
    </div>
  );
}
