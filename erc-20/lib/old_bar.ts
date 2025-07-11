import blueprint from "../../aiken-workspace/plutus.json";

import {
	PolicyId,
	ConStr0,
	ConStr1,
	MintingBlueprint,
	Integer,
	SpendingBlueprint,
	OutputReference,
} from "@meshsdk/core";

const version = "V3";
const networkId = 0; // 0 for testnet; 1 for mainnet
// Every spending validator would compile into an address with an staking key hash
// Recommend replace with your own stake key / script hash
const stakeKeyHash = "";
const isStakeScriptCredential = false;

export class Erc20MintBlueprint extends MintingBlueprint {
	compiledCode: string;

	constructor(params: [PolicyId]) {
		const compiledCode = blueprint.validators[0]!.compiledCode;
		super(version);
		this.compiledCode = compiledCode;
		this.paramScript(compiledCode, params, "JSON");
	}

	params = (data: [PolicyId]): [PolicyId] => data;
}

export class Erc20SpendBlueprint extends SpendingBlueprint {
	compiledCode: string;

	constructor(params: [Integer, PolicyId, PolicyId]) {
		const compiledCode = blueprint.validators[2]!.compiledCode;
		super(version, networkId, stakeKeyHash, isStakeScriptCredential);
		this.compiledCode = compiledCode;
		this.paramScript(compiledCode, params, "JSON");
	}

	params = (
		data: [Integer, PolicyId, PolicyId]
	): [Integer, PolicyId, PolicyId] => data;
	datum = (data: SetupTokenDatum): SetupTokenDatum => data;
	redeemer = (data: Data): Data => data;
}

export class SetupTokenMintBlueprint extends MintingBlueprint {
	compiledCode: string;

	constructor(params: [OutputReference]) {
		const compiledCode = blueprint.validators[4]!.compiledCode;
		super(version);
		this.compiledCode = compiledCode;
		this.paramScript(compiledCode, params, "JSON");
	}

	params = (data: [OutputReference]): [OutputReference] => data;
}

export type Action = Mint | Burn;

export type Mint = ConStr0<[]>;

export type Burn = ConStr1<[]>;

export type Data = any;

export type SetupTokenDatum = ConStr0<[Integer]>;
