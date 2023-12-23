# Job Application Tracker

Job Application Tracker is a full-stack website that allows users to write down and update information about their job applications. The frontend is developed using the React template from Vite with Redux for state management and Material-UI to design the user interface. The backend is developed using Node.js and Express.js, and connects to a MongoDB database. Requests between the frontend and backend are handled by a GraphQL API using Apollo Client and Apollo Server. A link to the website can be found [here](https://job-application-tracker-auje.onrender.com).

### Running the backend in development mode

> The server uses a MongoDB database and a Google OAuth2 Client for sending emails. Make sure to have both set up and available before starting the server.

To run the server in development mode, run the following commands:

```
cd server
npm run compile
npm run dev
```

> Remember to run `npm install` in the `server` directory before running the npm scripts above if you haven't done so already.

`npm run compile` will run the GraphQL Code Generator to parse the GraphQL schema from all of the files in the `server/src/schema` directory to generate types that can be used in the resolver functions.

`npm run dev` will start the server with `NODE_ENV=development` and will automatically restart the server on saving file changes through the `ts-node-dev` library.

Running the server requires certain environment variables in a `.env` file inside the `server` directory (i.e. `server/.env`). The variables are as follows:

- PORT (default: 4000): The port that the server is running on
- MONGODB_URI: The address of your MongoDB database
- TEST_MONGODB_URI: The address of your MongoDB database that is used for testing purposes (When the server is run with NODE_ENV=test)
- CLIENT_ID: The Client ID for your Google OAuth 2.0 API Credentials
- CLIENT_SECRET: The Client ID for your Google OAuth 2.0 API Credentials
- REFRESH_TOKEN: The refresh token that the OAuth Client will use to create access tokens
- REDIRECT_URI: The URI for the OAuth Client to redirect to (e.g. https://developers.google.com/oauthplayground)
- EMAIL: The email to be used for sending messages to users
- SECRET: A secret string used for signing and verifying JSON Web Tokens (JWTs)

When the server is running, you can access the Apollo Sandbox by visiting `http://localhost:4000/graphql` on the browser. To run subscriptions in Apollo Sandbox, make sure in the connection settings to set the Subscriptions endpoint to `ws://localhost:4000/subscriptions`.

### Running the backend in production mode

To run the server in development mode, run the following commands:

```
cd server
npm run build:server
npm start
```

> Remember to run `npm install` in the `server` directory before running the npm scripts above if you haven't done so already.

`npm run build:server` will run the GraphQL Code Generator
and then compile all of the files inside the `server/src` directory into JavaScript and place the output into hte `server/build` directory.

`npm run start` will start the server with `NODE_ENV=production` using the code inside the `server/build` directory.

The server in production mode behaves similar to development mode, with the addition of serving static files to show the production build of the frontend. To do so, run the command `npm run build:client` to create a production build of the frontend code and copy it to the server. The frontend build will appear in the `server/dist` directory. You can view the frontend page by visiting `http://localhost:4000` on the browser.

### Running the frontend in development mode

> Make sure the server is running so that the frontend works properly.

To run the client in development mode, run the following commands:

```
cd client
npm run compile-schema
npm run compile
npm run dev
```

> Remember to run `npm install` in the `client` directory before running the npm scripts above if you haven't done so already.

`npm run compile-schema` will run the GraphQL Code Generator to create an introspection file `introspection.json` based on the GraphQL schema defined in the server. The configuration file for this script is found in the `client/codegen-schema.ts` file. By default, this file assumes the server schema is found at the endpoint `http://localhost:4000/graphql`. If the endpoint is changed, you must reflect that change for this script by including a `.env` or `.env.development` file inside the `client` directory (i.e. `client/.env` or `client/.env.development`) with a `VITE_API_URL` variable containing the new endpoint.

`npm run compile` will run the GraphQL Code Generator to parse the GraphQL documents from all of the files in the `client/src/graphql` directory and use the generated `introspection.json` file to generate types that can be used for the hooks provided by Apollo Client. The configuration file for this script is found in the `client/codegen.ts` file.

`npm run dev` will start the dev server to run the React application. You can view the application by visiting `http://localhost:5173` on the browser.

### Running the frontend in production mode

> Make sure the server is running so that the frontend works properly.

To run the client in production mode, run the following commands:

```
cd client
npm run build
npm run preview
```

> Remember to run `npm install` in the `client` directory before running the npm scripts above if you haven't done so already.

> If you did not generate an `introspection.json` file in the `client` directory by running the `npm run compile-schema` command, make sure to do so before running `npm run build`.

`npm run build` will run the GraphQL Code Generator, compile all of the code inside the `client/src` directory into JavaScript, and run the `vite build` command to create a production build of your React application.

`npm run preview` will run the `vite preview` command to locally preview the production build. You can view the production build by visiting `http://localhost:4173` on the browser.
