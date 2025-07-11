import { BlockfrostProvider, UTxO } from "@meshsdk/core";
import { scripts } from "../../lib/constant";
import { getSetupDatum, getSetupUtxo } from "../../lib/utils";
import { SetupUtxos } from "../../lib/types";

export const hardCodedUtxo = {
	input: {
		txHash: "cd9830510d2b582f727c26df7e96a2bb90cc96fa83a531cd9f432bb39ab6033a",
		outputIndex: 3,
	},
	output: {
		address:
			"addr_test1qre8tjm4mqhhxlzf9qqrn9r7fpy3nmsyfjpv9exw4uhjmpucfslttj9qrd94837wcn8uzwf5tg5dyjnweyvgw0z9ntwsl3q7la",
		amount: [{ unit: "lovelace", quantity: "1223498700" }],
		dataHash: undefined,
		plutusData: undefined,
		scriptRef: undefined,
	},
};

export const printScriptUtxos = async (utxo: UTxO) => {
	if (!process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY) {
		alert("Please set up environment variables");
		return;
	}
	// Set up tx builder with blockfrost support
	const blockfrost: BlockfrostProvider = new BlockfrostProvider(
		process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY
	);

	const setupUtxo: SetupUtxos = getSetupUtxo(hardCodedUtxo);

	const setupTokenPolicyId = scripts(setupUtxo).setup.mint.hash;

	const scriptAddress = scripts(setupUtxo).erc20.spend.address;
	const scriptUtxos: UTxO[] = await blockfrost.fetchAddressUTxOs(
		scriptAddress,
		setupTokenPolicyId
	);

	console.log(
		"getting script utxo under spending script address: ",
		scriptUtxos[0]
	);

	console.log("script utxo datum: ", getSetupDatum(scriptUtxos[0]));
};
