import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

export async function analyzeCode(code: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a code analysis expert. Analyze the code for potential errors, security issues, and performance improvements."
        },
        {
          role: "user",
          content: code
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error analyzing code:', error);
    return null;
  }
}

export async function predictErrors(code: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Predict potential runtime errors and edge cases in the following code."
        },
        {
          role: "user",
          content: code
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error predicting errors:', error);
    return null;
  }
}