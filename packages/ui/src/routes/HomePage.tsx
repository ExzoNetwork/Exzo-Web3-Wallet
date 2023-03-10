import { useState } from "react"
import classnames from "classnames"
import { Link, useHistory } from "react-router-dom"
import { formatUnits } from "@ethersproject/units"
import { BigNumber } from "@ethersproject/bignumber"
import { BiCircle } from "react-icons/bi"

// Components
import PageLayout from "../components/PageLayout"
import CopyTooltip from "../components/label/СopyToClipboardTooltip"
import CopyIcon from "../components/icons/CopyIcon"
import NetworkSelect from "../components/input/NetworkSelect"
import ArrowHoverAnimation from "../components/icons/ArrowHoverAnimation"
import ErrorDialog from "../components/dialog/ErrorDialog"
import AccountIcon from "../components/icons/AccountIcon"
import ActivityAssetsView from "../components/ActivityAssetsView"
import GenericTooltip from "../components/label/GenericTooltip"
import AnimatedIcon, { AnimatedIconName } from "../components/AnimatedIcon"
import Tooltip from "../components/label/Tooltip"

// Utils
import { formatHash, formatName } from "../util/formatAccount"
import { formatCurrency, toCurrencyAmount } from "../util/formatCurrency"
import { getAccountColor } from "../util/getAccountColor"
import { formatRounded } from "../util/formatRounded"
import { HiOutlineExclamationCircle } from "react-icons/hi"

// Context
import { useBlankState } from "../context/background/backgroundHooks"
import { useSelectedAccount } from "../context/hooks/useSelectedAccount"
import { useSelectedNetwork } from "../context/hooks/useSelectedNetwork"
import { session } from "../context/setup"
import { useConnectedSite } from "../context/hooks/useConnectedSite"
import { useTokensList } from "../context/hooks/useTokensList"

// Utils
import { useSelectedAddressWithChainIdChecksum } from "../util/hooks/useSelectedAddressWithChainIdChecksum"

// Assets
import TokenSummary from "../components/token/TokenSummary"
import DoubleArrowHoverAnimation from "../components/icons/DoubleArrowHoverAnimation"
import TransparentOverlay from "../components/loading/TransparentOverlay"
import AssetsList from "../components/AssetsList"
import ArrowIcon from "../components/icons/ArrowIcon"
import { BsCurrencyBitcoin } from "react-icons/bs"
import BuyIcon from "../components/icons/BuyIcon"
import PopupHeader from "../components/popup/PopupHeader"
import PopupLayout from "../components/popup/PopupLayout"

