import { burnERC20Token } from "@/transaction/burn_erc20_token";
import { mintERC20Token } from "@/transaction/mint_erc20_token";
import { mintSetupToken } from "@/transaction/mint_setup_token";
import { IWallet } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import React, { useEffect, useState } from "react";

export default function Home() {
	const { wallet, connected, connect } = useWallet();

	const [balance, setUserBalance] = useState("");

	const paramUtxo = get(wallet);

	const [mintQuantity, setMintQuantity] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMintQuantity(e.target.value);
	};

	useEffect(() => {
		const getWalletBalance = async () => {
			const balance = await wallet.getLovelace();
			setUserBalance(balance);
		};
		if (connected) {
			getWalletBalance();
		} else {
			connect("eternl");
		}
	}, [connect, connected, wallet]);

	const setupButtons = ["Mint Setup Token", "Burn Setup Token"];

	const erc20Buttons = ["Mint Erc20 Token", "Burn Erc20 Token"];

	const handleClick = (buttonNumber: string) => {
		if (!wallet) {
			alert("Please connect wallet");
			return;
		}
		switch (buttonNumber) {
			case "Mint Setup Token":
				console.log("Minting Setup Token!");
				mintSetupToken(wallet);
				break;
			case "Burn Setup Token":
				console.log("Burning Setup Token!");
				break;
			case "Mint Erc20 Token":
				// console.log("hard coded utxo: ", hardCodedUtxo);
				console.log("Minting ERC20 Token!");
				mintERC20Token(wallet, +mintQuantity);
				setMintQuantity("");
				break;
			case "Burn Erc20 Token":
				console.log("Burning ERC20 Token!");
				burnERC20Token(wallet, -mintQuantity);
				setMintQuantity("");
				break;
			default:
				break;
		}
	};

	return (
		<div className="bg-gray-800 text-white text-center">
			<p>${balance} lovelace</p>
			<button
				onClick={() => {
					console.log(paramUtxo);
				}}
			>
				TEST BUTTON
			</button>
			<div
				style={{
					backgroundColor: "lightblue",
					minHeight: "50vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-evenly",
					alignItems: "center",
					padding: "20px",
				}}
			>
				{/* Setup buttons */}
				<div
					style={{
						display: "flex",
						width: "100%",
						maxWidth: "800px",
						justifyContent: "space-evenly",
						gap: "20px",
					}}
				>
					{setupButtons.map((name) => (
						<button
							key={name}
							onClick={() => handleClick(name)}
							style={{
								flex: 1,
								padding: "15px 0",
								fontSize: "16px",
								fontWeight: "bold",
								borderRadius: "8px",
								border: "none",
								backgroundColor: "rgb(63, 216, 137)",
								boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
								cursor: "pointer",
								transition: "transform 0.2s, background-color 0.2s",
							}}
							onMouseOver={(e) =>
								(e.currentTarget.style.transform = "scale(1.05)")
							}
							onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
						>
							{name}
						</button>
					))}
				</div>
				{/* Input field section */}
				<div
					style={{
						width: "100%",
						maxWidth: "600px",
						display: "flex",
						flexDirection: "column",
						gap: "10px",
					}}
				>
					<input
						type="number"
						className="[&::-webkit-inner-spin-button]:appearance-none"
						value={mintQuantity}
						onChange={handleInputChange}
						placeholder="Enter mint/burn amount here"
						style={{
							textAlign: "center",
							padding: "15px",
							color: "black",
							fontSize: "16px",
							borderRadius: "8px",
							border: "1px solid grey",
							boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
							width: "100%",
							boxSizing: "border-box",
						}}
					/>

					{mintQuantity && (
						<div
							style={{
								backgroundColor: "black",
								padding: "15px",
								borderRadius: "8px",
								textAlign: "center",
								fontSize: "16px",
							}}
						>
							minting: {mintQuantity} ERC20 Token
						</div>
					)}
				</div>

				{/* ERC20 buttons */}
				<div
					style={{
						display: "flex",
						width: "100%",
						maxWidth: "800px",
						justifyContent: "space-between",
						gap: "20px",
					}}
				>
					{erc20Buttons.map((name) => (
						<button
							key={name}
							onClick={() => handleClick(name)}
							style={{
								flex: 1,
								padding: "15px 0",
								fontSize: "16px",
								fontWeight: "bold",
								borderRadius: "8px",
								border: "none",
								backgroundColor: "rgb(63, 216, 137)",
								boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
								cursor: "pointer",
								transition: "transform 0.2s, background-color 0.2s",
							}}
							onMouseOver={(e) =>
								(e.currentTarget.style.transform = "scale(1.05)")
							}
							onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
						>
							{name}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

async function get(wallet: IWallet) {
	// const changeAddress = await wallet.getChangeAddress();
	const utxos = await wallet.getUtxos();
	const collateral = (await wallet.getCollateral())[0];
	const usedAddress = (await wallet.getUsedAddresses())[0];

	const paramUtxo = utxos[0]!;
	return paramUtxo;
}
