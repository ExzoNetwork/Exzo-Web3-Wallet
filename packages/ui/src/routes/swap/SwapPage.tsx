// import ErrorMessage from "../../components/error/ErrorMessage"
// import PopupFooter from "../../components/popup/PopupFooter"
// import PopupHeader from "../../components/popup/PopupHeader"
// import PopupLayout from "../../components/popup/PopupLayout"
// import RateUpdateDialog from "../../components/swaps/RateUpdateDialog"
// import { useState, useEffect, useMemo } from "react"
// import swapIcon from "../../assets/images/icons/swap.svg"
// import {
//     checkExchangeAllowance,
//     getExchangeQuote,
// } from "../../context/commActions"
// import {
//     AssetListType,
//     AssetSelection,
// } from "../../components/assets/AssetSelection"
// import { BigNumber } from "@ethersproject/bignumber"
// import { ButtonWithLoading } from "../../components/button/ButtonWithLoading"
// import { BASE_SWAP_FEE, SWAP_QUOTE_REFRESH_TIMEOUT } from "../../util/constants"
// import { ExchangeType } from "../../context/commTypes"
// import { InferType } from "yup"
// import { SwapConfirmPageLocalState } from "./SwapConfirmPage"
// import { SwapQuote } from "@exzo-wallet/background/controllers/SwapController"
// import { Token } from "@exzo-wallet/background/controllers/erc-20/Token"
// import { classnames, Classes } from "../../styles"
// import { formatCurrency, toCurrencyAmount } from "../../util/formatCurrency"
// import { formatUnits, parseUnits } from "@ethersproject/units"
// import { useBlankState } from "../../context/background/backgroundHooks"
// import { useForm } from "react-hook-form"
// import { useOnMountHistory } from "../../context/hooks/useOnMount"
// import { useTokensList } from "../../context/hooks/useTokensList"
// import { yupResolver } from "@hookform/resolvers/yup"
// import useCountdown from "../../util/hooks/useCountdown"
// import GenericTooltip from "../../components/label/GenericTooltip"
// import { AiFillInfoCircle } from "react-icons/ai"
// import { formatNumberLength } from "../../util/formatNumberLength"
// import RefreshLabel from "../../components/swaps/RefreshLabel"
// import { capitalize } from "../../util/capitalize"
// import useLocalStorageState from "../../util/hooks/useLocalStorageState"
// import { useCallback } from "react"
// import { useTokenBalance } from "../../context/hooks/useTokenBalance"
// import { GetAmountYupSchema } from "../../util/yup/GetAmountSchema"
// import { ApproveOperation } from "../transaction/ApprovePage"
// import SwapIcon from "../../components/icons/SwapIcon"
// import SwapIconHover from "../../components/icons/SwapIconHover"

// interface SwapPageLocalState {
//     fromToken?: Token
//     swapQuote?: SwapQuote
//     toToken?: Token
//     fromAssetPage?: boolean
//     amount?: string
// }

// interface SwapState {
//     tokenFrom?: Token
//     tokenTo?: Token
//     bigNumberAmount?: BigNumber
// }

// const SwapPage = () => {
//     const history = useOnMountHistory()
//     const {
//         fromToken,
//         swapQuote,
//         toToken,
//         amount: defaultAmount,
//         fromAssetPage,
//     } = (history.location.state || {}) as SwapPageLocalState
//     const [timeoutStart, setTimeoutStart] = useState<number | undefined>(
//         undefined
//     )
//     const { value: remainingSeconds } = useCountdown(
//         timeoutStart,
//         SWAP_QUOTE_REFRESH_TIMEOUT
//     )

//     const { selectedAddress, nativeCurrency, localeInfo, exchangeRates } =
//         useBlankState()!

//     const { nativeToken } = useTokensList()

//     // State
//     const [error, setError] = useState<string | undefined>(undefined)
//     const [inputFocus, setInputFocus] = useState(false)
//     const [isLoading, setIsLoading] = useState<boolean>(false)
//     const [hasAllowance, setHasAllowance] = useState<boolean>(true)
//     const [quote, setQuote] = useState<SwapQuote | undefined>(swapQuote)
//     const [canSwitchInputs, setCanSwitchInputs] = useState<boolean>(true)

//     const [swapDataState, setSwapDataState] = useLocalStorageState<SwapState>(
//         "swaps.form",
//         {
//             initialValue: {
//                 tokenFrom: fromToken ? fromToken : nativeToken.token,
//                 tokenTo: toToken,
//                 bigNumberAmount: undefined,
//             },
//             deserializer: useCallback((rawData: any) => {
//                 return {
//                     ...rawData,
//                     bigNumberAmount: rawData.bigNumberAmount
//                         ? BigNumber.from(rawData.bigNumberAmount)
//                         : undefined,
//                 }
//             }, []),
//         }
//     )

//     const tokenFromBalance = useTokenBalance(swapDataState.tokenFrom)

//     const { tokenFrom, tokenTo, bigNumberAmount } = swapDataState

