const bcrypt = require("bcryptjs");
const User = require("../../models/users");
const Event = require("../../models/event");

const events = async (eventIds) => {
  try {
    const events = Event.find({ _id: { $in: eventIds } });
    events.map((event) => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    return events;
  } catch (error) {
    throw error;
  }
};

// const events = (eventIds) => {
//   return Event.find({ _id: { $in: eventIds } })
//     .then((events) => {
//       return events.map((event) => {
//         return {
//           ...event._doc,
//           _id: event.id,
//           date: new Date(event._doc.date).toISOString(),
//           creator: user.bind(this, event.creator),
//         };
//       });
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

// const user = (userId) => {
//   return User.findById(userId)
//     .then((user) => {
//       return {
//         ...user._doc,
//         _id: user.id,

//         createdEvents: events.bind(this, user._doc.createdEvents),
//       };
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  // events: () => {
  //   return Event.find()

  //     .then((events) => {
  //       return events.map((event) => {
  //         return {
  //           ...event._doc,
  //           id: event._id,
  //           date: new Date(event._doc.date).toISOString(),
  //           creator: user.bind(this, event._doc.creator),
  //         };
  //       });
  //     })
  //     .catch((err) => {
  //       throw err;
  //     });
  // },
 createEvent: async args=>{
   const event = await new Event({
     title: args.userInput.title,
     description: args.userInput.description,
     price: +args.eventInput.price,
     date: new Date(args.eventInput.date),
     creator: "5f32e741a994311c6c908db2",
   });
   let createdEvent;
   try {
     const result = await event.save();
     createdEvent = {
       ...result._doc,
       _id: result._doc.id.toString,
       date: new Date(event._doc.date).toISOString(),
       creator: user.bind(this, result._doc.creator)
     }
     const user = User.findById("5f32e741a994311c6c908db2");
     if(!user){
       throw new Error("User not Found");
     }
     user.createdEvent.push(event);
     const userSaveResult = await user.save();
   } catch (err) {
     throw err;
   }
 }
  ,
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
        createdEvent = {
          ...result._doc,
          _id: result.id.toString(),
          date: new Date(result._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator),
        };
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
};
