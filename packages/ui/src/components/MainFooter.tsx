import { useLocation } from "react-router-dom"

import MenuIcon from "./menu/MenuIcon"
import BrowserIcon from "../components/icons/BrowserIcon"
import HomeIcon from "../components/icons/HomeIcon"
import SettingsIcon from "../components/icons/SettingsIcon"
import SwapIcon from "../components/icons/SwapIcon"
import TransactionHistoryIcon from "../components/icons/TransactionHistoryIcon"

const MainFooter = () => {
    const {pathname} = useLocation()
    return (
        <div className="absolute bottom-0 left-0 z-10 flex flex-col items-start w-full px-7 py-2 bg-header-100 popup-layout"
            style={{ backdropFilter: "blur(4px)" }}>
            <div className="flex flex-row items-center justify-between w-full px-3 py-2.5">
                <MenuIcon to="/home" icon={<HomeIcon active={pathname.includes('home')} />}/>
                <MenuIcon to="/collectibles" icon={<BrowserIcon active={pathname.includes('collectibles')}/>} />
                <MenuIcon to="/swap" icon={<SwapIcon active={pathname.includes('swap')}/>} />
                <MenuIcon to="/transaction_history" icon={<TransactionHistoryIcon active={pathname.includes('transaction_history')}/>} />
                <MenuIcon to="/settings" icon={<SettingsIcon active={pathname.includes('settings')}/>} />
            </div>
        </div>
    )
}

export default MainFooter
