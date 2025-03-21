const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zipCode: { type: String, default: '' },
            country: { type: String, default: '' },
        },
        role: { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
        bio: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
