import { conStr0, conStr1 } from "@meshsdk/core";
import { Burn, BurnSetup, Mint, MintBurnErc20 } from "./bar";

// Redeemer types
export const rMint: Mint = conStr0([]);
export const rBurn: Burn = conStr1([]);

export const rMintBurnErc20: MintBurnErc20 = conStr0([]);
export const rBurnSetup: BurnSetup = conStr1([]);

// setup
export type SetupUtxos = {
	txHash: string;
	outputIndex: number;
};
