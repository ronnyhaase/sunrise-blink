import { ActionGetResponse } from "@/types";

async function GET() {
	const config: ActionGetResponse = {
		icon: "https://blink.sunrisestake.com/logo.svg",
		title: "Offset carbon while you sleep",
		description:
			"Offset your carbon footprint by staking with Sunruse Stake",
		label: "Offset carbon",
		links: {
			actions: [
				{
					href: "https://blink.sunrisestake.com/api/actions/stake?amount=0.1",
					label: "0.1 SOL",
				},
				{
					href: "https://blink.sunrisestake.com/api/actions/stake?amount=0.25",
					label: "0.25 SOL",
				},
				{
					href: "https://blink.sunrisestake.com/api/actions/stake?amount=0.5",
					label: "0.5 SOL",
				},
				{
					href: "https://blink.sunrisestake.com/api/actions/stake",
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

export { GET };
