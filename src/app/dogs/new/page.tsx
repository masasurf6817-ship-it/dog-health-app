"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Dog, DogSize } from "@/types/database";

const SIZES: { value: DogSize; label: string; hint: string }[] = [
  { value: "small", label: "小型犬", hint: "〜10kg" },
  { value: "medium", label: "中型犬", hint: "10〜25kg" },
  { value: "large", label: "大型犬", hint: "25kg〜" },
];

export default function NewDogPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    breed: "",
    birthdate: "",
    size: "small" as DogSize,
    weight: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawData, error } = await (supabase as any)
      .from("dogs")
      .insert({
        user_id: user.id,
        name: form.name,
        breed: form.breed,
        birthdate: form.birthdate,
        size: form.size,
        weight: form.weight ? parseFloat(form.weight) : null,
      })
      .select()
      .single();
    const data = rawData as Dog | null;

    if (error) {
      setError("登録に失敗しました。もう一度お試しください。");
      setLoading(false);
      return;
    }

    router.push(`/dogs/${data!.id}`);
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-amber-100 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="text-amber-600 hover:text-amber-800">
          ← 戻る
        </Link>
        <span className="font-bold text-amber-900">わんこを登録</span>
      </header>

      <main className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="ポチ"
            />
          </div>

          {/* Breed */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
              犬種 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => set("breed", e.target.value)}
              required
              className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="柴犬"
            />
          </div>

          {/* Birthdate */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
              誕生日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.birthdate}
              onChange={(e) => set("birthdate", e.target.value)}
              required
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-amber-800">
              サイズ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set("size", s.value)}
                  className={`border rounded-xl p-3 text-center transition-colors ${
                    form.size === s.value
                      ? "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-amber-200 text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  <div className="font-medium text-sm">{s.label}</div>
                  <div className="text-xs mt-0.5 opacity-70">{s.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-amber-800">
              現在の体重（kg）
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
              className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="例: 8.5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 rounded-full transition-colors"
          >
            {loading ? "登録中..." : "登録する"}
          </button>
        </form>
      </main>
    </div>
  );
}
