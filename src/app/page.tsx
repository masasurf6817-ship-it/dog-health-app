import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero */}
        <div className="space-y-4">
          <div className="text-7xl">🐾</div>
          <h1 className="text-4xl font-bold text-amber-900">愛犬健康手帳</h1>
          <p className="text-lg text-amber-700">
            愛犬の健康・体重・ワクチン・お散歩を
            <br />
            かんたんに記録・管理できるアプリです
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            { icon: "📋", title: "プロフィール管理", desc: "犬種・誕生日・体重を記録" },
            { icon: "🧬", title: "人間年齢換算", desc: "大きさ別の正確な換算式" },
            { icon: "💉", title: "ワクチン記録", desc: "次回接種日のリマインド" },
            { icon: "🤖", title: "AIアドバイス", desc: "Claude AIによる健康相談" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100"
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-semibold text-amber-900">{f.title}</div>
              <div className="text-sm text-amber-600">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
          >
            無料で始める
          </Link>
          <Link
            href="/auth/login"
            className="bg-white hover:bg-amber-50 text-amber-700 font-bold py-3 px-8 rounded-full border border-amber-300 transition-colors"
          >
            ログイン
          </Link>
        </div>

        <p className="text-xs text-amber-500">
          基本機能は無料。有料プランで複数頭・AI機能が使えます（月額500円）
        </p>
      </div>
    </main>
  );
}
