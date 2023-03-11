import { FC } from "react"
import unknownTokenIcon from "../../assets/images/unknown_token.svg"
import { BigNumber } from "@ethersproject/bignumber"
import { Token } from "@exzo-wallet/background/controllers/erc-20/Token"
import { formatRounded } from "../../util/formatRounded"
import { formatUnits } from "@ethersproject/units"
import { formatNumberLength } from "../../util/formatNumberLength"

interface AssetAmountComponentProps {
    asset: Token
    amount?: BigNumber
}

const AssetAmountDisplay: FC<AssetAmountComponentProps> = ({
    asset,
    amount,
}) => {
    const amountString = formatRounded(
        formatUnits(amount || 0, asset.decimals),
        11
    )

    return (
        <div className="flex flex-row items-center w-full text-body-700">
            {/* <span className="flex items-center justify-center !w-6 !h-6 rounded-full">
                <img
                    src={asset.logo || unknownTokenIcon}
                    alt={asset.name}
                    className="rounded-full"
                />
            </span> */}
            {(
                <div
                    className="text-xs truncate"
                    title={amountString}
                >
                    {formatNumberLength(amountString, 12)}
                </div>
            )}
            <span
                className="text-xs truncate ml-2"
                title={asset.symbol}
            >
                {asset.symbol}
            </span>

        </div>
    )
}

export default AssetAmountDisplay
