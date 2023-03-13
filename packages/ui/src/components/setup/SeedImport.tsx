import { FunctionComponent, useCallback, useEffect, useState } from "react"
import { Classes, classnames } from "../../styles"
import LinkButton from "../button/LinkButton"
import Divider from "../Divider"
import PasswordInput from "../input/PasswordInput"
import Spinner from "../spinner/Spinner"
import * as yup from "yup"
import { isValidMnemonic } from "@ethersproject/hdnode"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import log from "loglevel"
import InfoTip from "../label/InfoTip"
import Select from "../input/Select"
import eyeOpen from "../../assets/images/icons/eye_open.svg"
import eyeClose from "../../assets/images/icons/eye_close.svg"
import { ButtonWithLoading } from "../button/ButtonWithLoading"

const schema = yup.object().shape({
    password: yup
        .string()
        .required("No password provided.")
        .min(8, "Password should be at least 8 characters long.")
        .matches(
            /(?=.*\d)(?=.*[a-z])/,
            "Password must contain at least one lowercase character and one digit."
        ),
    passwordConfirmation: yup
        .string()
        .required("Please enter the password confirmation.")
        .oneOf(
            [yup.ref("password"), null],
            "Password and password confirmation must match."
        ),
    acceptTOU: yup
        .bool()
        .required("You must accept the Terms of Use.")
        .oneOf([true], "You must accept the Terms of Use."),
})
type SeedImportFormData = {
    password: string
    passwordConfirmation: string
    acceptTOU: boolean
}

const numberOfWordsOptions: number[] = []
for (let i = 12; i <= 24; i += 3) {
    numberOfWordsOptions.push(i)
}

