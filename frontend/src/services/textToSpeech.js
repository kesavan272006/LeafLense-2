/**
 * Text-to-Speech Service
 * Handles speech synthesis for AI responses
 */

class TextToSpeechService {
  constructor() {
    this.isSupported = 'speechSynthesis' in window
    this.voices = []
    this.currentUtterance = null
    this.defaultSettings = {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0
    }
    
    if (this.isSupported) {
      this.loadVoices()
      // Listen for voices changed event (some browsers load voices asynchronously)
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices()
      }
    }
  }

  /**
   * Load available voices
   */
  loadVoices() {
    this.voices = speechSynthesis.getVoices()
    console.log('Loaded voices:', this.voices.length)
  }

  /**
   * Get the best voice for a language
   * @param {string} language - Language code (hi, en, etc.)
   * @returns {SpeechSynthesisVoice|null} Best matching voice
   */
  getBestVoice(language) {
    if (!this.voices.length) {
      this.loadVoices()
    }

    // Language mapping for voice selection
    const languageMap = {
      'hi': ['hi-IN', 'hi'],
      'en': ['en-US', 'en-GB', 'en'],
      'ta': ['ta-IN', 'ta'],
      'te': ['te-IN', 'te'],
      'ml': ['ml-IN', 'ml'],
      'kn': ['kn-IN', 'kn'],
      'bn': ['bn-IN', 'bn'],
      'gu': ['gu-IN', 'gu'],
      'mr': ['mr-IN', 'mr'],
      'pa': ['pa-IN', 'pa']
    }

    const preferredLangs = languageMap[language] || ['en-US', 'en']

    // Try to find exact match first
    for (const lang of preferredLangs) {
      const voice = this.voices.find(v => v.lang === lang)
      if (voice) {
        return voice
      }
    }

    // Try partial match
    for (const lang of preferredLangs) {
      const voice = this.voices.find(v => v.lang.startsWith(lang.split('-')[0]))
      if (voice) {
        return voice
      }
    }

    // Fallback to default voice
    return this.voices.find(v => v.default) || this.voices[0] || null
  }

  /**
   * Speak the given text
   * @param {string} text - Text to speak
   * @param {string} language - Language code
   * @param {Object} settings - Voice settings (rate, pitch, volume)
   * @returns {Promise} Promise that resolves when speech is complete
   */
  async speak(text, language = 'en', settings = {}) {
    if (!this.isSupported) {
      throw new Error('Speech synthesis is not supported in this browser')
    }

    if (!text || !text.trim()) {
      throw new Error('Text cannot be empty')
    }

    // Stop any current speech
    this.stop()

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text.trim())
        
        // Apply settings
        const finalSettings = { ...this.defaultSettings, ...settings }
        utterance.rate = finalSettings.rate
        utterance.pitch = finalSettings.pitch
        utterance.volume = finalSettings.volume

        // Set voice
        const voice = this.getBestVoice(language)
        if (voice) {
          utterance.voice = voice
          utterance.lang = voice.lang
        } else {
          // Fallback language setting
          const languageMap = {
            'hi': 'hi-IN',
            'en': 'en-US',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'ml': 'ml-IN',
            'kn': 'kn-IN',
            'bn': 'bn-IN',
            'gu': 'gu-IN',
            'mr': 'mr-IN',
            'pa': 'pa-IN'
          }
          utterance.lang = languageMap[language] || 'en-US'
        }

        // Event handlers
        utterance.onstart = () => {
          console.log('Speech started')
        }

        utterance.onend = () => {
          console.log('Speech ended')
          this.currentUtterance = null
          resolve()
        }

        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error)
          this.currentUtterance = null
          reject(new Error(`Speech synthesis failed: ${error.error}`))
        }

        utterance.onpause = () => {
          console.log('Speech paused')
        }

        utterance.onresume = () => {
          console.log('Speech resumed')
        }

        // Store current utterance
        this.currentUtterance = utterance

        // Start speaking
        speechSynthesis.speak(utterance)
      } catch (error) {
        console.error('TTS error:', error)
        reject(error)
      }
    })
  }

  /**
   * Stop current speech
   */
  stop() {
    if (this.isSupported && speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    this.currentUtterance = null
  }

  /**
   * Pause current speech
   */
  pause() {
    if (this.isSupported && speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
    }
  }

  /**
   * Resume paused speech
   */
  resume() {
    if (this.isSupported && speechSynthesis.paused) {
      speechSynthesis.resume()
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking() {
    return this.isSupported && speechSynthesis.speaking
  }

  /**
   * Check if speech is paused
   */
  isPaused() {
    return this.isSupported && speechSynthesis.paused
  }

  /**
   * Check if TTS is supported
   */
  isTextToSpeechSupported() {
    return this.isSupported
  }

  /**
   * Get available voices
   */
  getAvailableVoices() {
    return this.voices
  }

  /**
   * Get voices for a specific language
   */
  getVoicesForLanguage(language) {
    const languageMap = {
      'hi': ['hi-IN', 'hi'],
      'en': ['en-US', 'en-GB', 'en'],
      'ta': ['ta-IN', 'ta'],
      'te': ['te-IN', 'te'],
      'ml': ['ml-IN', 'ml'],
      'kn': ['kn-IN', 'kn'],
      'bn': ['bn-IN', 'bn'],
      'gu': ['gu-IN', 'gu'],
      'mr': ['mr-IN', 'mr'],
      'pa': ['pa-IN', 'pa']
    }

    const targetLangs = languageMap[language] || ['en']
    
    return this.voices.filter(voice => 
      targetLangs.some(lang => voice.lang.startsWith(lang.split('-')[0]))
    )
  }

  /**
   * Test speech with sample text
   */
  async testSpeech(language = 'en') {
    const testTexts = {
      'hi': 'नमस्ते, मैं आपका कृषि सहायक हूं।',
      'en': 'Hello, I am your agricultural assistant.',
      'ta': 'வணக்கம், நான் உங்கள் வேளாண்மை உதவியாளர்.',
      'te': 'నమస్కారం, నేను మీ వ్యవసాయ సహాయకుడను.',
      'ml': 'നമസ്കാരം, ഞാൻ നിങ്ങളുടെ കൃഷി സഹായകനാണ്.',
      'kn': 'ನಮಸ್ಕಾರ, ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ.'
    }

    const text = testTexts[language] || testTexts['en']
    
    try {
      await this.speak(text, language)
      return { success: true, message: 'Speech test completed successfully' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  /**
   * Set default speech settings
   */
  setDefaultSettings(settings) {
    this.defaultSettings = { ...this.defaultSettings, ...settings }
  }

  /**
   * Get current default settings
   */
  getDefaultSettings() {
    return { ...this.defaultSettings }
  }
}

// Export singleton instance
const textToSpeechService = new TextToSpeechService()
export default textToSpeechService
