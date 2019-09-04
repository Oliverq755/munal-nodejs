const mongoose = require('mongoose');
const Musics = require('../models/Musics');

// import schema
const Schema = mongoose.Schema;

const instaPostSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    post_caption: {
        type: String,
        default: ''
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Musics'
    },
    post_image: {
        type: String,
        required:true
    },
    likes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Musics' }]
    },
    created_on: {
        type: Date
    }
    
})

module.exports = mongoose.model('InstaPost', instaPostSchema);