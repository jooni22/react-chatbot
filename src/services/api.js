import axios from 'axios';

const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = "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";

export const sendMessageToAI = async (messages) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        messages: [
          { role: "system", content: "I'm the best ai" },
          ...messages,
        ],
        model: "llama3-8b-8192",
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message;
  } catch (error) {
    console.error("Error sending message to AI:", error);
    throw error;
  }
};