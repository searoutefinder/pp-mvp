export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      padding: {
        'safe-top': 'env(safe-area-inset-top, 16px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 16px)',
      },
      margin: {
        'safe-top': 'env(safe-area-inset-top, 16px)',
        'safe-bottom': 'env(safe-area-inset-bottom, 16px)',
      }         
    },
  },
  plugins: [],
};
