// Environment configuration
const config = {
  API_BASE_URL: import.meta.env.PROD 
    ? '/api' // Production (Vercel)
    : 'http://localhost:5000/api' // Development
};

export default config;
