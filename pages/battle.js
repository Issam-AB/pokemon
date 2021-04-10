import React, { useState, useEffect } from "react";
import soketIoClient from "socket.io-client";
import randomString from "randomstring";

const socket = soketIoClient("http://localhost:8000", { autoConnect: false });

export default function Battle({ pokemon, battlleId }) {
	const [Battle, setBattle] = useState({
		_id: null,
		playerOne: {
			pokemon: {},
		},
		playerTwo: {
			pokemon: {},
		},
	});
	useEffect(() => {
		socket.connect();
		socket.emit("join", battlleId ? battlleId : randomString.generate());
	}, []);
	return (
		<div className="bg-blue-100 h-screen">
			<h1 className="text-5xl font-bold text-center p-16">pokeBattle!</h1>
			<h2 className="text-center">BattleId: {battlleId}</h2>
			<div className="container mx-auto text-center">
				<div className="flex space-x-24">
					<div className="w-1/2">
						<h1>player 1</h1>
						<div className="flex flex-wrap">
							{pokemon &&
								pokemon.map((mon) => (
									<div
										key={mon._id}
										className={`w-1/4  ${
											Battle.playerOne.pokemon._id === mon._id
												? "bg-green-200"
												: ""
										}`}
										onClick={() => socket.emit("select", 1, mon)}
									>
										<img src={mon.Image} alt="pokemon" />
										<h2 className="font-bold text-lg">{mon.name}</h2>
									</div>
								))}
						</div>
					</div>

					<div className="w-1/2">
						<h1>player 2</h1>
						<div className="flex flex-wrap">
							{pokemon &&
								pokemon.map((mon) => (
									<div
										key={mon._id}
										className={`w-1/4 ${
											Battle.playerTwo.pokemon._id === mon._id
												? "bg-green-200"
												: ""
										}`}
										onClick={() => socket.emit("select", 2, mon)}
									>
										<img src={mon.Image} alt="pokemon" />
										<h2 className="font-bold text-lg">{mon.name}</h2>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps({ query }) {
	const response = await fetch("http://localhost:8000/pokemon");
	const data = await response.json();

	const pokemon = JSON.parse(JSON.stringify(data));

	return {
		props: {
			pokemon,
			battlleId: query.battlleId || null,
		},
	};
}
