import cron from "node-cron";
import db from "../config/db";
import { sendSlackMessage } from "./SlackServices";

export function startScheduler() {
    cron.schedule("* * * * *", async () => {
        const now = Date.now();
        const dueMessages = db.prepare(`SELECT * FROM scheduled_messages WHERE send_time <= ?`).all(now);

        for (const msg of dueMessages) {
            await sendSlackMessage(msg.channel, msg.text);
            db.prepare(`DELETE FROM scheduled_messages WHERE id = ?`).run(msg.id);
        }
    });
}
