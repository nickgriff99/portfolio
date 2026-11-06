export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score: number }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY ?? "";
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }).toString(),
  });
  const data = (await response.json()) as { success?: boolean; score?: number };
  return { success: data.success ?? false, score: data.score ?? 0 };
}
