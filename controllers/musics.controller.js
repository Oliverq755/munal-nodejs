const mongoose = require('mongoose');



/* Models */
const Music = mongoose.model('Musics');

let helloWorldFunc = (req, res) => res.send('Hello World');

let addMusicsFunction = (req, res, next) => {
    // res.send('music controller executed');
    console.log(req.body,"req")
    let musics = new Music ({
        _id: new mongoose.Types.ObjectId(),
        song_Name: req.body.songName,
        album_Name: req.body.albumName,
        release_date: req.body.releaseDate,
        description: req.body.description,
        song_image_uri: req.body.songImageURI,
        song_uri: req.body.songURI,
        home_featured: req.body.homeFeatured,
        singers_Name: req.body.singersName
    });
    musics
        .save()
        .then(result => {
            res.status(201).json({
                message: "Handling POST requests to /products",
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

let getAllMusics = (req, res) => {
    
}


module.exports = {
    helloWorldFunc,
    addMusicsFunction
}