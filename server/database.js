import dotenv from 'dotenv'
import mongoose from 'mongoose'
dotenv.config()

const url = process.env.VITE_DATABASE_URI;

export const databaseInit = () => {
    mongoose.connect(url)
        .then(() => {
            console.log('CONNECTED TO THE DATABASE');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error.message);
        });
};

const ordersSchema = new mongoose.Schema({ 
    round: Number,
    slim: Number,
    total: Number,
    isOwned: Boolean,
    status: String,
    username: String,
});
const adminSchema = new mongoose.Schema({
    username: String,
    password: String,
    // Add other relevant fields
}, { timestamps: true });

export const Orders = mongoose.model('Order', ordersSchema, 'orders');
export const Customers = mongoose.model('Customer', new mongoose.Schema(), 'users');
export const Admin = mongoose.model('Admin', adminSchema, 'admin');
