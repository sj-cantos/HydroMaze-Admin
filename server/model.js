import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const Admin = mongoose.model('admin', AdminSchema);

export default Admin;