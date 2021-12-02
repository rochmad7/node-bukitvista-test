const { validationResult } = require('express-validator');
const axios = require('axios');

const { FavoriteMovie } = require('../models');

exports.getMovies = async (req, res) => {
    res.sendStatus(403);
};

exports.getMovieByTitle = async (req, res) => {
    const title = req.params.title;

    try {
        let movie = await axios(`${process.env.OMDB_API}&t=${title}`);
        if (movie.data.Response === 'False') {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ title: movie.data.Title, poster: movie.data.Poster });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

exports.createFavoriteMovie = async (req, res) => {
    const user = req.user;

    try {
        const movie = await axios(
            `${process.env.OMDB_API}&t=${req.body.title}`
        );
        if (movie.data.Response === 'False') {
            return res
                .status(404)
                .json({ message: 'Movie not found. Try with another title!' });
        }
        const createdFavoriteMovie = await FavoriteMovie.create({
            title: movie.data.Title,
            user_id: user.user.id,
        });
        res.status(201).json(createdFavoriteMovie);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

exports.getFavoriteMovies = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;

    try {
        const favoriteMovies = await FavoriteMovie.findAll({
            where: { user_id: user.user.id },
            attributes: ['id', 'title', 'user_id'],
        });
        if (favoriteMovies.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        let movies = [];
        let posters = [];
        for (let i = 0; i < favoriteMovies.length; i++) {
            movies[i] = await axios.get(
                `${process.env.OMDB_API}&t=${favoriteMovies[i].title}`
            );
            posters[i] = {
                title: movies[i].data.Title,
                poster: movies[i].data.Poster,
            };
        }
        res.json(posters);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};
