import { BigNumber } from "@ethersproject/bignumber"

export const SEND_GAS_COST = BigNumber.from("0x5208") // Hex for 21000, cost of a simple send.
export const APPROVE_GAS_COST = BigNumber.from("0xcb34") // Hex for 52020, default cost of approve.

/**
 * Decimal places to default in case an error looking up for them occurred
 */
export const DEFAULT_DECIMALS = 18

/**
 * Percentage of the estimated gas to define a lower and higher threshold to calculate a gas warning
 */
export const DEFAULT_TRANSACTION_GAS_PERCENTAGE_THRESHOLD = 20

/**
 * Time before transitioning to next DApp request
 */
export const DAPP_FEEDBACK_WINDOW_TIMEOUT = 3000

/**
 * Timeout before cancelling a signing request
 */
export const SIGN_TRANSACTION_TIMEOUT = 180000

/**
 * Default swap fee for users without fee discount
 */
export const BASE_SWAP_FEE = 2.0

/**
 * Default bridge fee for users without fee discount
 */
export const BASE_BRIDGE_FEE = 0.005

/**
 * Time ellapsed before refreshing the swap quote
 */
export const SWAP_QUOTE_REFRESH_TIMEOUT = 1000 * 15

export const LINKS = {
    WEBSITE: "https://exzo.network",
    TELEGRAM: "https://t.me/Exzo_Network",
    GITHUB: "https://github.com/exzonetwork/",
    TWITTER: "https://twitter.com/Exzo_Network",
    WEBSITE_BUG_REPORT: "https://exzo.network/contact",
    GITHUB_BUG_REPORT: 
        "https://github.com/ExzoNetwork/Exzo-Web3-Wallet/issues",
    ARTICLES: {
        HD_PATH:
            "https://exzonetwork.medium.com/what-is-an-hd-path-in-blockchain-wallets-844fb5d1bae8",
        LOCK_TIMEOUT:
            "https://exzonetwork.medium.com/what-is-lock-timeout-d9aed0320214",
        CUSTOM_NETWORK_RISKS:
            "https://exzonetwork.medium.com/the-risks-of-adding-a-custom-blockchain-network-to-the-exzo-wallet-web3-chrome-extension-a271d0c96014",
        MALICIOUS_DAPPS:
            "https://exzonetwork.medium.com/what-is-an-hd-path-in-blockchain-wallets-844fb5d1bae8",
        BRIDGES: "https://exzonetwork.medium.com/what-is-an-hd-path-in-blockchain-wallets-844fb5d1bae8",
        CHANGELOG: "https://github.com/ExzoNetwork/Exzo-Web3-Wallet/pulls",
    },
}
