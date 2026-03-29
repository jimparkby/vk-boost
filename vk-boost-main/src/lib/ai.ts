export async function sendToAI(message: string, history: {role: string, text: string}[] = []) {
  const res = await fetch(
    "https://rftepvxdivtrxiqninnq.supabase.co/functions/v1/ai-chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ message, history })
    }
  );

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.reply ?? "Не удалось получить ответ";
}
