import {
	byteString,
	conStr0,
	integer,
	outputReference,
	resolveScriptHash,
} from "@meshsdk/core";
import { SetupUtxos } from "./types";
import {
	Erc20MintBlueprint,
	Erc20SpendBlueprint,
	SetupTokenDatum,
	SetupTokenMintBlueprint,
} from "./bar";

export const setupTokenDatum = (mintQuantity: number): SetupTokenDatum => {
	return conStr0([integer(mintQuantity)]);
};

// hard coded initial erc20 token amount as 0
export const initialSetupTokenDatum: SetupTokenDatum = setupTokenDatum(0);

export const scripts = (setupUtxo: SetupUtxos) => {
	const SetupToken = byteString(
		resolveScriptHash(
			new SetupTokenMintBlueprint([
				outputReference(setupUtxo.txHash, setupUtxo.outputIndex),
			]).cbor,
			"V3"
		)
	);

	const erc20Token = byteString(
		resolveScriptHash(new Erc20MintBlueprint([SetupToken]).cbor, "V3")
	);

	return {
		setup: {
			mint: new SetupTokenMintBlueprint([
				outputReference(setupUtxo.txHash, setupUtxo.outputIndex),
			]),
		},
		erc20: {
			mint: new Erc20MintBlueprint([SetupToken]),
			spend: new Erc20SpendBlueprint([
				integer(parseInt(process.env.NEXT_PUBLIC_ERC20_CAP!)),
				SetupToken,
				erc20Token,
			]),
		},
	};
};
