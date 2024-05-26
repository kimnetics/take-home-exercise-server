# Take Home Exercise Server

An example of a take home exercise server solution.

## About

The server is built on Node.js Express and is written in Typescript with ES6 modules. The server provides a REST API for company and customer objects. The API is described by an OpenAPI specification which may be retrieved at `/spec` when the server is running.

The code is done in the [JavaScript Standard Style](https://standardjs.com) and linting rules have been configured to enforce the style.

The code was created using an OpenAPI contract first approach. With this approach you start with the OpenAPI contract changes and then implement the endpoints. The `express-openapi-validator` middleware used will not accept any incoming request that does not follow the contact.

The server is configured with a New Relic agent and will send monitoring information to New Relic if the `license_key` field in the `newrelic.cjs` file is set. The server shows in the New Relic APM section as `take-home-exercise-server`.

A Docker build is provided to allow creating a Docker container with the server to allow deploying the server to cloud container services.

## Notable

### OpenAPI Contract Supports Common Components

OpenAPI allows endpoint components to layer on other components. Sharing common code between components helps with consistency and maintenance. Unfortunately, the `express-openapi-validator` middleware does not support OpenAPI contracts using that style.

I created a script which takes the OpenAPI contract in the `src/models` folder and replaces shared component references with copies of the components themselves. The updated version of the OpenAPI contract is what goes into the `dist/models` folder that is used when the server is running.

My conversion script is open source and may be found [here](https://gist.github.com/kimnetics/90780ad9f225b089d5f13c126061f575).

### Logs to New Relic While Using ES6 Modules

The server uses the [winston](https://github.com/winstonjs/winston) logging library to do its logging. I found that the New Relic agent has trouble automatically picking up Express/Winston logs when using ES6 modules. I created a Winston transport for New Relic to help with this. My transport is the official New Relic transport on the Winston site.

My Winston transport `winston-newrelic-agent-transport` is open source and may be found [here](https://github.com/kimnetics/winston-newrelic-agent-transport).

## Database

When the service is run, a `better-sqlite3` in-memory database is created. Two tables are created in the database: `company` and `customer`.

`faker` is used with a fixed seed to load the `company` and `customer` tables with a consistent set of data between runs.

## Postman

An exported Postman collection is provided in the `Take Home Exercise Server.postman_collection.json` file. This file may be imported into Postman to create a Take Home Exercise Server collection with endpoints defined to help test the API.

## Usage

### Installing

Install needed packages for the server with the following command:

```shell
npm install
```

### Testing

Run the unit tests with the following commands:

```shell
npm run build
npm test
```

### Running

Start the server with the following commands:

```shell
npm run build
npm start
```

The server listens on port 4000.
