import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { get } from "../../../services/api"
import { utcStringToDateLocal } from "../../../services/date"
import { EmpresaProvider } from "../../../context/empresaContext"
import { AuthProvider } from "../../../context"


export default function CarneCrediario() {

    const route = useRouter()

    const { pedido } = route.query

    const [dados, setDados] = useState([])
    const [dataVenda, setDataVenda] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        buscaPedido()
    }, [pedido])

    const buscaPedido = async () => {
        setLoading(true)
        try {

            const { venda, contaReceber } = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendas/${pedido}`)

            setDados(contaReceber)
            setDataVenda(venda[0])

            console.log(contaReceber)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

    }

    const qtdCarnes = () => {

        if (!Array.isArray(dados)) {
            console.error("Erro: 'dados' não é um array válido.");
            return 0;
        }

        const qtdcarnes = dados.filter((carne) => carne.valor_pago === null)
        return qtdcarnes.length
    }

    if (loading) {
        return (<>
            carregando...
        </>)
    }

    const verificacarnes = dados.filter((carne) => carne.valor_pago === null)

    if (verificacarnes.length === 0) {
        return (
            <div className="flex flex-col w-[1000px] h-screen mx-auto gap-8 justify-center items-center">
                <p className="text-2xl font-bold">Não há carnês disponiveis para esta Venda.</p>
            </div>
        )
    }

    const intervalo = 4

    return (

        <AuthProvider>
            <EmpresaProvider>

                <div className="flex flex-col w-[1000px] mx-auto gap-8">

                    {
                        dados && dados.map((carne, i) => (

                            carne.valor_pago === null &&

                            <div key={i} className={`flex flex-row text-[12px] h-[25%] border-r-2 border-l-2 border-black ${i !== 0 && i % intervalo === 0 ? 'break-before-page' : ''
                                }`}>
                                <div className="flex flex-col border-t-2 border-b-2 border-black w-1/5">
                                    <div className="flex flex-col w-full border-black border-r-2 border-dashed">
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-full border-r-2 border-black p-3 text-center">
                                                <p>Parcela</p>
                                                <span>{i}/{qtdCarnes()}</span>
                                            </div>
                                            <div className="flex flex-col p-3 w-full">
                                                <p>Vencimento</p>
                                                <span className="font-bold">{utcStringToDateLocal(carne.data_vencimento)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-full px-3 border-t-2 border-black">
                                                <p>(=) Valor do Documento</p>
                                                <span className="text-right font-bold">{carne.valor.toFixed(2).replace('.', ',')}</span>
                                            </div>

                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex w-full flex-col px-3 border-t-2 border-black">
                                                <p>(-) Abatimento</p>
                                                <span className="text-right">0,00</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-full px-3 border-t-2 border-black">
                                                <p>(+) Juros / Multa</p>
                                                <span className="text-right">0,00</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-full px-3 border-t-2 border-black">
                                                <p>(+) Outros Acréscimos</p>
                                                <span className="text-right">0,00</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-full px-3 border-t-2 border-black">
                                                <p>(=) Valor Cobrado</p>
                                                <span className="text-right">0,00</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-full px-3 border-t-2 border-black">
                                                <p>Numero Documento</p>
                                                <span className="text-right font-bold">{carne.venda_id}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col w-full px-3 border-t-2 border-black">
                                                <p>Beneficiario</p>
                                                <span className="text-right">{dataVenda.nome_cliente}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col border-t-2 border-b-2 border-black w-4/5">
                                    <div className="flex flex-row border-b-2 border-black">
                                        <div className="flex-1 p-3 border-black">
                                            <p>Local de Pagamento</p>
                                            <span className="text-right"></span>
                                        </div>
                                        <div className="flex flex-col p-3 border-l-2 border-black">
                                            <p>Vencimento</p>
                                            <span className="text-right font-bold">{utcStringToDateLocal(carne.data_vencimento)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row border-b-2 border-black">
                                        <div className="flex-1 px-3 border-black">
                                            <p>Cedente</p>
                                            <span className="text-right"></span>
                                        </div>
                                        <div className="flex flex-col px-3 border-l-2 border-black">
                                            <p>(=) Valor do Documento</p>
                                            <span className="text-right font-bold">{carne.valor.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row border-b-2 border-black">
                                        <div className="flex-1 px-3">
                                            <div className="flex flex-row">
                                                <div className="flex-1 px-3 text-center">
                                                    <p>Data Documento</p>
                                                    <span className="text-right">{utcStringToDateLocal(carne.created_at)}</span>
                                                </div>
                                                <div className="flex-1 px-3 text-center">
                                                    <p>Numero Documento</p>
                                                    <span className="text-right font-bold">{carne.venda_id}</span>
                                                </div>
                                                <div className="flex-1 px-3 text-center">
                                                    <p>Especie Doc</p>
                                                    <span className="text-right">Boleto</span>
                                                </div>
                                                <div className="flex-1 px-3 text-center">
                                                    <p>Data Processamento</p>
                                                    <span className="text-right">{utcStringToDateLocal(carne.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col px-3 border-l-2 border-black">
                                            <p>(-) Abatimento</p>
                                            <span className="text-right font-bold">0,00</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row border-b-2 border-black">
                                        <div className="flex-1 px-3">
                                            <div className="flex flex-row">
                                                <div className="flex-1">
                                                    <p className="uppercase">Todas as informações deste carnê são de exclusiva responsabilidade do cedente</p>
                                                    <span className="text-right"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex flex-col px-3 border-l-2 border-black">
                                                <p>(+) Mora / Juros</p>
                                                <span className="text-right font-bold">0,00</span>
                                            </div>
                                            <div className="flex flex-col px-3 border-l-2 border-t-2 border-black">
                                                <p>(-) Outras Acrescimo</p>
                                                <span className="text-right font-bold">0,00</span>
                                            </div>
                                            <div className="flex flex-col px-3 border-l-2 border-t-2 border-black">
                                                <p>(=) Valor Cobrado</p>
                                                <span className="text-right font-bold">0,00</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row border-black">
                                        <div className="flex flex-col">
                                            <div className="flex-1 px-3">
                                                <p>Sacado</p>
                                                <span className="text-right font-bold">{dataVenda.nome_cliente}</span>
                                            </div>
                                            <div className="flex-1 px-3">
                                                <p>Endereço</p>
                                                <span className="text-right">{`${dataVenda.rua_cliente} ${dataVenda.numero_cliente}, ${dataVenda.bairro_cliente}, ${dataVenda.cidade_cliente} - ${dataVenda.uf_cliente}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </EmpresaProvider>
        </AuthProvider>
    )
}