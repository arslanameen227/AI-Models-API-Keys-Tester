const API_BASE_URL = 'https://api.pollinations.ai/v1'; // Hypothetical API base URL

// Helper function for making authenticated requests to the Pollinations API
const pollinationsFetch = async (endpoint: string, apiKey: string, body: object, method: string = 'POST') => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown API error from Pollinations AI' }));
    throw new Error(errorData.message || `Pollinations API request failed with status ${response.status}`);
  }

  return response.json();
};

// --- Text Generation ---
export const generateText = async (apiKey: string, prompt: string, systemInstruction?: string) => {
  try {
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
    
    // Hypothetical payload structure for Pollinations AI
    const response = await pollinationsFetch('/completions', apiKey, {
      model: 'text-davinci-003', // Example model
      prompt: fullPrompt,
      max_tokens: 1500,
    });

    // Assuming a response structure similar to OpenAI's completion API
    const text = response.choices?.[0]?.text;
    if (text) {
        return { success: true, text };
    } else {
        return { success: false, error: "Received an invalid response from Pollinations AI." };
    }
  } catch (error: any) {
    console.error("AI Service Error (generateText):", error);
    return { success: false, error: error.message || "Failed to generate text." };
  }
};

// --- Chat ---
export const continueChat = async (apiKey: string, history: any[], newMessage: string) => {
  // Simulate chat by formatting history into a single prompt
  const prompt = history
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.parts[0].text}`)
    .join('\n') + `\nUser: ${newMessage}\nAssistant:`;

  // Use the standard text generation endpoint for chat simulation
  return generateText(apiKey, prompt);
};


// --- Image Generation ---
export const generateImage = async (apiKey: string, prompt: string) => {
    try {
        // Hypothetical payload for image generation
        const response = await pollinationsFetch('/images/generate', apiKey, {
            prompt: prompt,
            n: 1,
            size: '512x512',
            response_format: 'b64_json', // Request base64-encoded image data
        });

        // Assuming a response structure similar to DALL-E API
        const base64Image = response.data?.[0]?.b64_json;
        if (base64Image) {
            return { success: true, base64Image };
        } else {
            return { success: false, error: "Image generation failed to produce an image." };
        }
    } catch (error: any) {
        console.error("AI Service Error (generateImage):", error);
        return { success: false, error: error.message || "Failed to generate image." };
    }
};

// --- JSON Generation ---
export const generateJson = async (apiKey: string, prompt: string) => {
    const jsonPrompt = `Strictly return a valid JSON object based on this description. Do not include any other text, explanations, or markdown formatting. The JSON should represent: ${prompt}`;
    
    try {
      const response = await generateText(apiKey, jsonPrompt);
      if (response.success) {
        // The component expects the key `json` but it's still text
        return { success: true, json: response.text };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error: any) {
      console.error("AI Service Error (generateJson):", error);
      return { success: false, error: error.message || "Failed to generate JSON." };
    }
};
