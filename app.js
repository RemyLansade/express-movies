const express    = require("express");
const bodyParser = require("body-parser");
const https      = require('https');
const multer     = require("multer");
const app        = express();
const upload     = multer();
const port       = 3000;

let frenchMovies = [];

// middleWare
app.use("/public", express.static("public"));
var urlParserEncoded = bodyParser.urlencoded({extended: false});

// EJS 
app.set("views", "./views");
app.set("view engine", "ejs");



// HOME ROOT

app.get("/", (req, res) => {
    res.render("index");
});



// MOVIE ROOT

app.get("/movies", (req, res) => {

    const title = "Films français des trentes dernières années";

    frenchMovies = [ 
        {title: "Le fabuleux destin d'Amélie Poulain", year: 2001 },
        {title: "Buffet froid"                       , year: 1979 },
        {title: "Le diner de cons"                   , year: 1998 },
        {title: "De rouille et d'os"                 , year: 2012 },
    ];

    res.render("movies", { movies: frenchMovies, title: title});
});

app.post('/movies', upload.fields([]), (req, res) => {
    if (!req.body) {
        res.sendStatus(500);
    } else {
        const formData = req.body;
        // console.log('Form data: ', formData);
        const newMovie = { title: formData.movieTitle, year: formData.movieYear};
        frenchMovies = [...frenchMovies, newMovie];
        res.sendStatus(201);
    }
});

app.post("/movies-old-browser", urlParserEncoded, (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    } else {        
        const formData = req.body;
        frenchMovies = [... frenchMovies, { title: formData.movietitle, year: formData.movieyear }];
        res.sendStatus(201);
    }
});


app.get("/movies/add", (req, res) => {
    res.send("Prochainement un formulaire d'ajout ici.");
});


app.get("/movie/:id/:title", (req, res) => {

    const id    = req.params.id;
    const title = req.params.title;

    res.render("movie-details", {movieId : id, movieTitle: title});
});



// SEARCH ROOT

app.get("/movie-search", (req, res) => {
    res.render('movie-search');
});

// app.post("/movie-search", urlParserEncoded, (req, res) => {

//     const key = '5629071ccbd3e8676ff2ecf0ecf28dbd';
//     const query = req.body.term;
//     const language = 'fr-FR';
//     const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${query}&language=${language}`

//     https.get(url, function(response, error) {
//         if(response){
//             response.on("data", function(data){
//                 const movieApi = JSON.parse(data);
//                 console.log(movieApi.results[0].title);
//             });
//         } else {
//             console.log('Error : ', error);
//         }
//     })

//     res.redirect('/');
// });




app.listen(port, () => {
    console.log(`Listening on port: ${port}.`);
});