const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    description: String
});