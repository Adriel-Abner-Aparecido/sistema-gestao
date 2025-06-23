import { useEffect, useState } from "react";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { get, put } from "../../services/api";
import { useRouter } from "next/router";
import { LoadingComponent } from "../LoadingComponent";
import { useEmpresa } from "../../context/empresaContext";
import { PlanCard } from '../../ui/card/plan-card';
import { ButtonAssignPlan } from "../../ui/button/buttonAssignPlan";
import { ButtonAtualPlan } from "../../ui/button/buttonAtualPlan";
import { ButtonRenewPlan } from "../../ui/button/buttonRenewPlan";
import { utcStringToDateLocal } from "../../services/date";

export const PlanosComponent = () => {

    const router = useRouter()

    var localEmpresa = typeof window !== 'undefined' ? localStorage.getItem('applojaweb_user_empresa') : null;

    const [idEmpresa, setIdEmpresa] = useState(localEmpresa);
    const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)
    const [loading, setLoading] = useState(false)
    const [plano, setPlano] = useState(1)
    const [renovar, setRenovar] = useState(false)

    const { empresa } = useEmpresa();

    useEffect(() => {
        setLoading(true)
        if (empresa) {
            setLoading(false)
            setPlano(empresa.planoId)
            setRenovar(Boolean(empresa.inativo) && empresa.dias_para_expirar <= 18)
        }
    }, [empresa])

    const downGradePlanoGratuito = async () => {

        if (empresa.planoId !== 1) {

            const novoPlano = {
                ...empresa,
                planoId: 1
            }
            try {
                const downgrade = await put(`${process.env.NEXT_PUBLIC_API_URL}/empresas/${empresa.id}`, novoPlano)
                if (downgrade.affectedRows == 1) {
                    alert("Plano alterado com sucesso")
                    localStorage.removeItem("applojaweb_token");
                    router.push('/login')
                }
            } catch (error) {
                console.error(error)
            }

        }

    }

    if (loading) {
        return <LoadingComponent />
    } else {

        return (
            <div className="w-full px-5">
                <div className="flex flex-col md:flex-wrap bg-gray-200 w-full p-8 mb-4 rounded md:flex-row md:justify-between gap-8">
                    <div className="flex-1 flex justify-center">
                        <PlanCard>
                            <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Gratuito</h5>
                            <div className="h-28 w-60">
                            </div>
                            {plano === 1 ? <ButtonAtualPlan /> : <ButtonAssignPlan onClick={() => setPopUpConfirmacao(true)} />}
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
                                    <span className="text-base font-normal leading-tight text-black">Contas a Pagar e Receber</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsCheckCircleFill className="text-blue-500" />
                                    <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsXCircleFill className="text-gray-600" />
                                    <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Suporte Básico</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsXCircleFill className="text-gray-600" />
                                    <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Emissão de notas</span>
                                </li>
                            </ul>
                        </PlanCard>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <PlanCard>
                            <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Bronze</h5>
                            <div className="h-28">
                                <div className="flex items-baseline text-white flex-wrap">
                                    <span className="text-3xl md:text-3xl font-extrabold tracking-tight text-blue-500 ml-1">R$ 49,90<span className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-500">/Ano</span></span>
                                    <span className="text-xl font-semibold text-blue-500 ml-1">no PIX ou Cartão</span>
                                </div>
                                
                            </div>
                            {
                                plano === 2 ? renovar ?
                                    <ButtonRenewPlan onClick={() => window.open("https://apploja.com/pay/assets/checkout/?sistema=web_bronze&empresa_web=" + idEmpresa + "", "_blank")} /> :
                                    <ButtonAtualPlan /> :
                                    <ButtonAssignPlan onClick={() => window.open("https://apploja.com/pay/assets/checkout/?sistema=web_bronze&empresa_web=" + idEmpresa + "", "_blank")} />
                            }
                            {
                                plano === 2 &&
                                <div className="flex flex-row items-center p-1 text-center">
                                    <span className="flex-1 text-[0.65rem]">valido até {utcStringToDateLocal(empresa.validade_plano)}</span>
                                </div>
                            }
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
                                    <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsCheckCircleFill className="text-blue-500" />
                                    <span className="text-base font-normal leading-tight text-black">Suporte Básico</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsXCircleFill className="text-gray-600" />
                                    <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Emissão de notas</span>
                                </li>
                            </ul>
                        </PlanCard>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <PlanCard>
                            <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Prata</h5>
                            <div className="h-28 ">
                                <div className="flex items-baseline text-white flex-wrap">
                                    <span className="text-3xl md:text-3xl font-extrabold tracking-tight text-blue-500 ml-1">R$ 99,90<span className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-500">/Ano</span></span>
                                    <span className="text-xl font-semibold text-blue-500 ml-1">no PIX ou Cartão</span>
                                </div>
                                
                            </div>
                            {
                                plano === 3 ? renovar ?
                                    <ButtonRenewPlan onClick={() => window.open("https://apploja.com/pay/assets/checkout/?sistema=web_prata&empresa_web=" + idEmpresa + "", "_blank")} /> :
                                    <ButtonAtualPlan /> :
                                    <ButtonAssignPlan onClick={() => window.open("https://apploja.com/pay/assets/checkout/?sistema=web_prata&empresa_web=" + idEmpresa + "", "_blank")} />
                            }
                            {
                                plano === 3 &&
                                <div className="flex flex-row items-center p-1 text-center">
                                    <span className="flex-1 text-[0.65rem]">valido até {utcStringToDateLocal(empresa.validade_plano)}</span>
                                </div>
                            }
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
                                    <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsCheckCircleFill className="text-blue-500" />
                                    <span className="text-base font-normal leading-tight text-black">Suporte Básico</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsXCircleFill className="text-gray-600" />
                                    <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Emissão de notas</span>
                                </li>
                            </ul>
                        </PlanCard>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <PlanCard>
                            <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Ouro</h5>
                            <div className="h-28 ">
                                <div className="flex items-baseline text-white flex-wrap">
                                    <span className="text-3xl md:text-3xl font-extrabold tracking-tight text-blue-500 ml-1">R$ 199,90<span className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-500">/Ano</span></span>
                                    <span className="text-xl font-semibold text-blue-500 ml-1">no PIX ou Cartão</span>
                                </div>
                                
                            </div>
                            {
                                plano === 4 ? renovar ?
                                    <ButtonRenewPlan onClick={() => window.open("https://apploja.com/pay/assets/checkout/?sistema=web_ouro&empresa_web=" + idEmpresa + "", "_blank")} /> :
                                    <ButtonAtualPlan /> :
                                    <ButtonAssignPlan onClick={() => window.open("https://apploja.com/pay/assets/checkout/?sistema=web_ouro&empresa_web=" + idEmpresa + "", "_blank")} />
                            }
                            {
                                plano === 4 &&
                                <div className="flex flex-row items-center p-1 text-center">
                                    <span className="flex-1 text-[0.65rem]">valido até {utcStringToDateLocal(empresa.validade_plano)}</span>
                                </div>
                            }
                            <ul role="list" className="space-y-5 mt-7">
                                <li className="flex items-center space-x-1">
                                    <BsCheckCircleFill className="text-blue-500" />
                                    <span className="text-base font-normal leading-tight text-black">5000 Cadastros de Produtos</span>
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
                                    <span className="text-base font-normal leading-tight text-black">Controle de Estoque</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsCheckCircleFill className="text-blue-500" />
                                    <span className="text-base font-normal leading-tight text-black">Suporte Básico</span>
                                </li>
                                <li className="flex items-center space-x-1">
                                    <BsXCircleFill className="text-gray-600" />
                                    <span className="text-base font-normal leading-tight text-black line-through decoration-gray-500">Emissão de notas</span>
                                </li>
                            </ul>
                        </PlanCard>
                    </div>
                    {/* <div className="flex-1 flex justify-center">
                        <PlanCard>
                            <h5 className="mb-4 text-2xl font-bold text-blue-500">Plano Completo</h5>
                            <div className="h-28 ">
                                <div className="flex items-baseline text-white">
                                    <span className="ml-1 text-xl md:text-2xl font-normal text-blue-500">Á partir de</span>
                                </div>
                                <div className="flex items-baseline text-white mb-7 space-x-1">
                                    <span className="text-3xl md:text-5xl font-extrabold tracking-tight text-blue-500">R$149,90<span className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-500">/Mês</span></span>
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
                        </PlanCard>
                    </div> */}
                </div>
                <div className={popUpConfirmacao ? "fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
                    <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-xl w-full flex flex-col gap-4">
                        <h1 className="text-3xl text-gray-700 text-center">Atenção voce esta prestes a mudar para o plano gratuito</h1>
                        <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
                        <div className="flex flex-row gap-4">
                            <button onClick={downGradePlanoGratuito} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                            <button onClick={() => setPopUpConfirmacao(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}