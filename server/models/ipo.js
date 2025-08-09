import mongoose from 'mongoose';

const ipoSchema = new mongoose.Schema({
    company: { type: String, required: true },
    stockCode: { type: String, required: true },
    listingDate: { type: Date, required: true },
    publicOfferingPrice: { type: Number, required: true },
});

const IPO = mongoose.model('IPO', ipoSchema);
export default IPO;
