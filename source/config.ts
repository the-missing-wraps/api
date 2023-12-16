import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT ? +process.env.PORT : 3000,
    MONGODB: {
        URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017',
        DATABASE: process.env.MONGODB_DATABASE ?? 'test'
    }
};
