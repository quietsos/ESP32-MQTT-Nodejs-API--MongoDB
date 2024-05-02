import mongoose from "mongoose";

const esp32Schema = new mongoose.Schema({
    sensorMac : {type : String},
    currentCM : {type : Number},
    batteryLevel : {type : Number},
    signalStrength : {type: Number}
});

export const esp32DataSchema = mongoose.model('esp32', esp32Schema, 'esp32');