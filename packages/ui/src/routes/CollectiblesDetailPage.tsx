import PopupHeader from "../components/popup/PopupHeader"
import PopupLayout from "../components/popup/PopupLayout"
import { useOnMountHistory } from "../context/hooks/useOnMount"

import { useState } from "react"
import CopyIcon from "../components/icons/CopyIcon"

const CollectiblesDetailPage = () => {
    const history: any = useOnMountHistory()
    const token = history.location.state.token
    const [copied, setCopied] = useState(false)
    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(token.contract_address)
        setCopied(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCopied(false)
    }
    return (
        <PopupLayout
            header={
                <PopupHeader
                    title="Swap"
                    close="/"
                    networkIndicator
                    keepState
                    onBack={() =>history.push({
                                  pathname: "/collectibles"
                              })
                    }
                />
            }
        >
            <div className="p-4">
                <div className="p-6 pt-0">
                    <img src={token.cached_images?  token.cached_images.tiny_100_100 : ""} className="w-full rounded-xl"/>
                    <div className="flex justify-between text-txt-settings mt-2">
                        <div className="flex items-center text-base">{token.token_name}</div>
                            {
                                token.recent_price ? 
                                    <div className="flex items-center text-xs flex-col">
                                        <div className="flex w-full justify-end items-center">${parseFloat(token.recent_price.price_usd).toFixed(2)}</div>
                                        <div className="flex w-full justify-end items-center">{token.recent_price.price + token.recent_price.price_currency}</div>
                                    </div>:
                                    <div className="flex justify-end items-center">Not sale yet</div>
                            }
                    </div>
                    <div className="flex justify-between text-txt-settings mt-2">
                        <div className="text-sm">
                            Collection Name
                        </div>
                        <div className="flex text-xs items-center cursor-pointer relative" onClick={copyToClipboard}>
                            <CopyIcon/>
                            {" "}{(token.contract_address).slice(0, 5)}...{(token.contract_address).slice(-4)}
                            {copied && <div className="absolute text-white text-xxs rounded-2xl right-1 -top-2 bg-black px-4 py-1">Copied!</div>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-white text-base font-semibold">Description</div>
                        <div className="text-txt-settings text-xs mt-2 font-normal">{token.token_description}</div>
                    </div>
                    <div className="mt-4 text-white">
                        <div className=" text-base font-semibold">Details</div>
                        <div className=" text-xs mt-2 flex justify-between">
                            <div className="font-normal">Last Sale Price</div>
                            <div className="font-normal text-txt-settings">
                                {
                                    token.recent_price ? parseFloat(token.recent_price.price_usd).toFixed(2) : "Not sale yet"
                                }
                            </div>
                        </div>
                        <div className="text-white text-xs mt-2 flex justify-between">
                            <div className="font-normal">Token Standard</div>
                            <div className="font-normal text-txt-settings">{(token.token_type).toUpperCase()}</div>
                        </div>
                        <div className="text-white text-xs mt-2 flex justify-between">
                            <div className="font-medium">Chain</div>
                            <div className="font-normal text-txt-settings">Ether</div>
                        </div>
                    </div>
                    <div className="mt-4 text-white">
                        <div className="text-base font-semibold">Traits</div>
                        {(token.metadata.attributes).map((trait:any, index:Number) => {
                            return (
                                <div className="text-xs mt-2 flex justify-between">
                                    <div className="font-normal">{trait.trait_type}</div>
                                    <div className="font-normal text-txt-settings">{trait.value}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </PopupLayout>
    )
}

export default CollectiblesDetailPage