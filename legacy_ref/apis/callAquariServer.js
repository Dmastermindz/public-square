import axios from 'axios';

export default axios.create({
    // baseURL: "http://localhost:3007/api/v1"  // Use In Development to Defeat CORS
    // baseURL:"https://e3491c1da0df.ngrok.app/api/v1"   // Use in Development to Defeat CORS Mobile (Applies to Backend Server)
    baseURL:"https://app.aquari.org/api/v1"   // Use in Production to Defeat CORS
});