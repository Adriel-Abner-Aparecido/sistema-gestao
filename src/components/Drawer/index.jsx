import { useEffect, useState } from "react"
import { FaCashRegister, FaUserAlt, FaChartPie, FaShoppingBag, FaDollarSign, FaFileAlt, FaCartArrowDown, FaWallet } from 'react-icons/fa';
import { RiSuitcaseFill, RiAdminFill } from 'react-icons/ri';
import { BsFillChatLeftTextFill, BsFillExclamationCircleFill, BsX, BsCartFill, BsGearFill, BsTagsFill, BsPersonVcardFill, BsShareFill, BsMortarboardFill } from 'react-icons/bs';
import { AiFillDollarCircle } from 'react-icons/ai';
import { IoStorefrontSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Router, { useRouter } from 'next/router';
import { ProtectedComponent } from '../../context'

export const Drawer = (props) => {

    const router = useRouter()

    const hiddenDrawer = props.hiddenDrawer

    const [hiddenFinanceiro, setHiddenFinanceiro] = useState("hidden");
    const [hiddenCompras, setHiddenCompras] = useState("hidden");
    const [hiddenPopUpSairPdv, setHiddenPopUpSairPdv] = useState('hidden');
    const [destino, setDestino] = useState(0);
    const [empresaId, setEmpresaId] = useState(null)
    const [pegaempresa, setPegaEmpresa] = useState(true)
    const [active, setActive] = useState('dashboard')

    useEffect(() => {
        if (localStorage.getItem("applojaweb_user_empresa")) {
            const idEmpresa = localStorage.getItem("applojaweb_user_empresa")
            setEmpresaId(idEmpresa)
            setPegaEmpresa(false)
        }
    }, [pegaempresa])

    useEffect(() => {
        setActive(router.pathname)
    }, [])

    const closePopUpSairPdv = () => {
        if (hiddenPopUpSairPdv == 'hidden') {
            setHiddenPopUpSairPdv('')
        } else {
            setHiddenPopUpSairPdv('hidden')
        }
    }

    const openFinanceiro = () => {
        if (hiddenFinanceiro == "hidden") {
            setHiddenFinanceiro("");
        } else {
            setHiddenFinanceiro("hidden");
        }
    }

    const openCompras = () => {
        if (hiddenCompras == "hidden") {
            setHiddenCompras("");
        } else {
            setHiddenCompras("hidden");
        }
    }

    const saindoPdv = () => {
        if (destino == 0) {
            router.push('/dashboard');
        } else if (destino == 1) {
            router.push('/pdv');
        } else if (destino == 2) {
            router.push('/pedidos');
        } else if (destino == 3) {
            router.push('/clientes');
        } else if (destino == 4) {
            router.push('/produtos');
        } else if (destino == 5) {
            router.push('/fornecedores');
        } else if (destino == 6) {
            router.push('/empresa');
        } else if (destino == 7) {
            router.push('/usuarios');
        } else if (destino == 8) {
            router.push('/planos');
        } else if (destino == 9) {
            router.push('/relatorios');
        } else if (destino == 10) {
            router.push('/receber');
        } else if (destino == 11) {
            router.push('/pagar');
        } else if (destino == 12) {
            router.push('/emissao-nfe');
        } else if (destino == 13) {
            router.push('/fluxo-caixa');
        } else if (destino == 14) {
            router.push('/compras');
        } else if (destino == 15) {
            router.push('/entradas');
        } else if (destino == 16) {
            router.push('/newPdv');
        } else if (destino == 17) {
            router.push('/caixa');
        } else if (destino == 18) {
            router.push('/etiquetas')
        } else if (destino == 19) {
            router.push('/configuracoes')
        }
    }

    const goToDashboard = () => {
        if (props.sairPdv) {
            router.push('/dashboard');
        } else {
            closePopUpSairPdv();
            setDestino(0);
        }
    }

    const goToPdv = () => {
        if (props.sairPdv) {
            router.push('/pdv');
        } else {
            //closePopUpSairPdv();
            setDestino(1);
        }
    }

    const goToNewPdv = () => {
        if (props.sairPdv) {
            router.push('/newPdv');
        } else {
            closePopUpSairPdv();
            setDestino(16);
        }
    }

    const goToCaixa = () => {
        if (props.sairPdv) {
            router.push('/caixa');
        } else {
            closePopUpSairPdv();
            setDestino(17);
        }
    }

    const goToPedidos = () => {
        if (props.sairPdv) {
            router.push('/pedidos');
        } else {
            closePopUpSairPdv();
            setDestino(2);
        }
    }
    const goToClientes = () => {
        if (props.sairPdv) {
            router.push('/clientes');
        } else {
            closePopUpSairPdv();
            setDestino(3);
        }
    }
    const goToProdutos = () => {
        if (props.sairPdv) {
            router.push('/produtos');
        } else {
            closePopUpSairPdv();
            setDestino(4);
        }
    }
    const goToFornecedores = () => {
        if (props.sairPdv) {
            router.push('/fornecedores');
        } else {
            closePopUpSairPdv();
            setDestino(5);
        }
    }
    const goToEmpresa = () => {
        if (props.sairPdv) {
            router.push('/empresa');
        } else {
            closePopUpSairPdv();
            setDestino(6);
        }
    }
    const goToUsuarios = () => {
        if (props.sairPdv) {
            router.push('/usuarios');
        } else {
            closePopUpSairPdv();
            setDestino(7);
        }
    }
    const goToPlanos = () => {
        if (props.sairPdv) {
            router.push('/planos');
        } else {
            closePopUpSairPdv();
            setDestino(8);
        }
    }
    const goToRelatorios = () => {
        if (props.sairPdv) {
            router.push('/relatorios');
        } else {
            closePopUpSairPdv();
            setDestino(9);
        }
    }
    const goToFinanceiroContaReceber = () => {
        if (props.sairPdv) {
            router.push('/receber');
        } else {
            closePopUpSairPdv();
            setDestino(10);
        }
    }
    const goToFinanceiroFluxoDeCaixa = () => {
        if (props.sairPdv) {
            router.push('/fluxo-caixa');
        } else {
            closePopUpSairPdv();
            setDestino(13);
        }
    }
    const goToFinanceiroContaPagar = () => {
        if (props.sairPdv) {
            router.push('/pagar');
        } else {
            closePopUpSairPdv();
            setDestino(11);
        }
    }
    const goToNotaFiscal = () => {
        if (props.sairPdv) {
            router.push('/emissao-nfe');
        } else {
            closePopUpSairPdv();
            setDestino(12);
        }
    }

    const goToCompras = () => {
        if (props.sairPdv) {
            router.push('/compras');
        } else {
            closePopUpSairPdv();
            setDestino(14);
        }
    }

    const goToEntradas = () => {
        if (props.sairPdv) {
            router.push('/entradas');
        } else {
            closePopUpSairPdv();
            setDestino(15);
        }
    }

    const goToConfiguracoes = () => {
        if (props.sairPdv) {
            router.push('/configuracoes');
        } else {
            closePopUpSairPdv();
            setDestino(19);
        }
    }

    const goToEtiquetas = () => {
        if (props.sairPdv) {
            router.push('/etiqueta');
        } else {
            closePopUpSairPdv();
            setDestino(18);
        }
    }

    const goToVendedores = () => {
        if (props.sairPdv) {
            router.push('/vendedores');
        } else {
            closePopUpSairPdv();
            setDestino(20);
        }
    }

    const goToSugestao = () => {
        window.open("https://docs.google.com/forms/d/e/1FAIpQLSfwkJlcaJL3qb5DdU4ZEn3_KCA5Y5CwIQzrGSCe5XSwDBpUIw/viewform", "_blank");
    }

    return (
        <ProtectedComponent allowedLevels={[1, 3]}>
            <div id="drawer-navigation" className={hiddenDrawer + " z-50 overflow-y-auto h-[calc(100vh-68px)] w-60 text-gray-700 bg-gray-50"}>
                <div className="flex justify-between items-center px-4 py-2.5">
                    <h5 id="drawer-navigation-label" className="text-base font-semibold uppercase text-gray-700 ">Menu</h5>
                    <span className="text-xs text-gray-500">ID - {empresaId}</span>
                </div>
                <div className="overflow-y-auto font-medium">

                    <ul className="text-xl">
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToDashboard}>
                                    <span className={`hover:bg-gray-400 ${active === '/dashboard' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaChartPie className="" size={24} />
                                        <span className="ml-3">Dashboard</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        {/* <li>
                        <div onClick={goToPdv}>
                            <span className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-applojaDark">
                                <FaCashRegister className="text-white" size={24} />
                                <span className="flex-1 ml-3 whitespace-nowrap">PDV</span>
                            </span>
                        </div>
                    </li> */}
                        <ProtectedComponent allowedLevels={[1, 3]}>
                            <li>
                                <div onClick={goToNewPdv}>
                                    <span className={`hover:bg-gray-400 ${active.includes('/newPdv') && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaCashRegister className="" size={24} />
                                        <span className="ml-3">PDV</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToCaixa}>
                                    <span className={`hover:bg-gray-400 ${active === '/caixa' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaWallet className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Caixa</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1, 3]}>
                            <li>
                                <div onClick={goToPedidos}>
                                    <span className={`hover:bg-gray-400 ${active === '/pedidos' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <AiFillDollarCircle className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Pedidos</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1, 3]}>
                            <li>
                                <div onClick={goToClientes}>
                                    <span className={`hover:bg-gray-400 ${active === '/clientes' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaUserAlt className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Clientes</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1, 3]}>
                            <li>
                                <div onClick={goToProdutos}>
                                    <span className={`hover:bg-gray-400 ${active === '/produtos' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaShoppingBag className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Produtos</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToEtiquetas}>
                                    <span className={`hover:bg-gray-400 ${active === '/etiqueta' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <BsTagsFill className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Etiquetas</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToNotaFiscal}>
                                    <span className={`hover:bg-gray-400 ${active === '/emissao-nfe' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaFileAlt className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Nota Fiscal</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={openCompras} >
                                    <span className={`hover:bg-gray-400 ${active == '/entradas' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaCartArrowDown className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Compras</span>
                                        <IoIosArrowDown className="" size={24} />
                                    </span>
                                </div>
                                <ul id="dropdown-example" className={hiddenCompras + " py-2 space-y-2"}>
                                    {/* <li>
                                <div onClick={goToCompras}>
                                    <span className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg text-white hover:bg-applojaDark">
                                        <span className="flex-1 ml-8 whitespace-nowrap">Compras</span>
                                    </span>
                                </div>
                            </li> */}
                                    <li>
                                        <div onClick={goToEntradas}>
                                            <span className="hover:bg-gray-400 cursor-pointer flex items-center py-2 px-4">
                                                <span className="flex-1 pl-2 whitespace-nowrap">Entradas</span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={openFinanceiro} >
                                    <span className={`hover:bg-gray-400 ${active === '/fluxo-caixa' ? 'bg-gray-300' : active === '/receber' ? 'bg-gray-300' : active === '/pagar' ? 'bg-gray-300' : ''} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaDollarSign className="" size={24} />
                                        <span className="flex-1 pl-2 whitespace-nowrap">Financeiro</span>
                                        <IoIosArrowDown className="" size={24} />
                                    </span>
                                </div>
                                <ul id="dropdown-example" className={hiddenFinanceiro + " py-2 space-y-2"}>
                                    <li>
                                        <div onClick={goToFinanceiroFluxoDeCaixa}>
                                            <span className="hover:bg-gray-400 cursor-pointer flex items-center py-2 px-4">
                                                <span className="flex-1 pl-2 whitespace-nowrap">Fluxo de Caixa</span>
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <div onClick={goToFinanceiroContaReceber}>
                                            <span className="hover:bg-gray-400 cursor-pointer flex items-center py-2 px-4">
                                                <span className="flex-1 pl-2 whitespace-nowrap">Contas à Receber</span>
                                            </span>
                                        </div>
                                    </li>
                                    <li>
                                        <div onClick={goToFinanceiroContaPagar}>
                                            <span className="hover:bg-gray-400 cursor-pointer flex items-center py-2 px-4">
                                                <span className="flex-1 pl-2 whitespace-nowrap">Contas à Pagar</span>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToRelatorios}>
                                    <span className={`hover:bg-gray-400 ${active === '/relatorios' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <FaFileAlt className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Relatórios</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToFornecedores}>
                                    <span className={`hover:bg-gray-400 ${active === '/fornecedores' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <RiSuitcaseFill className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Fornecedores</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToEmpresa}>
                                    <span className={`hover:bg-gray-400 ${active === '/empresa' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <BsGearFill className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Empresa</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToUsuarios}>
                                    <span className={`hover:bg-gray-400 ${active === '/usuarios' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <RiAdminFill className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Usuarios</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToVendedores}>
                                    <span className={`hover:bg-gray-400 ${active === '/vendedores' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <BsPersonVcardFill className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Vendedores</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div>
                                    <a href="https://www.applojastore.com.br/" target="_blank" rel="noreferrer" className={`hover:bg-gray-400 ${active === '/planos' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <IoStorefrontSharp className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Marketplace</span>
                                    </a>
                                </div>
                            </li>
                        </ProtectedComponent>
                        <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={() => router.push('/indicacoes')}>
                                    <span className={`hover:bg-gray-400 ${active === '/indicacoes' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <BsShareFill className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Indicações</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent>
                        {/* <ProtectedComponent allowedLevels={[1]}>
                            <li>
                                <div onClick={goToConfiguracoes}>
                                    <span className={`hover:bg-gray-400 ${active === '/configuracoes' && 'bg-gray-300'} cursor-pointer flex items-center py-2 px-4`}>
                                        <BsGearFill className="" size={24} />
                                        <span className="flex-1 ml-3 whitespace-nowrap">Configurações</span>
                                    </span>
                                </div>
                            </li>
                        </ProtectedComponent> */}
                        <li>
                            <div onClick={() => router.push('https://academy.apploja.com', { target: "_blank", rel: "noreferrer" })}>
                                <span className="hover:bg-gray-400 cursor-pointer flex items-center py-2 px-4">
                                    <BsMortarboardFill className="" size={24} />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Cursos</span>
                                </span>
                            </div>
                        </li>
                        <li>
                            <div onClick={goToSugestao}>
                                <span className="hover:bg-gray-400 cursor-pointer flex items-center py-2 px-4">
                                    <BsFillChatLeftTextFill className="" size={24} />
                                    <span className="flex-1 ml-3 whitespace-nowrap">Sugestões</span>
                                </span>
                            </div>
                        </li>
                        <li className="p-4">
                            <span className="text-xs text-gray-500">ID - {empresaId}</span>
                        </li>
                    </ul>
                </div>
                {/* POPUP */}
                <div id="popup-modal" className={"fixed flex flex-col right-0 left-0 top-0 z-50 p-4 " + hiddenPopUpSairPdv + " md:h-full bg-gray-700 bg-opacity-60 items-center justify-center"}>
                    <div className="relative">
                        <div className="relative rounded-lg shadow bg-gray-200">
                            <button onClick={closePopUpSairPdv} type="button" className="absolute top-3 right-2.5 text-gray-700 bg-transparent rounded-lg text-sm p-1.5  hover:bg-gray-400" data-modal-hide="popup-modal">
                                <div className="flex w-5 h-5">
                                    <BsX className="text-2xl" />
                                </div>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-center">
                                <div className="mt-6 mx-auto mb-4 text-gray-700 w-14 h-14">
                                    <BsFillExclamationCircleFill size={60} />
                                </div>
                                <h3 className="mb-5 text-lg font-normal text-gray-700">Deseja sair sem salvar essa venda?</h3>
                                <button onClick={saindoPdv} type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    Sim
                                </button>
                                <button onClick={closePopUpSairPdv} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-applojaDark border-applojaLight2 text-white hover:bg-applojaLight">Não</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedComponent >
    )
}