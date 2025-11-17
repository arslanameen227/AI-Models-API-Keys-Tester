import { Provider, TestResult } from '../types';
import { GoogleGenAI } from '@google/genai';

/**
 * Tests a Gemini API key by making a simple, low-cost API call.
 * @param apiKey The Gemini API key to test.
 * @returns A promise that resolves to a TestResult object.
 */
const testGeminiKey = async (apiKey: string): Promise<TestResult> => {
  if (!apiKey) {
    return { valid: false, error: 'API key is missing.' };
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use a very simple prompt for validation
    await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'test'
    });
    return { valid: true };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const message = error.message || 'An unknown error occurred.';
    return { valid: false, error: `Gemini API Error: ${message}` };
  }
};

/**
 * Performs a real API call to a validation endpoint.
 * @param provider The provider configuration.
 * @param apiKey The API key to test.
 * @returns A promise that resolves to a TestResult object.
 */
const testWithRealEndpoint = async (provider: Provider, apiKey: string): Promise<TestResult> => {
    if (!provider.validationUrl) {
        return { valid: false, error: 'Validation URL is not configured for this provider.' };
    }

    const headers = new Headers();
    const authHeader = provider.authHeader || 'Authorization';
    const authScheme = provider.authScheme ? `${provider.authScheme} ` : '';
    headers.append(authHeader, `${authScheme}${apiKey}`);
    headers.append('Content-Type', 'application/json');

    try {
        const response = await fetch(provider.validationUrl, {
            method: 'GET', // Most "list" or "check" endpoints are GET
            headers: headers,
        });

        if (response.ok) {
            return { valid: true };
        } else {
            let errorMsg = `API request failed with status: ${response.status} ${response.statusText}.`;
            try {
                const errorBody = await response.json();
                errorMsg += ` ${errorBody.error?.message || ''}`;
            } catch (e) {
                // Ignore if response body is not JSON
            }
            return { valid: false, error: errorMsg };
        }
    } catch (error: any) {
        return { valid: false, error: `Network error: ${error.message}` };
    }
};


/**
 * Creates a mock test that validates an API key based on a prefix or other simple rule.
 * @param validate The validation function.
 * @param errorMessage The error message to return on failure.
 * @returns A function that performs the mock test.
 */
const createMockTest = (
    validate: (key: string) => boolean,
    errorMessage: string
): ((apiKey: string) => Promise<TestResult>) => {
    return (apiKey: string) => new Promise((resolve) => {
        setTimeout(() => {
            if (validate(apiKey)) {
                resolve({ valid: true });
            } else {
                resolve({ valid: false, error: errorMessage });
            }
        }, 500);
    });
};

/**
 * Dispatches the API key test to the appropriate function based on the provider.
 * @param provider The AI provider object.
 * @param apiKey The API key to be tested.
 * @returns A promise that resolves to a TestResult object.
 */
export const verifyApiKey = async (provider: Provider, apiKey: string): Promise<TestResult> => {
  // Real test for Gemini (special case)
  if (provider.id === 'GEMINI') {
    return testGeminiKey(apiKey);
  }

  // Real test for any provider with a validation URL
  if (provider.validationUrl) {
    return testWithRealEndpoint(provider, apiKey);
  }

  // Mock tests for others based on prefix
  if (provider.prefix) {
    const testFn = createMockTest(
      (key) => key && key.startsWith(provider.prefix!),
      `Invalid format. ${provider.name} keys should start with "${provider.prefix}".`
    );
    return testFn(apiKey);
  }

  // Generic mock test for providers without a specific prefix
  const genericTest = createMockTest(
    (key) => key && key.length > 10,
    `Invalid format. ${provider.name} key should be a non-empty string.`
  );
  return genericTest(apiKey);
};
