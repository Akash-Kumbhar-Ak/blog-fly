require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const compression=require('compression');


const postRoutes=require('./routes/postRoutes');
const authRoutes=require('./routes/authRoutes');


const app=express();

app.use(compression());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://blog-fly-frontend.onrender.com'] 
        : process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

const PORT=process.env.PORT || 5000;

app.use('/api/posts',postRoutes);
app.use('/api/auth',authRoutes);

const startServer=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("successfully Connected to the MongoDb database");
        
    app.listen(PORT,()=>{
    console.log(`server started at the port  ${PORT}`);
})
    } catch (error) {
        console.log("failed to connect the database of mongoDB");

        process.exit(1);
        
    }
}
startServer();

