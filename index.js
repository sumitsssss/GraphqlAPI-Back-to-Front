require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");
const app = express();
const graphqlSchema = require("./graphql/schema/schema");
const graphqlResolvers = require("./graphql/resolvers/resolver");

app.use(express.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphqlSchema,
    // Resolvers
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@sandbox-gvrvl.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("DB Connected!");
      app.listen(3000, () =>
        console.log("Server up and running at Port 3000.")
      );
    }
  }
);
