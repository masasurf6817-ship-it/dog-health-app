import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { calcDogAge, calcHumanAge, sizeLabel } from "@/lib/dogAge";
import { Dog } from "@/types/database";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/auth/login");

  const { data: dogs } = await supabase
    .from("dogs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className="font-bold text-amber-900">愛犬健康手帳</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-500">{user.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Dogs list */}
        {dogs && dogs.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-amber-900">登録中のわんこ</h2>
            {dogs.map((dog: Dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Add dog button (free plan: 1 dog max) */}
        {(!dogs || dogs.length === 0) && (
          <Link
            href="/dogs/new"
            className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-full transition-colors"
          >
            + わんこを登録する
          </Link>
        )}

        {dogs && dogs.length > 0 && (
          <div className="text-center">
            <p className="text-xs text-amber-500 mb-2">
              複数頭の登録は有料プランへ（月額500円）
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function DogCard({ dog }: { dog: Dog }) {
  const { years, months } = calcDogAge(dog.birthdate);
  const humanAge = calcHumanAge(years + months / 12, dog.size);

  return (
    <Link
      href={`/dogs/${dog.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-amber-100 p-4 hover:border-amber-300 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐶</span>
            <span className="text-lg font-bold text-amber-900">{dog.name}</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              {sizeLabel(dog.size)}
            </span>
          </div>
          <p className="text-sm text-amber-600 mt-1">{dog.breed}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-amber-700">
            {years}歳{months > 0 ? `${months}ヶ月` : ""}
          </div>
          <div className="text-xs text-amber-500">人間年齢 約{humanAge}歳</div>
          {dog.weight && (
            <div className="text-xs text-amber-500">{dog.weight}kg</div>
          )}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 space-y-4">
      <div className="text-6xl">🐾</div>
      <p className="text-amber-700 font-medium">まだわんこが登録されていません</p>
      <p className="text-sm text-amber-500">下のボタンから愛犬を登録しましょう</p>
    </div>
  );
}
