import {
	BlockfrostProvider,
	deserializeDatum,
	MeshTxBuilder,
	UTxO,
} from "@meshsdk/core";
import { SetupUtxos } from "./types";
import { SetupTokenDatum } from "./bar";

export const getSetupUtxo = (paramUtxo: UTxO): SetupUtxos => {
	const txHash = paramUtxo.input.txHash;
	const outputIndex = paramUtxo.input.outputIndex;

	return { txHash, outputIndex };
};

export const getSetupDatum = (SetupUtxo: UTxO): number => {
	const plutusData = SetupUtxo.output.plutusData!;
	const datum: SetupTokenDatum = deserializeDatum(plutusData);

	const count = Number(datum.fields[0].int);

	return count;
};

export const getBlockFrost = () => {
	if (!process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY) {
		alert("Please set up environment variables");
		return;
	}
	// Set up tx builder with blockfrost support
	const blockfrost: BlockfrostProvider = new BlockfrostProvider(
		process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY
	);

	return blockfrost;
};

export const newTxBuilder = (provider: BlockfrostProvider) => {
	const txBuilder: MeshTxBuilder = new MeshTxBuilder({
		fetcher: provider,
		submitter: provider,
		// evaluator: new OfflineEvaluator(blockfrost, "preprod"),
	});

	return txBuilder;
};
