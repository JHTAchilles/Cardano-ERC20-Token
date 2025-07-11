import { conStr0, conStr1 } from "@meshsdk/core";
import { Burn, Mint } from "./bar";

// Redeemer types
export const rMint: Mint = conStr0([]);
export const rBurn: Burn = conStr1([]);

// setup
export type SetupUtxos = {
	txHash: string;
	outputIndex: number;
};
