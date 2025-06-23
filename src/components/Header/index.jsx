import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react"
import { GiHamburgerMenu } from 'react-icons/gi';
import { ProtectedComponent } from "../../context";
import { useAuth } from "../../context";
import { useEmpresa } from "../../context/empresaContext";
import { IoStorefrontSharp } from "react-icons/io5";

export const Header = (props) => {

    const [hiddenLogin, setHiddenLogin] = useState("hidden");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const { empresa } = useEmpresa()
    const { setUserLevel } = useAuth()

    const openLogin = () => {
        if (hiddenLogin == "hidden") {
            setHiddenLogin("")
        } else {
            setHiddenLogin("hidden")
        }
    }

    const openDrawer = () => {
        if (props.hiddenDrawer == "hidden") {
            props.setHiddenDrawer("absolute lg:relative")
        } else {
            props.setHiddenDrawer("hidden")
        }
    }

    const logout = () => {
        localStorage.removeItem("applojaweb_token");
        localStorage.removeItem("applojaweb_user_level")
        setUserLevel(null)
        Router.push('/login')
    }

    useEffect(() => {
        setUsername(localStorage.getItem("applojaweb_user_name"));
        setEmail(localStorage.getItem("applojaweb_user_email"));
    }, [])

    return (
        <header className="">
            <nav className="relative z-[999] border-gray-200 w-full px-2 sm:px-4 py-2.5 bg-apploja rounded-b-xl">
                <div className="w-full flex flex-wrap justify-between items-center">
                    <div>
                        <ProtectedComponent allowedLevels={[1, 3]}>
                            <button onClick={openDrawer} type="button" className="inline-flex items-center p-2 text-sm rounded-lg focus:outline-none focus:ring-2 text-white hover:bg-applojaDark focus:ring-applojaLight2">
                                <span className="sr-only">Open main menu</span>
                                <GiHamburgerMenu className="text-white" size={24} />
                            </button>
                        </ProtectedComponent>
                    </div>
                    <div className="hidden justify-between items-center w-full md:flex md:w-auto" id="mobile-menu-2">
                        <Link href="/" >
                            <div className="cursor-pointer flex items-center">
                                <img src="/images/logoAPPLoja.png" className="mr-3 h-6 sm:h-9" alt="Logo" />
                                <span className="self-center text-xl font-semibold whitespace-nowrap text-white">APPLoja</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <a href="https://www.applojastore.com.br" className="text-white flex gap-2 hover:underline">
                                <IoStorefrontSharp size={20} /> Marketplace
                            </a>
                        </div>
                        <button onClick={openLogin} type="button" className="flex p-2 text-sm bg-apploja rounded-full md:mr-0 focus:ring-4 focus:ring-applojaLight2" id="user-menu-button">
                            <span className="sr-only">Open user menu</span>
                            {empresa.logoImage ?
                                (<img className="w-8 h-8 rounded-full" src={empresa.logoImage} alt="user photo" />) :
                                (<img className="w-8 h-8 rounded-full" src="/images/iconAvatar.png" alt="user photo" />)
                            }
                        </button>
                        <div className={hiddenLogin + " absolute z-[999] right-0 top-14 text-base list-none rounded divide-y shadow bg-applojaDark2 divide-applojaLight mr-4"} id="user-dropdown">
                            <div className="flex flex-col gap-1 py-3 px-4">
                                <span className="block text-sm text-white">{username}</span>
                                <span className="block text-sm font-medium truncate text-white">{email}</span>
                                <span className="block text-xs text-white">ID - {empresa.id}</span>
                            </div>
                            <ul className="py-1">
                                <li>
                                    <a href="#" className="hidden py-2 px-4 text-sm hover:bg-gray-600 text-gray-200 hover:text-white">Perfil</a>
                                </li>
                                <li>
                                    <a href="#" className="hidden  py-2 px-4 text-sm hover:bg-gray-600 text-gray-200 hover:text-white ">Configurações</a>
                                </li>
                                <li>
                                    <a onClick={logout} className="block py-2 px-4 text-sm hover:bg-applojaLight text-gray-200 hover:text-white hover:cursor-pointer">Sair</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}