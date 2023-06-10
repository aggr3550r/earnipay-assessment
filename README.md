<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This is a simple Todo application that is powered with NestS, GraphQL and Prisma - a combination of top choice modern technology. It is built in partial fulfilment of the interview requirements at Earnipay

## Running the app

In order to run the app, the first thing you need to do is create a .env file in the root of your project. The .env file should be like the one below
```bash
DATABASE_URL="postgresql://victor:killshot@host.docker.internal:5432/earnipay_datastore?schema=public"
JWT_SECRET=e3376540-31b5-11ed-a261-0242ac120002
JWT_EXPIRES_IN=24h
JWT_COOKIE_EXPIRES_IN=24
```

With that out of the way, there are two possible paths along which to proceed enumerated below:
### * Docker Compose
### * Dockerfile

#### Docker Compose 
To run the app using _docker compose_ take the following steps:
- Setup:
  Fire up Docker Desktop to make sure that the Docker daemon is up and running

- Build docker image:
  Run the following command in the terminal from the root directory of the project: 
```
docker-compose --build
```

- Start docker container:
  Run the following command in the terminal from the root directory of the project.
```
docker-compose up
```
  The above command will leverage both the declarations in the _docker-compose.yml_ file and those in the _Dockerfile_ to start the application and provision it with necessary resources like a postgres database to be precise


#### Dockerfile
To run the app using the Dockerfile provided, take the following steps:
- Setup:
  Fire up Docker Desktop to make sure that the Docker daemon is up and running
  
- Build docker image:
  Run the following command in the terminal from the root directory of the project:
 ```
 docker build -t earnipay-image .
 ```
 
 - Map the host port to the container port, mount the .env file in your project as a volume onto the image in the container and then run the container:
  The above step can be achieved by running the following command from the root directory of your project:
 ```
 docker run -p 3000:3000 /path/to/local/app/.env:/path/to/container/app/.env earnipay-image
 ```
  For example, this is the command I personally use:
 ```
 docker run -p 3000:3000 -v /Users/victor/Desktop/earnipay-assessment/.env:/app/.env earnipay-app
 ```
That should do it, your Todo API is up and ready for use @ http://localhost:3000/graphql ! 

## Test

To run the unit tests in the application use the following command:

```bash
# unit tests
$ npm run test
```
#### Note: 
  If you are opting to use the Dockerfile provided to start the application on your end then you do not need to run the tests explicitly as it is already taken care of while the docker image is being built.


- Author - [Victor Uche](https://github.com/aggr3550r/)


## License

Nest is [MIT licensed](LICENSE).
