import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#4ecca3', // Branding color, maybe teal or keep simple
        background: Colors.background,
        surface: Colors.surface,
        onSurface: Colors.text,
        secondaryContainer: Colors.accent,
    },
};

export default function RootLayout() {
    return (
        <PaperProvider theme={theme}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: Colors.background },
                    headerTintColor: Colors.text,
                    headerTitleStyle: { fontWeight: 'bold' },
                    contentStyle: { backgroundColor: Colors.background },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'KUZUSHI' }} />
                <Stack.Screen name="result" options={{ title: '返信案' }} />
                <Stack.Screen name="history" options={{ title: '履歴' }} />
            </Stack>
        </PaperProvider>
    );
}
