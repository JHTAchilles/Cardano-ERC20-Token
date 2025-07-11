// 1 - Oneshot Setup Token

pub type SetupTokenDatum {
  current_supply: Int,
}

// Spend Redeemer

pub type SpendingAction {
  MintErc20
  BurnErc20
  BurnSetup
}

// Mint Redeemer

pub type MintingAction {
  Mint
  Burn
}
