use aiken/collection/dict
// use aiken/collection/list
use cardano/assets.{PolicyId}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
} as tx
use cocktail.{inputs_at_with, outputs_at_with}
use types.{BurnSetup, MintBurnErc20, SetupTokenDatum, SpendingAction}

validator erc20(
  cap: Int,
  setup_policy_id: PolicyId,
  erc20_token_policy: PolicyId,
) {
  spend(
    _datum_opt: Option<SetupTokenDatum>,
    rdmr: SpendingAction,
    input: OutputReference,
    tx: Transaction,
  ) {
    let Transaction { mint, inputs, outputs, .. } = tx

    // 1. Input Validation
    // find own input
    expect Some(own_input) = find_input(inputs, input)

    // check if setup input included in inputs
    expect [_setup_input] =
      inputs_at_with(inputs, own_input.output.address, setup_policy_id, "")

    // get input datum
    expect InlineDatum(raw_input_datum) = own_input.output.datum
    expect input_datum: SetupTokenDatum = raw_input_datum

    when rdmr is {
      BurnSetup -> {
        // check if minting setup token
        expect [Pair(_asset_name, mint_quantity)] =
          mint
            |> assets.tokens(setup_policy_id)
            |> dict.to_pairs()

        // ensure all erc20 tokens are burnt before destroy setup token
        mint_quantity == -1 && input_datum.current_supply == 0
      }

      MintBurnErc20 -> {
        // check if minted erc20
        expect [Pair(_asset_name, mint_quantity)] =
          mint
            |> assets.tokens(erc20_token_policy)
            |> dict.to_pairs()

        // check whether mint exceed cap
        let updated_supply = input_datum.current_supply + mint_quantity
        let is_under_cap = updated_supply <= cap

        //2. Output Validation
        let filtered_outputs =
          outputs_at_with(
            outputs,
            own_input.output.address,
            setup_policy_id,
            "",
          )

        // get updated current supply from output datum and check for single output
        let output_updated_supply =
          when filtered_outputs is {
            [only_output] -> {
              expect InlineDatum(setup_output_datum) = only_output.datum
              expect output_datum: SetupTokenDatum = setup_output_datum
              output_datum.current_supply
            }
            [] -> {
              trace @"no output with own address"
              fail
            }
            _ -> {
              trace @"multiple outputs"
              fail
            }
          }

        // check for updated datum
        let is_output_correct = (updated_supply == output_updated_supply)?

        is_under_cap? && is_output_correct?
      }
    }
  }

  else(_) {
    fail
  }
}
