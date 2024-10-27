import express from "express";
import 'dotenv/config'

const app = express();


// Use JSON middleware
app.use(express.json());


//Set Up Database
import './src/core/db'

// Start your server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
