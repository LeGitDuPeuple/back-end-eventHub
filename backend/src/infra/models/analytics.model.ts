import mongoose from "mongoose";

const UserEventSchema = new mongoose.Schema({
    eventName: { type: String, default: "user_registration" },
    userId: String, 
    userEmail: String,
    timestamp: { type: Date, default: Date.now }
});

export const UserEventModel = mongoose.model("UserEvent", UserEventSchema);