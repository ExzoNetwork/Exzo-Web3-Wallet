import { useEffect, useState } from "react"

import classnames from "classnames"

import { Link } from "react-router-dom"

import PageLayout from "../../components/PageLayout"
import Divider from "../../components/Divider"
import { Classes } from "../../styles/classes"

import drawerIcon from "../../assets/images/icons/drawer.svg"
import penIcon from "../../assets/images/icons/pen.svg"
import backupIcon from "../../assets/images/icons/backup.svg"
import LinkButton from "../../components/button/LinkButton"
import { useOnMountHistory } from "../../context/hooks/useOnMount"
import ClickToReveal from "../../components/label/ClickToReveal"
import { useBlankState } from "../../context/background/backgroundHooks"
import { closeCurrentTab } from "../../util/window"
import IdleComponent from "../../components/IdleComponent"
import { ButtonWithLoading } from "../../components/button/ButtonWithLoading"
import CopyImg from "../../assets/exzo-images/images/copy.png"
import CopyTooltip from "../../components/label/СopyToClipboardTooltip"
const SideTips = () => (
    <div className="flex flex-col justify-between h-full w-full space-y-6 text-sm text-left md:w-64 md:ml-6">
        <div className="flex flex-col w-full p-6 space-y-4 rounded-md bg-body-balances-100">
            <img src={drawerIcon} className="w-5 h-5" alt="" />
            <span className="text-white">
                Store this phrase in a password manager like{" "}
                <b className="text-body-balances-200">1Password</b>.
            </span>
        </div>
        <div className="flex flex-col w-full p-6 space-y-4 rounded-md bg-body-balances-100">
            <img src={penIcon} className="w-5 h-5" alt="" />
            <span className="text-white">
                Write this phrase on pieces of paper and store each in{" "}
                <b className="text-body-balances-200">2 - 3</b> different locations.
            </span>
        </div>
        <div className="flex flex-col w-full p-6 space-y-4 rounded-md bg-body-balances-100">
            <img src={backupIcon} className="w-5 h-5" alt="" />
            <span className="text-white">
                <b className="text-body-balances-200">Download</b> this Secret Backup
                Phrase and keep it stored safely on an external encrypted hard
                drive or storage medium.
            </span>
        </div>
    </div>
)

const BackupNoticePage = () => {
    const { isUnlocked } = useBlankState()!
    useEffect(() => {
        if (!isUnlocked) {
            alert(
                "For security reasons the extension is now blocked. Login again in the extension to continue with the backup process."
            )
            closeCurrentTab()
        }
    }, [isUnlocked])

    const [revealed, setRevealed] = useState(false)
    const [active, setActive] = useState(false)
    const history: any = useOnMountHistory()
    const { seedPhrase, password } = history.location.state
    const [check1, setCheck1] = useState(-1)
    const [check2, setCheck2] = useState(-1)
    const [copied, setCopied] = useState(false)
    const onCheck1 = () => {
        setCheck1(check1 * -1)
    }
    const onCheck2 = () => {
        setCheck2(check2 * -1)
    }

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(seedPhrase)
        setCopied(true)
        setActive(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCopied(false)
    }

    return (
        <IdleComponent>
            <PageLayout
                header
                className="text-center relative"
                step={2}
            >
                <div className="mt-6 text-3xl font-bold font-title text-white">
                    Secret Recovery Phrase
                </div>
                <div className="text-txt-warn text-xl my-5">
                    This phrase is the ONLY way to recover your account. DO <br />NOT lose it or share it with anyone!
                </div>
                <div className="px-24 flex flex-col w-full relative">
                    <div className="flex flex-col py-6 px-9 space-y-6">
                        <ClickToReveal
                            hiddenText={seedPhrase}
                            revealMessage={"Click here to reveal secret words"}
                            revealed={revealed}
                            onClick={() => setRevealed(true)}
                            isReminder={true}
                            isPrivate={false}
                        />
                    </div>
                    {
                        revealed && 
                            <div className="px-48 w-full absolute bottom-0 left-0">
                                <div className="relative">
                                    <div className="bg-component-btn-500 py-4 rounded-full text-sm font-bold hover:opacity-60 flex justify-center hover:cursor-pointer" onClick={copyToClipboard}><img src={CopyImg} className="mr-2 w-5 h-5"/><span>Copy to clipboard</span></div>
                                    {copied && <div className="absolute text-white text-xxs rounded-2xl right-0 -top-2 bg-black px-4 py-1">Copied!</div>}
                                </div>
                            </div>
                    }
                </div>
                <div className="flex flex-col space-y-1 mt-6">
                    <div className="flex flex-row items-center space-x-2">
                        <input
                            type="checkbox"
                            className={classnames(Classes.checkbox, "bg-component-input-bg")}
                            id="backDONE"
                            onClick={onCheck1}
                        />
                        <label htmlFor="backDONE" className="text-xs text-txt-check">
                            I have backed up my recovery key
                        </label>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        <input
                            type="checkbox"
                            className={classnames(Classes.checkbox, "bg-component-input-bg")}
                            id="underSTOOD"
                            onClick={onCheck2}
                        />
                        <label htmlFor="underSTOOD" className="text-xs text-txt-check">
                            I understand that if I lose my recovery key I won’t be able to access my wallet
                        </label>
                    </div>
                </div>
                <div className="flex flex-row w-full p-6 space-x-4">
                    <ButtonWithLoading
                        label="Remind me later"
                        onClick={()=>{history.push('/setup/done')}}
                        buttonClass={Classes.reminderButton}
                    ></ButtonWithLoading>
                    <Link
                        to={{
                            pathname: "/setup/create/verify",
                            state: { seedPhrase, isReminder: false, password },
                        }}
                        className={classnames(
                            Classes.confrimButton,
                            (check1 == -1 || check2 == -1)  && "opacity-50 pointer-events-none"
                        )}
                        draggable={false}
                    >
                        Next
                    </Link>
                </div>
            </PageLayout>
        </IdleComponent>
    )
}

export default BackupNoticePage
