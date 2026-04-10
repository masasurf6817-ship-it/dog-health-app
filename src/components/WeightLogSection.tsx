"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WeightLog } from "@/types/database";

interface Props {
  dogId: string;
  initialLogs: WeightLog[];
}

export default function WeightLogSection({ dogId, initialLogs }: Props) {
  const [logs, setLogs] = useState<WeightLog[]>(initialLogs);
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addLog(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("weight_logs")
      .insert({
        dog_id: dogId,
        weight: parseFloat(weight),
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setError("記録に失敗しました");
    } else {
      setLogs((prev) => [...prev, data]);
      setWeight("");
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 space-y-4">
      <h3 className="font-bold text-amber-900">⚖️ 体重ログ（直近30日）</h3>

      {/* Input */}
      <form onSubmit={addLog} className="flex gap-2">
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className="flex-1 border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="体重 (kg)"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {loading ? "..." : "記録"}
        </button>
      </form>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Log list */}
      {logs.length === 0 ? (
        <p className="text-sm text-amber-400 text-center py-4">
          体重の記録がありません
        </p>
      ) : (
        <div className="space-y-1">
          {[...logs].reverse().map((log) => (
            <div
              key={log.id}
              className="flex justify-between items-center text-sm py-1.5 border-b border-amber-50 last:border-0"
            >
              <span className="text-amber-500">
                {new Date(log.recorded_at).toLocaleDateString("ja-JP")}
              </span>
              <span className="font-semibold text-amber-900">{log.weight} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
