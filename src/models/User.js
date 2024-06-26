import mongoose from "mongoose";

const { Schema, model } = mongoose;
// const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

export default model('User', userSchema);