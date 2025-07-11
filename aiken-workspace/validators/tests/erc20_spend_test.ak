use cardano/assets.{from_lovelace}
use cardano/transaction.{Transaction}
use erc20/spend as erc20_spend
use mocktail.{
  complete, mint, mock_tx_hash, mock_utxo_ref, mocktail_tx, tx_in,
  tx_in_inline_datum, tx_out, tx_out_inline_datum,
}
use tests/utils.{
  mock_correct_input_datum, mock_correct_output_datum, mock_erc20_spend_address,
  mock_erc20_token_policy_id, mock_extra_address, mock_incorrect_address,
  mock_incorrect_input_datum, mock_incorrect_output_datum,
  mock_incorrect_token_policy_id, mock_input_value, mock_output_value,
  mock_setup_token_policy_id,
}

type Erc20TestCase {
  is_under_cap: Bool,
  is_single_script_input: Bool,
  is_single_script_output: Bool,
  has_mint: Bool,
  is_correct_token_mint: Bool,
  is_correct_input_address: Bool,
  is_correct_input_datum: Bool,
  is_correct_output_address: Bool,
  is_correct_output_datum: Bool,
}

fn mock_erc20_tx(test_case: Erc20TestCase) -> Transaction {
  let Erc20TestCase {
    is_under_cap,
    is_single_script_input,
    is_single_script_output,
    has_mint,
    is_correct_token_mint,
    is_correct_input_address,
    is_correct_input_datum,
    is_correct_output_address,
    is_correct_output_datum,
  } = test_case

  mocktail_tx()
    |> tx_in(
        is_correct_input_address,
        mock_tx_hash(0),
        0,
        mock_input_value,
        mock_erc20_spend_address,
      )
    |> tx_in(
        // mock second input
        !is_single_script_input,
        mock_tx_hash(0),
        1,
        from_lovelace(1_000_000),
        mock_extra_address,
      )
    |> tx_in(
        // mock incorrect input
        !is_correct_input_address,
        mock_tx_hash(0),
        0,
        from_lovelace(1_000_000),
        mock_incorrect_address,
      )
    |> tx_in_inline_datum(is_correct_input_datum, mock_correct_input_datum)
    |> tx_in_inline_datum(!is_correct_input_datum, mock_incorrect_input_datum)
    |> tx_out(
        is_correct_output_address,
        mock_erc20_spend_address,
        mock_output_value,
      )
    |> tx_out(!is_single_script_output, mock_extra_address, mock_output_value)
    |> tx_out(
        !is_correct_output_address,
        mock_incorrect_address,
        mock_output_value,
      )
    |> tx_out_inline_datum(is_correct_output_datum, mock_correct_output_datum)
    |> tx_out_inline_datum(
        !is_correct_output_datum,
        mock_incorrect_output_datum,
      )
    |> mint(
        // correct mint
        has_mint && is_correct_token_mint && is_under_cap,
        50,
        mock_erc20_token_policy_id,
        "",
      )
    |> mint(
        // minted wrong token
        has_mint && !is_correct_token_mint && is_under_cap,
        50,
        mock_incorrect_token_policy_id,
        "",
      )
    |> mint(
        // minted too many token
        has_mint && is_correct_token_mint && !is_under_cap,
        100,
        mock_erc20_token_policy_id,
        "",
      )
    |> complete()
}

test t2_always_succeed() {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_mint_over_cap() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: False,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_multiple_input() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: False,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_multiple_output() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: False,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_no_mint() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: False,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_incorrect_token_minted() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: False,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_incorrect_input_address() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: False,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_incorrect_input_datum() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: False,
        is_correct_output_address: True,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_incorrect_output_address() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: False,
        is_correct_output_datum: True,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}

test t2_incorrect_output_datum() fail {
  let tx =
    mock_erc20_tx(
      Erc20TestCase {
        is_under_cap: True,
        is_single_script_input: True,
        is_single_script_output: True,
        has_mint: True,
        is_correct_token_mint: True,
        is_correct_input_address: True,
        is_correct_input_datum: True,
        is_correct_output_address: True,
        is_correct_output_datum: False,
      },
    )

  erc20_spend.erc20.spend(
    100,
    mock_setup_token_policy_id,
    mock_erc20_token_policy_id,
    Some(mock_correct_input_datum),
    None,
    mock_utxo_ref(0, 0),
    tx,
  )
}
