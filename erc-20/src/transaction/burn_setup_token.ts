import { OfflineEvaluator } from "@meshsdk/core-csl";
import { IWallet, UTxO } from "@meshsdk/core";
import { rBurn, rBurnSetup, SetupUtxos } from "../../lib/types";
import { scripts, setupTokenDatum } from "../../lib/constant";
import { hardCodedUtxo } from "./test";
import {
	getBlockFrost,
	getSetupDatum,
	getSetupUtxo,
	newTxBuilder,
} from "../../lib/utils";

export const burnSetupToken = async (wallet: IWallet) => {
	console.log(process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY);
	if (!wallet) {
		alert("Please connect your wallet from transactions/mint_setup_token");
		return;
	}

	const changeAddress = await wallet.getChangeAddress();
	const walletUtxos = await wallet.getUtxos();
	const collateral = (await wallet.getCollateral())[0];

	const setupUtxo: SetupUtxos = getSetupUtxo(hardCodedUtxo);

	const setupTokenPolicyId = scripts(setupUtxo).setup.mint.hash;

	const blockfrost = getBlockFrost()!;

	const scriptAddress = scripts(setupUtxo).erc20.spend.address;
	const scriptUtxos: UTxO[] = await blockfrost.fetchAddressUTxOs(
		scriptAddress,
		setupTokenPolicyId
	);

	// const currentQuantity: number = getSetupDatum(scriptUtxos[0]);

	try {
		const txBuilder = newTxBuilder(blockfrost);
		const unsignedTx = await txBuilder
			.spendingPlutusScriptV3()
			.txIn(
				scriptUtxos[0].input.txHash,
				scriptUtxos[0].input.outputIndex,
				scriptUtxos[0].output.amount,
				scriptUtxos[0].output.address,
				0
			)
			.txInRedeemerValue(rBurnSetup, "JSON")
			.txInInlineDatumPresent()
			.txInScript(scripts(setupUtxo).erc20.spend.cbor)

			.mintPlutusScriptV3()
			.mint("-1", setupTokenPolicyId, "")
			.mintingScript(scripts(setupUtxo).setup.mint.cbor)
			.mintRedeemerValue(rBurn, "JSON")
			.txInCollateral(
				collateral.input.txHash,
				collateral.input.outputIndex,
				collateral.output.amount,
				collateral.output.address
			)
			.changeAddress(changeAddress)
			.selectUtxosFrom(walletUtxos)
			.complete();
		const signedTx = await wallet.signTx(unsignedTx, true);
		const txHash = await wallet.submitTx(signedTx);
		console.log("txHash:", txHash);
		console.log("setupTokenPolicyId: ", setupTokenPolicyId);
		console.log("Setup Token Burnt");
	} catch (e) {
		console.error(e);
	}
};
