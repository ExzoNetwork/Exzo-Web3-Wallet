import { BigNumber } from "@ethersproject/bignumber"
import { Fragment, FunctionComponent, useState } from "react"
import { useOnMountHistory } from "../context/hooks/useOnMount"
import { Token } from "@exzo-wallet/background/controllers/erc-20/Token"
import { TokenList, useTokensList } from "../context/hooks/useTokensList"
import { formatUnits } from "@ethersproject/units"

import { Classes } from "../styles/classes"
import plus from "../assets/images/icons/plus.svg"
import unknownTokenIcon from "../assets/images/unknown_token.svg"
import ChevronRightIcon from "./icons/ChevronRightIcon"
import { formatRounded } from "../util/formatRounded"
import { ActionButton } from "./button/ActionButton"
import AssetsLoadingSkeleton from "./skeleton/AssetsLoadingSkeleton"
import useCurrencyFromatter from "../util/hooks/useCurrencyFormatter"
import { isNativeTokenAddress } from "../util/tokenUtils"
import { useBlankState } from "../context/background/backgroundHooks"
export type AssetItem = {
    token: Token
    balance: BigNumber
}

export const AssetIcon: FunctionComponent<{
    asset: Partial<Token>
    filled?: boolean
}> = ({ asset, filled }) => (
    <div className={filled ? Classes.roundedFilledIcon : Classes.roundedIcon}>
        {
            <img
                src={asset.logo || unknownTokenIcon}
                onError={(e) => {
                    ; (e.target as any).onerror = null
                        ; (e.target as any).src = unknownTokenIcon
                }}
                alt={asset.symbol || ""}
                className="rounded-full"
            />
        }
    </div>
)

const Asset: FunctionComponent<{
    asset: AssetItem
    pushDeleteTokens: Function
}> = ({ asset }) => {
    const history: any = useOnMountHistory()
    const formatter = useCurrencyFromatter()
    return (
        <div
            onClick={() =>
                history.push({
                    pathname: `/asset/details`,
                    state: {
                        address: asset.token.address,
                        transitionDirection: "left",
                    },
                })
            }
            className="flex flex-row items-center justify-between px-3 py-4 -ml-6 transition duration-300 hover:bg-opacity-20 
                bg-body-assets-100 active:bg-opacity-20 cursor-pointer rounded-lg"
            style={{ width: "calc(100% + 2 * 1.5rem)" }}
            role="listitem"
            aria-label={asset.token.symbol}
        >
            <div className="flex flex-row items-center">
                <AssetIcon asset={asset.token} />
                <div className="flex flex-col ml-2">
                    <span
                        className="font-bold text-white text-base"
                        title={`
                                    ${formatUnits(
                            asset.balance || "0",
                            asset.token.decimals
                        )} ${asset.token.symbol}
                                `}
                    >
                        {asset.token.name}
                    </span>
                    <span className="text-sm text-body-assets-200">
                        {`
                            ${formatRounded(
                                formatUnits(
                                    asset.balance || "0",
                                    asset.token.decimals
                                ),
                                4
                            )}
                            ${asset.token.symbol}
                        `}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                {/* <ChevronRightIcon /> */}
                <div className="flex flex-col ml-2">
                    <span
                        className="font-bold text-white text-base"
                        title={`
                                    ${formatUnits(
                            asset.balance || "0",
                            asset.token.decimals
                        )} ${asset.token.symbol}
                                `}
                    >
                        {formatter.format(
                            asset.balance || BigNumber.from(0),
                            asset.token.symbol,
                            asset.token.decimals,
                            isNativeTokenAddress(asset.token.address)
                        )}
                    </span>
                    <span className="text-sm text-body-balances-200">
                        +$0.10
                    </span>
                </div>
            </div>
        </div>
    )
}

const SubAssetList: FunctionComponent<{ assets: TokenList }> = ({ assets }) => {
    const state = useBlankState()!

    const isLoading =
        state.isNetworkChanging || state.isRatesChangingAfterNetworkChange

    const [deletedTokens, setDeletedTokens] = useState([] as string[])
    const pushDeleteTokens = (deleteToken: string) => {
        setDeletedTokens([...deletedTokens, deleteToken])
    }

    // the action of delete a token is not sync, we include this blick of code for not showing deleted tokens while they are being deleted.
    const newDeleted: string[] = []
    deletedTokens.forEach((t) => {
        if (assets.map((a) => a.token.address).includes(t)) {
            newDeleted.push(t)
        }
    })
    if (deletedTokens.length !== newDeleted.length) {
        setDeletedTokens(newDeleted)
    }

    return (
        <div
            className="flex flex-col flex-1 w-full space-y-0"
            role="list"
            aria-label="assets"
        >
            <div className="text-white text-sm mt-2.5" >Assets</div>
            <div className="px-6 py-2 flex gap-2 flex-col">
                {isLoading ? (
                    <AssetsLoadingSkeleton />
                ) : (
                    assets
                        .filter((t) => !deletedTokens.includes(t.token.address))
                        .map((a, i) => (
                            <Fragment key={i}>
                                <Asset
                                    asset={a}
                                    pushDeleteTokens={pushDeleteTokens}
                                />
                            </Fragment>
                        ))
                )}
            </div>
        </div>
    )
}

const AssetsList = () => {
    const { currentNetworkTokens, nativeToken } = useTokensList()

    const tokens = [nativeToken].concat(currentNetworkTokens)

    // Top spacing for network labels: "pt-6"
    return (
        <div
            className="flex flex-col w-full space-y-4"
            data-testid="assets-list"
        >
            {tokens.length > 9 && (
                <div className="flex flex-col w-full mt-4">
                    <ActionButton
                        icon={plus}
                        label="Add Token"
                        to="/settings/tokens/add"
                    />
                </div>
            )}
            <div className="flex flex-col w-full space-y-1">
                {/* Network label */}
                {/* <span className="text-xs text-gray-500">ETHEREUM</span> */}
                <SubAssetList assets={tokens} />
            </div>
            <div className="flex flex-col w-full space-y-1">
                <ActionButton
                    icon={plus}
                    label="Add Token"
                    to="/settings/tokens/add"
                />
            </div>
        </div>
    )
}

export default AssetsList
