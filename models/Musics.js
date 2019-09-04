// importing mongoose 
const mongoose = require('mongoose');



// import schema
const Schema = mongoose.Schema;

let musicSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    song_Name: {
        type: String,
        default: ''
    },
    album_Name: {
        type: String,
        default: ''
    },
    release_date: {
        type: Date,
        default: new Date(),
    },
    description: {
        type: String,
        default: ''
    },
    song_image_uri: {
        type: '',
        default: ''
    },
    song_uri: {
        type: '',
        default: ''
    },
    home_featured: {
        type: Boolean,
        default: true,
    },
    singers_Name: []
})


module.exports = mongoose.model('Musics', musicSchema);
