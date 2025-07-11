import { OfflineEvaluator } from "@meshsdk/core-csl";
import { IWallet, UTxO } from "@meshsdk/core";
import { rMint, SetupUtxos } from "../../lib/types";
import { scripts, setupTokenDatum } from "../../lib/constant";
import { hardCodedUtxo } from "./test";
import {
	getBlockFrost,
	getSetupDatum,
	getSetupUtxo,
	newTxBuilder,
} from "../../lib/utils";

export const mintERC20Token = async (wallet: IWallet, mintQuantity: number) => {
	console.log(process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY);
	if (!wallet) {
		alert("Please connect your wallet from transactions/mint_setup_token");
		return;
	}

	// // Set up tx builder with blockfrost support
	// const blockfrost: BlockfrostProvider = new BlockfrostProvider(
	// 	process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY
	// );

	// const txBuilder: MeshTxBuilder = new MeshTxBuilder({
	// 	fetcher: blockfrost,
	// 	submitter: blockfrost,
	// 	// evaluator: new OfflineEvaluator(blockfrost, "preprod"),
	// 	verbose: true,
	// });

	const changeAddress = await wallet.getChangeAddress();
	const walletUtxos = await wallet.getUtxos();
	const collateral = (await wallet.getCollateral())[0];

	const setupUtxo: SetupUtxos = getSetupUtxo(hardCodedUtxo);

	const setupTokenPolicyId = scripts(setupUtxo).setup.mint.hash;
	const erc20TokenPolicyId = scripts(setupUtxo).erc20.mint.hash;

	// hard-coded to mint 10 erc20 token each time
	// const mintQuantity = 10;

	const blockfrost = getBlockFrost()!;

	const scriptAddress = scripts(setupUtxo).erc20.spend.address;
	const scriptUtxos: UTxO[] = await blockfrost.fetchAddressUTxOs(
		scriptAddress,
		setupTokenPolicyId
	);

	const currentQuantity: number = getSetupDatum(scriptUtxos[0]);

	console.log(
		"getting script utxo under spending script address: ",
		scriptUtxos
	);

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
			.txInRedeemerValue("", "Mesh")
			.txInInlineDatumPresent()
			.txInScript(scripts(setupUtxo).erc20.spend.cbor)
			.txOut(scriptAddress, [
				{
					unit: setupTokenPolicyId,
					quantity: "1",
				},
			])
			.txOutInlineDatumValue(
				setupTokenDatum(currentQuantity + mintQuantity),
				"JSON"
			) // update quantity value
			.mintPlutusScriptV3()
			.mint(mintQuantity.toString(), erc20TokenPolicyId, "")
			.mintingScript(scripts(setupUtxo).erc20.mint.cbor)
			.mintRedeemerValue(rMint, "JSON")
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
		console.log("erc20TokenPolicyId: ", erc20TokenPolicyId);
		console.log("updated quantity: ", currentQuantity + mintQuantity);
	} catch (e) {
		console.error(e);
	}
};
