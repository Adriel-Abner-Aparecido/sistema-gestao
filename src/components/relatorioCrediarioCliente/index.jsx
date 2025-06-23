import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Brl } from '../../services/real';
import { utcStringToDateLocal } from '../../services/date';
import { BsCaretDownFill, BsCaretUpFill, BsX } from 'react-icons/bs';

export const RelatorioCrediarioCliente = () => {
    const [hiddenTable, setHiddenTable] = useState('hidden');
    const [listaCrediario, setListaCrediario] = useState([]);
    const [totalQuantidade, setTotalQuantidade] = useState(0);
    const [totalValor, setTotalValor] = useState(0);
    const [listaClientes, setListaCLientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [clienteDaBusca, setClienteDaBusca] = useState('');
    const [sortDirection, setSortDirection] = useState("desc");
    const [orderer, setOrderer] = useState("data_vencimento")

    const timeOut = useRef()

    const gerarRelatorio = () => {

        if (clienteSelecionado) {

            get(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/cliente/${clienteSelecionado.id}`).then((res) => {
                if (res.mensagem) {
                    if (res.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {

                    const crediariocompleto = res.crediario.map((item) => ({
                        ...item,
                        status: item.valor_pago >= item.valor_a_receber ? "Pago" : "Aberto"
                    }))

                    setListaCrediario(crediariocompleto)
                    setTotalQuantidade(res.parcelas)
                    setTotalValor(res.total_a_receber)
                    setHiddenTable("")
                }
            })

        } else {
            alert('Selecione um cliente');
        }
    }

    const gerarExcel = () => {

        if (clienteSelecionado) {

            get(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/cliente/${clienteSelecionado.id}`).then((res) => {
                if (res.mensagem) {
                    if (res.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {
                    if (res.length != 0) {
                        // cria uma nova planilha
                        const wb = XLSX.utils.book_new();
                        const dataAgora = new Date();

                        // Cria uma nova lista baseada na lista original, incluindo apenas as propriedades desejadas
                        const vendasParaExcel = res.crediario.map(res => ({
                            Data_Vencimento: utcStringToDateLocal(res.data_vencimento),
                            Cliente: res.nome_cliente,
                            Celular: res.celular,
                            Data_da_Venda: utcStringToDateLocal(res.data_venda),
                            Venda: res.venda_id,
                            Valor_da_Parcela: res.valor_a_receber
                        }));

                        const quantidadeTotal = res.parcelas
                        const valorTotal = res.total_a_receber

                        vendasParaExcel.push({
                            Data_da_Venda: "TOTAL",
                            Venda: quantidadeTotal,
                            Valor_da_Parcela: valorTotal,
                        })

                        // converte os dados para o formato de planilha
                        const ws = XLSX.utils.json_to_sheet(vendasParaExcel);

                        // adiciona a planilha ao livro de trabalho
                        XLSX.utils.book_append_sheet(wb, ws, "Vendas Por Produtos");

                        // exporta o livro de trabalho
                        XLSX.writeFile(wb, "lucro_por_produtos_" + formatDate(dataAgora) + ".xlsx");
                    }
                }
            })
        } else {
            alert('Selecione um cliente')
        }
    }

    function formatDate(inputString) {
        // Converte a string de entrada em um objeto Date
        let date = new Date(inputString);

        // Extrai o dia, mês e ano
        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();

        // Retorna a data formatada como uma string no formato DD:MM:YYYY
        return `${day}/${month}/${year}`;
    }

    const buscaCliente = async (value) => {

        if (value === '') {
            setListaCLientes([])
            return
        }

        try {

            const clientes = await get(`${process.env.NEXT_PUBLIC_API_URL}/clientenomecpf/${value}`)

            if (clientes) {
                setListaCLientes(clientes)
            }

        } catch (error) {
            console.error(error)
        }

    }

    const handleBuscaCliente = (event) => {

        setClienteDaBusca(event.target.value)

        if (timeOut.current) {
            clearTimeout(timeOut.current)
        }

        timeOut.current = setTimeout(() => {
            buscaCliente(event.target.value)
        }, 1000)
    }

    const handleSelecionarCliente = (cliente) => {

        setClienteDaBusca(cliente.nome)
        setClienteSelecionado(cliente)
        setListaCLientes([])

    }

    const orderBy = (order) => {
        const newDirection = sortDirection === "asc" ? "desc" : "asc";

        const sortedList = [...listaCrediario].sort((a, b) => {
            if (typeof a[order] === "string") {
                return newDirection === "asc"
                    ? a[order].localeCompare(b[order])
                    : b[order].localeCompare(a[order]);
            }
            return newDirection === "asc" ? a[order] - b[order] : b[order] - a[order];
        });

        setOrderer(order)
        setListaCrediario(sortedList);
        setSortDirection(newDirection);
    };

    const limpaBusca = () => {
        setClienteDaBusca('')
        setClienteSelecionado(null)
        setListaCrediario([])
        setTotalQuantidade(0)
        setTotalValor(0)
        setHiddenTable("hidden")
    }

    console.log(listaCrediario)

    return (
        <div id="medium-modal" className="w-full h-modal sm:h-auto">
            <div className="relative py-4 w-full h-full sm:h-auto">
                <div className="relative rounded shadow border bg-gray-200">
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Relatorio de crediario
                        </h3>
                    </div>
                    <div className="px-2 py-4 md:p-6 flex flex-row gap-4">
                        <div className="relative w-full">
                            <label htmlFor='busca-cliente' className="block mb-2 text-sm font-medium text-gray-700">Cliente</label>
                            <div className="flex gap-4">
                                <input name='busca-cliente' type="text" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300" value={clienteDaBusca} onChange={handleBuscaCliente} required /><button type='button' className='bg-gray-400 w-10 flex items-center justify-center rounded-lg' onClick={limpaBusca}><BsX className='' /></button>
                            </div>
                            {
                                listaClientes.length > 0 && (
                                    <div className="flex flex-col w-full bg-white absolute left-0 rounded-lg border border-black mt-2">
                                        {
                                            listaClientes && listaClientes.map((cliente, i) => (
                                                <button key={i} className='rounded-lg cursor-pointer flex w-full p-4 hover:bg-gray-200' onClick={() => handleSelecionarCliente(cliente)}>{cliente.nome}</button>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end p-6 space-x-2 rounded-b">
                        <button onClick={gerarRelatorio} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Relatório</button>
                        <button onClick={gerarExcel} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Excel</button>
                    </div>
                </div>
            </div>
            <div className={hiddenTable + " pt-4 pb-12 w-full overflow-auto"}>
                <table className="w-full text-left border-collapse table-auto rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('data_vencimento', 'desc')}>Data Vencimento <button type='button'>{orderer === "data_vencimento" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('nome_cliente', 'desc')}>Cliente <button type='button' >{orderer === "nome_cliente" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('celular', 'desc')}>Celular <button type='button'>{orderer === "celular" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('data_venda', 'desc')}>Data Venda <button type='button'>{orderer === "data_venda" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('venda_id', 'desc')}>Venda <button type='button'>{orderer === "venda_id" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('valor_a_receber', 'desc')}>Valor <button type='button'>{orderer === "valor_a_receber" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('status', 'desc')}>Status <button type='button'>{orderer === "status" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listaCrediario.map((data, index) => (
                                <tr key={index} className={index % 2 && 'bg-gray-100'}>
                                    <td className="border px-4 py-2">{utcStringToDateLocal(data.data_vencimento.replace("Z", ""))}</td>
                                    <td className="border px-4 py-2">{data.nome_cliente}</td>
                                    <td className="border px-4 py-2">{data.celular}</td>
                                    <td className="border px-4 py-2">{utcStringToDateLocal(data.data_venda)}</td>
                                    <td className="border px-4 py-2"><a className='hover:underline' href={`/newPdv/${data.venda_id}`} target='_blank' rel="noreferrer" >{data.venda_id}</a></td>
                                    <td className="border px-4 py-2">{Brl(data.valor_a_receber)}</td>
                                    <td className="border px-4 py-2">{data.status}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200">
                            <th className='border px-4 py-2'></th>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">{totalQuantidade}</th>
                            <th className="border px-4 py-2">{Brl(totalValor)}</th>
                            <th className="border px-4 py-2"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}