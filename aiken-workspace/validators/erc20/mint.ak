use aiken/collection/dict
use cardano/assets.{PolicyId}
use cardano/transaction.{Transaction} as tx
use cocktail.{inputs_with}
use types.{Action, Burn, Mint}

validator erc20(setup_policy_id: PolicyId) {
  mint(rdmr: Action, erc20_policy_id: PolicyId, tx: Transaction) {
    let Transaction { inputs, mint, .. } = tx
    expect [Pair(_asset_name, mint_amount)] =
      mint
        |> assets.tokens(erc20_policy_id)
        |> dict.to_pairs()

    expect [_setup_input] = inputs_with(inputs, setup_policy_id, "")

    when rdmr is {
      Mint -> mint_amount > 0
      Burn -> mint_amount < 0
    }
  }

  else(_) {
    fail
  }
}
