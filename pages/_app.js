import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Pokemon Battle</title>
				<link
					href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
					rel="stylesheet"
				></link>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
