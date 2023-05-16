## Description

This project is my first experience with NestJS, where I built a simple bookmarks API. It allowed me to dive into the world of NestJS and explore various concepts and features, such as:

- Object-Oriented Programming (OOP) principles
- Dependency Injection
- Authentication using Passport
- Guards for authorization
- Custom Pipes and Validations
- Exception Handling
- Decorators (which I found familiar from my experience with Spring Boot)
- Testing
- API documentation with Swagger, and more.


The RESTful API provides functionality for creating user accounts and managing bookmarks. While the application is relatively simple, it served as a great learning opportunity to grasp the fundamental concepts of NestJS and apply them in a practical project.


## Requirements

- PostgreSQL DB or docker (see `Miscellaneous` section below)
- Docker (not mandatory)
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Miscellaneous
This project requires PostgresDB, you may not need to install this if you've got docker.
You can spin up the docker db by running `npm run dev:bb:up` and then migrate the db by running `npx prisma:dev:deploy`
