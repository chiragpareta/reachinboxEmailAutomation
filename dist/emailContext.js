"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyEmailContext = classifyEmailContext;
exports.generateReply = generateReply;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
/**
 * Classify email context based on its content.
 */
async function classifyEmailContext(emailText) {
    try {
        const response = await openai.completions.create({
            model: 'text-davinci-003',
            prompt: `Classify the following email content into categories: Interested, Not Interested, More information. Email content: ${emailText}`,
            max_tokens: 50,
        });
        return response.choices[0].text.trim();
    }
    catch (error) {
        console.error('Error classifying email context:', error);
        throw error;
    }
}
/**
 * Generate an automated reply based on email context.
 */
async function generateReply(emailText) {
    try {
        const response = await openai.completions.create({
            model: 'text-davinci-003',
            prompt: `Generate an appropriate response for the following email content: ${emailText}`,
            max_tokens: 150,
        });
        return response.choices[0].text.trim();
    }
    catch (error) {
        console.error('Error generating reply:', error);
        throw error;
    }
}
