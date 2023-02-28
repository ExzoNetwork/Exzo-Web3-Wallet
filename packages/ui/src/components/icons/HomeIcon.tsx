import { useState } from "react"

const HomeIcon = (props: any) => {
    const [isHover, setIsHover] = useState(false);
    return(
        <div onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 10L3.5 8M3.5 8L10.5 1L17.5 8M3.5 8V18C3.5 18.5523 3.94772 19 4.5 19H7.5M17.5 8L19.5 10M17.5 8V18C17.5 18.5523 17.0523 19 16.5 19H13.5M7.5 19C8.05228 19 8.5 18.5523 8.5 18V14C8.5 13.4477 8.94772 13 9.5 13H11.5C12.0523 13 12.5 13.4477 12.5 14V18C12.5 18.5523 12.9477 19 13.5 19M7.5 19H13.5"  
                stroke={`${isHover || props.active ? "#00FFA3" : "#5F5F5F"}`} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
    )

}

export default HomeIcon
