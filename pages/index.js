import React, { useState } from "react";

export default function Home() {
	const [battleId, setBattle] = useState("");

	return (
		<div className="bg-blue-100 h-screen">
			<h1 className="text-5xl font-bold text-center p-16">PokeBattle!</h1>
			<div className="flex text-center space-x-16">
				<div className="w-1/2">
					<a href="/battle" className="w-full p-6 bg-blue-200">
						New Game
					</a>
				</div>
				<div className="w-1/2">
					<input
						type="text"
						className="w-1/2 p-6"
						onChange={(e) => setBattle(e.target.value)}
					/>
					<a
						href={"/battle?batleId=" + battleId}
						className="w-full p-6 bg-blue-200"
					>
						Join Game
					</a>
				</div>
			</div>
		</div>
	);
}
