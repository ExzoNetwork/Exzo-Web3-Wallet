import PopupHeader from "../components/popup/PopupHeader"
import PopupLayout from "../components/popup/PopupLayout"
import { BigNumber } from "@ethersproject/bignumber"
import { SwapQuote } from "@exzo-wallet/background/controllers/SwapController"
import { Token } from "@exzo-wallet/background/controllers/erc-20/Token"
import { useOnMountHistory } from "../context/hooks/useOnMount"

import { useAppDispatch } from "../app/hooks"
import { useAppSelector } from "../app/hooks"
import { getCollectionData } from "../slices/collection"

//assets
import { useEffect, useMemo, useState } from "react"
import { RootState } from "../app/store"
import LoadingDots from "../components/loading/LoadingDots"
import { useSelectedAddressWithChainIdChecksum } from "../util/hooks/useSelectedAddressWithChainIdChecksum"
import { useSelectedNetwork } from "../context/hooks/useSelectedNetwork"

interface SwapPageLocalState {
    fromToken?: Token
    swapQuote?: SwapQuote
    toToken?: Token
    fromAssetPage?: boolean
    amount?: string
}

interface SwapState {
    tokenFrom?: Token
    tokenTo?: Token
    bigNumberAmount?: BigNumber
}

const getNetworkName = (chainID: Number) => {
    const networkName = [{ key: 1, value: "eth-main" },
    { key: 42161, value: "arbitrum-main" },
    { key: 10, value: "optimism-main" },
    { key: 137, value: "poly-main" },
    { key: 5, value: "eth-goerli" }]
    for (const item of networkName) {
        if (item.key == chainID) {
            return item.value;
        }
    }
    return "no exist"
}

const CollectiblesPage = () => {

    const accountAddress = useSelectedAddressWithChainIdChecksum()
    const { chainId } = useSelectedNetwork()
    const networkName = useMemo(() => getNetworkName(chainId), [chainId])
    console.log("network name-----", networkName)
    const history = useOnMountHistory()
    const {
        fromToken,
        swapQuote,
        toToken,
        amount: defaultAmount,
        fromAssetPage,
    } = (history.location.state || {}) as SwapPageLocalState

    const isLoading = useAppSelector((state: RootState) => state.collection.isFetching)

    const dispatch = useAppDispatch()

    const nftArray = useAppSelector((state: RootState) => state.collection.data)

    const _getCollectionData = async () => {
        await dispatch(getCollectionData({ accountAddress, networkName }))
    }
    
    useEffect(() => {
        if (networkName != "no exist") {
            _getCollectionData()
        }
    }, [accountAddress, networkName])

    return (
        <PopupLayout
            header={
                <PopupHeader
                    title="Swap"
                    close="/"
                    networkIndicator
                    keepState
                    onBack={() =>
                        fromAssetPage
                            ? history.push({
                                pathname: "/asset/details"
                            })
                            : history.push("/home")
                    }
                />
            }
        >
            <div className="p-4">
                <div className="text-white text-2xl p-6 pt-2">Collectibles</div>
                {
                    isLoading ?
                        <div className="flex justify-center w-full">
                            <LoadingDots />
                        </div> :
                        nftArray.length === 0 ? <div className="text-sm text-gray-500 w-full flex justify-center mx-auto">You have no collections</div> :
                            <div className="grid grid-cols-2 gap-4 w-full">
                                {
                                    nftArray.map((token: any, index: Number) => {
                                        return (
                                            <div key={index + token.contract_address} className="relative p-2 bg-container-100 rounded-lg border-container-100 border-2 hover:border-component-btn-200 cursor-pointer"
                                                onClick={() => {
                                                    history.push({
                                                        pathname: `/collectibles/detail`,
                                                        state: {
                                                            token
                                                        },
                                                    })
                                                }}>
                                                <div>
                                                    <img className="w-full h-full rounded-t-lg" src={token.cached_images ? token.cached_images.tiny_100_100 : ""} />
                                                </div>
                                                <div className="mt-2 text-white text-xs">{token.token_name}</div>
                                                <div className="mt-2">
                                                    {
                                                        token.recent_price ?
                                                            <><div className="text-txt-settings font-thin text-[10px]"><span className="text-white text-xs font-medium">price: </span>
                                                                ${parseFloat(token.recent_price.price_usd).toFixed(2)}
                                                            </div><div className="text-txt-settings flex text-[10px] justify-end font-thin">{token.recent_price.price + token.recent_price.price_currency}</div></> :
                                                            <div className="mt-1 text-txt-settings font-thin"><span className="text-white text-xs font-medium">price: </span>
                                                                {"not sale yet"}
                                                            </div>
                                                    }
                                                </div>
                                            </div>)
                                    })
                                }
                            </div>
                }
            </div>
        </PopupLayout>
    )
}

export default CollectiblesPage