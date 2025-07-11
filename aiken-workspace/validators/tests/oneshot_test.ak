use cardano/assets.{zero}
use cardano/transaction.{Transaction} as tx
use mocktail.{complete, mint, mocktail_tx, tx_in}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_policy_id}
use mocktail/virgin_output_reference.{mock_tx_hash, mock_utxo_ref}
use setup/oneshot
use types.{Mint}

type TestCase {
  is_mint_amount_correct: Bool,
}

fn get_mint_test_tx(test_case: TestCase) -> Transaction {
  let TestCase { is_mint_amount_correct } = test_case

  mocktail_tx()
    |> tx_in(True, mock_tx_hash(0), 0, zero, mock_pub_key_address(0, None))
    |> mint(is_mint_amount_correct, 1, mock_policy_id(0), "")
    |> mint(!is_mint_amount_correct, 2, mock_policy_id(0), "")
    |> complete()
}

test t1_setup_token_success_mint() {
  let utxo = mock_utxo_ref(0, 0)
  let test_case = TestCase { is_mint_amount_correct: True }
  let tx = get_mint_test_tx(test_case)
  oneshot.setup_token.mint(utxo, Mint, mock_policy_id(0), tx)
}

test t1_setup_token_fail_mint_with_more_than_1_mint() {
  let utxo = mock_utxo_ref(0, 0)
  let test_case = TestCase { is_mint_amount_correct: False }
  let tx = get_mint_test_tx(test_case)
  !oneshot.setup_token.mint(utxo, Mint, mock_policy_id(0), tx)
}
// test t1_setup_token_fail_mint_without_param_name_minted() {
//   let utxo = mock_utxo_ref(0, 0)
//   let test_case = TestCase { is_mint_amount_correct: True }
//   let tx = get_mint_test_tx(test_case)
//   !oneshot.setup_token.mint(test_token_name, utxo, Mint, mock_policy_id(0), tx)
// }