//     // Validation
//     const schema = GetAmountYupSchema(tokenFrom, tokenFromBalance)
//     const {
//         register,
//         setValue,
//         trigger: triggerAmountValidation,
//         watch,
//         clearErrors,
//         formState: { errors },
//     } = useForm<InferType<typeof schema>>({
//         resolver: yupResolver(schema),
//         defaultValues: {
//             amount:
//                 defaultAmount ||
//                 (swapDataState?.bigNumberAmount
//                     ? formatUnits(
//                           swapDataState?.bigNumberAmount?.toString(),
//                           swapDataState?.tokenFrom?.decimals
//                       )
//                     : undefined),
//         },
//     })

//     const watchedAmount = watch("amount")

//     const formattedAmount =
//         tokenFrom && bigNumberAmount
//             ? formatCurrency(
//                   toCurrencyAmount(
//                       bigNumberAmount,
//                       exchangeRates[tokenFrom.symbol.toUpperCase()],
//                       tokenFrom.decimals
//                   ),
//                   {
//                       currency: nativeCurrency,
//                       locale_info: localeInfo,
//                       returnNonBreakingSpace: false,
//                       showSymbol: true,
//                   }
//               )
//             : undefined
//     const isUsingNetworkNativeCurrency =
//         tokenFrom?.address === nativeToken.token.address
//     const maxAmount = tokenFromBalance
//     const isMaxAmountEnabled =
//         maxAmount && !(bigNumberAmount && maxAmount.eq(bigNumberAmount))

//     //executes when the amount hex changes
//     useEffect(() => {
//         async function handleChangeAmount() {
//             if (tokenFrom && Number(watchedAmount)) {
//                 if (await triggerAmountValidation()) {
//                     setSwapDataState((prev: SwapState) => ({
//                         ...prev,
//                         bigNumberAmount: parseUnits(
//                             watchedAmount,
//                             tokenFrom?.decimals
//                         ),
//                     }))
//                 }
//             } else {
//                 setSwapDataState((prev: SwapState) => ({
//                     ...prev,
//                     bigNumberAmount: undefined,
//                 }))
//             }
//         }
//         handleChangeAmount()
//     }, [watchedAmount, tokenFrom, triggerAmountValidation, setSwapDataState])

//     const onSubmit = () => {
//         if (!quote || !tokenFrom || !bigNumberAmount) {
//             return
//         }

//         if (hasAllowance) {
//             history.push({
//                 pathname: "/swap/confirm",
//                 state: {
//                     fromToken: tokenFrom,
//                     fromTokenBalance: tokenFromBalance,
//                     swapQuote: quote,
//                     toToken: tokenTo,
//                     amount: watchedAmount,
//                 } as SwapConfirmPageLocalState,
//             })
//         } else {
//             history.push({
//                 pathname: "/transaction/approve",
//                 state: {
//                     assetAddress: tokenFrom.address,
//                     minAllowance: bigNumberAmount,
//                     approveOperation: ApproveOperation.SWAP,
//                     nextLocationState: {
//                         fromToken: tokenFrom,
//                         fromTokenBalance: tokenFromBalance,
//                         swapQuote: quote,
//                         toToken: tokenTo,
//                         amount: watchedAmount,
//                     } as SwapConfirmPageLocalState,
//                 },
//             })
//         }
//     }

//     const onUpdateAmount = (value: string) => {
//         //clear the quote first
//         setQuote(undefined)
//         const parsedAmount = value
//             .replace(/[^0-9.,]/g, "")
//             .replace(",", ".")
//             .replace(/(\..*?)\..*/g, "$1")
//         setValue("amount", parsedAmount)
//     }

//     const switchInputs = () => {
//         setQuote(undefined)
//         setError(undefined)
//         clearErrors()
//         let nextSwapState: SwapState = {
//             ...swapDataState,
//             //Update tokenTo data
//             tokenTo: tokenFrom || undefined,
//             //Update token from data
//             tokenFrom: tokenTo || undefined,
//             bigNumberAmount: undefined,
//         }

//         if (tokenFrom) {
//             if (quote && tokenTo) {
//                 const toTokenAmountBN = formatUnits(
//                     quote.toTokenAmount,
//                     tokenTo.decimals
//                 )
//                 setValue("amount", toTokenAmountBN.toString())
//             } else {
//                 setValue("amount", "0")
//             }
//         }
//         setSwapDataState((prev: SwapState) => ({
//             ...prev,
//             ...nextSwapState,
//         }))
//     }

//     useEffect(() => {
//         let intervalTimeoutRef: NodeJS.Timeout | null = null
//         let isValidFetch = true
//         setError(undefined)
//         async function fetchQuote() {
//             setHasAllowance(true)
//             setIsLoading(true)
//             setCanSwitchInputs(false)
//             if (
//                 tokenFrom!.address.toLowerCase() !==
//                 nativeToken.token.address.toLowerCase()
//             ) {
//                 try {
//                     const allowanceCheck = await checkExchangeAllowance(
//                         selectedAddress,
//                         bigNumberAmount!,
//                         ExchangeType.SWAP_1INCH,
//                         tokenFrom!.address
//                     )

