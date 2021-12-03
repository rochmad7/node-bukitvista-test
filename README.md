# Backend Developer Intern Test Bukit Vista #

This application is an api server to manage your favorite movies. This application will return image url of movie
poster.

## How to Run

1. After clone this repo run `npm install`
2. Configure your database in config/config.js
3. Rename .env.example to .env
4. Run `npm run setup-dev` to migrate database
5. Run `npm start` to start server

## API Documentation

API documentation using Postman

[Documentation Link](https://documenter.getpostman.com/view/13917997/UVJfiuqR)

1. Register your account to start using this application
2. After registration, you will get jwt token from server and this token will be automatically stored in the cookie. If
   not, you can set this jwt token in authorization in the header using bearer.