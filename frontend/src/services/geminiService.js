/**
 * Gemini AI Service for Agricultural Assistant
 * Handles communication with Google's Gemini API
 */

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models'
    this.model = 'gemini-1.5-flash' // Try the basic model name
    this.isInitialized = false
  }

  /**
   * Initialize the Gemini service
   */
  async initialize() {
    if (this.isInitialized) return true

    if (!this.apiKey) {
      console.error('Gemini API key not found in environment variables')
      console.log('Available env vars:', Object.keys(import.meta.env))
      return false
    }

    console.log('Initializing Gemini service with API key:', this.apiKey ? 'Present' : 'Missing')
    
    // Skip test connection for now to speed up initialization
    this.isInitialized = true
    console.log('Gemini Service initialized successfully')
    return true
  }

  /**
   * Test connection to Gemini API
   */
  async testConnection() {
    const response = await fetch(
      `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello'
            }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error(`API test failed: ${response.status} ${response.statusText}`)
    }

    return true
  }

  /**
   * Generate AI response using Gemini
   * @param {string} query - User's question
   * @param {string} language - Language code (en, hi, ml)
   * @param {string} location - User's location
   * @param {Object} weather - Weather data
   * @returns {Promise<string>} AI response
   */
  async generateResponse(query, language = 'en', location = 'Delhi', weather = null) {
    await this.initialize()

    if (!this.isInitialized) {
      throw new Error('Gemini service not available')
    }

    console.log('Generating response for query:', query)
    console.log('Using language:', language, 'Location:', location)

    // Create context-aware prompt
    const systemPrompt = this.createSystemPrompt(language, location, weather)
    const userPrompt = `${systemPrompt}\n\nUser Question: ${query}`

    const requestUrl = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`
    console.log('Making request to:', requestUrl.replace(this.apiKey, 'API_KEY_HIDDEN'))

    try {
      const requestBody = {
        contents: [{
          parts: [{
            text: userPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }

      console.log('Request body:', JSON.stringify(requestBody, null, 2))

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || errorData.message || 'Unknown error'}`)
      }

      const data = await response.json()
      console.log('API Response:', JSON.stringify(data, null, 2))
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const responseText = data.candidates[0].content.parts[0].text
        console.log('Generated response:', responseText)
        return responseText
      } else {
        console.error('Invalid response structure:', data)
        throw new Error('No valid response from Gemini API')
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }

  /**
   * Create system prompt based on context
   */
  createSystemPrompt(language, location, weather) {
    const weatherInfo = weather ? 
      `Current weather in ${location}: ${weather.current?.temp_c}°C, ${weather.current?.condition?.text}, Humidity: ${weather.current?.humidity}%` : 
      ''

    const languageInstructions = {
      'en': 'Respond in English',
      'hi': 'Respond in Hindi (Devanagari script)',
      'ml': 'Respond in Malayalam',
    }

    // Custom prompt as specified
    const basePrompt = `You are LeafLense, an AI-powered Smart Agriculture Assistant built to support farmers with any agricultural information or guidance they need. Your role is to provide accurate, detailed, and practical advice on topics including crop yield prediction, plant disease detection, fertilizer recommendations, weather and pest risk alerts, irrigation practices, soil health management, sustainable farming methods, and market-related information.

Always communicate in simple, farmer-friendly language while maintaining accuracy. Provide step-by-step guidance when needed so that even a non-technical farmer can follow your advice easily.

Use available data from ML models (yield, disease, fertilizer) and external information sources when relevant. If specific details such as location, crop type, or soil data are missing, ask for them politely before giving recommendations.

Your answers should:

Be detailed yet easy to follow, avoiding unnecessary technical jargon.

Include practical actions, not just raw numbers or probabilities. Make your answer easy to read and structured. Avoid congested sentences.

Cover any agriculture-related query—from crop selection and soil improvement to pest management and irrigation planning.

If multiple solutions exist, explain the pros and cons clearly so the farmer can make an informed choice.

${languageInstructions[language] || 'Respond in English'}.

Context:
- Location: ${location}
${weatherInfo ? `- Weather: ${weatherInfo}` : ''}

Important: Always respond in a helpful, professional manner as an agricultural expert.`

    return basePrompt
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return this.isInitialized && !!this.apiKey
  }

  /**
   * Get current model being used
   */
  getCurrentModel() {
    return this.model
  }
}

// Export singleton instance
const geminiService = new GeminiService()
export default geminiService