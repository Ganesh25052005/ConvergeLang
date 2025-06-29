import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUser({...userData});
        return userData;
    } catch (error) {
        console.error("Error in upsertStreamUser:", error);
    }
}

export const generateStreamToken = async (userId) => {
    try {
        const userIdStr = userId.toString();
        const token = streamClient.createToken(userIdStr);
        return token;
    } catch (error) {
        console.error("Error in generateStreamToken:", error);
    }
}