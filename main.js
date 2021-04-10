const { MongoClient } = require("mongodb");
const Express = require("express");
const Cors = require("cors");

const app = Express();

const http = require("http").Server(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowHeaders: [],
		credentials: true,
	},
});

app.use(Cors());
require("dotenv").config();

const mongoClient = new MongoClient(process.env.DATABASE, {
	useUnifiedTopology: true,
});

let collections = {};
let changeBattle = {};

app.get("/pokemon", async (req, res, next) => {
	try {
		let result = await collections.pokemon.find({}).toArray();
		res.send(result);
	} catch (ex) {
		res.status(500).send({ message: ex.message });
	}
});

app.get("/Battle", async (req, res, next) => {
	try {
		let result = await collections.Battle.find({}).toArray();
		res.send(result);
	} catch (error) {
		res.status(500).send({ message: ex.message });
	}
});

io.on("connection", (socket) => {
	console.log("A client has connected !");
	socket.on("join", async (battleId) => {
		try {
			let result = await collections.battle.findOne({ _id: battleId });

			if (result) {
				socket.emit("message", result);
			} else {
				let newBattle = await collections.battle.insertOne({
					id: battleId,
					playerOne: {
						pokemon: {},
					},
					playerTwo: {
						pokemon: {},
					},
				});

				socket.emit("refresh", newBattle.ops[0]);
				socket.join(battleId);
				socket.activeRoom = battleId;
			}
		} catch (error) {}
	});

	socket.on("select", async (player, pokemon) => {
		try {
			if (player == 1) {
				await collections.battle.updateOne(
					{
						_id: socket.activeRoom,
					},
					{
						$set: {
							playerOne: {
								pokemon: pokemon,
							},
						},
					}
				);
			} else {
				await collections.battle.updateOne(
					{
						_id: socket.activeRoom,
					},
					{
						$set: {
							playerTwo: {
								pokemon: pokemon,
							},
						},
					}
				);
			}
		} catch (ex) {
			console.log(ex);
		}
	});
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
	try {
		await mongoClient.connect();
		collections.pokemon = mongoClient.db("game").collection("pokemon");
		collections.Battle = mongoClient.db("game").collection("battle");
		changeBattle = collections.Battle.watch([
			{
				$match: {
					operationType: "update",
				},
			},
			{ fullDocument: "updateLookup" },
		]);
		console.log(`Listening at *${port}`);
	} catch (error) {
		console.error(error);
	}
});
