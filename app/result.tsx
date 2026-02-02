import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/Colors';
import { generateReplies, GenerateParams } from '../lib/openai';
import { saveReply } from '../lib/storage';

export default function ResultScreen() {
    const router = useRouter();
    // 全パラメータを受け取る
    const params = useLocalSearchParams() as unknown as GenerateParams;

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                // OpenAIに全パラメータを渡す
                const data = await generateReplies(params);
                setResults(data);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'AIの思考回路がショートしました...');
            } finally {
                setLoading(false);
            }
        };
        fetchReplies();
    }, []);

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied', 'コピーしました！');
    };

    const handleSave = async (item: any) => {
        try {
            await saveReply({
                situation: {
                    message: params.message,
                    // 詳細な設定を保存
                    details: `一人称:${params.myPronoun} / 相手:${params.opponentName} / 性格:${params.myPersonality} / 関係:${params.relationship}`
                },
                type: item.type,
                label: item.label,
                text: item.body,
                explanation: item.explanation,
            });
            Alert.alert("保存しました", "履歴タブから確認できます");
        } catch (error) {
            Alert.alert("Error", "保存に失敗しました");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 16, color: Colors.text }}>性格と関係性をインストール中...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>AI提案: 3つのアプローチ</Text>
            {results.map((item, index) => (
                <Card key={index} style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardHeader}>
                            <Text variant="titleMedium" style={{ color: _getLabelColor(item.type), fontWeight: 'bold' }}>{item.label}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <IconButton icon="content-save" iconColor={Colors.secondaryText} size={20} onPress={() => handleSave(item)} />
                                <IconButton icon="content-copy" iconColor={Colors.secondaryText} size={20} onPress={() => copyToClipboard(item.body)} />
                            </View>
                        </View>
                        <Text variant="bodyLarge" style={styles.replyText}>{item.body}</Text>
                        <View style={styles.explanationBox}>
                            <Text style={styles.explanationTitle}>💡 心理テクニック</Text>
                            <Text style={styles.explanationText}>{item.explanation}</Text>
                        </View>
                    </Card.Content>
                </Card>
            ))}
            <Button mode="outlined" onPress={() => router.back()} style={styles.backButton} textColor={Colors.text}>条件を変えてやり直す</Button>
        </ScrollView>
    );
}

function _getLabelColor(type: string) {
    switch (type) {
        case 'A': return '#4ecca3';
        case 'B': return '#ff758f';
        case 'C': return '#fcdab7';
        default: return '#fff';
    }
}

const styles = StyleSheet.create({
    container: { padding: 16, paddingBottom: 40, backgroundColor: Colors.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
    header: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 16, textAlign: 'center' },
    card: { marginBottom: 16, backgroundColor: '#16213E', borderColor: '#0F3460', borderWidth: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    replyText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#A0A0A0', paddingLeft: 10 },
    explanationBox: { backgroundColor: 'rgba(15, 52, 96, 0.5)', padding: 10, borderRadius: 8, marginTop: 8 },
    explanationTitle: { fontSize: 12, fontWeight: 'bold', color: '#A0A0A0', marginBottom: 4 },
    explanationText: { color: '#dcdcdc', fontSize: 13 },
    backButton: { marginTop: 16, borderColor: '#A0A0A0' }
});