import NetworkLogo from "./NetworkLogo"
import classnames from "classnames"
import { FunctionComponent, useEffect } from "react"
import { IChain } from "@exzo-wallet/background/utils/types/chain"

interface NetworkDisplayProps {
    network: IChain
    padding?: boolean
    transparent?: boolean
    bigLogo?: boolean
    assetAmountDisplay?: React.ReactNode
}

const NetworkDisplay: FunctionComponent<NetworkDisplayProps> = ({
    network,
    padding = true,
    transparent = false,
    bigLogo,
    assetAmountDisplay,
}) => {
    return (
        <div
            className={classnames(
                "flex flex-row items-center w-full rounded-md ml-1",
                padding && "p-4",
                !transparent && "bg-primary-100"
            )}
        >
            <div style={{transform: "scale(1.4)"}}>
                <NetworkLogo
                    logo={network.logo}
                    name={network.name}
                    bigLogo={bigLogo}
                />
            </div>
            <div className="w-full ml-4">
                <div
                    className="text-base truncate font-semibold text-body-600"
                    title={network.name}
                >
                    {network.name}
                </div>
                <div>
                    {assetAmountDisplay}
                </div>
            </div>
        </div>
    )
}

export default NetworkDisplay
