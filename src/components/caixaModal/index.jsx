import { useEffect, useState } from "react"
import { BsTrash, BsX } from "react-icons/bs"
import { convertDate, Hora, toDateTime } from "../../services/date"
import { get, post, put, remove } from "../../services/api"
import { LoadingComponent } from "../LoadingComponent"
import { Brl } from "../../services/real"

export const CaixaModal = (props) => {

    const caixaPadrao = {
        valorAbertura: 0,
        status: "Aberto",
        observacao: ""
    }

    const operacaoPadrao = {
        caixaId: '',
        valorPagamento: '',
        formaPagamento: '01',
        tipoOperacao: 'Entrada',
        observacao: '',
        horaPagamento: new Date().toISOString(),
    }

    const [data, setData] = useState(null)
    const [operacoes, setOperacoes] = useState([])
    const [loading, setLoading] = useState(false);
    const [saldo, setSaldo] = useState(null)
    const [novoCaixa, setNovoCaixa] = useState(caixaPadrao)
    const [novaOperacao, setNovaOperacao] = useState(operacaoPadrao)
    const [listaFormasPagamento, setListaFormasPagamento] = useState([])
    const [formasPagamentoOperacao, setFormasPagamentoOperacao] = useState([])

    useEffect(() => {
        if (props.data) {
            setData({
                id: props.data.id,
                hora_abertura: toDateTime(props.data.hora_abertura),
                hora_fechamento: props.data.status === "Fechado" ? new Date(props.data.hora_fechamento).toISOString().slice(0, 16) : null,
                nome_usuario: props.data.nome_usuario,
                observacao: props.data.observacao,
                saldo_final: parseFloat(props.data.saldo_final.toFixed(2)),
                status: props.data.status,
                total_entradas: parseFloat(props.data.total_entradas.toFixed(2)),
                total_saidas: parseFloat(props.data.total_saidas.toFixed(2)),
                usuario_id: props.data.usuario_id,
                valor_abertura: parseFloat(props.data.valor_abertura.toFixed(2)),
                valor_fechamento: parseFloat((props.data.valor_fechamento || props.data.saldo_final).toFixed(2))
            })
            console.log("Data", toDateTime(props.data.hora_abertura))
            props.setvisible('')
            buscaOperacoes(props.data.id)
            setNovaOperacao({
                ...operacaoPadrao,
                caixaId: props.data.id,
            })
            listarFormasPagamento()
        }
    }, [props.data])

    const listarFormasPagamento = async () => {
        try {
            const listaformaspagamento = await get(`${process.env.NEXT_PUBLIC_API_URL}/formaspagamento`)
            setListaFormasPagamento(listaformaspagamento)
        } catch (error) {
            console.error(error)
        }
    }

    const fecharModal = () => {
        setData(null)
        props.setData(null)
        props.setvisible('hidden')
    }

    const buscaOperacoes = async (id) => {
        setLoading(true)
        try {
            const operacoes = await get(`${process.env.NEXT_PUBLIC_API_URL}/operacaocaixa/${id}`)
            setOperacoes(operacoes.operacoes)
            setSaldo(operacoes.saldos[0])
            setFormasPagamentoOperacao(operacoes.formasPagamentoOperacao)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    const fecharCaixa = async (id) => {
        if (data.status !== "Fechado") {
            const fechaCaixa = await put(`${process.env.NEXT_PUBLIC_API_URL}/fecharcaixa/${id}`, {
                valor_abertura: parseFloat(parseFloat(data.valor_abertura).toFixed(2)),
                observacao: data.observacao,
                status: "Fechado",
                valor_fechamento: parseFloat(data.valor_abertura) + parseFloat(saldo.saldo)
            })
            if (fechaCaixa.affectedRows === 1) {
                setData({ ...data, status: "Fechado" })
                alert("Caixa Fechado!!")
                props.setupdate(true)
            }
        }
    }

    const reabrirCaixa = async (id) => {
        if (data.status !== "Aberto") {
            const fechaCaixa = await put(`${process.env.NEXT_PUBLIC_API_URL}/reabrircaixa/${id}`, {
                status: "Aberto"
            })
            if (fechaCaixa.affectedRows === 1) {
                setData({ ...data, status: "Aberto" })
                alert("Caixa Reaberto!!")
                props.setupdate(true)
            }
        }
    }

    const abrirCaixa = async () => {
        setLoading(true)

        const dadosTratados = {
            valorAbertura: novoCaixa.valorAbertura || 0,
            status: "Aberto",
            observacao: novoCaixa.observacao || ""
        }

        try {
            const iniciarcaixa = await post(`${process.env.NEXT_PUBLIC_API_URL}/caixa`, dadosTratados)

            if (iniciarcaixa.insertId) {
                alert("Caixa aberto")
                props.setupdate(true)
                setLoading(false)
                fecharModal()
                setNovoCaixa({
                    valorAbertura: 0,
                    status: "Aberto",
                    observacao: ""
                })
            }
        } catch (error) {
            console.error(error)
        }

    }

    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    const handleValorInicial = (event) => {
        setNovoCaixa({ ...novoCaixa, valorAbertura: parseFloat(event.target.value) })
    }

    const handleNovoCaixa = (event) => {
        setNovoCaixa({ ...novoCaixa, [event.target.name]: event.target.value })
    }

    const handleNovaOperacao = (event) => {
        setNovaOperacao({ ...novaOperacao, [event.target.name]: event.target.value })
    }

    const addNovaOperacao = async () => {

        const operacao = {
            caixaId: props.data.id,
            valorPagamento: parseFloat(novaOperacao.valorPagamento || 0),
            formaPagamento: novaOperacao.formaPagamento || 1,
            tipoOperacao: novaOperacao.tipoOperacao || 'Entrada',
            observacao: novaOperacao.observacao || '',
            horaPagamento: new Date().toISOString(),
        }

        if (data.status === "Aberto") {

            try {
                const novaoperacao = await post(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa`, operacao)

                if (novaoperacao.insertId) {
                    props.setupdate(true)
                    buscaOperacoes(props.data.id)
                    setNovaOperacao({
                        caixaId: props.data.id,
                        valorPagamento: '',
                        formaPagamento: '',
                        tipoOperacao: '',
                        observacao: '',
                        horaPagamento: new Date().toISOString(),
                    })
                }
            } catch (error) {
                console.error(error)
            }

        }

    }

    const deleteOperacao = async (id) => {

        try {

            const deleteoperacao = await remove(`${process.env.NEXT_PUBLIC_API_URL}/deleteoperacao/${id}`)

            if (deleteoperacao.affectedRows === 1) {
                alert("Operação excluida!!")
                props.setupdate(true)
                buscaOperacoes(props.data.id)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const formaPagamentoNome = (id) => {
        const nome = listaFormasPagamento.find((forma) => id === forma.id)
        return nome ? nome.nome : null
    }

    const atualizaCaixa = async () => {

        props.setupdate(true)

        const dadosTratados = {
            hora_abertura: new Date(data.hora_abertura).toUTCString(),
            hora_fechamento: new Date(data.hora_fechamento).toUTCString(),
            status: data.status,
            valor_abertura: parseFloat(parseFloat(data.valor_abertura || 0).toFixed(2)),
            valor_fechamento: parseFloat(parseFloat(data.valor_fechamento || 0).toFixed(2)),
            observacao: data.observacao
        }

        try {
            const update = await put(`${process.env.NEXT_PUBLIC_API_URL}/caixas/${props.data.id}`, dadosTratados)

            if (update.affectedRows === 1) {
                alert('Dados salvos com sucesso')
            }
        } catch (error) {
            console.error(error)
        } finally {
            props.setupdate(false)
        }
    }

    console.log("Caixa", data)

    if (loading) {
        return <LoadingComponent />
    }

    return (
        <div className={`${props.visible} flex flex-col w-full min-h-full absolute z-10 bg-gray-700 bg-opacity-60 items-center p-20 pb-10`}>

            {
                data ? (
                    <>
                        <div className="flex flex-col bg-gray-100 w-full min-h-full rounded-lg">
                            <div className="flex justify-between items-center p-5 bg-gray-300 rounded-t-lg">
                                <h3 className="text-xl font-medium text-gray-700">
                                    Caixa {data && data.id}
                                </h3>
                                <button onClick={fecharModal} type="button" className="text-gray-700 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
                                    <BsX size={24} />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="flex flex-col xl:flex-row justify-between p-5 gap-2 text-gray-700">
                                <div className="flex-1">
                                    <div className="flex flex-col">
                                        <label className="text-gray-700" htmlFor="hora_abertura">Data de abertura:</label>
                                        <input className="p-1" type="datetime-local" value={data.hora_abertura} name="hora_abertura" onChange={handleChange} />
                                    </div>
                                </div>
                                {
                                    data.hora_fechamento && (
                                        <div className="flex-1">
                                            <div className="flex flex-col">
                                                <label className="text-gray-700" htmlFor="hora_abertura">Data de fechamento:</label>
                                                <input className="p-1" type="datetime-local" value={data.hora_fechamento} name="hora_fechamento" onChange={handleChange} />
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="flex-1">
                                    <div className="flex flex-col">
                                        <label className="text-gray-700" htmlFor="valor_abertura">Abertura:</label>
                                        <input className="p-1" name="valor_abertura" type="number" value={data.valor_abertura} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col">
                                        <label className="text-gray-700" htmlFor="status">Status:</label>
                                        <input className="p-1" name="status" type="text" value={data.status} readOnly />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col">
                                        <label className="text-gray-700" htmlFor="valor_fechamento">Fechamento:</label>
                                        <input className="p-1" name="valor_fechamento" type="number" value={data.valor_fechamento} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col h-full justify-end">
                                        {data.status === "Fechado" ? (
                                            <button onClick={() => reabrirCaixa(data.id)} className="bg-green-500 px-4 py-1 hover:bg-green-400 cursor-pointer text-white uppercase">Reabrir caixa</button>
                                        ) : (
                                            <button onClick={() => fecharCaixa(data.id)} className="bg-red-500 px-4 py-1 hover:bg-red-400 cursor-pointer text-white uppercase">Fechar caixa</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="px-5">
                                <button onClick={atualizaCaixa} className="bg-green-500 px-4 py-1 hover:bg-green-400 cursor-pointer text-white uppercase">Salvar</button>
                            </div>
                            <div className="flex flex-col p-5">
                                <label className="text-gray-700" htmlFor="observacao">Observação:</label>
                                <textarea className="p-1" type="text" name="observacao" defaultValue={data.observacao} />
                            </div>


                            {
                                data.status === "Aberto" && (
                                    <div className="flex flex-col w-full p-5">
                                        <div className="flex flex-col lg:flex-row gap-2">
                                            <div className="flex-1">
                                                <div className="flex flex-col">
                                                    <label className="text-gray-700" htmlFor="valorPagamento">Valor:</label>
                                                    <input className="p-1" type="number" name="valorPagamento" defaultValue={novaOperacao.valorPagamento} onChange={(event) => setNovaOperacao({ ...novaOperacao, valorPagamento: parseFloat(event.target.value) })} />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col">
                                                    <label htmlFor="formaPagamento" className="text-gray-700">Forma de Pagamento:</label>
                                                    <select className="p-1" name="formaPagamento" defaultValue={novaOperacao.formaPagamento} onChange={handleNovaOperacao}>
                                                        {
                                                            listaFormasPagamento && listaFormasPagamento.map((forma, i) => (
                                                                <option key={i} value={forma.id}>{forma.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col">
                                                    <label htmlFor="tipoOperacao" className="text-gray-700">Tipo:</label>
                                                    <select className="p-1 rounded-none" name="tipoOperacao" defaultValue={novaOperacao.tipoOperacao} onChange={handleNovaOperacao}>
                                                        <option value="Entrada">Entrada</option>
                                                        <option value="Saida">Saida</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col">
                                                    <label htmlFor="observacao" className="text-gray-700">Observação:</label>
                                                    <input type="text" className="p-1" name="observacao" defaultValue={novaOperacao.observacao} onChange={handleNovaOperacao} />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col h-full justify-end">
                                                    <button className="bg-green-500 px-4 py-1 hover:bg-green-400 cursor-pointer text-white uppercase" onClick={addNovaOperacao}>Adicionar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }


                            {
                                operacoes.length > 0 && (
                                    <div className="flex flex-col mt-5 overflow-x-auto w-full max-h-[500px] p-5">
                                        <h1 className="font-bold text-gray-700">Operações do Caixa</h1>

                                        <table className="w-full border-collapse border border-slate-600">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-300">
                                                <tr>
                                                    <th scope="col" className="py-3 px-6 border border-slate-600">Hora</th>
                                                    <th scope="col" className="text-center hidden py-3 px-6 sm:table-cell border border-slate-600">Tipo</th>
                                                    <th scope="col" className="text-center hidden py-3 px-6 sm:table-cell border border-slate-600">Tipo de Pagamento</th>
                                                    <th scope="col" className="py-3 px-6 border border-slate-600">Valor</th>
                                                    <th scope="col" className="text-center hidden py-3 px-6 sm:table-cell border border-slate-600">Observacao</th>
                                                    <th scope="col" className="py-3 px-6 border border-slate-600">Açao</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    operacoes.map((operacao, i) => (
                                                        <tr key={i} className="hover:bg-gray-200">
                                                            <td className="py-4 px-6 font-medium border border-slate-600 text-center">{Hora(operacao.hora_pagamento)}</td>
                                                            <td className="py-4 px-6 font-medium border border-slate-600">{operacao.tipo_operacao}</td>
                                                            <td className="py-4 px-6 font-medium border border-slate-600">{formaPagamentoNome(operacao.forma_pagamento_id)}</td>
                                                            <td className="py-4 px-6 font-medium border border-slate-600 text-right">{Brl(operacao.valor_pagamento)}</td>
                                                            <td className="py-4 px-6 font-medium border border-slate-600">{operacao.observacao}</td>
                                                            <td className="py-4 px-6 font-medium border border-slate-600 text-center">
                                                                <button className="text-gray-700" onClick={() => deleteOperacao(operacao.id)}><BsTrash /></button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                            <tfoot>
                                                {
                                                    saldo && (<>
                                                        <tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td className="py-4 px-6 font-medium">Entradas: {Brl(saldo.total_entradas)}</td>
                                                            <td className="py-4 px-6 font-medium">Saidas: {Brl(saldo.total_saidas)}</td>
                                                            <td className="py-4 px-6 font-medium">Total: {Brl(saldo.saldo)}</td>
                                                        </tr>

                                                        {
                                                            formasPagamentoOperacao && formasPagamentoOperacao.map((item, i) => (
                                                                <tr key={i}>
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td className="px-6 font-medium">{item.nome}: {Brl(item.valor_pagamento)}</td>
                                                                    <td></td>
                                                                    <td></td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </>)
                                                }
                                            </tfoot>
                                        </table>
                                    </div>
                                )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col bg-gray-100 w-11/12 md:w-[400px] h-auto rounded-lg">
                        <div className="flex justify-between items-center p-5 bg-gray-300 rounded-t-lg">
                            <h3 className="text-xl font-medium text-gray-700">
                                Caixa {data && data.id}
                            </h3>
                            <button onClick={fecharModal} type="button" className="text-gray-700 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
                                <BsX size={24} />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="flex flex-col lg:flex-col p-5 gap-2">
                            <div className="flex flex-col">
                                <label className="text-gray-700" htmlFor="valor_abertura">Abertura:</label>
                                <input className="p-1" name="valorAbertura" min={0} type="number" defaultValue={novoCaixa.valorAbertura} onChange={handleValorInicial} />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700" htmlFor="status">Observação:</label>
                                <textarea className="p-1" name="observacao" type="text" value={novoCaixa.observacao} onChange={handleNovoCaixa} />
                            </div>
                            <div className="flex flex-col">
                                <button onClick={abrirCaixa} className="bg-green-500 px-4 py-1 hover:bg-green-400 cursor-pointer text-white uppercase">Abrir caixa</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}