//                     setHasAllowance(allowanceCheck)
//                 } catch (error) {
//                     setError("Error checking allowance")
//                 }
//             }

//             try {
//                 const quote = await getExchangeQuote(ExchangeType.SWAP_1INCH, {
//                     fromTokenAddress: tokenFrom!.address,
//                     toTokenAddress: tokenTo!.address,
//                     amount: bigNumberAmount!.toString(),
//                 })
//                 if (isValidFetch) {
//                     setQuote(quote)
//                 }
//             } catch (error) {
//                 setError(capitalize(error.message || "Error fetching quote."))
//             } finally {
//                 setCanSwitchInputs(true)
//                 setIsLoading(false)
//                 if (isValidFetch) {
//                     setTimeoutStart(new Date().getTime())
//                 }
//             }
//         }

//         function validateBeforeFetch() {
//             if (
//                 !tokenFrom ||
//                 !tokenTo ||
//                 !bigNumberAmount ||
//                 bigNumberAmount.lte(BigNumber.from(0)) ||
//                 errors.amount
//             ) {
//                 return false
//             }
//             if (
//                 tokenFrom.address.toLowerCase() ===
//                 tokenTo.address.toLowerCase()
//             ) {
//                 setError("Can't swap the same asset")
//                 return false
//             }

//             return true
//         }

//         const isReadyToFetch = validateBeforeFetch()
//         if (isReadyToFetch) {
//             fetchQuote()
//             intervalTimeoutRef = setInterval(
//                 fetchQuote,
//                 SWAP_QUOTE_REFRESH_TIMEOUT
//             )
//         } else {
//             setTimeoutStart(undefined)
//         }

//         return () => {
//             isValidFetch = false
//             intervalTimeoutRef && clearInterval(intervalTimeoutRef)
//         }
//     }, [
//         bigNumberAmount,
//         errors.amount,
//         nativeToken.token.address,
//         selectedAddress,
//         tokenFrom,
//         tokenTo,
//     ])

//     const remainingSuffix = Math.ceil(remainingSeconds!)
//         ? `${Math.floor(remainingSeconds!)}s`
//         : null

//     const rate = useMemo(() => {
//         return quote?.toTokenAmount
//             ? BigNumber.from(quote?.toTokenAmount)
//             : undefined
//     }, [quote?.toTokenAmount])

//     const swapFee = quote
//         ? `${formatNumberLength(
//               formatUnits(
//                   BigNumber.from(quote.fromTokenAmount)
//                       .mul(BASE_SWAP_FEE * 10)
//                       .div(1000),
//                   quote.fromToken.decimals
//               ),
//               8
//           )} ${quote.fromToken.symbol}`
//         : undefined

//     return (
//         <>
//             <div className="absolute top-0 left-0 w-full popup-layout z-10">
//                 <PopupHeader title="home" backButton={false}/>
//             </div>
//             <div className="p-6 pt-24">
//                 <div className="text-white text-2xl mb-8">Swap Assets</div>
//                 {rate && tokenTo && quote ? (
//                     <RateUpdateDialog
//                         key={`${tokenTo.address}-${tokenFrom?.address}-${bigNumberAmount?._hex}`}
//                         assetName={tokenTo.symbol}
//                         assetDecimals={tokenTo.decimals}
//                         rate={rate}
//                     />
//                 ) : null}
//                 <div>
//                     <div
//                         className={classnames(
//                             "flex flex-row",
//                             // Error message height
//                             !errors.amount?.message && "mb-[22px]"
//                         )}
//                     >
//                         {/* Asset */}
//                         <div className="flex flex-col space w-full pr-1.5">
//                             {/* <p className="mb-2 text-sm text-gray-600">Swap From</p> */}
//                             <AssetSelection
//                                 selectedAssetList={AssetListType.DEFAULT}
//                                 selectedAsset={
//                                     tokenFrom && tokenFromBalance
//                                         ? {
//                                             token: tokenFrom,
//                                             balance: tokenFromBalance,
//                                         }
//                                         : undefined
//                                 }
//                                 onAssetChange={(asset) => {
//                                     //Before assigning 'from' we check if it is not the same as 'to'. If that is the case we swap the inputs
//                                     if (asset.token.address === tokenTo?.address) {
//                                         switchInputs()
//                                     } else {
//                                         setQuote(undefined)
//                                         setSwapDataState((prev: SwapState) => ({
//                                             ...prev,
//                                             tokenFrom: asset.token,
//                                         }))
//                                     }
//                                 }}
//                                 topMargin={100}
//                                 bottomMargin={60}
//                                 dropdownWidth="w-[309px]"
//                                 assetBalanceClassName="w-24"
//                                 addTokenState={{
//                                     redirectTo: "/swap/afterAddToken",
//                                     tokenTarget: "from",
//                                     fromToken: tokenFrom,
//                                     toToken: tokenTo,
//                                 }}
//                             />
//                             <hr />  
//                         </div>
//                     </div>

