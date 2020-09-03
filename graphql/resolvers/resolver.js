const bcrypt = require('bcryptjs');
const User = require('../../models/users');
const Event = require('../../models/event');
const Booking = require('../../models/bookings');

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

const singleEvent = async (eventId) => {
	const event = await Event.findById(eventId);
	return {
		...event._doc,
		_id: event.id,
		user: user.bind(this, booking._doc.user),
		event: event.bind(this, booking._doc.event),
		createdAt: new Date(booking._doc.createdAt).toISOString(),
		updatedAt: new Date(booking._doc.updatedAt).toISOString(),
	};
};

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
	bookings: async () => {
		try {
			const allBookings = await Booking.find();
			return allBookings.map((booking) => {
				return {
					...booking._doc,
					_id: booking.id,
					createdAt: new Date(booking._doc.date).toISOString(),
					updatedAt: new Date(booking._doc.date).toISOString(),
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

	// CreateEvent Async
	createEvent: async (args) => {
		const event = await new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			creator: '5f46a2e05b77ca1ba0258789',
		});
		let createdEvent;
		try {
			const result = await event.save();
			createdEvent = {
				...result._doc,
				_id: result._doc._id.toString(),
				date: new Date(event._doc.date).toISOString(),
				creator: user.bind(this, result._doc.creator),
			};
			const user_Creator = await User.findById('5f46a2e05b77ca1ba0258789');
			if (!user_Creator) {
				throw new Error('User not Found');
			}
			user_Creator.createdEvents.push(event);
			await userFinding.save();
			return createdEvent;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	// CreateEvent (Promises)

	// createEvent: async (args) => {
	//   const event = await new Event({
	//     title: args.eventInput.title,
	//     description: args.eventInput.description,
	//     price: +args.eventInput.price,
	//     date: new Date(args.eventInput.date),
	//     creator: "5f32e741a994311c6c908db2",
	//   });
	//   let createdEvent;
	//   return event
	//     .save()
	//     .then((result) => {
	//       createdEvent = {
	//         ...result._doc,
	//         _id: result.id.toString(),
	//         date: new Date(result._doc.date).toISOString(),
	//         creator: user.bind(this, result._doc.creator),
	//       };
	//       return User.findById("5f32e741a994311c6c908db2");
	//     })
	//     .then((user) => {
	//       if (!user) {
	//         throw new Error("User not Found!");
	//       }
	//       user.createdEvents.push(event);
	//       return user.save();
	//     })
	//     .then((result) => {
	//       return createdEvent;
	//     })
	//     .catch((err) => {
	//       console.log(err);
	//       throw err;
	//     });
	// },

	// Async CreateUser
	createUser: async (args) => {
		try {
			const existingUser = await User.findOne({ email: args.userInput.email });
			if (existingUser) {
				throw new Error('User Exists already');
			}

			const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
			const user = new User({
				email: args.userInput.email,
				password: hashedPassword,
			});
			const result = await user.save();
			return { ...result._doc, password: null, _id: result.id };
		} catch (error) {
			throw error;
		}
	},

	// Promise CreateUser
	// createUser: (args) => {
	//   return User.findOne({ email: args.userInput.email })
	//     .then((user) => {
	//       if (user) {
	//         throw new Error("User Exists alredy");
	//       } else {
	//         return bcrypt.hash(args.userInput.password, 12);
	//       }
	//     })
	//     .then((hashedPassword) => {
	//       const user = new User({
	//         email: args.userInput.email,
	//         password: hashedPassword,
	//       });
	//       return user.save();
	//     })
	//     .then((returnedUser) => {
	//       return {
	//         ...returnedUser._doc,
	//         password: null,
	//         _id: returnedUser.id,
	//       };
	//     })
	//     .catch((err) => {
	//       throw err;
	//     });
	// },
	//
	bookEvent: async (args) => {
		const fetchedEvent = Event.findOne({ _id: args.eventId });
		const booking = new Booking({
			user: '5f46a2e05b77ca1ba0258789',
			event: fetchedEvent,
		});
		const result = booking.save();
		return {
			...result._doc,
			_id: result.id,
			user: user.bind(this, booking._doc.user),
			event: event.bind(this, booking._doc.event),
			createdAt: new Date(result._doc.date).toISOString(),
			updatedAt: new Date(result._doc.date).toISOString(),
		};
	},
};
