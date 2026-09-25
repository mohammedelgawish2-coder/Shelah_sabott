const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const bot = new TelegramBot(process.env.8977391542:AAGRJefNU1_2_piR4_DnS0A6Yc71RQfB73g, { polling: true });
const7948442870 = Number(process.env.7948442870);
// نظام الإنذارات
let warnings = {};
// نظام الاستثناء
let exceptions = [];
// دالة التحقق من المالك
function isOwner(id) {
  return id === 7948442870;
}
/* ──────────────── الكتم ──────────────── */
// كتم
bot.onText(/كتم/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return bot.sendMessage(msg.chat.id, "❌ لازم ترد على العضو");
  const userId = msg.reply_to_message.from.id;
  bot.restrictChatMember(msg.chat.id, userId, { can_send_messages: false });
  bot.sendMessage(msg.chat.id, "🔇 تم كتم العضو");
});
// رفع كتم
bot.onText(/رفع كتم/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return;
  const userId = msg.reply_to_message.from.id;
  bot.restrictChatMember(msg.chat.id, userId, { can_send_messages: true });
  bot.sendMessage(msg.chat.id, "🔊 تم رفع الكتم");
});
/* ──────────────── الطرد ──────────────── */
// طرد
bot.onText(/طرد/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return bot.sendMessage(msg.chat.id, "❌ لازم ترد على العضو");
  const userId = msg.reply_to_message.from.id;
  bot.banChatMember(msg.chat.id, userId, { until_date: Math.floor(Date.now() / 1000) + 30 });
  bot.sendMessage(msg.chat.id, "🚪 تم طرد العضو (بدون حظر)");
});
/* ──────────────── الحظر ──────────────── */
// حظر
bot.onText(/حظر/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return;
  const userId = msg.reply_to_message.from.id;
  bot.banChatMember(msg.chat.id, userId);
  bot.sendMessage(msg.chat.id, "⛔ تم حظر العضو نهائيًا");
});
// رفع حظر
bot.onText(/رفع حظر/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return;
  const userId = msg.reply_to_message.from.id;
  bot.unbanChatMember(msg.chat.id, userId);
  bot.sendMessage(msg.chat.id, "✔ تم رفع الحظر");
});
/* ──────────────── الإنذارات ──────────────── */
// إنذار
bot.onText(/انذار/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return;
  const userId = msg.reply_to_message.from.id;
  warnings[userId] = (warnings[userId] || 0) + 1;
  bot.sendMessage(msg.chat.id, ⚠ تم إعطاء إنذار\nعدد الإنذارات: ${warnings[userId]});
  if (warnings[userId] >= 3) {
    bot.banChatMember(msg.chat.id, userId);
    bot.sendMessage(msg.chat.id, "⛔ تم حظر العضو بسبب كثرة الإنذارات");
  }
});
// رفع إنذار
bot.onText(/رفع انذار/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return;
  const userId = msg.reply_to_message.from.id;
  if (!warnings[userId] || warnings[userId] === 0) {
    return bot.sendMessage(msg.chat.id, "❌ العضو ما عنده إنذارات");
  }
  warnings[userId] -= 1;
  bot.sendMessage(msg.chat.id, ✔ تم رفع إنذار\nالإنذارات الآن: ${warnings[userId]});
});
/* ──────────────── الاستثناء ──────────────── */
// استثني
bot.onText(/استثني/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return bot.sendMessage(msg.chat.id, "❌ لازم ترد على الوسائط");
  exceptions.push(msg.reply_to_message.message_id);
  bot.sendMessage(msg.chat.id, "✔ تم استثناء الوسائط من الحذف");
});
// حذف استثناء
bot.onText(/يل استثناء/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return;
  exceptions = exceptions.filter(id => id !== msg.reply_to_message.message_id);
  bot.sendMessage(msg.chat.id, "🗑 تم حذف الاستثناء");
});
// عرض الاستثناءات
bot.onText(/الاستثناءات/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  bot.sendMessage(msg.chat.id, 📌 عدد الاستثناءات: ${exceptions.length});
});
/* ──────────────── تثبيت ──────────────── */
// تثبيت
bot.onText(/تثبيت/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  if (!msg.reply_to_message) return;
  bot.pinChatMessage(msg.chat.id, msg.reply_to_message.message_id);
  bot.sendMessage(msg.chat.id, "📌 تم تثبيت الرسالة");
});
// إلغاء تثبيت
bot.onText(/الغاء تثبيت/, (msg) => {
  if (!isOwner(msg.from.id)) return;
  bot.unpinAllChatMessages(msg.chat.id);
  bot.sendMessage(msg.chat.id, "❌ تم إلغاء التثبيت");
});
/* ──────────────── حذف الوسائط غير المستثناة ──────────────── */
bot.on('message', (msg) => {
  if (msg.photo || msg.video || msg.document || msg.sticker) {
    if (!exceptions.includes(msg.message_id) && !isOwner(msg.from.id)) {
      bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => {});
    }
  }
});
console.log("🛡️ نظام الحماية شغال بنجاح");
