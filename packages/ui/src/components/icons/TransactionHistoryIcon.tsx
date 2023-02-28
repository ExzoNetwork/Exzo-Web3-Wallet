import { useState } from "react";

const TransactionHistoryIcon = (props: any) => {
    const [isHover, setIsHover] = useState(false); 
    return(
        <div onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 6V10L13.5 13M19.5 10C19.5 14.9706 15.4706 19 10.5 19C5.52944 19 1.5 14.9706 1.5 10C1.5 5.02944 5.52944 1 10.5 1C15.4706 1 19.5 5.02944 19.5 10Z" 
                stroke={`${isHover || props.active ? "#00FFA3" : "#5F5F5F"}`} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
    )
    }

export default TransactionHistoryIcon
