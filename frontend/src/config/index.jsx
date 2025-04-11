const {default:axios} =require('axios');

export const base_url="https://mel-jol.onrender.com"

export const clientServer=axios.create({
    baseURL:base_url
})