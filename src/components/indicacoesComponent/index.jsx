import { useEffect, useState } from 'react';
import { utcStringToDateLocal } from '../../services/date';
import { BsLink, BsWhatsapp } from 'react-icons/bs';
import { useEmpresa } from '../../context/empresaContext';
import { get, post } from '../../services/api';

export const IndicacoesComponent = () => {

    const { empresa } = useEmpresa()

    const [urlEncurtada, setUrlEncurtada] = useState("")
    const [listaIndicacoes, setListaIndicacoes] = useState([])
    const [totalIndicacoes, setTotalIndicacoes] = useState(0)
    const [totalAprovados, setTotalAprovados] = useState(0)
    const [totalPendente, setTotalPendente] = useState(0)

    useEffect(() => {
        buscarIndicacoes()
        encurtarUrl(`https://app.apploja.com/cadastro?indicacao=${empresa.id}&utm_campanha=indicacao`)
    }, [empresa.id])

    const planos = [
        { nome: "Bronze", indicacoes: 5, cor: "border-yellow-600", features: ['500 produtos', '2 usuarios'], link: `https://apploja.com/pay/assets/checkout/?sistema=web_bronze&empresa_web=${empresa.id}`, id: 2 },
        { nome: "Prata", indicacoes: 10, cor: "border-gray-400", features: ['2000 produtos', '5 usuarios'], link: `https://apploja.com/pay/assets/checkout/?sistema=web_prata&empresa_web=${empresa.id}`, id: 3 },
        { nome: "Ouro", indicacoes: 20, cor: "border-yellow-400", features: ['5000 produtos', '10 usuarios'], link: `https://apploja.com/pay/assets/checkout/?sistema=web_ouro&empresa_web=${empresa.id}`, id: 4 },
    ];

    const buscarIndicacoes = async () => {

        const { indicacoes, total } = await get(`${process.env.NEXT_PUBLIC_API_URL}/indicacoes`)

        setTotalIndicacoes(total)
        setListaIndicacoes(indicacoes)

        setTotalAprovados(indicacoes.reduce((acc, item) => {
            if (item.status === "Aprovado") {
                return acc += 1
            }
            return acc
        }, 0))

        setTotalPendente(indicacoes.reduce((acc, item) => {
            if (item.status === "Pendente") {
                return acc += 1
            }
            return acc
        }, 0))

    }

    const copiaParaClipBoard = (link) => {
        navigator.clipboard.writeText(link)
            .then(() => alert('Copiado para area de tranferência'))
    }

    const encurtarUrl = async (url) => {
        try {
            const response = await fetch(`https://urlenc.link/api/url`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: url })
            })

            const content = await response.json()

            setUrlEncurtada(content.url)
        } catch (error) {
            console.error(error)
        }
    }

    const ativarPlano = async (id) => {
        const response = await post(`${process.env.NEXT_PUBLIC_API_URL}/ativarplanoporindicacao`, { id })

        if (response.message) {
            alert(response.message)
        }
    }

    const texto = encodeURIComponent(`
         Ei! Conhece o Apploja?
        
        É um sistema de gestão (ERP) feito sob medida pra pequenos e médios negócios!
        
        Com ele, você pode:
            Cadastrar produtos e clientes
            Emitir notas fiscais
            Controlar vendas e estoque
            Tudo online, simples e rápido!
        
        Se cadastra aqui e testa grátis: ${urlEncurtada}
    `);

    const whatsappUrl = `https://wa.me/?text=${texto}`;

    return (
        <div className="flex flex-col items-center py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Planos de Indicação</h1>

            {/* Planos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
                {planos.map((plano) => (
                    <div
                        key={plano.nome}
                        className={`border-2 ${plano.cor} rounded-lg shadow-md p-6 flex flex-col items-center bg-white`}
                    >
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">{plano.nome}</h2>
                        <p className="text-4xl font-bold text-blue-600 mb-4">
                            {plano.indicacoes} indicações
                        </p>
                        <ul className="flex flex-col w-full text-gray-500 mb-6 text-sm">
                            {
                                plano.features.map((feature, i) => (
                                    <li key={i}>✔ {feature}</li>
                                ))
                            }
                        </ul>
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => ativarPlano(plano.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:hover:bg-blue-400 text-sm" disabled={totalAprovados < plano.indicacoes}>
                                Ativar Plano
                            </button>
                            <a href={plano.link} target='_blank' rel="noreferrer" className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm">
                                Assinar
                            </a>
                            <button className="text-blue-600 underline text-sm">Ver Mais</button>
                        </div>
                    </div>
                ))}
            </div>

            {/*Link de para indicação */}
            <div className="w-full bg-gray-50 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Seu link de indicação:</h2>
                <div className="flex gap-4">
                    <button onClick={() => copiaParaClipBoard(urlEncurtada)} className="flex gap-1 text-blue-700 underline text-sm"><BsLink size={20} />{urlEncurtada}</button>
                    <a className='text-blue-700' href={whatsappUrl} target='_blank' rel="noreferrer"><BsWhatsapp /></a>
                </div>
            </div>

            {/* Resumo de Indicações */}
            <div className="w-full bg-gray-50 rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Resumo de Indicações</h2>
                <div className="flex justify-between text-gray-600 text-sm">
                    <p><strong>Total realizadas:</strong> {totalIndicacoes}</p>
                    <p><strong>Total aprovados:</strong> {totalAprovados}</p>
                    <p><strong>Pendentes:</strong> {totalPendente}</p>
                </div>
            </div>

            {/* Lista de Indicações */}
            <div className="w-full bg-gray-50 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Minhas Indicações</h2>
                {
                    listaIndicacoes.length === 0 && (
                        <h1 className='text-center text-gray-700'>Nenhuma indicação</h1>
                    )
                }
                {
                    listaIndicacoes.length > 0 && (
                        <table className="w-full table-auto text-sm text-left text-gray-600">

                            <thead>
                                <tr className="border-b">
                                    <th className="pb-2">Nome</th>
                                    <th className="pb-2">Data</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaIndicacoes.map((ind, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="py-2">{ind.nome}</td>
                                        <td className="py-2">{utcStringToDateLocal(ind.data)}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded text-white text-xs ${ind.status === "Pendente" ? "bg-yellow-500" : ind.status === "Aprovada" ? "bg-blue-500" : "bg-green-500"}`}>
                                                {ind.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
            </div>
        </div>
    )
}