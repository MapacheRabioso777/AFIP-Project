/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable dark mode with class strategy
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Light theme colors - Más claros y brillantes
                light: {
                    bg: '#F8FAFC',           // Fondo principal muy claro
                    surface: '#FFFFFF',       // Blanco puro para tarjetas
                    border: '#E2E8F0',        // Bordes suaves
                    text: {
                        primary: '#0F172A',   // Texto principal oscuro
                        secondary: '#475569',  // Texto secundario
                        tertiary: '#64748B',   // Texto terciario
                    }
                },
                // Dark theme colors
                dark: {
                    bg: '#0A0E27',        // Fondo principal oscuro
                    'bg-secondary': '#141B34', // Fondo secundario
                    'bg-tertiary': '#1E2640',  // Fondo terciario
                    surface: '#1A1F3A',   // Superficie de tarjetas
                    border: '#2A3354',    // Bordes
                },
                // Blue accent colors
                primary: {
                    50: '#E6F7FF',
                    100: '#BAE7FF',
                    200: '#91D5FF',
                    300: '#69C0FF',
                    400: '#40A9FF',
                    500: '#1890FF',  // Azul principal brillante
                    600: '#0E7CFF',  // Azul vibrante (hover)
                    700: '#0969DA',
                    800: '#0550AE',
                    900: '#033D8B',
                },
                // Text colors - Para modo oscuro
                text: {
                    primary: '#FFFFFF',      // Blanco puro para mejor visibilidad
                    secondary: '#B4B8BD',    // Gris más claro
                    tertiary: '#8A9099',     // Gris medio más claro
                    disabled: '#4A5057',     // Texto deshabilitado
                },
                success: {
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                },
                danger: {
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                },
                warning: {
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #1890FF 0%, #0E7CFF 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0A0E27 0%, #141B34 100%)',
                'gradient-dark-surface': 'linear-gradient(135deg, #1A1F3A 0%, #1E2640 100%)',
            },
            boxShadow: {
                'primary-sm': '0 1px 2px 0 rgba(24, 144, 255, 0.15)',
                'primary': '0 4px 6px -1px rgba(24, 144, 255, 0.3), 0 2px 4px -1px rgba(24, 144, 255, 0.2)',
                'primary-md': '0 10px 15px -3px rgba(24, 144, 255, 0.4), 0 4px 6px -2px rgba(24, 144, 255, 0.3)',
                'primary-lg': '0 20px 25px -5px rgba(24, 144, 255, 0.5), 0 10px 10px -5px rgba(24, 144, 255, 0.4)',
                'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                'dark-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            },
        },
    },
    plugins: [],
}
