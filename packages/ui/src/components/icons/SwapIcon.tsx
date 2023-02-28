import { useState } from "react";

const HomeIcon = (props: any) => {
    const [isHover, setIsHover] = useState(false); 
    return(
        <div onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1V6H2.08152M17.4381 8C16.946 4.05369 13.5796 1 9.5 1C6.14262 1 3.26829 3.06817 2.08152 6M2.08152 6H6.5M17.5 17V12H16.9185M16.9185 12C15.7317 14.9318 12.8574 17 9.5 17C5.42038 17 2.05399 13.9463 1.56189 10M16.9185 12H12.5" 
                stroke={`${isHover || props.active ? "#00FFA3" : "#5F5F5F"}`} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
    )

}

export default HomeIcon
