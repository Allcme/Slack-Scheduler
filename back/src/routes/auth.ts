import { Router } from "express";
import { exchangeCodeForToken } from "../services/SlackServices";

const router = Router();

router.get("/slack/callback", async (req, res) => {
    try {
        const code = req.query.code as string;
        await exchangeCodeForToken(code);
       // res.send("App installed successfully. You can close this window.");
        res.redirect("http://localhost:5173?connected=true");
    } catch (err) {
       const message = err instanceof Error ? err.message : String(err);
       res.status(500).send(message);
    }
});

export default router;
