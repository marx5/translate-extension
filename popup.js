document.addEventListener('DOMContentLoaded', async () => {
  const inputText = document.getElementById('inputText');
  const translateBtn = document.getElementById('translateBtn');
  const sourceLang = document.getElementById('sourceLang');
  const targetLang = document.getElementById('targetLang');
  const resultArea = document.getElementById('resultArea');
  const translatedText = document.getElementById('translatedText');
  const phoneticText = document.getElementById('phoneticText');
  const sourcePhonetic = document.getElementById('sourcePhonetic');
  const errorMessage = document.getElementById('errorMessage');
  const speakSource = document.getElementById('speakSource');
  const speakTarget = document.getElementById('speakTarget');
  const translationService = document.getElementById('translationService');
  const swapLangs = document.getElementById('swapLangs');

  let detectedSourceLang = 'en'; // Store detected language for auto mode

  // Load saved languages and service
  chrome.storage.sync.get(['sourceLang', 'targetLang', 'translationService'], (result) => {
    if (result.sourceLang) sourceLang.value = result.sourceLang;
    if (result.targetLang) targetLang.value = result.targetLang;
    if (result.translationService) translationService.value = result.translationService;
  });

  // Get selected text from active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection().toString()
      });
      
      if (results && results[0] && results[0].result) {
        inputText.value = results[0].result.trim();
        if (inputText.value) {
          doTranslate();
        }
      }
    } catch (e) {
      console.log('Cannot access page content', e);
    }
  }

  translateBtn.addEventListener('click', doTranslate);

  // Swap languages functionality
  swapLangs.addEventListener('click', () => {
    const currentSource = sourceLang.value;
    const currentTarget = targetLang.value;
    
    // Don't swap if source is auto-detect
    if (currentSource === 'auto') {
      return;
    }
    
    // Swap the values
    sourceLang.value = currentTarget;
    targetLang.value = currentSource;
    
    // Save the new language selection
    chrome.storage.sync.set({
      sourceLang: sourceLang.value,
      targetLang: targetLang.value
    });
    
    // If there's text and a translation, re-translate
    if (inputText.value.trim() && !resultArea.classList.contains('hidden')) {
      doTranslate();
    }
  });

  // Text-to-speech functionality
  speakSource.addEventListener('click', () => {
    const text = inputText.value.trim();
    if (text) {
      const lang = sourceLang.value === 'auto' ? detectedSourceLang : sourceLang.value;
      speak(text, lang);
    }
  });

  speakTarget.addEventListener('click', () => {
    const text = translatedText.textContent.trim();
    if (text) {
      speak(text, targetLang.value);
    }
  });

  function speak(text, lang) {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zh-CN' ? 'zh-CN' : lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function getIPAPhonetic(text, lang) {
    try {
      const words = text.trim().split(/\s+/);
      
      // Handle multi-word phrases by getting phonetic for each word
      if (words.length > 1 && words.length <= 10) {
        const phonetics = [];
        for (let word of words) {
          // Clean word from punctuation
          const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
          if (!cleanWord) continue;
          
          const phonetic = await getSingleWordPhonetic(cleanWord);
          phonetics.push(phonetic || cleanWord);
        }
        return phonetics.join(' ');
      } else if (words.length === 1) {
        return await getSingleWordPhonetic(words[0].toLowerCase());
      }
    } catch (e) {
      console.log('Could not fetch IPA phonetic:', e);
    }
    return '';
  }

  async function getSingleWordPhonetic(word) {
    try {
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '');
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data[0] && data[0].phonetics) {
          for (let phonetic of data[0].phonetics) {
            if (phonetic.text) {
              return phonetic.text.replace(/[\/\[\]]/g, '');
            }
          }
        }
      }
    } catch (e) {
      console.log('Could not fetch phonetic for:', word);
    }
    return '';
  }

  // Save language preferences
  sourceLang.addEventListener('change', () => {
    chrome.storage.sync.set({ sourceLang: sourceLang.value });
  });

  targetLang.addEventListener('change', () => {
    chrome.storage.sync.set({ targetLang: targetLang.value });
    if (inputText.value) doTranslate();
  });

  translationService.addEventListener('change', () => {
    chrome.storage.sync.set({ translationService: translationService.value });
    if (inputText.value) doTranslate();
  });

  async function doTranslate() {
    const text = inputText.value.trim();
    if (!text) return;

    translateBtn.textContent = 'Translating...';
    translateBtn.disabled = true;
    errorMessage.classList.add('hidden');
    resultArea.classList.add('hidden');

    try {
      const service = translationService.value;
      let result;

      if (service === 'gemini') {
        result = await translateWithGemini(text, sourceLang.value, targetLang.value);
      } else if (service === 'libretranslate') {
        result = await translateWithLibreTranslate(text, sourceLang.value, targetLang.value);
      } else if (service === 'mymemory') {
        result = await translateWithMyMemory(text, sourceLang.value, targetLang.value);
      } else {
        result = await translateWithGoogle(text, sourceLang.value, targetLang.value);
      }

      translatedText.textContent = result.translation;
      phoneticText.textContent = result.targetPhonetic ? `/${result.targetPhonetic}/` : '';
      sourcePhonetic.textContent = result.srcPhonetic ? `/${result.srcPhonetic}/` : '';
      
      if (result.detectedLang) {
        detectedSourceLang = result.detectedLang;
      }
      
      resultArea.classList.remove('hidden');

    } catch (error) {
      errorMessage.textContent = 'Translation failed. Please check your internet connection or try another service.';
      errorMessage.classList.remove('hidden');
      console.error('Translation error:', error);
    } finally {
      translateBtn.textContent = 'Translate';
      translateBtn.disabled = false;
    }
  }

  async function translateWithGoogle(text, sl, tl) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    let translation = '';
    let targetPhonetic = '';
    let srcPhonetic = '';
    let detectedLang = sl;
    
    // Extract detected source language from data[2] (if auto-detect was used)
    if (sl === 'auto' && data[2]) {
      detectedLang = data[2];
    }

    if (data[0]) {
      // Build translation from segments
      data[0].forEach(segment => {
        if (segment && segment[0]) translation += segment[0];
      });
      
      // Extract phonetics
      const sentences = data[0];
      for (let segment of sentences) {
        if (segment && Array.isArray(segment)) {
          if (segment[3] && typeof segment[3] === 'string' && !srcPhonetic) {
            srcPhonetic = segment[3];
          }
          if (segment[2] && typeof segment[2] === 'string' && !targetPhonetic) {
            targetPhonetic = segment[2];
          }
        }
      }
    }

    // If no phonetic from Google, try to get IPA phonetic for English
    const actualSourceLang = sl === 'auto' ? detectedLang : sl;
    if (!srcPhonetic && actualSourceLang === 'en') {
      srcPhonetic = await getIPAPhonetic(text, actualSourceLang);
    }
    if (!targetPhonetic && tl === 'en') {
      targetPhonetic = await getIPAPhonetic(translation, tl);
    }

    return { translation, srcPhonetic, targetPhonetic, detectedLang };
  }

  async function translateWithGemini(text, sl, tl) {
    const apiKey = CONFIG.GEMINI_API_KEY;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';
    
    // Map language codes to full names
    const langNames = {
      'en': 'English',
      'vi': 'Vietnamese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh-CN': 'Chinese',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'ru': 'Russian'
    };
    
    const sourceLangName = sl === 'auto' ? 'the source language' : langNames[sl] || sl;
    const targetLangName = langNames[tl] || tl;
    
    // Request translation with phonetic transcription
    const prompt = `You are a professional translator. Translate the following text from ${sourceLangName} to ${targetLangName}.

Text: ${text}

Provide your response in this exact JSON format:
{
  "translation": "the translated text here",
  "sourcePhonetic": "phonetic transcription of source text (pinyin for Chinese, romaji for Japanese, IPA for others)",
  "targetPhonetic": "phonetic transcription of translated text if applicable"
}

Only respond with the JSON, no additional text.`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) throw new Error('Gemini API error');
      
      const data = await response.json();
      let responseText = data.candidates[0]?.content?.parts[0]?.text || '';
      responseText = responseText.trim();
      
      // Try to parse JSON response
      let translation = '';
      let srcPhonetic = '';
      let targetPhonetic = '';
      
      try {
        // Remove markdown code blocks if present
        responseText = responseText.replace(/```json\s*|\s*```/g, '');
        const parsed = JSON.parse(responseText);
        translation = parsed.translation || '';
        srcPhonetic = parsed.sourcePhonetic || '';
        targetPhonetic = parsed.targetPhonetic || '';
      } catch (e) {
        // If JSON parsing fails, use the whole response as translation
        translation = responseText;
      }
      
      // Detect source language if auto
      let detectedLang = sl === 'auto' ? 'en' : sl;

      // Get IPA phonetics for English if not provided
      const actualSourceLang = sl === 'auto' ? detectedLang : sl;
      if (!srcPhonetic && actualSourceLang === 'en') {
        srcPhonetic = await getIPAPhonetic(text, 'en');
      }
      if (!targetPhonetic && tl === 'en') {
        targetPhonetic = await getIPAPhonetic(translation, 'en');
      }

      return { translation, srcPhonetic, targetPhonetic, detectedLang };
    } catch (error) {
      console.error('Gemini translation failed:', error);
      // Fall back to Google Translate
      return await translateWithGoogle(text, sl, tl);
    }
  }

  async function translateWithLibreTranslate(text, sl, tl) {
    // Try multiple LibreTranslate instances
    const instances = [
      'https://libretranslate.com/translate',
      'https://translate.argosopentech.com/translate',
      'https://translate.terraprint.co/translate'
    ];
    
    // Map language codes
    const langMap = {
      'zh-CN': 'zh',
      'auto': 'auto'
    };
    
    const sourceLang = langMap[sl] || sl;
    const targetLang = langMap[tl] || tl;
    
    let lastError = null;
    
    // Try each instance until one works
    for (const url of instances) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text'
          })
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        let translation = data.translatedText;
        let detectedLang = data.detectedLanguage?.language || sl;

        // Get phonetics for English
        let srcPhonetic = '';
        let targetPhonetic = '';
        
        const actualSourceLang = sl === 'auto' ? detectedLang : sl;
        if (actualSourceLang === 'en') {
          srcPhonetic = await getIPAPhonetic(text, 'en');
        }
        if (tl === 'en') {
          targetPhonetic = await getIPAPhonetic(translation, 'en');
        }

        return { translation, srcPhonetic, targetPhonetic, detectedLang };
      } catch (error) {
        lastError = error;
        continue;
      }
    }
    
    // All instances failed, fall back to Google
    console.log('LibreTranslate instances failed, falling back to Google');
    return await translateWithGoogle(text, sl, tl);
  }

  async function translateWithMyMemory(text, sl, tl) {
    const sourceLang = sl === 'auto' ? 'en' : sl;
    const langPair = `${sourceLang}|${tl}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('MyMemory API error');
    
    const data = await response.json();
    let translation = data.responseData.translatedText;
    let detectedLang = sourceLang;

    // Get phonetics for English
    let srcPhonetic = '';
    let targetPhonetic = '';
    
    if (sourceLang === 'en') {
      srcPhonetic = await getIPAPhonetic(text, 'en');
    }
    if (tl === 'en') {
      targetPhonetic = await getIPAPhonetic(translation, 'en');
    }

    return { translation, srcPhonetic, targetPhonetic, detectedLang };
  }
});
