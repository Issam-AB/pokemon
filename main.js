const { MongoClient } = require("mongodb");
const Express = require("express");
const Cors = require("cors");
const { response } = require("express");

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
		let result = await collections.pokemon.find({}).toArray();
		res.send(result);
	} catch (error) {
		res.status(500).send({ message: ex.message });
	}
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
	try {
		await mongoClient.connect();
		collections.pokemon = mongoClient.db("game").collection("pokemon");
		collections.Battle = mongoClient.db("game").collection("battle");
		console.log(`Listening at *${port}`);
	} catch (error) {
		console.error(error);
	}
});
