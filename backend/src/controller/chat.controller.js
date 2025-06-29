import { generateStreamToken } from "../lib/stream.js";

export async function getStreamtoken(req, res) {
    try {
        const userId = req.user._id;
        const token = await generateStreamToken(userId);
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error generating Stream token:", error);
        res.status(500).json({ error: "Failed to generate Stream token" });
    }
}