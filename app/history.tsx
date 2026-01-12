import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { Text, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/Colors';
import { getHistory, deleteReply, SavedReply } from '../lib/storage';

export default function HistoryScreen() {
    const [history, setHistory] = useState<SavedReply[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        setLoading(true);
        const data = await getHistory();
        setHistory(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        // Webブラウザの場合
        if (Platform.OS === 'web') {
            // window.confirm はブラウザ標準の「OK/キャンセル」ダイアログを出します
            if (window.confirm("この履歴を削除しますか？")) {
                await deleteReply(id);
                loadHistory(); // 画面を更新
            }
            return;
        }

        // スマホアプリ（iOS/Android）の場合
        Alert.alert(
            "削除",
            "この履歴を削除しますか？",
            [
                { text: "キャンセル", style: "cancel" },
                {
                    text: "削除",
                    style: "destructive",
                    onPress: async () => {
                        await deleteReply(id);
                        loadHistory();
                    }
                }
            ]
        );
    };

    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied', 'コピーしました');
    };

    const renderItem = ({ item }: { item: SavedReply }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleMedium" style={{ color: _getLabelColor(item.type), fontWeight: 'bold' }}>
                        {item.label}
                    </Text>
                    <Text style={styles.date}>{new Date(item.timestamp).toLocaleDateString()}</Text>
                </View>

                <View style={styles.situationContainer}>
                    <Text style={styles.situationLabel}>To: {item.situation.relation} ({item.situation.opponentType})</Text>
                    <Text style={styles.situationMsg} numberOfLines={1}>Msg: {item.situation.message}</Text>
                </View>

                <Text style={styles.replyText}>{item.text}</Text>

                <View style={styles.actions}>
                    <IconButton icon="content-copy" iconColor={Colors.secondaryText} size={20} onPress={() => copyToClipboard(item.text)} />
                    <IconButton icon="delete" iconColor="#E94560" size={20} onPress={() => handleDelete(item.id)} />
                </View>

            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>保存された履歴はありません</Text>
                    </View>
                }
            />
        </View>
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
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    list: {
        padding: 16,
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
    date: {
        color: '#A0A0A0',
        fontSize: 12,
    },
    situationContainer: {
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#0F3460',
    },
    situationLabel: {
        color: '#A0A0A0',
        fontSize: 12,
        fontWeight: 'bold',
    },
    situationMsg: {
        color: '#808080',
        fontSize: 12,
        fontStyle: 'italic',
    },
    replyText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        color: '#A0A0A0',
        fontSize: 16,
    }
});
