# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `npm install` in your terminal at the project root.

## Required Technologies

Your application must make use of the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to run the repo

### Install dependencies

Simply, run the following command to install the project dependencies:

```bash
npm install
```

### Setup environment

Create an `.env` file with the required environment variables:

```bash
# .env
POSTGRES_USER=your_db_username
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=storefront
POSTGRES_DB_TEST=storefront_test
TOKEN_SECRET=storefrontSecr3t
BCRYPT_SECRET=HashSynCr3t
SALT_ROUNDS=10
ENV=test
PORT=3000
```

### Create database

Create 2 databases:
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;

Run the database migrations:

```bash
db-migrate up
```

## Running the application

Use the following command to run the application:

```bash
npm start
```

The application will run on <http://localhost:3000/>.

## Running the unit tests

Use the following command to run the unit tests:

Change ENV value in .env to test

Use the following command to run the test:

```bash
npm test
```
