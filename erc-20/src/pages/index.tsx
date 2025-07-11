import { burnERC20Token } from "@/transaction/burn_erc20_token";
import { mintERC20Token } from "@/transaction/mint_erc20_token";
import { mintSetupToken } from "@/transaction/mint_setup_token";
import { useWallet } from "@meshsdk/react";
import React, { useEffect, useState } from "react";
// import { getCurrentQuantity, getSetupDatum } from "../../lib/utils";
import { hardCodedUtxo } from "@/transaction/test";
import { burnSetupToken } from "@/transaction/burn_setup_token";

export default function Home() {
	const { wallet, connected, connect } = useWallet();

	const [balance, setUserBalance] = useState("");
	const [inputField, setInputField] = useState("");
	const [mintQuantity, setMintQuantity] = useState("0");
	const [currentQuantity, setCurrentQuantity] = useState("0");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			setInputField(e.target.value);
			setMintQuantity(e.target.value);
		} else {
			setMintQuantity("0");
			setInputField("");
		}
	};

	const mintErc20Wrap = async () => {
		const quantity = await mintERC20Token(wallet, +mintQuantity);
		if (quantity) {
			setCurrentQuantity(quantity.toString());
		} else setCurrentQuantity("0");
		setInputField("");
		setMintQuantity("0");
	};

	const burnErc20Wrap = async () => {
		const quantity = await burnERC20Token(wallet, -mintQuantity);
		if (quantity) {
			setCurrentQuantity(quantity.toString());
		} else setCurrentQuantity("0");
		setInputField("");
		setMintQuantity("0");
	};

	// const getQuantity = async () => {
	// 	const quantity: number = await getCurrentQuantity(hardCodedUtxo);
	// 	setCurrentQuantity(quantity.toString());
	// };

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
				burnSetupToken(wallet);
				break;

			case "Mint Erc20 Token":
				console.log("Minting ERC20 Token!");
				mintErc20Wrap();
				break;

			case "Burn Erc20 Token":
				console.log("Burning ERC20 Token!");
				burnErc20Wrap();
				break;

			default:
				break;
		}
	};

	return (
		<div className="bg-gray-800 text-white text-center">
			<p>${balance} lovelace</p>
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
						value={inputField}
						className="[&::-webkit-inner-spin-button]:appearance-none"
						//value={mintQuantity}
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

					{
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
					}
				</div>
				<div
					style={{
						backgroundColor: "black",
						padding: "15px",
						borderRadius: "8px",
						textAlign: "center",
						fontSize: "16px",
					}}
				>
					current quantity: {currentQuantity} ERC20 Token
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
