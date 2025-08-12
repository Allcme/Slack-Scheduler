import dotenv from "dotenv";
dotenv.config();

export const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID || "";
export const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET || "";
export const SLACK_REDIRECT_URI = process.env.SLACK_REDIRECT_URI || "http://localhost:4000/auth/slack/callback";
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
