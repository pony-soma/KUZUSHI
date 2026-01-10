import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/Colors';
import { generateReplies } from '../lib/openai';

export default function ResultScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { message, relation, opponentType } = params;

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Generate replies on mount
        const fetchReplies = async () => {
            try {
                const data = await generateReplies(
                    message as string,
                    relation as string,
                    opponentType as string
                );
                setResults(data);
            } catch (error) {
                Alert.alert('Error', 'Failed to generate replies');
            } finally {
                setLoading(false);
            }
        };
        fetchReplies();
    }, []);

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied', '返信案をコピーしました');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 16, color: Colors.text }}>AIが思考中...</Text>
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
                            <Text variant="titleMedium" style={{ color: _getLabelColor(item.type), fontWeight: 'bold' }}>
                                {item.label}
                            </Text>
                            <IconButton icon="content-copy" iconColor={Colors.secondaryText} size={20} onPress={() => copyToClipboard(item.body)} />
                        </View>
                        <Text variant="bodyLarge" style={styles.replyText}>
                            {item.body}
                        </Text>
                        <View style={styles.explanationBox}>
                            <Text style={styles.explanationTitle}>心理ポイント</Text>
                            <Text style={styles.explanationText}>{item.explanation}</Text>
                        </View>
                    </Card.Content>
                </Card>
            ))}

            <Button mode="outlined" onPress={() => router.back()} style={styles.backButton} textColor={Colors.text}>
                条件を変えてやり直す
            </Button>
        </ScrollView>
    );
}

function _getLabelColor(type: string) {
    switch (type) {
        case 'A': return '#4ecca3'; // Green/Comfort
        case 'B': return '#E94560'; // Red/PushPull
        case 'C': return '#fcdab7'; // Orange/Humor
        default: return '#fff';
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#16213E',
        borderColor: '#0F3460',
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    replyText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#A0A0A0',
        paddingLeft: 10,
    },
    explanationBox: {
        backgroundColor: '#0F3460',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
    },
    explanationTitle: {
        fontSize: 12,
        color: '#A0A0A0',
        marginBottom: 4,
    },
    explanationText: {
        color: '#dcdcdc',
        fontSize: 13,
    },
    backButton: {
        marginTop: 16,
        borderColor: '#A0A0A0',
    }
});