//                     {/* Switch Inputs */}
//                     {/* <div className="pt-6">
//                         <hr/>
//                         <button
//                             type="button"
//                             className="flex -translate-y-2/4 justify-center items-center mx-auto rounded-full w-8 h-8 border border-grey-200 bg-white z-10 cursor-pointer"
//                             onClick={switchInputs}
//                             disabled={!canSwitchInputs}
//                         >
//                             <img
//                                 src={swapIcon}
//                                 className="h-4 w-auto mx-auto"
//                                 alt="swap"
//                             />
//                         </button>
//                     </div> */}
//                     <div className="flex flex-col space w-full pr-1.5">
//                         {/* <p className="text-sm text-gray-600 pb-3">Swap To</p> */}
//                         <AssetSelection
//                             displayIcon
//                             selectedAssetList={AssetListType.ALL}
//                             selectedAsset={
//                                 tokenTo
//                                     ? {
//                                         token: tokenTo,
//                                         balance: BigNumber.from(0),
//                                     }
//                                     : undefined
//                             }
//                             onAssetChange={(asset) => {
//                                 //Before assigning 'to' we check if it is not the same as 'from'. If that is the case we swap the inputs
//                                 if (asset.token.address === tokenFrom?.address) {
//                                     switchInputs()
//                                 } else {
//                                     setQuote(undefined)
//                                     setSwapDataState((prev: SwapState) => ({
//                                         ...prev,
//                                         tokenTo: asset.token,
//                                     }))
//                                 }
//                             }}
//                             customAmount={BigNumber.from(quote?.toTokenAmount || 0)}
//                             topMargin={50}
//                             bottomMargin={200}
//                             addTokenState={{
//                                 redirectTo: "/swap/afterAddToken",
//                                 tokenTarget: "to",
//                                 fromToken: tokenFrom,
//                                 toToken: tokenTo,
//                             }}
//                         />
//                         <hr />
//                     </div>

//                     {/* Amount */}
//                     <div className="flex flex-col w-2/3 mt-12">
//                         {/** max button */}
//                         {/* <div className="flex flex-row items-center space-x-1 mb-2">
//                             <span
//                                 className={classnames(
//                                     "ml-auto text-sm",
//                                     isUsingNetworkNativeCurrency && "invisible",
//                                     isMaxAmountEnabled
//                                         ? "text-blue-500 hover:text-blue-800 cursor-pointer"
//                                         : "text-gray-600 cursor-default"
//                                 )}
//                                 onClick={() => {
//                                     if (isMaxAmountEnabled) {
//                                         const parsedAmount = formatUnits(
//                                             maxAmount,
//                                             tokenFrom?.decimals
//                                         )
//                                         onUpdateAmount(parsedAmount)
//                                     }
//                                 }}
//                             >
//                                 Max
//                             </span>
//                         </div> */}
//                         <div
//                             className={classnames(
//                                 "flex flex-col items-stretch rounded-md p-4 w-full",
//                                 inputFocus
//                                     ? ""
//                                     : "",
//                                 errors.amount
//                                     ? "border-red-400"
//                                     : "border-opacity-0 border-transparent"
//                             )}
//                         >
//                             <input
//                                 {...register("amount")}
//                                 id="amount"
//                                 name="amount"
//                                 onChange={(e) => {
//                                     onUpdateAmount(e.target.value)
//                                 }}
//                                 maxLength={80}
//                                 className="p-0 text-xl bg-transparent border-none text-white"
//                                 placeholder={`0.0 ${
//                                     tokenFrom ? tokenFrom.symbol : ""
//                                 }`}
//                                 autoComplete="off"
//                                 autoFocus={true}
//                                 onFocus={() => setInputFocus(true)}
//                                 onBlur={() => setInputFocus(false)}
//                             />
//                         </div>
//                         <hr />
//                         <p
//                             className={classnames(
//                                 "text-xs text-gray-600 mt-1",
//                                 !formattedAmount && "hidden"
//                             )}
//                         >
//                             {formattedAmount}
//                         </p>
//                         <div
//                             className={classnames(
//                                 "mt-1",
//                                 !errors.amount?.message && "hidden"
//                             )}
//                         >
//                             <ErrorMessage>{errors.amount?.message}</ErrorMessage>
//                         </div>
//                     </div>

//                     {swapFee && (
//                         <div className="flex items-center pt-2 text-xs text-gray-600 mr-1 mt-2">
//                             <span>{`ExzoWallet fee (${BASE_SWAP_FEE}%): ${swapFee}`}</span>
//                         </div>
//                     )}
//                 </div>
//                 <div className="w-full mt-6">
//                     <button className="text-base p-3 bg-body-balances-100 w-full rounded-lg text-body-balances-200">
//                         <div className="flex items-center justify-center">
//                             <SwapIconHover /> 
//                             <div className="ml-2.5">Swap 0.00 ETH</div>
//                         </div>
//                     </button>
//                 </div>
//                 {remainingSuffix && (
//                     <RefreshLabel value={remainingSuffix} className="ml-6 mt-12" />
//                 )}
//             </div>
//         </>
//     )
// }

