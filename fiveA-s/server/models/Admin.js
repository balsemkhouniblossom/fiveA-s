const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    description: String
});

const AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel;
