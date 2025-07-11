// 1 - Oneshot Setup Token

pub type SetupTokenDatum {
  current_supply: Int,
}

// Spend Redeemer

pub type SpendingAction {
  MintBurnErc20
  BurnSetup
}

// Mint Redeemer

pub type MintingAction {
  Mint
  Burn
}
