"use client";

import { useActionState } from "react";
import { loginAction, type LoginActionState } from "@/app/login/actions";

type LoginFormProps = {
  isSupabaseReady: boolean;
  redirectTo: string;
};

const initialState: LoginActionState = {
  message: "",
};

export function LoginForm({ isSupabaseReady, redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-10 space-y-5">
      <input name="redirectTo" type="hidden" value={redirectTo} />

      <label className="block">
        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          Email
        </span>
        <input
          autoComplete="email"
          className="mt-3 w-full border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-950 disabled:cursor-not-allowed disabled:text-zinc-400"
          disabled={!isSupabaseReady || isPending}
          name="email"
          placeholder="admin@example.com"
          type="email"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.24em] text-zinc-500">
          Password
        </span>
        <input
          autoComplete="current-password"
          className="mt-3 w-full border border-zinc-300 bg-transparent px-4 py-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-zinc-950 disabled:cursor-not-allowed disabled:text-zinc-400"
          disabled={!isSupabaseReady || isPending}
          name="password"
          placeholder="请输入后台密码"
          type="password"
        />
      </label>

      {state.message ? (
        <p className="border border-zinc-300 px-4 py-3 text-sm leading-6 text-zinc-600">
          {state.message}
        </p>
      ) : null}

      {!isSupabaseReady ? (
        <p className="border border-zinc-300 px-4 py-3 text-sm leading-6 text-zinc-600">
          Supabase 环境变量尚未配置。请先在本地 `.env.local` 中填写项目 URL 和
          anon public key。
        </p>
      ) : null}

      <button
        className="w-full border border-zinc-950 bg-zinc-950 px-5 py-3 text-sm text-white transition-colors hover:bg-transparent hover:text-zinc-950 disabled:cursor-not-allowed disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-400"
        disabled={!isSupabaseReady || isPending}
        type="submit"
      >
        {isPending ? "登录中..." : "登录后台"}
      </button>
    </form>
  );
}
