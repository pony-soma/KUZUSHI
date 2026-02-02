import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedReply {
    id: string;
    timestamp: number;
    situation: {
        message: string;
        // 変更: 古い targetType などを廃止し、まとめて details という文字列で保存することにしました
        details: string;
    };
    type: string;
    label: string;
    text: string;
    explanation: string;
}

const HISTORY_KEY = 'kuzushi_history';

export const saveReply = async (reply: Omit<SavedReply, 'id' | 'timestamp'>) => {
    try {
        const history = await getHistory();
        const newReply: SavedReply = {
            ...reply,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };
        const updatedHistory = [newReply, ...history];
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return newReply;
    } catch (e) {
        console.error('Failed to save reply', e);
        throw e;
    }
};

export const getHistory = async (): Promise<SavedReply[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
        // エラー回避: 古いデータ構造が混ざっていても落ちないようにする
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to load history', e);
        return [];
    }
};

export const deleteReply = async (id: string) => {
    try {
        const history = await getHistory();
        const updatedHistory = history.filter((item) => item.id !== id);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
    } catch (e) {
        console.error('Failed to delete reply', e);
        throw e;
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error('Failed to clear history', e);
        throw e;
    }
};