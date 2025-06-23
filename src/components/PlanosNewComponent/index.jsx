import { useEffect, useState } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { get } from "../../services/api";
import Router from "next/router";

export const PlanosNewComponent = (props) => {
    var localEmpresa = typeof window !== 'undefined' ? localStorage.getItem('applojaweb_user_empresa') : null;
    const [idEmpresa, setIdEmpresa] = useState(localEmpresa);
    const [idPlanoAtual, setIdPlanoAtual] = useState();

    const openMercadoPagoModal = (plano) => {
        props.setPlanoSelecionado(plano);
        if (props.hiddenCheckoutModal == "hidden") {
            props.setHiddenCheckoutModal("")
        }
    }

    useEffect(() => {
        get(process.env.NEXT_PUBLIC_API_URL + '/minhaempresa').then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setIdPlanoAtual(res[0].plano_id);
            }
        })
    }, [])

    const buttonPlanoGratuito = () => {
        if (idPlanoAtual == 1) {
            return (
                <button type="button" className="text-blue-600 bg-white hover:bg-gray-100 border border-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Seu Plano Atual</button>
            )
        } else {
            return (
                <button type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
                    Assinar Plano
                </button>
            )
        }
    }

    const buttonPlanoBronze = () => {
        if (idPlanoAtual == 2) {
            return (
                <button type="button" className="text-blue-600 bg-white hover:bg-gray-100 border border-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Seu Plano Atual</button>
            )
        } else {
            return (
                <button
                    onClick={
                        () => openMercadoPagoModal({ plano_id: 2, plano_nome: "Plano Bronze", plano_valor: 1 })
                    }
                    type="button"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
                    Assinar Plano
                </button>
            )
        }
    }

    const buttonPlanoPrata = () => {
        if (idPlanoAtual == 3) {
            return (
                <button type="button" className="text-blue-600 bg-white hover:bg-gray-100 border border-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Seu Plano Atual</button>
            )
        } else {
            return (
                <button
                    onClick={
                        () => openMercadoPagoModal({ plano_id: 3, plano_nome: "Plano Prata", plano_valor: 1 })
                    }
                    type="button"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
                    Assinar Plano
                </button>
            )
        }
    }

    const buttonPlanoOuro = () => {
        if (idPlanoAtual == 4) {
            return (
                <button type="button" className="text-blue-600 bg-white hover:bg-gray-100 border border-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Seu Plano Atual</button>
            )
        } else {
            return (
                <button
                    onClick={
                        () => openMercadoPagoModal({ plano_id: 4, plano_nome: "Plano Ouro", plano_valor: 10 })
                    }
                    type="button"
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">
                    Assinar Plano
                </button>
            )
        }
    }

    return (
        <div className="w-full px-5">
            <div className="flex flex-col md:flex-wrap bg-gray-200 w-full p-8 mb-4 rounded md:flex-row md:justify-between gap-8">
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-sm p-4 rounded-lg shadow sm:p-8 bg-white border border-blue-500 transition duration-300 ease-in-out hover:scale-105">
                        <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Gratuito</h5>
                        <div className="h-28 w-60">

                        </div>
                        {buttonPlanoGratuito()}
                        <ul role="list" className="space-y-5 mt-7">
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">100 Cadastros de Produtos</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Cadastro de Clientes</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">1 Usuários</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Vendas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Frente de Caixa PDV</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Suporte</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Contas a Pagar e Receber</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Importação XML <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Orçamento <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Ordens de Serviços <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Crediário <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Emissão de notas <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-sm p-4 rounded-lg shadow sm:p-8 bg-white border border-blue-500 transition duration-300 ease-in-out hover:scale-105">
                        <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Bronze</h5>
                        <div className="h-28">
                            <div className="flex items-baseline line-through decoration-gray-700 text-white">
                                <span className="text-xl font-semibold text-red-500">De R$</span>
                                <span className="text-xl font-extrabold tracking-tight text-red-500">39,90</span>
                                <span className="text-xl font-normal text-red-500">/Mês</span>
                            </div>
                            <div className="flex items-baseline text-white mb-7 space-x-1">
                                <span className="ml-1 text-xl md:text-2xl font-normal text-blue-500">12x de</span>
                                <span className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-500">R$11,97</span>
                            </div>
                        </div>
                        {buttonPlanoBronze()}
                        <ul role="list" className="space-y-5 mt-7">
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">500 Cadastros de Produtos</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Cadastro de Clientes</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">2 Usuários</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Vendas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Frente de Caixa PDV</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Suporte</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Contas a Pagar e Receber</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Importação XML <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Orçamento <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Ordens de Serviços <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Crediário <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Emissão de notas <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-sm p-4 rounded-lg shadow sm:p-8 bg-white border border-blue-500 transition duration-300 ease-in-out hover:scale-105">
                        <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Prata</h5>
                        <div className="h-28 ">
                            <div className="flex items-baseline line-through decoration-gray-700 text-white">
                                <span className="text-xl font-semibold text-red-500">De R$</span>
                                <span className="text-xl font-extrabold tracking-tight text-red-500">59,90</span>
                                <span className="text-xl font-normal text-red-500">/Mês</span>
                            </div>
                            <div className="flex items-baseline text-white mb-7 space-x-1">
                                <span className="ml-1 text-xl md:text-2xl font-normal text-blue-500">12x de</span>
                                <span className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-500">R$17,97</span>
                            </div>
                        </div>
                        {buttonPlanoPrata()}
                        <ul role="list" className="space-y-5 mt-7">
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">2000 Cadastros de Produtos</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Cadastro de Clientes</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">5 Usuários</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Vendas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Frente de Caixa PDV</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Suporte</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Contas a Pagar e Receber</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Importação XML <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Orçamento <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Ordens de Serviços <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Crediário <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsXCircleFill className="text-gray-600" />
                                <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Emissão de notas <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-sm p-4 rounded-lg shadow sm:p-8 bg-white border border-blue-500 transition duration-300 ease-in-out hover:scale-105">
                        <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Ouro</h5>
                        <div className="h-28 ">
                            <div className="flex items-baseline line-through decoration-gray-700 text-white">
                                <span className="text-xl font-semibold text-red-500">De R$</span>
                                <span className="text-xl font-extrabold tracking-tight text-red-500">99,90</span>
                                <span className="text-xl font-normal text-red-500">/Mês</span>
                            </div>
                            <div className="flex items-baseline text-white mb-7 space-x-1">
                                <span className="ml-1 text-xl md:text-2xl font-normal text-blue-500">12x de</span>
                                <span className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-500">R$29,97</span>
                            </div>
                        </div>
                        {buttonPlanoOuro()}
                        <ul role="list" className="space-y-5 mt-7">
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Cadastro de Produtos Ilimitado</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Cadastro de Clientes</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">10 Usuários</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Vendas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Frente de Caixa PDV</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Suporte</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Contas a Pagar e Receber</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Importação XML <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Orçamento <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Ordens de Serviços <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Crediário <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Emissão de notas <span className="text-base font-normal leading-tight text-green-500">(em breve)</span></span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-sm p-4 rounded-lg shadow sm:p-8 bg-white border border-blue-500 transition duration-300 ease-in-out hover:scale-105">
                        <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Completo</h5>
                        <div className="h-28 ">
                            <div className="flex items-baseline text-white">
                                <span className="ml-1 text-xl md:text-2xl font-normal text-blue-500">Á partir de</span>
                            </div>
                            <div className="flex items-baseline text-white mb-7 space-x-1">
                                <span className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-500">R$139,90<span className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-500">/Mês</span></span>
                            </div>
                        </div>
                        <button onClick={() => window.open("https://cadastrocompleto.apploja.com/", "_blank")} type="button" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center">Saiba Mais</button>
                        <ul role="list" className="space-y-5 mt-7">
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Cadastro de Produtos</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Cadastro de Clientes</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">2 Usuários</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Vendas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Frente de Caixa PDV</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Suporte</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Contas a Pagar e Receber</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Importação XML</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Orçamento</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Ordens de Serviços</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Crediário</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Emissão de notas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Emissão de notas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Loja Virtual</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Agenda</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Aplicativo Android e IOS</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Boleto</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Integração com Ecommerce</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Marketplace</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Relatórios Detalhados</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Avisos Internos</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Impressão de Etiquetas</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">Suporte por telefone e chat</span>
                            </li>
                            <li className="flex items-center space-x-1">
                                <BsCheckCircleFill className="text-blue-500" />
                                <span className="text-base font-normal leading-tight text-black">NF-e / NFS-e / NFC-e / CT-e / MDF-e</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}