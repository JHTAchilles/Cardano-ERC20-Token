use cardano/address.{from_script}
use cardano/assets.{add, from_lovelace}
use mocktail.{mock_policy_id}
use types.{SetupTokenDatum}

pub type IncorrectSetupTokenDatum {
  supply: Int,
}

pub const mock_setup_token_policy_id = mock_policy_id(0)

pub const mock_erc20_token_policy_id = mock_policy_id(1)

pub const mock_incorrect_token_policy_id = mock_policy_id(2)

pub const mock_erc20_spend_address = from_script("erc20_spend_script")

pub const mock_extra_address = from_script("extra_address")

pub const mock_incorrect_address = from_script("incorrect_address")

pub const mock_setup_token_address = from_script("token_mint_script")

pub const mock_input_value =
  from_lovelace(20000000) |> add(mock_setup_token_policy_id, "", 1)

pub const mock_input_value_2 = from_lovelace(20000000)

pub const mock_incorrect_input_value =
  from_lovelace(20000000) |> add(mock_incorrect_token_policy_id, "", 1)

pub const mock_output_value =
  from_lovelace(20000000) |> add(mock_setup_token_policy_id, "", 1)

pub const mock_correct_input_datum = SetupTokenDatum { current_supply: 30 }

pub const mock_incorrect_input_datum = IncorrectSetupTokenDatum { supply: 2 }

pub const mock_correct_output_datum = SetupTokenDatum { current_supply: 80 }

pub const mock_incorrect_output_datum = SetupTokenDatum { current_supply: 0 }
