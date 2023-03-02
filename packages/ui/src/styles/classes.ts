import _classnames from "classnames"

export const classnames = _classnames

const primaryButton =
"text-body-balances-200 bg-body-balances-100 hover:bg-body-balances-300 border-body-balances-300"

export class Classes {
    static centered = classnames("flex flex-row items-center justify-center")
    static start = classnames("flex flex-row items-center justify-start ")
    static animated = classnames("transition-all duration-300")
    static transform = classnames("transform active:scale-95")

    static iconButton = classnames(
        Classes.start,
        Classes.animated,
        Classes.transform,
        "h-12 space-x-2 p-4 rounded-md text-sm font-bold text-component-btn-200 cursor-pointer disabled:pointer-events-none"
    )

    static baseButton = classnames(
        Classes.centered,
        Classes.animated,
        Classes.transform,
        "flex-1 h-12 px-6 py-3 font-normal font-title text-sm shadow-sm rounded-md",
        // "border-2",
        "cursor-pointer disabled:pointer-events-none"
    )
    static button = classnames(
        Classes.centered,
        Classes.baseButton,
        primaryButton
    )

    static smallButton = classnames(
        Classes.centered,
        primaryButton,
        "text-xs shadow-sm rounded-md p-1 border-2 cursor-pointer disabled:pointer-events-none"
    )

    static menuButton = classnames(
        Classes.iconButton,
        "bg-primary-100 hover:bg-primary-200"
    )

    static buttonIcon = classnames("w-5 h-5 mr-3")

    static actionButton = classnames(
        Classes.iconButton,
        "bg-component-btn-200 bg-opacity-[8%] hover:bg-opacity-[20%]"
    )

    static logoutButton = classnames(
        Classes.iconButton,
        "text-red-500 bg-red-100 border border-opacity-0 hover:border-red-600 hover:border-opacity-100"
    )
    static disabledLogoutButton = classnames(
        Classes.iconButton,
        "text-red-300 bg-red-50 border border-opacity-0 hover:border-red-400 hover:border-opacity-50"
    )

    static redButton = classnames(
        Classes.centered,
        Classes.baseButton,
        "text-white bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
    )
    static disabledButton = classnames(
        Classes.centered,
        Classes.baseButton,
        "text-white bg-blue-200 pointer-events-none border-blue-200"
    )
    static darkButton = classnames(
        Classes.centered,
        Classes.baseButton,
        "bg-gray-900 text-white hover:bg-gray-800 border-gray-900 hover:border-gray-800"
    )
    static confrimButton = classnames(
        Classes.baseButton,
        "hover:bg-body-balances-300 disabled:bg-component-btn-300 disabled:text-component-btn-400 bg-component-btn-100 text-component-btn-200 w-full"
    )
    static reminderButton = classnames(
        Classes.baseButton,
        "hover:border-[1px] border-border-200 bg-component-btn-300 text-component-btn-400"
    )
    static disabledDarkButton = classnames(
        Classes.baseButton,
        "bg-gray-700 border-gray-700 text-white pointer-events-none"
    )
    static liteButton = classnames(
        Classes.centered,
        Classes.baseButton,
        "text-gray-900 border-gray-900 hover:text-white hover:bg-gray-900"
    )
    static backButton = classnames(
        Classes.centered,
        Classes.baseButton,
        "text-white border-gray-900 hover:text-white hover:bg-gray-900"
    )
    static inputLabel = classnames("text-xs")
    static inputBordered = classnames(
        "text-sm rounded-md placeholder-gray-400 focus:ring-0"
    )
    static input = classnames(
        "w-full text-xs px-4 rounded-md py-5 text-white border-[1px] border-component-input-border placeholder-component-input-placeholder focus:ring-0"
    )
    static seedInput = classnames(
        "bg-component-btn-600 text-component-btn-700 rounded-2xl py-2 text-xs rounded-md py-5 placeholder-component-input-placeholder focus:ring-0"
    )
    static inputBorder = classnames(
        "w-full text-xs px-2 py-2 mt-1 rounded-md border-1 border-gray-200 placeholder-gray-400 focus:ring-0"
    )

    static checkbox = classnames(
        "w-5 h-5 border-[1px] border-component-input-border rounded-md focus:ring-0 hover:cursor-pointer checked:bg-component-btn-200 checked:text-component-btn-200"
    )
    static checkboxAlt = classnames(
        "w-6 h-6 border-2 border-gray-200 rounded-md focus:ring-0 cursor-pointer"
    )
    static placeholder = classnames("overflow-hidden relative placeholder")

    static blueSection = classnames(
        "p-4 border-opacity-0 border-transparent flex justify-between items-center flex-row w-full rounded-md border cursor-pointer"
    )
    
    static blueSectionSwapPage = classnames(
        "border-opacity-0 border-transparent flex items-center flex-row w-full rounded-md border cursor-pointer"
    )

    static blueSelectionDisabled = classnames(
        "cursor-not-allowed hover:bg-primary-100"
    )

    static blueSectionActive = classnames("bg-gray-900")
    static blueSectionInput = classnames(
        "bg-transparent p-0 mb-1 border-none font-bold"
    )

    static roundedIcon = classnames(
        "flex items-center justify-center w-9 h-9 p-1.5 bg-white border border-gray-200 rounded-full"
    )

    static roundedFilledIcon = classnames(
        "flex items-center justify-center w-9 h-9 p-0 rounded-full"
    )

    static clickableText = classnames(
        "rounded border-none bg-transparent text-body-balances-200 hover:underline"
    )
    static selectBaseStyle = classnames(
        "relative flex flex-row justify-between items-center cursor-pointer select-none"
    )
    static selectStyle = classnames(
        this.selectBaseStyle,
        "text-gray-600 border rounded-md group border-primary-200 hover:border-primary-300 px-3 py-2"
    )
    static selectStyleDisabled = classnames(
        this.selectStyle,
        "opacity-50 cursor-not-allowed"
    )
    static selectInlineStyle = classnames(
        this.selectBaseStyle,
        "px-1 text-sky-600"
    )
}
