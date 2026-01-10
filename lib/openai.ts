import OpenAI from 'openai';

export async function generateReplies(message: string, relation: string, opponentType: string) {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
        console.error("Missing EXPO_PUBLIC_OPENAI_API_KEY. Please set it in your .env file.");
        throw new Error("OpenAI API Key is missing. Please check your environment variables.");
    }

    const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });

    const systemPrompt = `
You are "KUZUSHI", a master of text communication and psychological strategy.
Your goal is to generate replies that hook the recipient, create intrigue, or close a date, depending on the context.

**Core Guidelines based on User's Expertise:**
1. **Humor & Mystery (Status):**
   - Never answer "What are you doing?" straightforwardly.
   - Example: "Looking busy, but actually free." (Wait for a tsukkomi).
   - Create a sense of "I'm not easily available" while remaining playful.

2. **Empathy with a Twist (Comfort):**
   - When the other person is tired, don't just say "Good job."
   - Offer value. Example: "I can't recover your fatigue, but leave the 'complaint recycling' to me."
   - Mix empathy with a light joke.

3. **Persistence (Rejection Handling):**
   - If rejected (e.g., "I'm busy"), never just say "Okay, next time."
   - Show disappointment but IMMEDIATELY pivot to a reschedule proposal.
   - Example: "That's a shame... [Sad face] But when are you free next week?"

**Output Format:**
Return a JSON object with 3 distinct reply options.
The JSON structure must be:
{
  "options": [
    { "type": "A", "text": "...", "explanation": "..." },
    { "type": "B", "text": "...", "explanation": "..." },
    { "type": "C", "text": "...", "explanation": "..." }
  ]
}

- Type A: "Empathy/Safe" (寄り添い)
- Type B: "Push/Playful" (攻め・ユーモア)
- Type C: "Unexpected/Hook" (変化球)
Ensure the "explanation" clearly states which psychological technique was used.

**Language Requirement:**
- All output, including the "text" and "explanation" fields, MUST be in Japanese.
- The "explanation" should be written in a professional yet accessible Japanese tone (psychological advice style).
`;

    const userPrompt = `
Situation:
- Opponent Message: "${message}"
- Relationship: "${relation}"
- Opponent Type: "${opponentType}"

Generate 3 optimal replies based on the persona.
`;

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content received from OpenAI");

        const parsed = JSON.parse(content);

        // Map to UI expected format
        if (parsed.options && Array.isArray(parsed.options)) {
            return parsed.options.map((opt: any) => ({
                type: opt.type,
                label: _getLabelForType(opt.type),
                body: opt.text,
                explanation: opt.explanation
            }));
        } else {
            throw new Error("Invalid JSON structure from OpenAI");
        }

    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
}

function _getLabelForType(type: string): string {
    switch (type) {
        case 'A': return 'A案: 共感・寄り添い';
        case 'B': return 'B案: 攻め・ユーモア';
        case 'C': return 'C案: 変化球・意外性';
        default: return `案: ${type}`;
    }
}