// export default SwapPage

import ErrorMessage from "../../components/error/ErrorMessage"
import PopupFooter from "../../components/popup/PopupFooter"
import PopupHeader from "../../components/popup/PopupHeader"
import PopupLayout from "../../components/popup/PopupLayout"
import RateUpdateDialog from "../../components/swaps/RateUpdateDialog"
import { useState, useEffect, useMemo } from "react"
import swapIcon from "../../assets/images/icons/swap.svg"
import {
    checkExchangeAllowance,
    getExchangeQuote,
} from "../../context/commActions"
import {
    AssetListType,
    AssetSelection,
} from "../../components/assets/AssetSelection"
import { BigNumber } from "@ethersproject/bignumber"
import { ButtonWithLoading } from "../../components/button/ButtonWithLoading"
import { BASE_SWAP_FEE, SWAP_QUOTE_REFRESH_TIMEOUT } from "../../util/constants"
import { ExchangeType } from "../../context/commTypes"
import { InferType } from "yup"
import { SwapConfirmPageLocalState } from "./SwapConfirmPage"
import { SwapQuote } from "@exzo-wallet/background/controllers/SwapController"
import { Token } from "@exzo-wallet/background/controllers/erc-20/Token"
import { classnames, Classes } from "../../styles"
import { formatCurrency, toCurrencyAmount } from "../../util/formatCurrency"
import { formatUnits, parseUnits } from "@ethersproject/units"
import { useBlankState } from "../../context/background/backgroundHooks"
import { useForm } from "react-hook-form"
import { useOnMountHistory } from "../../context/hooks/useOnMount"
import { useTokensList } from "../../context/hooks/useTokensList"
import { yupResolver } from "@hookform/resolvers/yup"
import useCountdown from "../../util/hooks/useCountdown"
import GenericTooltip from "../../components/label/GenericTooltip"
import { AiFillInfoCircle } from "react-icons/ai"
import { formatNumberLength } from "../../util/formatNumberLength"
import RefreshLabel from "../../components/swaps/RefreshLabel"
import { capitalize } from "../../util/capitalize"
import useLocalStorageState from "../../util/hooks/useLocalStorageState"
import { useCallback } from "react"
import { useTokenBalance } from "../../context/hooks/useTokenBalance"
import { GetAmountYupSchema } from "../../util/yup/GetAmountSchema"
import { ApproveOperation } from "../transaction/ApprovePage"
import SwapIconHover from "../../components/icons/SwapIconHover"

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

