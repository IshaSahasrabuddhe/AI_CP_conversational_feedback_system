import type { FormEvent } from "react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  alternateLabel: string;
  alternateLink: string;
  alternateText: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  error: string | null;
  loading: boolean;
}

export default function AuthCard(props: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
      <div className="mb-8">
        <p className="mb-3 inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
          AI Feedback Collector
        </p>
        <h1 className="text-3xl font-bold text-white">{props.title}</h1>
        <p className="mt-2 text-sm text-slate-300">{props.subtitle}</p>
      </div>

      <form className="space-y-5" onSubmit={props.onSubmit}>
        <label className="block text-sm text-slate-200">
          Email
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-orange-400"
            type="email"
            value={props.email}
            onChange={(event) => props.setEmail(event.target.value)}
            required
          />
        </label>

        <label className="block text-sm text-slate-200">
          Password
          <input
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-orange-400"
            type="password"
            value={props.password}
            onChange={(event) => props.setPassword(event.target.value)}
            required
          />
        </label>

        {props.error ? <p className="text-sm text-rose-300">{props.error}</p> : null}

        <button
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={props.loading}
        >
          {props.loading ? "Please wait..." : props.submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        {props.alternateText}{" "}
        <Link className="font-semibold text-orange-300 hover:text-orange-200" to={props.alternateLink}>
          {props.alternateLabel}
        </Link>
      </p>
    </div>
  );
}
