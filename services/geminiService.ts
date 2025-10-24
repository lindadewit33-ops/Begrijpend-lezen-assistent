import { GoogleGenAI, Type } from "@google/genai";
import type { FormData, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Een pakkende titel voor de tekst." },
        text: { type: Type.STRING, description: "De gegenereerde leestekst, opgedeeld in alinea's." },
        questions: {
            type: Type.ARRAY,
            description: "Een lijst met multiple-choice-vragen over de tekst.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "De vraag zelf." },
                    options: { 
                        type: Type.OBJECT,
                        description: "Vier antwoordopties (A, B, C, D).",
                        properties: {
                            A: { type: Type.STRING },
                            B: { type: Type.STRING },
                            C: { type: Type.STRING },
                            D: { type: Type.STRING },
                        },
                        required: ["A", "B", "C", "D"]
                    },
                    answer: { type: Type.STRING, description: "De letter van het correcte antwoord (A, B, C, of D)." },
                },
                required: ["question", "options", "answer"]
            }
        }
    },
    required: ["title", "text", "questions"]
};

export const generateReadingComprehension = async (formData: FormData): Promise<GeneratedContent> => {
    const { groupLevel, textLength, numQuestions, subject } = formData;
    
    const prompt = `
Je bent een educatieve assistent. Genereer een leestekst met multiple-choice-vragen voor begrijpend lezen voor de Nederlandse basisschool.

**Parameters:**
- **Groepsniveau:** ${groupLevel}
- **Lengte van de tekst:** ${textLength} (kort ≈ 100-150 woorden, middel ≈ 150-250 woorden, lang ≈ 250-400 woorden)
- **Aantal vragen:** ${numQuestions}
- **Onderwerp van de tekst:** ${subject}

**Instructies:**
1. Schrijf een Nederlandse tekst over het opgegeven onderwerp. Pas de woordenschat, zinsbouw en inhoud aan het gekozen groepsniveau aan. Houd je aan de gewenste lengte. Verdeel de tekst in logische alinea's om de leesbaarheid te vergroten.
2. Bedenk een pakkende, korte titel voor de tekst.
3. Maak ${numQuestions} multiple-choice-vragen over de tekst.
4. Voor iedere vraag:
   - Formuleer een duidelijke vraag die begrijpend lezen toetst.
   - Geef vier antwoordopties (A, B, C, D) waarvan er één correct is. De foute antwoorden moeten plausibel lijken.
   - Geef aan wat het juiste antwoord is met de letter (A, B, C, of D).

Lever het resultaat op als een JSON-object dat voldoet aan het opgegeven schema.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\s*|```\s*$/g, '');
        const generatedContent: GeneratedContent = JSON.parse(cleanedJsonText);
        
        if (!generatedContent.title || !generatedContent.text || !generatedContent.questions) {
            throw new Error("Ongeldige response van de AI. Probeer het opnieuw.");
        }

        return generatedContent;
    } catch (error) {
        console.error("Fout bij het genereren van content:", error);
        throw new Error("Er is een fout opgetreden bij het communiceren met de AI. Controleer de console voor details.");
    }
};