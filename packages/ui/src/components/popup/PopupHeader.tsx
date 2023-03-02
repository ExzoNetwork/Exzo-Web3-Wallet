import { useErrorHandler } from "react-error-boundary"

import classnames from "classnames"
import { FunctionComponent, useEffect, useState } from "react"

import {
    useOnMountHistory,
    useOnMountLastLocation,
} from "../../context/hooks/useOnMount"
import { useSelectedNetwork } from "../../context/hooks/useSelectedNetwork"
import NetworkDisplayBadge from "../chain/NetworkDisplayBadge"

//context
import { useBlankState } from "../../context/background/backgroundHooks"
import { lockApp } from "../../context/commActions"
import { session } from "../../context/setup"

//style
import { Classes } from "../../styles/classes"

//icon
import logoutIcon from "../../assets/images/icons/logout.svg"
import AppIcon from "../icons/AppIcon"
import CloseIcon from "../icons/CloseIcon"
import ArrowIcon from "../icons/ArrowIcon"
import Dropdown from "../ui/Dropdown/Dropdown"
import { DropdownMenuItem } from "../ui/Dropdown/DropdownMenu"
import { Link, useHistory } from "react-router-dom"
import VectorIcon from "../icons/VectorIcon"
import Tooltip from "../label/Tooltip"
import AccountIcon from "../icons/AccountIcon"
import { getAccountColor } from "../../util/getAccountColor"
import { useSelectedAddressWithChainIdChecksum } from "../../util/hooks/useSelectedAddressWithChainIdChecksum"
import { useSelectedAccount } from "../../context/hooks/useSelectedAccount"
import { formatHash, formatName } from "../../util/formatAccount"
import CopyIcon from "../icons/CopyIcon"
import CopyTooltip from "../label/СopyToClipboardTooltip"
import NetworkSelect from "../input/NetworkSelect"
import { HiOutlineExclamationCircle } from "react-icons/hi"
import { BiCircle } from "react-icons/bi"
import GenericTooltip from "../label/GenericTooltip"
import { useConnectedSite } from "../../context/hooks/useConnectedSite"


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
                style={{transform:"scale(1.5)"}}
                className={classnames(
                    "relative flex flex-row items-center group cursor-pointer",
                    // dAppConnected === "connected" &&
                    // "bg-green-100 hover:border-green-300",
                    // dAppConnected === "connected-warning" &&
                    // "bg-yellow-100 hover:border-yellow-300",
                    // dAppConnected === "not-connected" && "pointer-events-none"
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
                    <BiCircle className="mr-1 w-2 text-white" />
                )}

                {/* <span
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
                </span> */}
            </div>
        </GenericTooltip>
    )
}


export interface PopupHeaderProps {
    title: string
    backButton?: boolean
    keepState?: boolean // if true, keeps the previous state while going back using the back button
    networkIndicator?: boolean
    close?: string | boolean
    icon?: string | null
    disabled?: boolean // used to disable back or close buttons
    onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onBack?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void // in case we want to replace default back behavior
    actions?: React.ReactNode[]
    children?: React.ReactNode | undefined
    className?: string
    goBackState?: object
    lockStatus?: boolean
    networkSelect?: React.ReactNode
    isReminder?: boolean
    isReminderConfirm?: boolean
}

