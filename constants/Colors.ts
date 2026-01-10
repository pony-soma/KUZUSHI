export const Colors = {
    background: '#1A1A2E', // Midnight Blue
    surface: '#16213E',    // Slightly lighter blue
    primary: '#E94560',    // Accent (maybe pink/red) - let's check the request. 
    // Request said: "Deep Midnight Blue", text white/light gray.
    // Let's define a Paper theme compatible object or just constants.

    text: '#E0E0E0',
    secondaryText: '#A0A0A0',
    accent: '#0F3460',
};

export const PaperTheme = {
    dark: true,
    colors: {
        primary: '#0F3460',
        onPrimary: '#FFFFFF',
        background: '#1A1A2E',
        surface: '#16213E',
        onSurface: '#E0E0E0',
        text: '#E0E0E0',
        placeholder: '#A0A0A0',
        backdrop: 'rgba(0,0,0,0.5)',
        elevation: {
            level1: '#16213E',
            level2: '#1A1A40',
            level3: '#202050',
        }
        // Add other paper colors as needed
    }
};
