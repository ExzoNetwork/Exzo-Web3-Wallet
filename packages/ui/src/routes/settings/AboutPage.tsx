import PopupLayout from "../../components/popup/PopupLayout"
import PopupHeader from "../../components/popup/PopupHeader"
import AppVersion from "../../components/AppVersion"

import { IoLogoTwitter } from "react-icons/io"
import { HiGlobeAlt } from "react-icons/hi"
import { FaGithub, FaTelegramPlane } from "react-icons/fa"
import classNames from "classnames"
import logo from "../../assets/exzo-images/images/logo.png"
import { LINKS } from "../../util/constants"
import { FiDownload } from "react-icons/fi"
import { Classes } from "../../styles"
import useStateLogs from "../../util/hooks/useStateLogs"

const links = [
    {
        icon: <HiGlobeAlt className="w-5 h-5 text-component-btn-200" />,
        link: LINKS.WEBSITE,
        text: "blockwallet.io",
    },
    {
        icon: <FaTelegramPlane className="w-5 h-5 text-component-btn-200" />,
        link: LINKS.TELEGRAM,
        text: "t.me/blockwallet",
    },
    {
        icon: <FaGithub className="w-5 h-5 text-component-btn-200" />,
        link: LINKS.GITHUB,
        text: "github.com/block-wallet",
    },
    {
        icon: <IoLogoTwitter className="w-5 h-5 text-component-btn-200" />,
        link: LINKS.TWITTER,
        text: "twitter.com/GetBlockWallet",
    },
]
const AboutPage = () => {
    const { downloadStateLogsHandler } = useStateLogs()
    return (
        <PopupLayout header={<PopupHeader title={"About"} close="/" />}>
            <div className="space-y-4 p-6 py-4">
                <div className="bg-body-assets-100 rounded-lg p-4">
                    <div className="flex items-center">
                        <img
                            src={logo}
                            alt="ExzoWallet logo"
                            className="w-5 h-5"
                        />
                        <span className="ml-2 text-lg font-bold text-white">
                            ExzoWallet
                        </span>
                    </div>
                    <p className="mt-4 text-txt-settings">
                        ExzoWallet is the most private, non-custodial browser
                        extension wallet where users can store funds and
                        interact with their favorite blockchain applications
                        anonymously.
                    </p>
                    <p className="text-txt-settings">Join us today and reclaim your privacy.</p>
                    <div className="mt-4">
                        <AppVersion />
                    </div>
                </div>
                <div className="bg-body-assets-100 rounded-lg p-4">
                    <span className="text-lg font-bold text-white">Contacts</span>
                    <div className="space-y-4 mt-4">
                        {links.map(({ text, link, icon }) => (
                            <a
                                href={link}
                                target="_blank"
                                className="text-sm font-bold flex items-center"
                                rel="noopener noreferrer"
                            >
                                {icon}
                                <span className="ml-2 text-txt-settings hover:text-component-btn-200">{text}</span>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="w-full bg-body-assets-100 rounded-lg flex justify-between items-center p-4 py-2">
                    <span className="text-xs mr-2 text-txt-settings">
                        Download state logs for support
                    </span>
                    <button
                        className={classNames(Classes.smallButton, "px-4")}
                        onClick={downloadStateLogsHandler}
                    >
                        <FiDownload size={18} />
                    </button>
                </div>
            </div>
        </PopupLayout>
    )
}

export default AboutPage
