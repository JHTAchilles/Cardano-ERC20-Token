# Spend UTxO

## Parameter

- `cap`: Supply cap of the erc20 token
- `setup_policy_id`: Policy Id of the setup token
- `erc20_token_policy`: Policy Id of the erc20 token

## User Action

1. Mint - Redeemer `Mint`

   - Transaction hash as parameterized is included in input

2. Burn - Redeemer `Burn`

   - The current policy id only has negative minting value in transaction body.
