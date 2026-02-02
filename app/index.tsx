import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Chip, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

// プリセット（よく使う項目）
const PERSONALITIES = ['小悪魔ギャル', '清楚系', 'メンヘラ', 'オラオラ系', 'サバサバ'];
const RELATIONS = ['初対面', '指名客(太客)', '指名客(細客)', '色恋', '友達'];

export default function InputScreen() {
    const router = useRouter();

    // 入力ステート
    const [message, setMessage] = useState('');
    const [myPronoun, setMyPronoun] = useState('私'); // デフォルト
    const [opponentName, setOpponentName] = useState('相手');
    const [myPersonality, setMyPersonality] = useState('小悪魔ギャル');
    const [opponentPersonality, setOpponentPersonality] = useState('普通');
    const [relationship, setRelationship] = useState('指名客(太客)');

    const [loading, setLoading] = useState(false);

    const handleGenerate = () => {
        if (!message) return;
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            // 全パラメータを渡す
            router.push({
                pathname: '/result',
                params: {
                    message,
                    myPronoun,
                    opponentName,
                    myPersonality,
                    opponentPersonality,
                    relationship
                }
            });
        }, 800);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text variant="headlineMedium" style={styles.title}>KUZUSHI</Text>
                <Button mode="text" icon="history" onPress={() => router.push('/history')} textColor="#4ecca3">履歴</Button>
            </View>

            {/* 1. 相手のメッセージ */}
            <SectionTitle title="📩 相手からのメッセージ" />
            <TextInput
                mode="outlined"
                multiline
                numberOfLines={3}
                placeholder="「今週末あいてる？」"
                value={message}
                onChangeText={setMessage}
                style={styles.input}
                textColor={Colors.text}
                theme={{ colors: { background: Colors.surface, placeholder: Colors.secondaryText, primary: Colors.primary } }}
            />

            {/* 2. 呼び方設定 */}
            <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <SectionTitle title="🙋‍♀️ 一人称" />
                    <TextInput mode="outlined" value={myPronoun} onChangeText={setMyPronoun} style={styles.smallInput} textColor={Colors.text} />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <SectionTitle title="👉 相手の呼び方" />
                    <TextInput mode="outlined" value={opponentName} onChangeText={setOpponentName} style={styles.smallInput} textColor={Colors.text} />
                </View>
            </View>

            {/* 3. キャラ設定 */}
            <SectionTitle title="💄 自分の性格（キャラ）" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {PERSONALITIES.map(p => (
                    <Chip key={p} selected={myPersonality === p} onPress={() => setMyPersonality(p)} style={styles.chip} showSelectedOverlay>{p}</Chip>
                ))}
            </ScrollView>
            <TextInput mode="outlined" placeholder="自由入力 (例: クールな毒舌)" value={myPersonality} onChangeText={setMyPersonality} style={styles.input} textColor={Colors.text} />

            {/* 4. 関係値 */}
            <SectionTitle title="❤️ 相手との関係" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                {RELATIONS.map(r => (
                    <Chip key={r} selected={relationship === r} onPress={() => setRelationship(r)} style={styles.chip} showSelectedOverlay>{r}</Chip>
                ))}
            </ScrollView>

            <Button mode="contained" onPress={handleGenerate} loading={loading} disabled={!message} style={styles.button} labelStyle={{ fontSize: 18, fontWeight: 'bold' }}>
                返信を生成 🪄
            </Button>
        </ScrollView>
    );
}

const SectionTitle = ({ title }: { title: string }) => (
    <Text style={styles.label}>{title}</Text>
);

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 60, backgroundColor: Colors.background },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, marginTop: 20 },
    title: { fontWeight: 'bold', fontFamily: 'System', color: Colors.text },
    label: { color: '#4ecca3', marginTop: 20, marginBottom: 8, fontWeight: 'bold', fontSize: 14 },
    input: { backgroundColor: '#16213E', fontSize: 14, marginBottom: 8 },
    smallInput: { backgroundColor: '#16213E', fontSize: 14, height: 40 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    chipScroll: { flexDirection: 'row', marginBottom: 8 },
    chip: { backgroundColor: '#16213E', marginRight: 8, borderColor: '#0F3460', borderWidth: 1 },
    button: { marginTop: 40, backgroundColor: '#E94560', borderRadius: 8, paddingVertical: 6 },
});