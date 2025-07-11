import { OfflineEvaluator } from "@meshsdk/core-csl";
import { IWallet } from "@meshsdk/core";
import { rMint, SetupUtxos } from "../../lib/types";
import { initialSetupTokenDatum, scripts } from "../../lib/constant";
import { getBlockFrost, getSetupUtxo, newTxBuilder } from "../../lib/utils";

export const mintSetupToken = async (wallet: IWallet) => {
	console.log(process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY);
	if (!wallet) {
		alert("Please connect your wallet from transactions/mint_setup_token");
		return;
	}

	const changeAddress = await wallet.getChangeAddress();
	const utxos = await wallet.getUtxos();
	const collateral = (await wallet.getCollateral())[0];

	const paramUtxo = utxos[0]!;
	console.log("paramUtxo: ", paramUtxo);

	// const setupUTxos: SetupUtxos = {
	// 	txHash: paramUtxo.input.txHash,
	// 	outputIndex: paramUtxo.input.outputIndex,
	// };

	const setupUtxo: SetupUtxos = getSetupUtxo(paramUtxo);

	const setupTokenPolicyId = scripts(setupUtxo).setup.mint.hash;

	const blockfrost = getBlockFrost()!;

	try {
		const txBuilder = newTxBuilder(blockfrost);
		const unsignedTx = await txBuilder
			.txIn(
				paramUtxo.input.txHash,
				paramUtxo.input.outputIndex,
				paramUtxo.output.amount,
				paramUtxo.output.address
			)
			.mintPlutusScriptV3()
			.mint("1", setupTokenPolicyId, "")
			.mintingScript(scripts(setupUtxo).setup.mint.cbor)
			.mintRedeemerValue(rMint, "JSON")
			.txOut(scripts(setupUtxo).erc20.spend.address, [
				{
					unit: setupTokenPolicyId,
					quantity: "1",
				},
			])
			.txOutInlineDatumValue(initialSetupTokenDatum, "JSON") // default to 0
			.txInCollateral(
				collateral.input.txHash,
				collateral.input.outputIndex,
				collateral.output.amount,
				collateral.output.address
			)
			.changeAddress(changeAddress)
			.selectUtxosFrom(utxos.slice(1))
			.complete();
		const signedTx = await wallet.signTx(unsignedTx, true);
		const txHash = await wallet.submitTx(signedTx);
		console.log("txHash:", txHash);
		console.log("setupTokenPolicyId: ", setupTokenPolicyId);
	} catch (e) {
		console.error(e);
	}
};
