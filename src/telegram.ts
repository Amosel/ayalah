import { telegran_new_rsvp_template, telegran_rsv_canclled } from './data';
import { type RSVPForm } from './schema';

// Function to send a notification via Telegram
const telegramBotToken = import.meta.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = import.meta.env.TELEGRAM_CHAT_ID;
const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

export const Telegram = {
  async onNewRSVP(form: RSVPForm, url: string) {
    try {
      const response = await fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegran_new_rsvp_template({ name: form.name, url }),
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
  },
  async onRSVPCancelled(email: string, url: string) {
    try {
      const response = await fetch(telegramApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegran_rsv_canclled({ email, url }),
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
}