const AccountDisplay = () => {
    const accountAddress = useSelectedAddressWithChainIdChecksum()
    const account = useSelectedAccount()
    const [copied, setCopied] = useState(false)
    const copy = async () => {
        await navigator.clipboard.writeText(accountAddress)
        setCopied(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCopied(false)
    }
    return (
        <button
            type="button"
            className="relative flex flex-col group"
            onClick={copy}
        >
            <span className="text-sm font-bold text-white" data-testid="account-name">
                {formatName(account.name, 18)}
            </span>
            <span className="text-sm truncate text-white flex items-center">
                {formatHash(accountAddress)}
                <CopyIcon />
            </span>
            <CopyTooltip copied={copied} />
        </button>
    )
}

const DAppConnection = () => {
    const dAppConnected = useConnectedSite()
    const history = useHistory()!
    return (
        <GenericTooltip
            bottom
            className="p-2 w-150 overflow-auto -m-4 transition delay-300 hover:delay-0 ease-in-out"
            content={
                <div>
                    <p className="w-100 text-center">
                        {dAppConnected === "connected" ? (
                            <span>You are connected to the open site</span>
                        ) : (
                            <span>You are not connected to the open site</span>
                        )}
                    </p>
                </div>
            }
        >
            <div
                onClick={() => {
                    if (dAppConnected !== "not-connected") {
                        history.push({
                            pathname:
                                "/accounts/menu/connectedSites/accountList",
                            state: {
                                origin: session?.origin,
                                fromRoot: true,
                            },
                        })
                    }
                }}
                className={classnames(
                    "relative flex flex-row items-center p-1 px-2 pr-1  text-gray-600 rounded-md group border border-primary-200  text-xs cursor-pointer",
                    dAppConnected === "connected" &&
                    "bg-green-100 hover:border-green-300",
                    dAppConnected === "connected-warning" &&
                    "bg-yellow-100 hover:border-yellow-300",
                    dAppConnected === "not-connected" && "pointer-events-none"
                )}
            >
                {dAppConnected === "connected" && (
                    <span className="relative inline-flex rounded-full h-2 w-2 mr-2 animate-pulse bg-green-400 pointer-events-none"></span>
                )}

                {dAppConnected === "connected-warning" && (
                    <HiOutlineExclamationCircle
                        size={16}
                        className="mr-1 text-yellow-600"
                    />
                )}

                {dAppConnected === "not-connected" && (
                    <BiCircle className="mr-1 w-2" />
                )}

                <span
                    className={classnames(
                        "mr-1 pointer-events-none",
                        dAppConnected === "connected" && "text-green-600",
                        dAppConnected === "connected-warning" &&
                        "text-yellow-600"
                    )}
                >
                    {dAppConnected === "not-connected"
                        ? "Not connected"
                        : "Connected"}
                </span>
            </div>
        </GenericTooltip>
    )
}

const HomePage = () => {
    const state = useBlankState()!
    const { nativeToken } = useTokensList()
    const { nativeCurrency, isSendEnabled, isSwapEnabled, isBridgeEnabled } =
        useSelectedNetwork()

    const isLoading =
        state.isNetworkChanging || state.isRatesChangingAfterNetworkChange
    return (
        <PopupLayout
            header={
                <PopupHeader title="home" backButton={false}/>
            }>
            {state.isNetworkChanging && <TransparentOverlay />}
            <div className="flex flex-col items-start flex-1 w-full max-h-screen p-6 space-y-2 overflow-auto hide-scroll">
                <div className="w-full">
                    {/* dapp connected status part */}
                    {/* <div className="flex flex-row items-start w-full justify-between pt-1 pb-2">
                        <GenericTooltip
                            bottom
                            disabled={!state.isImportingDeposits}
                            content={
                                <p className="w-40 text-center">
                                    Please wait until deposits are done loading
                                    to change networks. This can take up to 15
                                    minutes.
                                </p>
                            }
                        >
                        <NetworkSelect />
                        </GenericTooltip>
                        <DAppConnection />
                    </div> */}
                    <TokenSummary>
                        <TokenSummary.Balances>
                            <TokenSummary.TokenBalance
                                title={
                                    formatUnits(
                                        nativeToken.balance || "0",
                                        nativeCurrency.decimals
                                    ) + ` ${nativeCurrency.symbol}`
                                }
                            >
                                {formatRounded(
                                    formatUnits(
                                        nativeToken.balance || "0",
                                        nativeCurrency.decimals
                                    ),
                                    5
                                )}{" "}
                                {nativeCurrency.symbol}
                            </TokenSummary.TokenBalance>
                            <TokenSummary.ExchangeRateBalance>
                                {formatCurrency(
                                    toCurrencyAmount(
                                        nativeToken.balance ||
                                        BigNumber.from(0),
                                        state.exchangeRates[
                                        state.networkNativeCurrency.symbol
                                        ],
                                        nativeCurrency.decimals
                                    ),
                                    {
                                        currency: state.nativeCurrency,
                                        locale_info: state.localeInfo,
                                        returnNonBreakingSpace: true,
                                        showSymbol: true,
                                    }
                                )}
                            </TokenSummary.ExchangeRateBalance>
                        </TokenSummary.Balances>
                        <TokenSummary.Actions>
                            <Link
                                to="/accounts/menu/receive"
                                draggable={false}
                                className={classnames(
                                    "flex flex-row items-center space-y-2 group w-full",
                                    !isSendEnabled && "pointer-events-none"
                                )}
                            >
                                <div
                                    className={classnames(
                                        "overflow-hidden flex flex-1 w-full justify-center items-center px-2.5 py-1.5 transition duration-300 rounded-lg group-hover:opacity-75",
                                        !isSendEnabled
                                            ? "bg-gray-300"
                                            : "bg-body-balances-100"
                                    )}
                                >
                                    {/* {isLoading ? (
                                        <div className="flex flex-row items-center justify-center w-full h-full">
                                            <AnimatedIcon
                                                icon={
                                                    AnimatedIconName.BlueCircleLoadingSkeleton
                                                }
                                                className="w-4 h-4 pointer-events-none"
                                            />
                                        </div>
                                    ) : (
                                        <ArrowHoverAnimation />
                                    )} */}
                                    <ArrowIcon direction={"down"}/>
                                    <span className="text-xs font-medium text-body-balances-200">
                                        Deposit
                                    </span>
                                </div>
                            </Link>
                            {isSwapEnabled && (
                                <Link
                                    to="/bridge"
                                    draggable={false}
                                    className={classnames(
                                        "flex flex-row items-center space-y-2 group w-full",
                                        (!isSendEnabled ||
                                            !state.isUserNetworkOnline) &&
                                        "pointer-events-none"
                                    )}
                                >
                                    <div
                                        className={classnames(
                                            "overflow-hidden flex items-center justify-center flex-1 px-2.5 py-1.5 transition duration-300 rounded-lg group-hover:opacity-75",
                                            !isSendEnabled ||
                                                !state.isUserNetworkOnline
                                                ? "bg-gray-300"
                                                : "bg-body-balances-100"
                                        )}
                                    >
                                        {/* {isLoading ? (
                                            <div className="flex flex-row items-center justify-center w-full h-full">
                                                <AnimatedIcon
                                                    icon={
                                                        AnimatedIconName.BlueCircleLoadingSkeleton
                                                    }
                                                    className="w-4 h-4 pointer-events-none rotate-180"
                                                />
                                            </div>
                                        ) : (
                                            <DoubleArrowHoverAnimation />
                                        )} */}
                                        <BuyIcon />
                                        <span className="text-xs font-medium text-body-balances-200">
                                            Bridge
                                        </span>
                                    </div>
                                </Link>
                            )}
                            {isBridgeEnabled && (
                                <Link
                                    to="/send"
                                    draggable={false}
                                    className={classnames(
                                        "flex flex-row items-center space-y-2 group w-full",
                                        (!isSendEnabled ||
                                            !state.isUserNetworkOnline) &&
                                        "pointer-events-none"
                                    )}
                                >
                                    <div
                                        className={classnames(
                                            "overflow-hidden flex items-center justify-center flex-1 w-full px-2.5 py-1.5 transition duration-300 rounded-lg group-hover:opacity-75",
                                            !isSendEnabled ||
                                                !state.isUserNetworkOnline
                                                ? "bg-gray-300"
                                                : "bg-body-balances-100"
                                        )}
                                    >
                                        {/* {isLoading ? (
                                            <div className="flex flex-row items-center justify-center w-full h-full">
                                                <AnimatedIcon
                                                    icon={
                                                        AnimatedIconName.BlueCircleLoadingSkeleton
                                                    }
                                                    className="w-4 h-4 pointer-events-none"
                                                />
                                            </div>
                                        ) : (
                                            <AnimatedIcon
                                                icon={AnimatedIconName.Bridge}
                                                className="cursor-pointer"
                                            />
                                        )} */}
                                        <ArrowIcon direction={"up"}/>
                                        <span className="text-xs font-medium text-body-balances-200">
                                            Send
                                        </span>
                                    </div>
                                </Link>
                            )}
                        </TokenSummary.Actions>
                    </TokenSummary>
                    {/* <ActivityAssetsView initialTab={state.popupTab} /> */}
                    <AssetsList />
                </div>
            </div>
        </PopupLayout>
    )
}

export default HomePage
