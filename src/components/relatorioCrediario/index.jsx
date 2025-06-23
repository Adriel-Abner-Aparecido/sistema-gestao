import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Brl } from '../../services/real';
import { getPrimeiroDiaDoMesAtual, getUltimoDiaDoMesAtual, utcStringToDateLocal } from '../../services/date';

export const RelatorioCrediario = () => {
    const [hiddenTable, setHiddenTable] = useState('hidden');
    const [listaCrediario, setListaCrediario] = useState([]);
    const [totalQuantidade, setTotalQuantidade] = useState(0);
    const [totalValor, setTotalValor] = useState(0);
    const [filtros, setFiltros] = useState({
        nomeCliente: "",
        status: "",
        dataInicio: "",
        dataFim: "",
        idVenda: "",
    })
    const [dadosFiltrados, setDadosFiltrados] = useState(listaCrediario)
    const [dataInicio, setDataInicio] = useState(() => getPrimeiroDiaDoMesAtual())
    const [dataFinal, setDataFinal] = useState(() => getUltimoDiaDoMesAtual())

    useEffect(() => {

        let dadosFiltrados = [...listaCrediario];

        // Filtra pelo nome do cliente
        if (filtros.nomeCliente) {
            dadosFiltrados = dadosFiltrados.filter((item) =>
                item.nome_cliente.toLowerCase().includes(filtros.nomeCliente.toLowerCase())
            );
        }

        // Filtra pelo status
        if (filtros.status) {
            dadosFiltrados = dadosFiltrados.filter((item) => item.status === filtros.status);
        }

        // Filtra por ID de venda
        if (filtros.idVenda) {
            dadosFiltrados = dadosFiltrados.filter((item) => item.venda_id.toString() === filtros.idVenda);
        }

        // Filtra por intervalo de datas
        if (filtros.dataInicio || filtros.dataFim) {
            dadosFiltrados = dadosFiltrados.filter((item) => {
                const dataVenda = new Date(item.dataVenda);
                const dataInicio = filtros.dataInicio ? new Date(filtros.dataInicio) : null;
                const dataFim = filtros.dataFim ? new Date(filtros.dataFim) : null;

                if (dataInicio && dataVenda < dataInicio) return false;
                if (dataFim && dataVenda > dataFim) return false;

                return true;
            });
        }

        // Atualiza o estado dos dados filtrados
        setDadosFiltrados(dadosFiltrados);
        setTotalQuantidade(() => dadosFiltrados.length)
        setTotalValor(() => dadosFiltrados.reduce((acc, item) => acc + item.valor_a_receber, 0))

    }, [filtros, listaCrediario])

    const gerarRelatorio = () => {

        setFiltros({
            nomeCliente: "",
            status: "",
            dataInicio: "",
            dataFim: "",
            idVenda: "",
        })

        if (dataInicio === "" && dataFinal === "") {
            return alert('Preencha os campos "Data Inicio" e "Data Final"');
        }

        if (dataInicio > dataFinal) {
            return alert('A "Data Inicio" não pode ser maior que a "Data Final"')
        }

        get(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/periodo/${dataInicio}/${dataFinal}`).then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setListaCrediario(res.crediario.map((item) => ({
                    ...item,
                    status: item.valor_pago < item.valor_a_receber ? "Aberto" : "Pago"
                })))
                setHiddenTable("")
            }
        })
    }

    const gerarExcel = () => {

        // cria uma nova planilha
        const wb = XLSX.utils.book_new();
        const dataAgora = new Date();

        // Cria uma nova lista baseada na lista original, incluindo apenas as propriedades desejadas
        const vendasParaExcel = dadosFiltrados.map(item => ({
            "Data de vencimento": utcStringToDateLocal(item.data_vencimento),
            "Cliente": item.nome_cliente,
            "Celular": item.celular,
            "Data da venda": utcStringToDateLocal(item.data_venda),
            "Venda": item.venda_id,
            "Valor da parcela": item.valor_a_receber
        }));

        vendasParaExcel.push({
            "Data da venda": "TOTAL",
            "Venda": totalQuantidade,
            "Valor da Parcela": totalValor,
        })

        // converte os dados para o formato de planilha
        const ws = XLSX.utils.json_to_sheet(vendasParaExcel);

        // adiciona a planilha ao livro de trabalho
        XLSX.utils.book_append_sheet(wb, ws, "Vendas Por Produtos");

        // exporta o livro de trabalho
        XLSX.writeFile(wb, "lucro_por_produtos_" + utcStringToDateLocal(dataAgora) + ".xlsx");

    }

    const handleFiltrar = (event) => {
        setFiltros((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    console.log("Dados sem filtro: ", listaCrediario)
    console.log("Data inicio:", dataInicio)
    console.log("Data Final:", dataFinal)
    console.log("Filtro: ", filtros)

    return (
        <div id="medium-modal" className="first-letter:overflow-y-auto overflow-x-hidden w-full h-modal sm:h-auto">
            <div className="relative py-4 w-full h-full sm:h-auto">
                <div className="relative rounded shadow border bg-gray-200">
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Relatório de crediario
                        </h3>
                    </div>
                    <div className="px-2 py-4 md:p-6 flex flex-col gap-4">
                        <div className="flex flex-row w-full gap-4">
                            <div className="w-full">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Data Inicio</label>
                                <input name='dataInicio' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
                            </div>
                            <div className="w-full">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Data Final</label>
                                <input name='dataFinal' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} required />
                            </div>
                        </div>
                        <div className={`${hiddenTable} flex flex-col gap-4`}>
                            <h1 className='text-lg text-gray-700 font-bold'>Filtros</h1>
                            <div className="flex flex-row">
                                <div className="w-full">
                                    <form className='flex flex-row gap-4' >
                                        <div className="flex flex-col">
                                            <label htmlFor="nome-cliente" className="block mb-2 text-sm font-medium text-gray-700">Nome cliente</label>
                                            <select name="nomeCliente" onChange={handleFiltrar} className='border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300' value={filtros.nomeCliente}>
                                                <option value=""></option>
                                                {
                                                    listaCrediario && Object.values(listaCrediario.reduce((acc, item) => {
                                                        acc[item.nome_cliente] = { id: item.nome_cliente, nome: item.nome_cliente }
                                                        return acc
                                                    }, {})).map((item, i) => (
                                                        <option key={i} value={item.nome.toString()}>{item.nome.toString()}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="nome-cliente" className="block mb-2 text-sm font-medium text-gray-700">Venda</label>
                                            <select name="idVenda" onChange={handleFiltrar} className='border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300' value={filtros.idVenda}>
                                                <option value=""></option>
                                                {
                                                    listaCrediario && Object.values(listaCrediario.reduce((acc, item) => {
                                                        acc[item.venda_id] = { id: item.venda_id, nome: item.venda_id }
                                                        return acc
                                                    }, {})).map((item, i) => (
                                                        <option key={i} value={item.venda_id}>{item.nome}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="nome-cliente" className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                                            <select name="status" onChange={handleFiltrar} className='border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300' value={filtros.status}>
                                                <option value=""></option>
                                                {
                                                    listaCrediario && Object.values(listaCrediario.reduce((acc, item) => {
                                                        acc[item.status] = { id: item.status, nome: item.status }
                                                        return acc
                                                    }, {})).map((item, i) => (
                                                        <option key={i} value={item.venda_id}>{item.nome}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end p-6 space-x-2 rounded-b">
                        <button onClick={gerarRelatorio} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Relatório</button>
                        {
                            dadosFiltrados.length > 0 && (
                                <button onClick={gerarExcel} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Excel</button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={hiddenTable + " pt-4 pb-12 w-full overflow-auto"}>
                <table className="w-full text-left border-collapse table-auto rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">Data Vencimento</th>
                            <th className="border px-4 py-2">Cliente</th>
                            <th className="border px-4 py-2">Celular</th>
                            <th className="border px-4 py-2">Data da Venda</th>
                            <th className="border px-4 py-2">Venda</th>
                            <th className="border px-4 py-2">Valor da Parcela</th>
                            <th className="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosFiltrados.map((data, index) => (
                            <tr key={index} className={index % 2 && 'bg-gray-100'}>
                                <td className="border px-4 py-2">{utcStringToDateLocal(data.data_vencimento)}</td>
                                <td className="border px-4 py-2">{data.nome_cliente}</td>
                                <td className="border px-4 py-2">{data.celular}</td>
                                <td className="border px-4 py-2">{utcStringToDateLocal(data.data_venda)}</td>
                                <td className="border px-4 py-2">{data.venda_id}</td>
                                <td className="border px-4 py-2">{Brl(data.valor_a_receber)}</td>
                                <td className="border px-4 py-2">{Brl(data.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200">
                            <th className='border px-4 py-2'></th>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">{totalQuantidade}</th>
                            <th className="border px-4 py-2">{Brl(totalValor)}</th>

                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}