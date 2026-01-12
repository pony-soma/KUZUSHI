import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Chip, HelperText, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

const RELATIONS = ['初対面', '脈あり', '喧嘩中', '冷め気味', '客とキャスト'];
const TYPES = ['論理的', '感情的', '年上', '年下'];

export default function InputScreen() {
    const router = useRouter();
    const theme = useTheme();

    const [message, setMessage] = useState('');
    const [relation, setRelation] = useState('');
    const [opponentType, setOpponentType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!message || !relation || !opponentType) return;

        setLoading(true);
        // Simulate processing delay for MVP feel
        setTimeout(() => {
            setLoading(false);
            router.push({
                pathname: '/result',
                params: { message, relation, opponentType }
            });
        }, 1000); // 1s delay
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text variant="headlineMedium" style={[styles.title, { color: Colors.text }]}>
                    シチュエーション入力
                </Text>
                <Button mode="text" icon="history" onPress={() => router.push('/history')} textColor="#4ecca3">
                    履歴
                </Button>
            </View>

            <Text variant="titleMedium" style={styles.label}>相手からのメッセージ</Text>
            <TextInput
                mode="outlined"
                multiline
                numberOfLines={4}
                placeholder="例: 「今週末空いてる？」"
                value={message}
                onChangeText={setMessage}
                style={styles.input}
                textColor={Colors.text}
                theme={{ colors: { background: Colors.surface, placeholder: Colors.secondaryText } }}
            />

            <Text variant="titleMedium" style={styles.label}>現在の関係性</Text>
            <View style={styles.chipContainer}>
                {RELATIONS.map((r) => (
                    <Chip
                        key={r}
                        selected={relation === r}
                        onPress={() => setRelation(r)}
                        style={styles.chip}
                        showSelectedOverlay
                    >
                        {r}
                    </Chip>
                ))}
            </View>

            <Text variant="titleMedium" style={styles.label}>相手のタイプ</Text>
            <View style={styles.chipContainer}>
                {TYPES.map((t) => (
                    <Chip
                        key={t}
                        selected={opponentType === t}
                        onPress={() => setOpponentType(t)}
                        style={styles.chip}
                        showSelectedOverlay
                    >
                        {t}
                    </Chip>
                ))}
            </View>

            <Button
                mode="contained"
                onPress={handleGenerate}
                loading={loading}
                disabled={!message || !relation || !opponentType || loading}
                style={styles.button}
                contentStyle={{ paddingVertical: 8 }}
            >
                生成する
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        color: '#A0A0A0',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#16213E',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#16213E',
    },
    button: {
        marginTop: 32,
        backgroundColor: '#E94560', // Accent color
    },
});
