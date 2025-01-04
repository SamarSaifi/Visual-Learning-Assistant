import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyDN-ld3NfyTFWnmGB2G5krnm7OpEEadf38');

function isValidBase64Image(imageData: string): boolean {
  try {
    // Check if it's a valid base64 data URL
    if (!imageData.startsWith('data:image/')) {
      return false;
    }
    
    // Extract the base64 part
    const base64 = imageData.split(',')[1];
    if (!base64) {
      return false;
    }

    // Check if the size is reasonable (less than 4MB)
    const sizeInBytes = (base64.length * 3) / 4;
    return sizeInBytes < 4 * 1024 * 1024;
  } catch {
    return false;
  }
}

export async function analyzeImage(imageData: string): Promise<string> {
  try {
    if (!isValidBase64Image(imageData)) {
      throw new Error('Invalid image data');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = "You are a helpful teaching assistant. Please analyze this image and provide a clear, step-by-step solution if it contains an academic problem. If it's not an academic problem, politely explain that you can only help with academic questions.";
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    if (error instanceof Error) {
      return `Sorry, I encountered an error: ${error.message}. Please try again.`;
    }
    return 'Sorry, I encountered an error while analyzing the image. Please try again.';
  }
}