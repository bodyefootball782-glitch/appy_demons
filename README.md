# DEMONS — FiveM Application Portal

موقع تقديمات DEMONS بتصميم سينمائي أسود وأحمر، فورم عربي متعدد المراحل، وإرسال آمن إلى Discord عبر Vercel Serverless Function.

## الملفات
- `index.html` — واجهة الموقع والأسئلة.
- `style.css` — التصميم المتجاوب.
- `script.js` — مراحل الفورم والتحقق والإرسال.
- `api/apply.js` — يستقبل التقديم ويرسله إلى Discord من جهة الخادم.
- `background.jpg` — أضف صورة الخلفية التي تختارها إلى جذر المشروع بهذا الاسم.

## النشر على Vercel
1. ارفع محتويات المجلد إلى GitHub.
2. من Vercel اختر **Add New → Project** ثم استورد المستودع.
3. لا تحتاج إلى Build Command أو Framework Preset خاص؛ المشروع يستخدم ملفات ثابتة وVercel Function.
4. من **Project → Settings → Environment Variables** أضف:
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: رابط Webhook الخاص بروم التقديمات في Discord.
   - فعّل البيئة المطلوبة (Production، ويمكن Preview أيضًا إذا احتجت).
5. اضغط Redeploy بعد إضافة المتغير.
6. ضع صورة الخلفية التي تختارها في جذر المشروع باسم `background.jpg`. يمكنك استبدالها في أي وقت مع الحفاظ على الاسم.

## ملاحظات مهمة
- لا تضع رابط Webhook في `index.html` أو `script.js` أو أي ملف يصل للمتصفح.
- لا ترفع `.env` أو أي أسرار إلى GitHub.
- لو الرابط غير مضبوط، سيعرض الفورم رسالة أن الإرسال غير مفعّل.
- لا توجد قاعدة بيانات أو منع تكرار دائم في النسخة الحالية؛ الطلبات تُرسل مباشرة إلى Discord.
- أرسل فقط المعلومات اللازمة للمراجعة، وراجع إعدادات صلاحيات روم Discord.
