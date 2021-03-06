const {
    getMovies,
    getMovieByTitle,
    createFavoriteMovie,
    getFavoriteMovies,
} = require('../controllers/movies');
const { body } = require('express-validator');
const { authenticateToken } = require('../middlewares/authenticate-token');
const { validate } = require('../middlewares/validation');
const router = require('express').Router();

const movieValidation = [
    body('title').notEmpty().withMessage('Title is required'),
];

router.get('/', getMovies);
router.post(
    '/favorite',
    authenticateToken,
    movieValidation,
    validate,
    createFavoriteMovie
);
router.get('/favorite', authenticateToken, getFavoriteMovies);
router.get('/:title', authenticateToken, getMovieByTitle);

module.exports = router;
