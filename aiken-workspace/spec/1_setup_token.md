# Setup Token - One Shot

## Parameter

- `utxo_ref`: UTxO to be spent at minting for this setup token

## User Action

1. Mint - Redeemer `Mint`

   - Transaction hash as parameterized is included in input

2. Burn - Redeemer `Burn`

   - The current policy id only has negative minting value in transaction body.