const SeedImport: FunctionComponent<{
    buttonLabel: string
    action: (password: string, seedPhrase: string) => Promise<any>
}> = ({ buttonLabel = "Import", action }) => {
    const [passwordScore, setPasswordScore] = useState<number>(0)
    const [numberOfWords, setNumberOfWords] = useState<number>(
        numberOfWordsOptions[0]
    )
    const [seedPhrase, setSeedPhrase] = useState(
        new Array(numberOfWordsOptions[0]).fill("")
    )
    const [seedPhraseError, setSeedPhraseError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isImportDisabled, setIsImportDisabled] = useState(true)
    const { register, handleSubmit, setError, trigger, watch, formState } =
        useForm<SeedImportFormData>({
            mode: "onChange",
            resolver: yupResolver(schema),
        })
    const [showPassword, setShowPassword] = useState(false);

    const passwordConfirmationWatch = watch("passwordConfirmation")
    const onSubmit = handleSubmit(async (data: SeedImportFormData) => {
        try {
            if (passwordScore < 3) {
                return setError(
                    "password",
                    {
                        message: "Password is not strong enough",
                    },
                    {
                        shouldFocus: true,
                    }
                )
            }

            if (!isValidMnemonic(seedPhrase.join(" "))) {
                return setSeedPhraseError("Seed phrase invalid")
            }

            setIsLoading(true)

            const { password } = data

            await action(password, seedPhrase.join(" "))
        } catch (error) {
            log.error(error.message || error)

            setSeedPhraseError("Error importing seed phrase")
        } finally {
            setIsLoading(false)
        }
    })

    const onSeedPhraseChange = useCallback(
        (newSP: string[]) => {
            if (newSP.some((word: string) => word !== "")) {
                if (newSP.some((word: string) => word === "")) {
                    setSeedPhraseError("Enter the full seed phrase")
                } else if (!isValidMnemonic(newSP.join(" "))) {
                    setSeedPhraseError("Seed phrase invalid")
                } else {
                    setSeedPhraseError("")
                }
            }
            setSeedPhrase(newSP)
        },
        [setSeedPhrase, setSeedPhraseError]
    )

    const onSeedPhraseWordChange = useCallback(
        (wordN: number, word: string) => {
            const newSP = seedPhrase.slice()
            newSP[wordN] = word.trim()
            onSeedPhraseChange(newSP)
        },
        [seedPhrase, onSeedPhraseChange]
    )

    const onSeedPhrasePaste = useCallback(
        (pastedSP: string) => {
            const parsedSP =
                pastedSP.trim().toLowerCase().match(/\w+/gu)?.join(" ") || ""

            let newSP = parsedSP.split(" ")
            let newNumberOfWords = numberOfWords
            if (newSP.length !== numberOfWords) {
                if (newSP.length < 12) {
                    newNumberOfWords = 12
                } else if (newSP.length % 3 === 0) {
                    newNumberOfWords = newSP.length
                } else {
                    newNumberOfWords = newSP.length + (3 - (newSP.length % 3))
                }
                setNumberOfWords(newNumberOfWords)
            }

            if (newSP.length < newNumberOfWords) {
                newSP = newSP.concat(
                    new Array(newNumberOfWords - newSP.length).fill("")
                )
            }

            onSeedPhraseChange(newSP)
        },
        [numberOfWords, onSeedPhraseChange]
    )

    const passwordValues = watch()
    useEffect(() => {
        if (
            seedPhrase &&
            !seedPhraseError &&
            seedPhrase.filter((s) => s !== "").length === numberOfWords &&
            formState.isValid
        ) {
            setIsImportDisabled(false)
        } else {
            setIsImportDisabled(true)
        }
    }, [seedPhrase, passwordValues, seedPhraseError, formState.errors.password])

    useEffect(() => {
        // trigger password confirmation validation when password changes given that there is a value in both fields
        if (passwordValues.password && passwordValues.passwordConfirmation) {
            trigger("passwordConfirmation")
        }
    }, [passwordValues.password, trigger])

    return (
        <form
            className="flex flex-col w-full text-gray-600"
            onSubmit={onSubmit}
        >
            <div className="flex flex-col px-12 space-y-4">
                <div className="flex flex-col space-y-2">
                    {/* <div className="flex flex-col space-y-1">
                        <Select
                            onChange={setNumberOfWords}
                            currentValue={numberOfWords}
                            id="numberOfWords"
                            label="Seed phrase length"
                        >
                            {numberOfWordsOptions.map(
                                (numberOfWords: number) => {
                                    return (
                                        <Select.Option
                                            value={numberOfWords}
                                            key={numberOfWords}
                                        >
                                            {`${numberOfWords}-word Seed Phrase`}
                                        </Select.Option>
                                    )
                                }
                            )}
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <InfoTip
                            text="You can paste your entire seed phrase into any field."
                            fontSize="text-xs"
                        />
                    </div> */}
                    <div className="flex flex-col space-y-1">
                        {/* <div className="grid grid-cols-3 gap-2"> */}
                        <div className="h-[224px] px-2 py-12 overflow-hidden rounded-3xl bg-container-reveal bg-opacity-20 relative">
                            <div className="absolute left-[1px] top-[5px] w-[30px]">
                                <img
                                    className={classnames(
                                        "w-6 h-6 p-1 absolute right-0 transition-all duration-300 cursor-pointer hover:bg-component-btn-100 rounded-full",
                                        showPassword === false
                                            ? "opacity-100 z-10"
                                            : "opacity-0 pointer-event-none z-0"
                                    )}
                                    src={eyeClose}
                                    alt="show password"
                                    onClick={() => setShowPassword(true)}
                                />
                                <img
                                    className={classnames(
                                        "w-6 h-6 p-1 absolute right-0 transition-all duration-300 cursor-pointer hover:bg-component-btn-100 rounded-full",
                                        showPassword === true
                                            ? "opacity-100 z-10"
                                            : "opacity-0 pointer-event-none z-0"
                                    )}
                                    src={eyeOpen}
                                    alt="hide password"
                                    onClick={() => setShowPassword(false)}
                                />
                            </div>
                            <div className=" flex flex-wrap justify-center gap-x-[10px] gap-y-[10px]">
                                {Array.from({ length: numberOfWords }, (v, i) => {
                                    const wordnN = i + 1
                                    return (
                                        <PasswordInput
                                            key={`word_${i}`}
                                            placeholder={`Enter word #${wordnN}`}
                                            name={`word_${i}`}
                                            //register={register}
                                            value={seedPhrase[i]}
                                            showPasswordStatus={showPassword}
                                            onChange={(e: any) => {
                                                e.preventDefault()
                                                onSeedPhraseWordChange(
                                                    i,
                                                    e.target.value
                                                )
                                            }}
                                            seedImportStatus={true}
                                            onPaste={(e: any) => {
                                                const newSP =
                                                    e.clipboardData.getData("text")

                                                if (newSP.trim().match(/\s/u)) {
                                                    e.preventDefault()
                                                    onSeedPhrasePaste(newSP)
                                                }
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <span className="text-xs text-red-500">
                            {seedPhraseError || <>&nbsp;</>}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col space-y-1">
                    <PasswordInput
                        label="New Password"
                        placeholder="Enter New Password"
                        {...register("password", {
                            onChange: () => {
                                passwordConfirmationWatch &&
                                    trigger("passwordConfirmation")
                            },
                        })}
                        error={formState.errors.password?.message}
                        strengthBar={true}
                        seedImportStatus={false}
                        setPasswordScore={setPasswordScore}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm New Password"
                        {...register("passwordConfirmation")}
                        error={formState.errors.passwordConfirmation?.message}
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex flex-row items-center space-x-2">
                        <input
                            type="checkbox"
                            className={Classes.checkbox}
                            id="acceptTOU"
                            {...register("acceptTOU")}
                        />
                        <label htmlFor="acceptTOU" className="text-xs text-white">
                            I have read and agree to the{" "}
                            <a
                                href="https://www.exzo.network/disclaimer"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-body-balances-200"
                            >
                                Terms of Use
                            </a>
                        </label>
                    </div>
                    <span className="text-xs text-red-500">
                        {formState.errors.acceptTOU?.message || <>&nbsp;</>}
                    </span>
                </div>
            </div>
            <div className="px-24 flex flex-col w-full relative">
                <button
                    type="submit"
                    className={classnames(
                        Classes.confrimButton,
                        (isLoading || isImportDisabled) &&
                            "opacity-50 pointer-events-none"
                    )}
                    disabled={isImportDisabled || isLoading}
                >
                    {!isLoading ? buttonLabel : <Spinner />}
                </button>
            </div>
        </form>
    )
}

export default SeedImport
