import mongoose, { Mongoose } from "mongoose";

const dbConnectionString = process.env.NODE_ENV === 'production'
    ? process.env.DB_CONNECTION!.replace('<password>', process.env.DB_PASSWORD!).replace('<username>', process.env.DB_USERNAME!)
    : process.env.mongo_URIS!

mongoose.connect(dbConnectionString).then(() => {
    console.log('Connected successfully to MongoDB')
}).catch((error: Error) => {
    console.error('Connection error:', error.message)
})

const db = mongoose.connection;

db.on('error', (error: Error) => {
    console.error('MongoDB connection error:', error.message)
})


export default db