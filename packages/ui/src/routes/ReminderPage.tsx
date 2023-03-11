import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"

// Components
import PopupHeader from "../components/popup/PopupHeader"
import PopupLayout from "../components/popup/PopupLayout"
import PopupFooter from "../components/popup/PopupFooter"
import ClickToReveal from "../components/label/ClickToReveal"
import { ButtonWithLoading } from "../components/button/ButtonWithLoading"
import PasswordInput from "../components/input/PasswordInput"

// Comms
import { useBlankState } from "../context/background/backgroundHooks"
import getRequestRouteAndStatus from "../context/util/getRequestRouteAndStatus"
import { verifyPassword, requestSeedPhrase } from "../context/commActions"
import CopyImg from "../assets/exzo-images/images/copy.png"
const schema = yup.object().shape({
    password: yup.string().required("Password required."),
})
type PasswordFormData = { password: string }

const ReminderPage = () => {
    const history: any = useHistory()
    const [revealed, setRevealed] = useState<boolean>(false)
    const [seedPhrase, setSeedPhrase] = useState<string | undefined>("")
    const [password, setPassword] = useState<string | undefined>("")
    const [copied, setCopied] = useState(false)
    const [active, setActive] = useState(false)
    const hasBack = history.location.state?.hasBack ?? true

    const { permissionRequests, unapprovedTransactions, dappRequests } =
        useBlankState()!

    const [showRequests, requestRoute] = getRequestRouteAndStatus(
        permissionRequests,
        unapprovedTransactions,
        dappRequests
    )

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: yupResolver(schema),
    })

    const onSubmit = handleSubmit((data) => {
        verifyPassword(data.password)
            .then(async (isValid) => {
                if (!isValid)
                    return setError(
                        "password",
                        {
                            message: "Incorrect password",
                        },
                        {
                            shouldFocus: true,
                        }
                    )

                const seedPhrase = await requestSeedPhrase(data.password)

                setPassword(data.password)
                setSeedPhrase(seedPhrase)
            })
            .catch(console.log)
    })

    useEffect(() => {
        setSeedPhrase(history.location?.state?.seedPhrase)
        setPassword(history.location?.state?.password)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(seedPhrase? seedPhrase  : "")
        setCopied(true)
        setActive(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCopied(false)
    }

    const shouldEnterPassword = !seedPhrase || !password

    return (
        <PopupLayout
            header={
                <PopupHeader
                    title="You Haven’t Set Up a Backup"
                    backButton={true}
                    close={showRequests ? requestRoute : undefined}
                    isReminder={true}
                />
            }
            submitOnEnter={{
                onSubmit,
                isEnabled: shouldEnterPassword,
                isFormValid: Object.keys(errors).length === 0,
            }}
        >
            {shouldEnterPassword ? (
                <div className="p-6 flex flex-col space-y-8">
                    <div className="flex flex-col space-y-2">
                        <span className="text-center text-base font-bold font-title text-white">
                            Enter your password to back up your seed phrase.
                        </span>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <PasswordInput
                            label="Password"
                            placeholder="Enter Password"
                            {...register("password")}
                            error={errors.password?.message}
                            autoFocus
                        />
                    </div>
                </div>
            ) : (
                <div className="w-full min-h-[476px] p-6 relative">
                    <div className="flex flex-col w-full relative">
                        <div className="flex flex-col space-y-6">
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
                                <div className="px-18 absolute bottom-0 left-0 w-[300px]">
                                    <div className="relative w-[300px]">
                                        <div className="bg-component-btn-500 py-4 rounded-full text-xs font-bold hover:opacity-60 absolute left-[72px] -top-[26px] 
                                            p-[14px] flex justify-center hover:cursor-pointer" onClick={copyToClipboard}><img src={CopyImg} className="mr-2 w-4 h-4"/>
                                            <span>Copy to clipboard</span>
                                        </div>
                                        {copied && <div className="absolute text-white text-xxs rounded-2xl left-[166px] -top-[35px] bg-black px-4 py-1">Copied!</div>}
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="w-full absolute bottom-0 pr-[49px] pb-[20px]">
                        <ButtonWithLoading
                            disabled={!shouldEnterPassword && !active}
                            label={shouldEnterPassword ? "Next" : "Backup now"}
                            onClick={() => {
                                if (shouldEnterPassword) {
                                    onSubmit()
                                    return
                                }

                                history.push({
                                    pathname: "/reminder/backup",
                                    state: {
                                        seedPhrase,
                                        isReminder: true,
                                        password,
                                    },
                                })
                            }}
                        />
                    </div>
                </div>
            )}
        </PopupLayout>
    )
}

export default ReminderPage