const PopupHeader: FunctionComponent<PopupHeaderProps> = ({
    title,
    backButton = true,
    keepState = false,
    networkIndicator = false,
    close = "/home",
    icon,
    children,
    disabled = false,
    onClose,
    onBack,
    actions,
    className,
    goBackState,
    lockStatus = false,
    networkSelect,
    isReminder = false,
    isReminderConfirm = false,
}) => {
    const history = useOnMountHistory()
    const lastLocation = useOnMountLastLocation()
    const network = useSelectedNetwork()

    const [fromAction, setFromAction] = useState(false)

    const [mounted, setMounted] = useState(false)
    const checksumAddress = useSelectedAddressWithChainIdChecksum()
    
    const { isSeedPhraseBackedUp, isImportingDeposits } = useBlankState()!
    const handleError = useErrorHandler()

    useEffect(() => {
        setFromAction(history.location.state?.fromAction)
        setMounted(true)

        return () => setMounted(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const logout = () => {
        try {
            if (!isImportingDeposits) {
                lockApp()
            }
        } catch {
            handleError("Error logging out")
        }
    }

    return (
        <div
            className={classnames(
                "flex flex-row w-full items-center px-5 py-3 bg-header-100 max-w-full popup-layout",
                className
            )}
            style={{ backdropFilter: "blur(4px)", minHeight: "61px" }}
        >
            {isReminder && <div><span title="Backup Seed" className="text-base font-bold ml-1.5 text-white">Backup Seed</span></div>}
            {backButton && !isReminder && (
                <div className="flex items-center justify-between w-full">
                    <div>
                        <button
                            type="button"
                            onClick={(e) => {
                                if (onBack) return onBack(e)

                                //means there is no stack at all and we don't were to go
                                //as the history hasn't been restored.
                                //Also, we don't have the lastLocation as the extension may have been closed
                                //and restored using the localStorage (useLocationRecovery).
                                //Therefore, we return to home.
                                if (history.length <= 1) {
                                    return history.replace("/")
                                }

                                if (keepState || goBackState) {
                                    let newState = {}
                                    if (keepState) {
                                        newState = lastLocation?.state
                                            ? (lastLocation?.state as any & {
                                                keepState: true
                                            })
                                            : {}
                                    }
                                    if (goBackState) {
                                        newState = {
                                            ...newState,
                                            ...goBackState,
                                        }
                                    }
                                    return history.replace({
                                        pathname: lastLocation?.pathname,
                                        state: newState,
                                    })
                                }
                                fromAction ? history.go(-3) : history.goBack()
                            }}
                            disabled={disabled || !mounted}
                            className={classnames(
                                "p-2 -ml-2 mr-1 cursor-pointer transition duration-300 rounded-lg hover:bg-body-assets-200 text-white hover:text-black",
                                disabled && "pointer-events-none text-gray-300"
                            )}
                        >
                            <div className="flex items-center">
                                <ArrowIcon direction={"left"}/>
                                <span
                                        title={title}
                                        className={classnames("text-base font-bold ml-1.5", 
                                        // icon && "w-56"
                                        )}
                                    >
                                        {/* {title} */}
                                        Back
                                </span>

                            </div>
                        </button>
                    </div>
                    {
                        title === "Settings" &&
                            <div>
                                <button
                                        type="button"
                                        onClick={logout}
                                        className={classnames(
                                            !isImportingDeposits
                                                ? Classes.logoutButton
                                                : Classes.disabledLogoutButton,
                                            "h-2.5 p-4"
                                        )}
                                        disabled={isImportingDeposits}
                                    >
                                        <img
                                            alt="Logout"
                                            src={logoutIcon}
                                            className={classnames(
                                                Classes.buttonIcon, "mr-0",
                                                isImportingDeposits && "opacity-30"
                                            )}
                                        />
                                        {/* Logout */}
                                </button>
                            </div>
                    }
                </div>
                
            )}
            {
                lockStatus && 
                    <span
                            title={title}
                            className={classnames("text-base font-bold ml-1.5 text-white",
                            //  icon && "w-56"
                             )}
                        >
                            {title}
                    </span>
            }
            {icon && (
                <div className="pr-3">
                    <AppIcon iconURL={icon} size={10} />
                </div>
            )}
            {
                backButton && (
                    <>
                        <div className="ml-auto flex space-x-1 mr-2.5">
                            {actions && (
                                <Dropdown>
                                    <Dropdown.Menu id="popup-actions">
                                        {actions.map((action, idx) => {
                                            return (
                                                <DropdownMenuItem key={idx}>
                                                    {action}
                                                </DropdownMenuItem>
                                            )
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                            {/* {networkIndicator && (
                                <NetworkDisplayBadge truncate network={network} />
                            )} */}
                            {close && isReminder && (
                                <button
                                    onClick={(e) => {
                                        if (onClose) return onClose(e)
                                        history.push(
                                            typeof close === "string" ? close : "/home"
                                        )
                                    }}
                                    disabled={disabled}
                                    className={classnames(
                                        "p-2 -mr-2 transition duration-300 rounded-full hover:bg-primary-100 hover:text-primary-300",
                                        disabled && "pointer-events-none text-gray-300"
                                    )}
                                    type="button"
                                >
                                    <CloseIcon />
                                </button>
                            )}
                        </div>
                    </>)
            }
            {
                backButton && title !== "Settings"  && !isReminder && !isReminderConfirm && (
                    <div>
                        {children}
                        <NetworkSelect dappConnection={<DAppConnection />}/>
                    </div>
                    )
            }        
            {
                !backButton && !lockStatus && !isReminder && (
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row items-center space-x-3">
                            <div className="relative flex flex-col items-start group">
                                <Link
                                    to="/accounts"
                                    className="transition duration-300"
                                    draggable={false}
                                    data-testid="navigate-account-link"
                                >
                                    <AccountIcon
                                        className="transition-transform duration-200 ease-in transform hover:rotate-180"
                                        fill={getAccountColor(checksumAddress)}
                                    />
                                </Link>
                                {/* <Tooltip
                                    className="pointer-events-none absolute bottom-0 -mb-2 transform !translate-x-0 !translate-y-full p-2 rounded-md text-xs font-bold bg-gray-900 text-white"
                                    content={
                                        <>
                                            <div className="border-t-4 border-r-4 border-gray-900 absolute top-0 left-2 w-2 h-2 -mt-2.5 transform -rotate-45 -translate-x-1/2" />
                                            <span>My Accounts</span>
                                        </>
                                    }
                                /> */}
                            </div>
                            <div className="flex flex-row items-center space-x-1">
                                <AccountDisplay />
                                {/* <Link
                                    to="/accounts/menu/receive"
                                    draggable={false}
                                    onClick={(e) => {
                                        e.preventDefault()
            
                                        history.push("/accounts/menu/receive")
                                    }}
                                    className="p-2 transition duration-300 rounded-full hover:bg-primary-100 hover:text-primary-300"
                                >
                                    <QRIcon />
                                </Link> */}
                            </div>
                        </div>
                        {/** change network */}
                        {/* {networkSelect} */}
                        {
                            title !== "Settings" && <NetworkSelect dappConnection={<DAppConnection />}/>
                        }
                    </div>
                )
            }
        </div>
    )
}

export default PopupHeader
