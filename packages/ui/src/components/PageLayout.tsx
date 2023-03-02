import { FunctionComponent } from "react"
import { classnames } from "../styles/classes"
import FullCenterContainer from "./FullCenterContainer"
import LogoHeader from "./LogoHeader"
import BackIcon from "../assets/exzo-images/images/back_icon.png"
import { Link } from "react-router-dom"

const PageLayout: FunctionComponent<{
    centered?: boolean
    header?: boolean
    className?: string
    maxWidth?: string
    style?: React.CSSProperties
    sideComponent?: React.ReactNode
    children?: React.ReactNode
    screen?: boolean
    welcomePage?: boolean
    step?: Number
    backClick?: React.ReactNode
    fromImportPage?: boolean
    InitialPageStatus?: boolean
}> = ({
    children,
    centered = false,
    header = false,
    className,
    maxWidth,
    style,
    sideComponent,
    screen = false,
    welcomePage = false,
    step = 0,
    backClick,
    fromImportPage = false,
    InitialPageStatus = false
}) => {
    return (
        <FullCenterContainer centered={centered} screen={screen} InitialPageStatus={InitialPageStatus}>
            {header ? (
                <div className="top-4 left-[300px] z-10 absolute ">
                    <LogoHeader />
                </div>
            ) : null}
            <div className={classnames("flex-1 flex flex-col items-center")}>
                <div
                    className={classnames(
                        "flex-1 flex flex-row w-full justify-center",
                        !screen && "my-4"
                    )}
                >
                    <div
                        className={classnames(
                            "flex-1 flex flex-col items-center shadow-lg bg-container-100 border-[1px] border-border-100 shadow-boxShadow-3xl relative",
                            screen ? "" : "rounded-md backdrop-blur-md py-24",
                            maxWidth || "max-w-2xl",
                            className
                        )}
                        style={style}
                    >
                        {
                            !screen && !welcomePage && 
                            <div className="h-16 bg-header-200 rounded-t-md border-b-[1px] border-border-300 w-full absolute left-0 top-0">
                                <div className="relative flex justify-center items-center">
                                    {
                                        (step == 1 || step == 5) &&
                                            <Link
                                                className="absolute left-4 top-4 px-6 py-2 flex justify-center items-center hover:border-border-300 hover:border-2 rounded-sm"
                                                to={"/setup"}                                    >
                                                <img className="w-6 h-4" src={BackIcon} />
                                            </Link>
                                    }
                                    {
                                        (step == 3 || step == 6) &&
                                        backClick
                                    }
                                    {
                                        step != 5 && fromImportPage == false && step != 6 ?
                                            <div className="flex gap-x-2 mt-6">
                                                <div className={classnames("w-4 h-4 rounded-full", step >= 1 ? "bg-header-step-200" : "bg-header-step-100")} ></div>
                                                <div className={classnames("w-4 h-4 rounded-full", step >= 2 ? "bg-header-step-200" : "bg-header-step-100")}></div>
                                                <div className={classnames("w-4 h-4 rounded-full", step >= 3 ? "bg-header-step-200" : "bg-header-step-100")}></div>
                                                <div className={classnames("w-4 h-4 rounded-full", step >= 4 ? "bg-header-step-200" : "bg-header-step-100")}></div>
                                            </div> :
                                            <div className="flex gap-x-2 mt-6">
                                                <div className={classnames("w-4 h-4 rounded-full", "bg-header-step-200")} ></div>
                                            </div>

                                    }
                                </div>
                            </div>
                        }
                        {children}
                    </div>
                    {sideComponent}
                </div>
            </div>
        </FullCenterContainer>
    )
}

export default PageLayout
