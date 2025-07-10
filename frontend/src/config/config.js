// Environment configuration
const config = {
  API_BASE_URL: import.meta.env.PROD 
    ? '/api' 
    : 'http://localhost:5000/api' || 'https:wyreflow-assignment.onrender.com/api' // Development && //Production

};

export default config;
