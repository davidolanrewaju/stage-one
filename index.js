import express from "express";
import { config } from "dotenv";

const app = express();
const PORT = process.env.PORT??5000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}...`));