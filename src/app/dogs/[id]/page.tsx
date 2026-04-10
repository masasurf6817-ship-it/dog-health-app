import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { calcDogAge, calcHumanAge, sizeLabel } from "@/lib/dogAge";
import WeightLogSection from "@/components/WeightLogSection";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DogDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const { data: dog } = await supabase
    .from("dogs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!dog) return notFound();

  const { years, months } = calcDogAge(dog.birthdate);
  const humanAge = calcHumanAge(years + months / 12, dog.size);

  // 直近30日の体重ログ
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: weightLogs } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("dog_id", dog.id)
    .gte("recorded_at", thirtyDaysAgo.toISOString())
    .order("recorded_at", { ascending: true });

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="text-amber-600 hover:text-amber-800">
          ← 戻る
        </Link>
        <span className="font-bold text-amber-900">{dog.name}のプロフィール</span>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">🐶</span>
                <h1 className="text-2xl font-bold text-amber-900">{dog.name}</h1>
              </div>
              <p className="text-amber-600">{dog.breed}</p>
            </div>
            <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              {sizeLabel(dog.size)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <InfoTile label="犬年齢" value={`${years}歳${months > 0 ? `${months}ヶ月` : ""}`} />
            <InfoTile label="人間換算" value={`約${humanAge}歳`} highlight />
            {dog.weight ? (
              <InfoTile label="体重" value={`${dog.weight}kg`} />
            ) : (
              <InfoTile label="体重" value="未登録" />
            )}
          </div>

          <div className="mt-3 text-xs text-amber-400">
            誕生日: {new Date(dog.birthdate).toLocaleDateString("ja-JP")}
          </div>
        </div>

        {/* Human age explanation */}
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
          <h3 className="font-semibold text-amber-800 mb-2">🧬 人間年齢の計算式</h3>
          <p className="text-sm text-amber-700">
            {sizeLabel(dog.size)}の計算式：最初の2年＝24歳、以降1年＝
            {dog.size === "small" ? "4" : dog.size === "medium" ? "5" : "6"}歳
          </p>
          <p className="text-sm text-amber-600 mt-1">
            {dog.name}は現在 <strong>{years}歳{months > 0 ? `${months}ヶ月` : ""}</strong> →{" "}
            人間換算で <strong>約{humanAge}歳</strong> です
          </p>
        </div>

        {/* Weight log */}
        <WeightLogSection dogId={dog.id} initialLogs={weightLogs ?? []} />

        {/* Premium features teaser */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white">
          <h3 className="font-bold text-lg mb-2">有料プランで更に便利に</h3>
          <ul className="text-sm space-y-1 opacity-90">
            <li>✓ 複数頭の登録</li>
            <li>✓ ワクチン・病院記録とリマインド</li>
            <li>✓ 食事・散歩ログとグラフ</li>
            <li>✓ AIによる健康アドバイス（Claude）</li>
          </ul>
          <button className="mt-4 bg-white text-amber-600 font-bold py-2 px-6 rounded-full text-sm">
            月額500円でアップグレード
          </button>
        </div>
      </main>
    </div>
  );
}

function InfoTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 text-center ${
        highlight ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-800"
      }`}
    >
      <div className={`text-xs mb-1 ${highlight ? "opacity-90" : "text-amber-500"}`}>
        {label}
      </div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}
