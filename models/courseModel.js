import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, default: 'General' },
    published: { type: Boolean, default: false },
    lessons: [{ title: String, content: String, duration: String }],
}, {
    timestamps: true,
});

export default mongoose.model('Course', courseSchema);