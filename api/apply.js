const ALLOWED_FIELDS = {
  name: "اسم المتقدم",
  age: "العمر",
  cityName: "الاسم داخل المدينة",
  discord: "Discord",
  otherServers: "سيرفرات FiveM أخرى",
  combatLog: "يعني إيه COMPAT LOG؟",
  powerGaming: "يعني إيه POWER GAMING؟",
  cityActivity: "مدة التفاعل داخل كيان",
  discordActivity: "مدة التفاعل داخل ديسكورد",
  gangExperience: "خبرة العصابات السابقة",
  familyContacts: "معارف داخل العائلة"
};

function clean(value, max = 700) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max);
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "الطريقة غير مسموح بها." });
  }

  // A webhook is configured in Vercel Environment Variables, never in browser code.
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook || !/^https:\/\/discord\.com\/api\/webhooks\//i.test(webhook)) {
    return res.status(503).json({ error: "الإرسال غير مفعّل حاليًا. تواصل مع الإدارة." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "البيانات المرسلة غير صحيحة." });
  }

  const answers = {};
  for (const [key, label] of Object.entries(ALLOWED_FIELDS)) {
    const max = key === "age" ? 3 : (key === "name" || key === "cityName" || key === "discord" ? 80 : 700);
    answers[key] = clean(body[key], max);
    if (!answers[key]) return res.status(400).json({ error: "من فضلك أكمل كل الأسئلة المطلوبة." });
  }

  const age = Number(answers.age);
  if (!Number.isInteger(age) || age < 13 || age > 99) {
    return res.status(400).json({ error: "اكتب عمرًا صحيحًا." });
  }

  const fields = Object.entries(ALLOWED_FIELDS).map(([key, label]) => ({
    name: label,
    value: answers[key].slice(0, 1024),
    inline: false
  }));

  const payload = {
    username: "DEMONS | Recruitment",
    allowed_mentions: { parse: [] },
    embeds: [{
      title: "🩸 طلب دخول اختبار جديد — DEMONS",
      description: "وصل تقديم جديد من بوابة الاختبارات الرسمية.",
      color: 0xD51E2B,
      fields,
      footer: { text: "DEMONS FAMILY • FiveM Roleplay" },
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const discordResponse = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!discordResponse.ok) {
      console.error("Discord webhook returned status:", discordResponse.status);
      return res.status(502).json({ error: "تعذر تسليم الطلب إلى Discord. حاول لاحقًا." });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Application delivery failed:", error?.message || "unknown error");
    return res.status(502).json({ error: "حصل خطأ في الاتصال بـ Discord. حاول لاحقًا." });
  }
};
