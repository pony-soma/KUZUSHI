import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Web版のルートHTML設定
 * ここにAdSenseのスクリプトタグを埋め込みます
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="ja">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/* Expo Routerのデフォルトスタイル */}
                <ScrollViewStyleReset />

                {/* ▼▼▼ Google AdSenseのスクリプト ▼▼▼ */}
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-app-pub-7911846990308189/3549867697" // ★あなたのパブリッシャーIDを入れてください
                    crossOrigin="anonymous"
                />
                {/* ▲▲▲ ここまで ▲▲▲ */}
            </head>
            <body>{children}</body>
        </html>
    );
}