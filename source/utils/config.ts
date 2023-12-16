import path from "node:path";
import dotenv from "dotenv";
dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

export default {
  MONGODB: {
    URI: process.env.MONGODB_URI ?? "mongodb://localhost:27017",
    DATABASE: process.env.MONGODB_DATABASE ?? "test",
  },
};
