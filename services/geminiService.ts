
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GeminiResponse } from "../types";

const apiKey = process.env.API_KEY || '';

export const getGeminiChat = () => {
  const ai = new GoogleGenAI({ apiKey });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'Birdie', a whimsical and hilarious bird enthusiast. 
      Your mission is to find out the user's favorite bird species and then help them visualize it in the silliest way possible.
      
      FLOW & RULES:
      1. Always be polite, enthusiastic, and SFW (Safe For Work).
      2. Accept and ENCOURAGE both real biological bird species AND mythical birds (e.g., Phoenix, Griffin, Roc, Thunderbird, Harpy).
      3. CRITICAL - IDENTIFYING A BIRD: When the user identifies a bird species (real or mythical), you MUST:
         a) Generate a short, hilarious silly story (1-2 paragraphs) about that bird. Place this in the 'reply' field.
         b) Set 'followUpQuestion' to: "Would you like another image from this same story, or should we start a different story with a new bird?"
         c) Set 'shouldGenerate' to true.
         d) Create a funny 'sillyDescription' based on the story for the image generator.
      4. CRITICAL - ANOTHER IMAGE: If the user asks for another image from the same story:
         a) Keep the context of the previous story.
         b) Set 'reply' to an enthusiastic confirmation (e.g., "Coming right up! Here's another snapshot from that adventure!").
         c) Set 'followUpQuestion' to: "Should I snap another one of this, or move on to a different bird?"
         d) Set 'shouldGenerate' to true.
         e) Provide a NEW, slightly different 'sillyDescription' based on the SAME story context.
      5. CRITICAL - SAFETY & PROHIBITIONS:
         - You MUST NOT engage in or discuss: violence, hate speech, self-harm, politics, religion, drug use, sex, harming others, or illegal activities.
         - You MUST NOT generate content about real-world people (politicians, celebrities, etc.).
         - If a user mentions these topics, provide a playful, bird-themed refusal (e.g., "My bird-brain can't process that! I'm strictly here for feathers and fun. Let's talk about Pigeons instead!") and set 'shouldGenerate' to false.
      6. Return your response in JSON format according to the schema.
      7. Ensure scenarios and images ONLY involve the specified bird species.
      8. Safety: Never generate inappropriate, violent, or NSFW content.
      9. Ensure images of birds generated do not have extra body parts, such as more then 2 legs and 2 wings.  Make sure there is not a foot or hand comming out of the wing and if the bird is holding something with their wing, feathers instead of fingers`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description: "The silly story or conversational text response."
          },
          followUpQuestion: {
            type: Type.STRING,
            description: "The specific question asking if they want another image or a different story."
          },
          birdName: {
            type: Type.STRING,
            description: "The specific bird species or mythical bird mentioned."
          },
          sillyDescription: {
            type: Type.STRING,
            description: "A funny visual description for image generation."
          },
          shouldGenerate: {
            type: Type.BOOLEAN,
            description: "MUST be true if a bird species was identified. MUST be false if the topic is prohibited or unsafe."
          }
        },
        required: ["reply", "shouldGenerate"]
      }
    }
  });
};

export const generateSillyBirdImage = async (birdName: string, description: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const prompt = `A high-quality, vibrant, and hilarious 3D render of a ${birdName} in a silly situation. 
    ${description}. 
    
    APPEARANCE RULES:
    - If ${birdName} is a REAL bird species: The bird must be biologically accurate (correct beak, plumage, and body proportions).
    - If ${birdName} is a MYTHICAL bird: Follow iconic mythical descriptions.
    
    STRICT CONSTRAINTS: 
    - The image must feature ONLY the specified species: ${birdName}.
    - The bird MUST NOT have human hands or human arms.
    - No extra legs (exactly two, unless the mythical creature has more naturally).
    - No text in image.
    - NO real-world people, NO violence, NO political symbols, NO religious symbols, NO drug references.
    - Must be SFW and safe for all audiences.
    
    The style should be whimsical, colorful, and detailed like a high-end 3D animated movie character.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
