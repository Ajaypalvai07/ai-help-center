import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function analyzeSentiment(text: string) {
  try {
    const result = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: text,
    });

    return {
      sentiment: result[0].label,
      confidence: result[0].score,
      needsEscalation: result[0].label === 'anger' || result[0].label === 'frustration'
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return null;
  }
}

export async function translateText(text: string, targetLang: string) {
  try {
    const result = await hf.translation({
      model: `Helsinki-NLP/opus-mt-en-${targetLang}`,
      inputs: text,
    });

    return result.translation_text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
}