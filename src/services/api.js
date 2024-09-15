import { logInfo, logError } from '../utils/logger';

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = "";

export const sendMessageToAI = async (messages, onChunk) => {
  try {
    logInfo('Sending message to AI', { messages });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Jesteś pomocnym asystentem i znasz dwa języki: polskim i angielskim." },
          ...messages,
        ],
        model: "llama-3.1-8b-instant",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0].delta.content;
            if (content) {
              onChunk(content);
              logInfo('Received chunk from AI', { content });
            }
          } catch (error) {
            logError('Error parsing JSON:', error);
          }
        }
      }
    }
  } catch (error) {
    logError('Error sending message to AI', error);
    throw error;
  }
};
