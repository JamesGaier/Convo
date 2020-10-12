import mongoose, { model, Document } from 'mongoose';

export interface MessagesI {
    name: string,
    messages: Array<string>
}
export interface MessagesModelI  extends Document{}

const messagesSchema = new mongoose.Schema({
    name: {
        type: String
    },
    messages: {
        type: [],
        required: true
    }
});

export default model<MessagesModelI>('Messages', messagesSchema);