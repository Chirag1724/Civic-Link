/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E5A8E',
          light: '#2E7AB8',
          dark: '#0D3A5F',
        },
        accent: {
          green: '#2E865F',
          'green-light': '#3FA872',
        },
        status: {
          urgent: '#D32F2F',
          'urgent-bg': '#FFEBEE',
          medium: '#FF8C00',
          'medium-bg': '#FFF3E0',
          low: '#FFA726',
          'low-bg': '#FFF8E1',
          progress: '#1976D2',
          'progress-bg': '#E3F2FD',
          resolved: '#388E3C',
          'resolved-bg': '#E8F5E9',
          pending: '#757575',
          'pending-bg': '#F5F5F5',
        },
        bg: {
          primary: '#F8F9FB',
          secondary: '#FFFFFF',
          tertiary: '#E8EDF2',
        },
      },
    },
  },
  plugins: [],
}