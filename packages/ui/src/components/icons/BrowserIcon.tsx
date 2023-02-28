import { useState } from "react";

const HomeIcon = (props: any) => {
    const [isHover, setIsHover] = useState(false); 
    return(
        <div onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 3C0.5 1.34315 1.84315 0 3.5 0H5.5C7.15685 0 8.5 1.34315 8.5 3V5C8.5 6.65685 7.15685 8 5.5 8H3.5C1.84315 8 0.5 6.65685 0.5 5V3Z" fill={`${isHover || props.active ? "#00FFA3" : "#5F5F5F"}`}/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 3C10.5 1.34315 11.8431 0 13.5 0H15.5C17.1569 0 18.5 1.34315 18.5 3V5C18.5 6.65685 17.1569 8 15.5 8H13.5C11.8431 8 10.5 6.65685 10.5 5V3Z" fill={`${isHover || props.active ? "#00FFA3" : "#5F5F5F"}`} />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 13C0.5 11.3431 1.84315 10 3.5 10H5.5C7.15685 10 8.5 11.3431 8.5 13V15C8.5 16.6569 7.15685 18 5.5 18H3.5C1.84315 18 0.5 16.6569 0.5 15V13Z" fill={`${isHover || props.active ? "#00FFA3" : "#5F5F5F"}`} />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 13C10.5 11.3431 11.8431 10 13.5 10H15.5C17.1569 10 18.5 11.3431 18.5 13V15C18.5 16.6569 17.1569 18 15.5 18H13.5C11.8431 18 10.5 16.6569 10.5 15V13Z" fill={`${isHover || props.active ? "#00FFA3" : "#5F5F5F"}`} />
            </svg>
        </div>
    )


}

export default HomeIcon
