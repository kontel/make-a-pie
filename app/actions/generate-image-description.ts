"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export async function generateImageDescription(base64ImageData: string) {
  try {
    // Generate description using AI
    const { text } = await generateText({
      //model: openai("gpt-4o-mini"),
      model: anthropic("claude-3-5-sonnet-20241022"),
      prompt: `Write a creative ~50 word description of this pie. Make it engaging and descriptive. Don't include any other text in your response.\n\nImage in base64: ${base64ImageData}`,
      temperature: 0.9,
      maxTokens: 2048,
    });

    return { success: true, description: text };
  } catch (error) {
    console.error("Detailed error:", error);
    return {
      success: false,
      error: `Failed to process image: ${(error as Error).message}`,
    };
  }
}
