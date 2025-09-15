import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Skill } from '../entities/Skill.js';
import { AppDataSource } from '../data-source.js';

export class LLMService {
    private static genAI: GoogleGenerativeAI;
    private static model: any;

    static initialize() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not found. LLM features will be disabled.');
            return;
        }

        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 100,
                },
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                ],
            });
            console.log('Gemini AI initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Gemini AI:', error);
        }
    }

    static async identifySkillsFromTitle(title: string): Promise<Skill[]> {
        if (!this.model) {
            console.warn('LLM model not initialized. Cannot identify skills.');
            return [];
        }

        try {
            const prompt = this.createSkillIdentificationPrompt(title);
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            return await this.parseLLMResponse(text);
        } catch (error) {
            console.error('Gemini API call failed:', error);
            return [];
        }
    }

    private static createSkillIdentificationPrompt(title: string): string {
        return `
Analyze this software development task title and identify the required technical skills.
Only respond with skill names from this exact list: Frontend, Backend.
If multiple skills are required, return them as a comma-separated list.
If no skills match, return "None".

Task title: "${title}"

Examples:
- "Create responsive homepage" → "Frontend"
- "Implement API authentication" → "Backend" 
- "Build user profile system" → "Frontend,Backend"
- "Write documentation" → "None"

Your response (only skill names or "None"):
`;
    }

    private static async parseLLMResponse(response: string): Promise<Skill[]> {
        const skillRepo = AppDataSource.getRepository(Skill);
        const allSkills = await skillRepo.find();

        if (response === 'None' || !response) {
            return [];
        }

        const identifiedSkillNames = response
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill && skill !== 'None');

        const skills: Skill[] = [];

        for (const skillName of identifiedSkillNames) {
            const skill = allSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
            if (skill) {
                skills.push(skill);
            }
        }

        return skills;
    }

    static async identifySkillsForMultipleTitles(titles: string[]): Promise<Map<string, Skill[]>> {
        const results = new Map<string, Skill[]>();

        for (const title of titles) {
            const skills = await this.identifySkillsFromTitle(title);
            results.set(title, skills);
        }

        return results;
    }
}

// Initialize when module loads
LLMService.initialize();
