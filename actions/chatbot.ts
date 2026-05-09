"use server";

import { chatbotService } from "@/services/chatbot.service";

export async function sendMessageToChatbot(message: string) {
  try {
    const res = await chatbotService.chat(message);
    if (res.data && res.data.success && res.data.data) {
      return res.data.data;
    }
    throw new Error(res.data?.message || "Failed to get chatbot response");
  } catch (error: any) {
    console.error("Error in sendMessageToChatbot action:", error);
    throw error;
  }
}
