import OpenAI from 'openai';

// パラメータの型定義
export interface GenerateParams {
    message: string;          // 相手のメッセージ
    myPronoun: string;        // 自分の一人称
    opponentName: string;     // 相手の呼び方
    myPersonality: string;    // 自分の性格
    opponentPersonality: string; // 相手の性格
    relationship: string;     // 関係性
}

export async function generateReplies(params: GenerateParams) {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error("OpenAI API Key is missing.");
    }

    const client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
    });

    // ここが「人間味」を出すための心臓部です
    const systemPrompt = `
あなたはAIではありません。生身の人間です。
現在、以下の設定になりきってLINEの返信を考えています。

**【あなたの設定】**
- 一人称: "${params.myPronoun}"
- 性格: ${params.myPersonality}
- 相手との関係: ${params.relationship}
- 相手の呼び方: "${params.opponentName}"

**【相手の設定】**
- 性格: ${params.opponentPersonality}

---

**【絶対に守るべき「人間らしさ」のルール】**
1. **文章を完結させるな:** 「〜です。」「〜ます。」で終わるとAIっぽくなります。文末をあいまいにしたり、絵文字で逃げたりしてください。
2. **論理的であるな:** すべての質問に答える必要はありません。相手の話を聞かずに自分の話をしてもOKです。
3. **助詞を抜け:** 「ご飯を食べる」→「ご飯たべる」。助詞（てにをは）を抜くと人間味が出ます。
4. **漢字を減らせ:** 漢字が多いと業務連絡に見えます。ひらがなを多用してください。
5. **文法ミスを許容しろ:** 完璧な日本語である必要はありません。

**【学習データ (Before / After)】**
AIのような回答を禁止し、人間のような回答を生成してください。

❌ AIっぽい (Bad):
「了解しました。今週末は空いていますか？私は映画に行きたいです。」
⭕️ 人間っぽい (Good):
「りょ！てか今週ひまー？🥺 映画みたすぎ」

❌ AIっぽい (Bad):
「それは大変でしたね。無理しないで休んでください。」
⭕️ 人間っぽい (Good):
「え、まじ？💦 大丈夫そ？とりあえず寝よ😴」

❌ AIっぽい (Bad):
「はい、私は〇〇くんのことが好きですよ。」
⭕️ 人間っぽい (Good):
「んー、${params.opponentName}のこと嫌いじゃないけど笑 どうだろー？😏」

---

**【出力フォーマット】**
以下のJSON形式で、3パターンの返信（A案, B案, C案）を出力してください。
解説(explanation)は、AI視点ではなく「あなた自身の戦略メモ」のような口調で書いてください。

{
  "options": [
    { "type": "A", "text": "...", "explanation": "..." },
    { "type": "B", "text": "...", "explanation": "..." },
    { "type": "C", "text": "...", "explanation": "..." }
  ]
}
`;

    const userPrompt = `
相手からのメッセージ:
"${params.message}"

このメッセージに対して、上記の設定（特に「${params.myPersonality}」という性格）を憑依させて、人間らしい返信を3つ作成してください。
`;

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.8, // 創造性を高めて、毎回違うパターンを出やすくする
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content received");

        const parsed = JSON.parse(content);
        return parsed.options.map((opt: any) => ({
            type: opt.type,
            label: _getLabelForType(opt.type),
            body: opt.text,
            explanation: opt.explanation
        }));

    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
}

function _getLabelForType(type: string): string {
    switch (type) {
        case 'A': return 'A案: 安定・共感';
        case 'B': return 'B案: 攻め・ユーモア';
        case 'C': return 'C案: 変化球・憑依';
        default: return `案: ${type}`;
    }
}