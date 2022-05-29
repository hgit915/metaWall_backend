const mongoose = require('mongoose')
const addImgSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        img: {
            type: String,
            default: []
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // select: false
        },
    },
    {
        versionKey: false,
        new: true,
    }
);
const addImgs = mongoose.model('imglibery', addImgSchema)

module.exports = addImgs