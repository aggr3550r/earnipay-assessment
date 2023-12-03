
## Description

This is a simple Todo application that is powered with NestS, GraphQL and Prisma - a combination of top choice modern technology. It is built in partial fulfilment of the interview requirements at Earnipay

## Functionalities

The app is mostly a simple todo application that helps its users to manage their tasks in a simple and efficient manner. The aim of the project is not
to max out on functionality but to demonstrate my approach to programming and implementing everyday requirements such as authentication, authorization, pagination, testing and containerization in smart and very wholesome ways.
Users can sign up, log in, create and manage tasks within the app using a set of clean and intuitive APIs. To browse the APIs for more understanding 
follow the steps below to run the app.

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
  If you are opting to use the Dockerfile provided to run the application on your end then you do not need to run the tests explicitly as it is already taken care of while the docker image is being built.


- Author - [Victor Uche](https://github.com/aggr3550r/)


## License

Nest is [MIT licensed](LICENSE).
