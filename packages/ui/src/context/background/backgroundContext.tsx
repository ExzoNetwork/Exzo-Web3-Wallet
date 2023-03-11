import { createContext } from "react"
import type { ResponseGetState } from "@exzo-wallet/background/utils/types/communication"

export type BackgroundStateType = {
    blankState?: ResponseGetState
}

export const initBackgroundState: BackgroundStateType = {}

const BackgroundContext: React.Context<BackgroundStateType> =
    createContext<BackgroundStateType>(initBackgroundState)

export default BackgroundContext
