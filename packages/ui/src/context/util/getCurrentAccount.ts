import { AccountInfo } from "@exzo-wallet/background/controllers/AccountTrackerController"
import { Flatten } from "@exzo-wallet/background/utils/types/helpers"
import { BlankAppUIState } from "@exzo-wallet/background/utils/constants/initialState"

export const getCurrentAccount = (state: Flatten<BlankAppUIState>) =>
    state.accounts[
        state.selectedAddress.length > 0
            ? state.selectedAddress
            : Object.keys(state.accounts)[0]
    ] as AccountInfo