const SwapPage = () => {
    const history = useOnMountHistory()
    const {
        fromToken,
        swapQuote,
        toToken,
        amount: defaultAmount,
        fromAssetPage,
    } = (history.location.state || {}) as SwapPageLocalState
    const [timeoutStart, setTimeoutStart] = useState<number | undefined>(
        undefined
    )
    const { value: remainingSeconds } = useCountdown(
        timeoutStart,
        SWAP_QUOTE_REFRESH_TIMEOUT
    )

    const { selectedAddress, nativeCurrency, localeInfo, exchangeRates } =
        useBlankState()!

    const { nativeToken } = useTokensList()

    // State
    const [error, setError] = useState<string | undefined>(undefined)
    const [inputFocus, setInputFocus] = useState(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasAllowance, setHasAllowance] = useState<boolean>(true)
    const [quote, setQuote] = useState<SwapQuote | undefined>(swapQuote)
    const [canSwitchInputs, setCanSwitchInputs] = useState<boolean>(true)

    const [swapDataState, setSwapDataState] = useLocalStorageState<SwapState>(
        "swaps.form",
        {
            initialValue: {
                tokenFrom: fromToken ? fromToken : nativeToken.token,
                tokenTo: toToken,
                bigNumberAmount: undefined,
            },
            deserializer: useCallback((rawData: any) => {
                return {
                    ...rawData,
                    bigNumberAmount: rawData.bigNumberAmount
                        ? BigNumber.from(rawData.bigNumberAmount)
                        : undefined,
                }
            }, []),
        }
    )

    const tokenFromBalance = useTokenBalance(swapDataState.tokenFrom)

    const { tokenFrom, tokenTo, bigNumberAmount } = swapDataState

    // Validation
    const schema = GetAmountYupSchema(tokenFrom, tokenFromBalance)
    const {
        register,
        setValue,
        trigger: triggerAmountValidation,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm<InferType<typeof schema>>({
        resolver: yupResolver(schema),
        defaultValues: {
            amount:
                defaultAmount ||
                (swapDataState?.bigNumberAmount
                    ? formatUnits(
                          swapDataState?.bigNumberAmount?.toString(),
                          swapDataState?.tokenFrom?.decimals
                      )
                    : undefined),
        },
    })

    const watchedAmount = watch("amount")

    const formattedAmount =
        tokenFrom && bigNumberAmount
            ? formatCurrency(
                  toCurrencyAmount(
                      bigNumberAmount,
                      exchangeRates[tokenFrom.symbol.toUpperCase()],
                      tokenFrom.decimals
                  ),
                  {
                      currency: nativeCurrency,
                      locale_info: localeInfo,
                      returnNonBreakingSpace: false,
                      showSymbol: true,
                  }
              )
            : undefined
    const isUsingNetworkNativeCurrency =
        tokenFrom?.address === nativeToken.token.address
    const maxAmount = tokenFromBalance
    const isMaxAmountEnabled =
        maxAmount && !(bigNumberAmount && maxAmount.eq(bigNumberAmount))

    //executes when the amount hex changes
    useEffect(() => {
        async function handleChangeAmount() {
            if (tokenFrom && Number(watchedAmount)) {
                if (await triggerAmountValidation()) {
                    setSwapDataState((prev: SwapState) => ({
                        ...prev,
                        bigNumberAmount: parseUnits(
                            watchedAmount,
                            tokenFrom?.decimals
                        ),
                    }))
                }
            } else {
                setSwapDataState((prev: SwapState) => ({
                    ...prev,
                    bigNumberAmount: undefined,
                }))
            }
        }
        handleChangeAmount()
    }, [watchedAmount, tokenFrom, triggerAmountValidation, setSwapDataState])

    const onSubmit = () => {
        if (!quote || !tokenFrom || !bigNumberAmount) {
            return
        }

        if (hasAllowance) {
            history.push({
                pathname: "/swap/confirm",
                state: {
                    fromToken: tokenFrom,
                    fromTokenBalance: tokenFromBalance,
                    swapQuote: quote,
                    toToken: tokenTo,
                    amount: watchedAmount,
                } as SwapConfirmPageLocalState,
            })
        } else {
            history.push({
                pathname: "/transaction/approve",
                state: {
                    assetAddress: tokenFrom.address,
                    minAllowance: bigNumberAmount,
                    approveOperation: ApproveOperation.SWAP,
                    nextLocationState: {
                        fromToken: tokenFrom,
                        fromTokenBalance: tokenFromBalance,
                        swapQuote: quote,
                        toToken: tokenTo,
                        amount: watchedAmount,
                    } as SwapConfirmPageLocalState,
                },
            })
        }
    }

    const onUpdateAmount = (value: string) => {
        //clear the quote first
        setQuote(undefined)
        const parsedAmount = value
            .replace(/[^0-9.,]/g, "")
            .replace(",", ".")
            .replace(/(\..*?)\..*/g, "$1")
        setValue("amount", parsedAmount)
    }

    const switchInputs = () => {
        setQuote(undefined)
        setError(undefined)
        clearErrors()
        let nextSwapState: SwapState = {
            ...swapDataState,
            //Update tokenTo data
            tokenTo: tokenFrom || undefined,
            //Update token from data
            tokenFrom: tokenTo || undefined,
            bigNumberAmount: undefined,
        }

        if (tokenFrom) {
            if (quote && tokenTo) {
                const toTokenAmountBN = formatUnits(
                    quote.toTokenAmount,
                    tokenTo.decimals
                )
                setValue("amount", toTokenAmountBN.toString())
            } else {
                setValue("amount", "0")
            }
        }
        setSwapDataState((prev: SwapState) => ({
            ...prev,
            ...nextSwapState,
        }))
    }

    useEffect(() => {
        let intervalTimeoutRef: NodeJS.Timeout | null = null
        let isValidFetch = true
        setError(undefined)
        async function fetchQuote() {
            setHasAllowance(true)
            setIsLoading(true)
            setCanSwitchInputs(false)
            if (
                tokenFrom!.address.toLowerCase() !==
                nativeToken.token.address.toLowerCase()
            ) {
                try {
                    const allowanceCheck = await checkExchangeAllowance(
                        selectedAddress,
                        bigNumberAmount!,
                        ExchangeType.SWAP_1INCH,
                        tokenFrom!.address
                    )

                    setHasAllowance(allowanceCheck)
                } catch (error) {
                    setError("Error checking allowance")
                }
            }

            try {
                const quote = await getExchangeQuote(ExchangeType.SWAP_1INCH, {
                    fromTokenAddress: tokenFrom!.address,
                    toTokenAddress: tokenTo!.address,
                    amount: bigNumberAmount!.toString(),
                })
                if (isValidFetch) {
                    setQuote(quote)
                }
            } catch (error) {
                setError(capitalize(error.message || "Error fetching quote."))
            } finally {
                setCanSwitchInputs(true)
                setIsLoading(false)
                if (isValidFetch) {
                    setTimeoutStart(new Date().getTime())
                }
            }
        }

        function validateBeforeFetch() {
            if (
                !tokenFrom ||
                !tokenTo ||
                !bigNumberAmount ||
                bigNumberAmount.lte(BigNumber.from(0)) ||
                errors.amount
            ) {
                return false
            }
            if (
                tokenFrom.address.toLowerCase() ===
                tokenTo.address.toLowerCase()
            ) {
                setError("Can't swap the same asset")
                return false
            }

            return true
        }

        const isReadyToFetch = validateBeforeFetch()
        if (isReadyToFetch) {
            fetchQuote()
            intervalTimeoutRef = setInterval(
                fetchQuote,
                SWAP_QUOTE_REFRESH_TIMEOUT
            )
        } else {
            setTimeoutStart(undefined)
        }

        return () => {
            isValidFetch = false
            intervalTimeoutRef && clearInterval(intervalTimeoutRef)
        }
    }, [
        bigNumberAmount,
        errors.amount,
        nativeToken.token.address,
        selectedAddress,
        tokenFrom,
        tokenTo,
    ])

    const remainingSuffix = Math.ceil(remainingSeconds!)
        ? `${Math.floor(remainingSeconds!)}s`
        : null

    const rate = useMemo(() => {
        return quote?.toTokenAmount
            ? BigNumber.from(quote?.toTokenAmount)
            : undefined
    }, [quote?.toTokenAmount])

    const swapFee = quote
        ? `${formatNumberLength(
              formatUnits(
                  BigNumber.from(quote.fromTokenAmount)
                      .mul(BASE_SWAP_FEE * 10)
                      .div(1000),
                  quote.fromToken.decimals
              ),
              8
          )} ${quote.fromToken.symbol}`
        : undefined

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
                                  pathname: "/asset/details",
                                  state: {
                                      address: fromToken?.address,
                                  },
                              })
                            : history.push("/home")
                    }
                />
            }
            // footer={
            //     <PopupFooter>
            //         <ButtonWithLoading
            //             label={hasAllowance ? "Review" : "Approve"}
            //             disabled={!!(error || !quote)}
            //             isLoading={isLoading}
            //             onClick={onSubmit}
            //         />
            //     </PopupFooter>
            // }
        >
            {rate && tokenTo && quote ? (
                <RateUpdateDialog
                    key={`${tokenTo.address}-${tokenFrom?.address}-${bigNumberAmount?._hex}`}
                    assetName={tokenTo.symbol}
                    assetDecimals={tokenTo.decimals}
                    rate={rate}
                />
            ) : null}
            <div className="text-white text-2xl p-6 pb-0">Swap Assets</div>
            <div className="px-6 py-4">
                <div  className="bg-body-800 px-3 py-[9px] rounded-[10px] h-[112px]">
                    <div
                        className={classnames(
                            "flex flex-row justify-between ",
                            // Error message height
                            !errors.amount?.message && ""
                        )}
                    >
                        {/* Asset */}
                        <div className="pr-1.5 w-3/4">
                            <div className="flex flex-col space">
                                <p className="mb-2 text-xxs text-body-900">You pay</p>
                                <AssetSelection
                                    selectedAssetList={AssetListType.DEFAULT}
                                    selectedAsset={
                                        tokenFrom && tokenFromBalance
                                            ? {
                                                token: tokenFrom,
                                                balance: tokenFromBalance,
                                            }
                                            : undefined
                                    }
                                    onAssetChange={(asset) => {
                                        //Before assigning 'from' we check if it is not the same as 'to'. If that is the case we swap the inputs
                                        if (asset.token.address === tokenTo?.address) {
                                            switchInputs()
                                        } else {
                                            setQuote(undefined)
                                            setSwapDataState((prev: SwapState) => ({
                                                ...prev,
                                                tokenFrom: asset.token,
                                            }))
                                        }
                                    }}
                                    topMargin={100}
                                    bottomMargin={60}
                                    dropdownWidth="w-[309px]"
                                    assetBalanceClassName="w-24"
                                    addTokenState={{
                                        redirectTo: "/swap/afterAddToken",
                                        tokenTarget: "from",
                                        fromToken: tokenFrom,
                                        toToken: tokenTo,
                                    }}
                                    displayIcon={true}
                                    swapPage={true}
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="flex flex-col w-1/4 pl-1.5">
                            <div className="flex flex-row items-center space-x-1 mb-2">
                                <span
                                    className={classnames(
                                        "ml-auto text-sm px-1 rounded-sm bg-body-balances-100",
                                        isUsingNetworkNativeCurrency && "invisible",
                                        isMaxAmountEnabled
                                            ? "text-body-balances-200 hover:text-body-balances-300 cursor-pointer"
                                            : "text-gray-600 cursor-default"
                                    )}
                                    onClick={() => {
                                        if (isMaxAmountEnabled) {
                                            const parsedAmount = formatUnits(
                                                maxAmount,
                                                tokenFrom?.decimals
                                            )
                                            onUpdateAmount(parsedAmount)
                                        }
                                    }}
                                >
                                    Max
                                </span>
                            </div>
                            <div
                                className={classnames(
                                    "flex flex-col items-stretch rounded-md w-full",
                                    // inputFocus
                                    //     ? "bg-primary-200"
                                    //     : "bg-primary-100",
                                    errors.amount
                                        ? "border-red-400"
                                        : "border-opacity-0 border-transparent"
                                )}
                            >
                                <input
                                    {...register("amount")}
                                    id="amount"
                                    name="amount"
                                    onChange={(e) => {
                                        onUpdateAmount(e.target.value)
                                    }}
                                    maxLength={80}
                                    className="p-0 text-3xl bg-transparent border-none font-normal text-body-900 -mt-0.5"
                                    placeholder={`0.00 ${
                                        tokenFrom ? tokenFrom.symbol : ""
                                    }`}
                                    autoComplete="off"
                                    autoFocus={true}
                                    onFocus={() => setInputFocus(true)}
                                    onBlur={() => setInputFocus(false)}
                                />
                                <p
                                    className={classnames(
                                        "text-xs text-gray-600 mt-1",
                                        !formattedAmount && "hidden"
                                    )}
                                >
                                    {formattedAmount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={classnames(
                            "mt-1",
                            !errors.amount?.message && "hidden"
                        )}
                    >
                        <ErrorMessage>{errors.amount?.message}</ErrorMessage>
                    </div>
                </div>

                {/* Switch Inputs */}
                <div className="">
                    {/* <hr className="-mx-5" /> */}
                    <button
                        type="button"
                        className="flex -translate-y-2/4 justify-center items-center mx-auto rounded-full w-8 h-8 bg-body-100 z-10 cursor-pointer"
                        onClick={switchInputs}
                        disabled={!canSwitchInputs}
                    >
                        <img
                            src={swapIcon}
                            className="h-4 w-auto mx-auto"
                            alt="swap"
                        />
                    </button>
                </div>
                {/** To */}
                <div className="bg-body-800 px-3 py-[9px] rounded-[10px] -mt-6 h-[112px] flex">
                    <div className="pr-1.5 w-3/4">
                        <p className="mb-2 text-xxs text-body-900">You receive</p>
                        <AssetSelection
                            selectedAssetList={AssetListType.DEFAULT}
                            selectedAsset={
                                tokenTo
                                    ? {
                                        token: tokenTo,
                                        balance: BigNumber.from(0),
                                    }
                                    : undefined
                            }
                            onAssetChange={(asset) => {
                                //Before assigning 'to' we check if it is not the same as 'from'. If that is the case we swap the inputs
                                if (asset.token.address === tokenFrom?.address) {
                                    switchInputs()
                                } else {
                                    setQuote(undefined)
                                    setSwapDataState((prev: SwapState) => ({
                                        ...prev,
                                        tokenTo: asset.token,
                                    }))
                                }
                            }}
                            // customAmount={BigNumber.from(quote?.toTokenAmount || 0)}
                            topMargin={50}
                            bottomMargin={200}
                            addTokenState={{
                                redirectTo: "/swap/afterAddToken",
                                tokenTarget: "to",
                                fromToken: tokenFrom,
                                toToken: tokenTo,
                            }}
                            displayIcon={true}
                            swapPage={true}
                        />
                    </div>
                    <div className="flex items-center w-1/4 pl-1.5">
                        <div
                            className={classnames(
                                "flex flex-col items-stretch rounded-md w-full",
                                // inputFocus
                                //     ? "bg-primary-200"
                                //     : "bg-primary-100",
                                errors.amount
                                    ? "border-red-400"
                                    : "border-opacity-0 border-transparent"
                            )}
                        >
                            <span className="p-0 text-3xl bg-transparent border-none font-normal text-body-900 -mt-0.5">
                                0.00
                            </span>
                            <p
                                className={classnames(
                                    "text-xs text-gray-600 mt-1",
                                    !formattedAmount && "hidden"
                                )}
                            >
                                {formattedAmount}
                            </p>
                        </div>
                    </div>
                    
                </div>
                {swapFee && (
                    <div className="flex items-center pt-2 text-xs text-gray-600 pt-0.5 mr-1 mt-2">
                        <span>{`ExzoWallet fee (${BASE_SWAP_FEE}%): ${swapFee}`}</span>
                    </div>
                )}
                <div className="flex flex-col justify-end space-y-3">
                    {error && (
                        <div>
                            <ErrorMessage>{error}</ErrorMessage>
                        </div>
                    )}
                    {remainingSuffix && (
                        <div className="flex flex-col justify-end">
                            <RefreshLabel value={remainingSuffix} />
                        </div>
                    )}
                </div>
                <div className="w-full mt-6">
                     <button className="text-base p-3 bg-body-balances-100 w-full rounded-lg text-body-balances-200">
                         <div className="flex items-center justify-center">
                            <SwapIconHover /> 
                            <div className="ml-2.5">Swap 0.00 ETH</div>
                         </div>
                     </button>
                     <div className="text-sm text-body-600 mt-1">Expected Gas Fees: 0.00074 ETH</div>
                 </div>
            </div>
        </PopupLayout>
    )
}

export default SwapPage