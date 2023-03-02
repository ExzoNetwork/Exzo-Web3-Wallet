import { FC, PropsWithChildren } from "react"
import classnames from "classnames"
interface OutlinedButtonProps {
    onClick?: (e: any) => void
    className?: string
}
const OutlinedButton: FC<PropsWithChildren<OutlinedButtonProps>> = ({
    onClick,
    className = "",
    children,
}) => {
    return (
        <button
            className={classnames(
                "flex flex-row items-center  justify-between",
                "h-12 space-x-2 p-4 rounded-md text-sm font-bold text-white w-full bg-component-btn-200 bg-opacity-[8%] hover:bg-opacity-20",
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
export default OutlinedButton
