require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const Event = require("./models/event");
const User = require("./models/users");
const bcrypt = require("bcryptjs");

app.use(express.json());

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type Event {
          _id: ID!
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        type User{
          _id: ID!
          email: String!
          password: String
        }
        input EventInput {
          title: String!
          description: String!
          price: Float!
          date: String!
        }
        input UserInput{
          email:String!
          password: String!
        }
        type RootQuery {
            events: [Event!]!
           
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    // Resolvers
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc, id: event._doc._id };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: async (args) => {
        const event = await new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "5f32e741a994311c6c908db2",
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            createdEvent = { ...result._doc, _id: result.id.toString() };
            return User.findById("5f32e741a994311c6c908db2");
          })
          .then((user) => {
            if (!user) {
              throw new Error("User not Found!");
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then((result) => {
            return createdEvent;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      // createUser: (args) => {
      //   return User.findOne({ email: args.userInput.email })
      //     .then((user) => {
      //       if (user) {
      //         throw new Error("user exists already");
      //       }
      //       return bcrypt.hash(args.userInput.password, 12);
      //     })
      //     .then((hashedPassword) => {
      //       const user = new User({
      //         email: args.userInput.email,
      //         password: hashedPassword,
      //       });
      //       return user.save();
      //     })
      //     .then((result) => {
      //       return { ...result._doc, password: null, _id: result.id };
      //     })
      //     .catch((err) => {
      //       throw err;
      //     });
      // },
      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error("User Exists alredy");
            } else {
              return bcrypt.hash(args.userInput.password, 12);
            }
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((returnedUser) => {
            return {
              ...returnedUser._doc,
              password: null,
              _id: returnedUser.id,
            };
          })
          .catch((err) => {
            throw err;
          });
      },
      // createUser: (args) => {
      //   return User.findOne(
      //     { email: args.userInput.email },
      //     (err, returnedUser) => {
      //       if (returnedUser) {
      //         throw new Error("User already exists");
      //       } else {
      //         return bcrypt.hash(args.userInput.password, 12, (err, hash) => {
      //           if (!err) {
      //             const user = new User({
      //               email: args.userInput.email,
      //               password: hash,
      //             });
      //             return user.save((err, resultedUser) => {
      //               if (err) throw err;
      //               return {
      //                 ...resultedUser._doc,
      //                 password: null,
      //                 _id: resultedUser.id,
      //               };
      //             });
      //           }
      //         });
      //       }
      //     }
      //   );
      // },
    },
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
