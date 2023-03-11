import NetworkLogo from "./NetworkLogo"
import checkmarkMiniIcon from "../../assets/images/icons/checkmark_mini.svg"
import classNames from "classnames"
import { FunctionComponent } from "react"
import { IChain } from "@exzo-wallet/background/utils/types/chain"

interface DropdownNetworkDisplayProps {
    network: IChain
    active?: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

/**
 * Network display component
 *
 * @param network - Object containing the network info
 * @param active - Determines if the element is already showing selected style.
 * @param onClick - onClick callback
 */
const DropdownNetworkDisplay: FunctionComponent<
    DropdownNetworkDisplayProps
> = ({ network, active = false, onClick }) => {
    return (
        <div
            className={classNames(
                "flex flex-row items-center w-full p-3 my-0.5 rounded-md cursor-pointer",
                "transition-all duration-300 active:scale-95 hover:hover:bg-gray-700",
                active && "scale-95"
            )}
            onClick={onClick}
        >
            <div className="p-2 bg-white rounded-full">
                <NetworkLogo
                    logo={network.logo}
                    name={network.name}
                    bigLogo={false}
                />
            </div>
            <div
                className="text-sm truncate font-semibold ml-4 text-white"
                title={network.name}
            >
                {network.name}
            </div>
            <img
                src={checkmarkMiniIcon}
                alt="checkmark"
                className={classNames(
                    "absolute right-6",
                    active ? "visible" : "hidden"
                )}
            />
        </div>
    )
}

export default DropdownNetworkDisplay
