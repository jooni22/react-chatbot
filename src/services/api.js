import axios from 'axios';
import { logInfo, logError } from '../utils/logger';
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = "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";

export const sendMessageToAI = async (messages) => {
    try {
      logInfo('Sending message to AI', { messages });
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
          stream: true,
          stop: null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
        }
      );
  
      logInfo('Received response from AI', { response: response.data });
      return response.data.choices[0].message;
    } catch (error) {
      logError('Error sending message to AI', error);
      throw error;
    }
  };