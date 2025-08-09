import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ticker: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    description: { type: String },
    logo: { type: String },
    listingDate: { type: Date },
});


const UserSchema = new mongoose.Schema({
    name: String,
    phone: String,
    username: { type: String, unique: true },
    password: String,
    brokerage: String,
    accountNumber: String,
    balance: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;