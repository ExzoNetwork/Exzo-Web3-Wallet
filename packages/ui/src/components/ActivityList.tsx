import TransactionsList from "./transactions/TransactionsList"

// Context
import { useSelectedNetwork } from "../context/hooks/useSelectedNetwork"
import { useSelectedAccount } from "../context/hooks/useSelectedAccount"

// Utils

import useTransactions from "../util/hooks/useTransactions"
import MenuIcon from "./menu/MenuIcon"
import MainFooter from "./MainFooter"
import PageLayout from "./PageLayout"
import MainHeader from "./MainHeader"
import ErrorDialog from "./dialog/ErrorDialog"
import FileIcon from "./icons/FileIcon"
import { Link } from "react-router-dom"
import TransactionArrowIcon from "./icons/TransactionArrowIcon"
import CopyIconDark from "./icons/CopyIconDark"
import ExternalLinkIcon from "./icons/ExternalLinkIcon"
import PopupHeader from "./popup/PopupHeader"
import PopupLayout from "./popup/PopupLayout"

const ActivityList = () => {
    const { chainId } = useSelectedNetwork()
    const { address } = useSelectedAccount()

    const { transactions } = useTransactions()

    return (
        <PopupLayout
            header={
                <PopupHeader title="home" backButton={true}/>
            }
        >
        
            <div className="flex flex-col items-start flex-1 w-full max-h-screen px-6 py-4 space-y-2 overflow-auto hide-scroll">
                <div className="text-white flex justify-between w-full items-center">
                    <span className="text-2xl">Activity</span>
                    {/* <Link
                        to="/#"
                        className="transition duration-300"
                        draggable={false}
                        data-testid="navigate-account-link"
                    >
                        <div className="text-sm flex items-center">
                            <span className="mr-1.5">Export</span>
                            <FileIcon />    
                        </div>
                    </Link> */}
                </div>
                <div
                    className="flex flex-col flex-1 w-full space-y-0"
                    data-testid="activity-list"
                >
                    <TransactionsList
                        transactions={transactions}
                        //When the chainId and/or the address changes, this component is unmounted and mounted again.
                        key={`${chainId}-${address}`}
                    />
                    {/* <div className="mt-8">
                        <div>
                            <div className="py-4 flex justify-between">
                                <div className="flex">
                                    <div className="rounded-md bg-body-balances-100 py-2 px-[10.5px] flex items-center justify-center mr-4">
                                        <TransactionArrowIcon direction="right"/>
                                    </div>
                                    <div className="flex flex-col text-base text-body-activity-100">
                                        <div>
                                            <span>Sent </span>
                                            <span> 1.02 ETH</span>
                                        </div>
                                        <div className="flex text-xs items-center text-body-activity-200">
                                            <div className="flex items-center mr-4">
                                                <span>Au...Ux</span>
                                                <CopyIconDark />
                                            </div>
                                            <span>11:34 PM IST</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center mr-4">
                                    <ExternalLinkIcon />
                                </div>
                            </div>
                            <hr className="border-0.5 border-body-activity-300"/>
                        </div>
                        <div>
                            <div className="py-4 flex justify-between">
                                <div className="flex">
                                    <div className="rounded-md bg-body-balances-100 py-2 px-[10.5px] flex items-center justify-center mr-4">
                                        <TransactionArrowIcon direction="left"/>
                                    </div>
                                    <div className="flex flex-col text-base text-body-activity-100">
                                        <div>
                                            <span>Received </span>
                                            <span> 2 ETH</span>
                                        </div>
                                        <div className="flex text-xs items-center text-body-activity-200">
                                            <div className="flex items-center mr-4">
                                                <span>Au...Ux</span>
                                                <CopyIconDark />
                                            </div>
                                            <span>11:34 PM IST</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center mr-4">
                                    <ExternalLinkIcon />
                                </div>
                            </div>
                            <hr className="border-0.5 border-body-activity-300"/>
                        </div>
                        <div>
                            <div className="py-4 flex justify-between">
                                <div className="flex">
                                    <div className="rounded-md bg-body-balances-100 py-2 px-[10.5px] flex items-center justify-center mr-4">
                                        <TransactionArrowIcon direction="down"/>
                                    </div>
                                    <div className="flex flex-col text-base text-body-activity-100">
                                        <div>
                                            <span>Deposited </span>
                                            <span> 4 ETH</span>
                                        </div>
                                        <div className="flex text-xs items-center text-body-activity-200">
                                            <div className="flex items-center mr-4">
                                                <span>Au...Ux</span>
                                                <CopyIconDark />
                                            </div>
                                            <span>11:34 PM IST</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center mr-4">
                                    <ExternalLinkIcon />
                                </div>
                            </div>
                            <hr className="border-0.5 border-body-activity-300"/>
                        </div>
                    </div> */}
                </div>
            </div>
            </PopupLayout>
    )
}

export default ActivityList
