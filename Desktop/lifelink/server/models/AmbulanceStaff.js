const mongoose = require('mongoose')

const AmbulanceStaffSchema = new mongoose.Schema({
    contactNumber: Number
});

const AmbulanceStaffModel = mongoose.model("ambulanceStaff", AmbulanceStaffSchema);
module.exports = AmbulanceStaffModel;
