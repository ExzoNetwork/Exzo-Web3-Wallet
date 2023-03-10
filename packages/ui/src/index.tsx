import log, { LogLevelDesc } from "loglevel"
import { StrictMode } from "react"
import Modal from "react-modal"
import App from "./App"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"

import "./styles"

// Setting the default log level
log.setLevel((process.env.LOG_LEVEL as LogLevelDesc) || "error")

Modal.setAppElement("#root")

const container = document.getElementById("root")
const root = createRoot(container!)
root.render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
)
