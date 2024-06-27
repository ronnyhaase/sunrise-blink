import { AnchorProvider } from "@coral-xyz/anchor";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { SunriseStakeClient } from "@sunrisestake/client";
import { NextRequest } from "next/server";

import { ActionGetResponse, ActionPostRequest } from "@/types";
import { solToLamports } from "@/utils";

async function GET() {
	const config: ActionGetResponse = {
		icon: "https://sunrise-blink.vercel.app/action-image.png",
		title: "Offset carbon while you sleep",
		description:
			"Offset your carbon footprint by staking with Sunrise Stake",
		label: "Offset carbon",
		links: {
			actions: [
				{
					href: "https://sunrise-blink.vercel.app/api/actions/stake?amount=0.1",
					label: "0.1 SOL",
				},
				{
					href: "https://sunrise-blink.vercel.app/api/actions/stake?amount=0.25",
					label: "0.25 SOL",
				},
				{
					href: "https://sunrise-blink.vercel.app/api/actions/stake?amount=0.5",
					label: "0.5 SOL",
				},
				{
					href: "https://sunrise-blink.vercel.app/api/actions/stake",
					label: "Stake",
					parameters: [
						{
							name: "amount",
							label: "Enter a custom SOL amount",
							required: false,
						},
					],
				},
			],
		},
	};

	return Response.json(config);
}

async function POST(request: NextRequest) {
	let account: PublicKey;
	try {
		const body: ActionPostRequest = await request.json();
		account = new PublicKey(body.account);
	} catch (error) {
		return Response.json(
			{ error: "Invalid or missing account" },
			{ status: 400 },
		);
	}

	const parsedUrl = new URL(request.url);
	const params = new URLSearchParams(parsedUrl.search);
	const amount = params.get("amount");
	if (!amount) {
		return Response.json(
			{ error: "Invalid or missing amount" },
			{ status: 400 },
		);
	}
	const lamports = solToLamports(amount);

	const dummyWallet = {
		publicKey: account,
		signTransaction: () =>
			Promise.reject(new Error("Dummy wallet can't sign")),
		signAllTransactions: () =>
			Promise.reject(new Error("Dummy wallet can't sign")),
	};
	const connection = new Connection(clusterApiUrl("mainnet-beta"));
	const provider = new AnchorProvider(
		// @ts-ignore - Connection incompatible with Connection ¯\_(ツ)_/¯
		connection,
		dummyWallet,
		{ skipPreflight: true, maxRetries: 0 },
	);
	const client = await SunriseStakeClient.get(
		provider,
		WalletAdapterNetwork.Mainnet,
	);

	const tx = await client.deposit(lamports, account);
	tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
	tx.feePayer = account;
	const serializedTx = tx.serialize({
		requireAllSignatures: false,
		verifySignatures: false,
	});
	const encodedTx = Buffer.from(serializedTx).toString("base64");
	console.log(encodedTx);

	return Response.json({
		transaction: encodedTx,
	});
}

export { GET, POST };
