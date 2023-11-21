import { type RSVPForm } from './schema';

// Function to send a notification via Telegram
const telegramBotToken = import.meta.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = import.meta.env.TELEGRAM_CHAT_ID;
const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

export async function onNewRSVP(form: RSVPForm, url: string) {
  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: `<b>New RSVP from ${form.name}!</b> Open <a href="${url}">inline URL</a>`,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API responded with status: ${response.status}, ${response.statusText}`);
    } else {
      console.log("Sending Telegram notification url");
    }
  } catch (error) {
    console.error("Error sending Telegram notification", error);
  }
}
export async function onRSVPCancelled(email: string, url: string) {
  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: `<b>${email}! Cancelled</b> Open <a href="${url}">rsvps</a>`,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API responded with status: ${response.status}, ${response.statusText}`);
    } else {
      console.log("Sending Telegram notification on cancel ");
    }
  } catch (error) {
    console.error("Error sending Telegram notification", error);
  }
}
