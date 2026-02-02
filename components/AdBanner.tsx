import React, { useEffect, useRef } from 'react';
import { View, Text, Platform } from 'react-native';

export default function AdBanner() {
    // 開発中は広告を出さない（誤クリック防止）
    if (__DEV__) {
        return (
            <View style={{ padding: 20, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
                <Text style={{ color: '#888' }}>（開発モード：ここにAdSenseが表示されます）</Text>
            </View>
        );
    }

    const adRef = useRef<boolean>(false);

    useEffect(() => {
        // コンポーネントがマウントされた後に広告をリクエストする
        try {
            if (typeof window !== 'undefined' && !adRef.current) {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                adRef.current = true;
            }
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    return (
        <View style={{ alignItems: 'center', marginVertical: 10, overflow: 'hidden' }}>
            {/* HTMLを直接埋め込むためのコンテナ */}
            <div style={{ display: 'block', minHeight: '90px', width: '100%' }}>
                <ins
                    className="adsbygoogle"
                    style={{ display: 'block' }}
                    data-ad-client="ca-app-pub-7911846990308189/3549867697" // ★ここにパブリッシャーID
                    data-ad-slot="YYYYYYYYYY"               // ★ここに広告ユニットID
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        </View>
    );
}