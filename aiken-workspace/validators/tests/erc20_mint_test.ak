use cardano/transaction.{Transaction} as tx
use erc20/mint as erc20_mint
use mocktail.{complete, mint, mocktail_tx, tx_in}
use mocktail/virgin_key_hash.{mock_policy_id}
use mocktail/virgin_output_reference.{mock_tx_hash}
use tests/utils.{
  mock_erc20_spend_address, mock_extra_address, mock_incorrect_input_value,
  mock_input_value, mock_input_value_2, mock_setup_token_policy_id,
}
use types.{Mint}

type TestCase {
  is_mint_info_correct: Bool,
}

fn get_mint_test_tx(test_case: TestCase) -> Transaction {
  let TestCase { is_mint_info_correct } = test_case

  mocktail_tx()
    |> tx_in(
        is_mint_info_correct,
        mock_tx_hash(0),
        0,
        mock_input_value,
        mock_erc20_spend_address,
      )
    |> tx_in(
        !is_mint_info_correct,
        mock_tx_hash(0),
        0,
        mock_incorrect_input_value,
        mock_erc20_spend_address,
      )
    |> tx_in(True, mock_tx_hash(0), 1, mock_input_value_2, mock_extra_address)
    |> mint(True, 100, mock_policy_id(0), "")
    |> mint(True, 5000, mock_policy_id(0), "")
    |> complete()
}

test t1_setup_token_success_mint() {
  let test_case = TestCase { is_mint_info_correct: True }
  let tx = get_mint_test_tx(test_case)
  erc20_mint.erc20.mint(mock_setup_token_policy_id, Mint, mock_policy_id(0), tx)
}

test t1_setup_token_fail_mint_with_more_than_1_mint() fail {
  let test_case = TestCase { is_mint_info_correct: False }
  let tx = get_mint_test_tx(test_case)
  erc20_mint.erc20.mint(mock_setup_token_policy_id, Mint, mock_policy_id(0), tx)
}
