import { FunctionComponent } from "react"
import lockIcon from "../../assets/images/icons/lock.svg"
import { classnames } from "../../styles"

const ClickToReveal: FunctionComponent<{
    hiddenText: string
    revealMessage: string
    revealed: boolean
    onClick: () => void
    isReminder: boolean
    isPrivate: boolean
}> = ({ hiddenText, revealMessage, revealed, onClick, isReminder = false, isPrivate = false}) => {
    const phraseArray = hiddenText ? hiddenText.split(" ") : [];
    return (
        <div className="relative px-4 py-12 overflow-hidden rounded-3xl bg-container-reveal bg-opacity-20">
            {/* {!revealed ? (
                <button
                    type="button"
                    onClick={onClick}
                    className="absolute top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full space-y-2 bg-opacity-50 bg-body-balances-100"
                >
                    <img src={lockIcon} alt="lock" className="w-5 h-5" />
                    <span className="font-bold text-white">{revealMessage}</span>
                </button>
            ) : null} */}
            {
                !isPrivate ? 
                <div className="grid grid-cols-3 gap-3">
                    {
                        phraseArray.map((one, index) =>  {
                            return (
                                <div className={classnames("text-component-btn-200 text-left", isReminder ? "text-xs" : "text-base")}>
                                    {index+1}{". "}<span className="text-white">{one}</span>
                                </div>
                            )
                        })
                    }
                </div> : <div className="text-txt-settings">{phraseArray[0].slice(0,36)}...</div>
            }
            
            {/* <span
                className="font-bold break-words allow-select text-body-balances-200"
                style={revealed ? {} : {}}
            >
                {hiddenText}
            </span> */}
        </div>
    )
}

export default ClickToReveal
