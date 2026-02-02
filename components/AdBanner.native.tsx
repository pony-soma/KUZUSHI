import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// ★本番用の広告ユニットID（/ スラッシュが入っている方）
// 開発中（__DEV__がtrue）は自動でGoogleのテスト用IDに切り替わる安全設計です
const adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-7911846990308189/3549867697';

export default function AdBanner() {
    return (
        <View style={styles.container}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0', // 読み込み中の背景色
        width: '100%',
        paddingVertical: 5, // 見た目の調整
    },
});