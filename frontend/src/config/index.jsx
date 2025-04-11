const {default:axios} =require('axios');

export const base_url="http://localhost:9080"

export const clientServer=axios.create({
    baseURL:base_url
})