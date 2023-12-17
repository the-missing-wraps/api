import dotenv from 'dotenv';
dotenv.config();

export default {
    API: {
        PORT: process.env.API_PORT ? +process.env.API_PORT : 3000,
        HOST: process.env.API_HOST ?? 'localhost'
    },
    MONGODB: {
        URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
        DATABASE: process.env.MONGODB_DATABASE ?? 'test'
    }
};
