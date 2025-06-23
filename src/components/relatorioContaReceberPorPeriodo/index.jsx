import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Brl } from '../../services/real';
import { utcStringToDateLocal } from '../../services/date';
import { BsCaretDownFill, BsCaretUpFill } from 'react-icons/bs';

export const RelatorioContaReceberPorPeriodo = () => {
    const [hiddenTable, setHiddenTable] = useState('hidden');
    const [listaCrediario, setListaCrediario] = useState([]);
    const [totalQuantidade, setTotalQuantidade] = useState(0);
    const [totalValor, setTotalValor] = useState(0);
    const [sortDirection, setSortDirection] = useState("desc");
    const [orderer, setOrderer] = useState("data_vencimento")


    useEffect(() => {
        document.getElementById("vendasPorProdutoDataInicio").value = getPrimeiroDiaDoMesAtual();
        document.getElementById("vendasPorProdutoDataFinal").value = getUltimoDiaDoMesAtual();
    }, [])

    const gerarRelatorio = () => {
        let dataInicio = document.getElementById("vendasPorProdutoDataInicio").value;
        let dataFinal = document.getElementById("vendasPorProdutoDataFinal").value;

        if (dataInicio != "" && dataFinal != "") {

            if (checkDates(dataInicio, dataFinal)) {
                get(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/relatorio/${dataInicio}/${dataFinal}`).then((res) => {
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
                        setTotalQuantidade(res.parcelas)
                        setTotalValor(res.total_a_receber)
                        setHiddenTable("")
                    }
                })
            } else {
                alert('A "Data Inicio" não pode ser maior que a "Data Final"')
            }
        } else {
            alert('Preencha os campos "Data Inicio" e "Data Final"');
        }
    }

    const gerarExcel = () => {
        let dataInicio = document.getElementById("vendasPorProdutoDataInicio").value;
        let dataFinal = document.getElementById("vendasPorProdutoDataFinal").value;

        if (dataInicio != "" && dataFinal != "") {
            if (checkDates(dataInicio, dataFinal)) {
                get(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/relatorio/${dataInicio}/${dataFinal}`).then((res) => {
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
                alert('A "Data Inicio" não pode ser maior que a "Data Final"')
            }
        } else {
            alert('Preencha os campos "Data Inicio" e "Data Final"');
        }
    }

    function checkDates(startDateStr, endDateStr) {
        // Converte as strings de entrada em objetos Date
        let startDate = new Date(startDateStr);
        let endDate = new Date(endDateStr);

        // Verifica se a data de início é posterior à data final
        if (startDate > endDate) {
            return false; // A data de início é posterior à data final
        } else {
            return true; // A data de início não é posterior à data final
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

    function getPrimeiroDiaDoMesAtual() {
        let data = new Date();
        let ano = data.getFullYear();
        let mes = data.getMonth() + 1;

        let primeiroDia = new Date(ano, mes - 1, 1);

        let dia = primeiroDia.getDate();
        dia = dia < 10 ? '0' + dia : dia;  // Adiciona um zero à frente se o dia tiver um único dígito

        mes = mes < 10 ? '0' + mes : mes;  // Adiciona um zero à frente se o mês tiver um único dígito

        return `${ano}-${mes}-${dia}`;
    }

    function getUltimoDiaDoMesAtual() {
        let data = new Date();
        let ano = data.getFullYear();
        let mes = data.getMonth() + 1;
        let ultimoDia = new Date(ano, mes, 0);

        let dia = ultimoDia.getDate();
        dia = dia < 10 ? '0' + dia : dia;  // Adiciona um zero à frente se o dia tiver um único dígito

        mes = mes < 10 ? '0' + mes : mes;  // Adiciona um zero à frente se o mês tiver um único dígito

        return `${ano}-${mes}-${dia}`;
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

    return (
        <div id="medium-modal" className="first-letter:overflow-y-auto overflow-x-hidden w-full h-modal sm:h-auto">
            <div className="relative py-4 w-full h-full sm:h-auto">
                <div className="relative rounded shadow border bg-gray-200">
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Relatorio Conta Receber Por Periodo
                        </h3>
                    </div>
                    <div className="px-2 py-4 md:p-6 flex flex-row gap-4">
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Data Inicio</label>
                            <input id='vendasPorProdutoDataInicio' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300" required />
                        </div>
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Data Final</label>
                            <input id='vendasPorProdutoDataFinal' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300" required />
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
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('venda_id', 'desc')}>Venda <button type='button'>{orderer === "venda_id" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('nome', 'desc')}>Forma Pagamento<button type='button'>{orderer === "nome" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('valor_a_receber', 'desc')}>Valor <button type='button'>{orderer === "valor_a_receber" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>
                            <th className="border px-4 py-2"><div className='flex justify-between cursor-pointer' onClick={() => orderBy('status', 'desc')}>Status <button type='button'>{orderer === "status" ? sortDirection === "asc" ? <BsCaretUpFill /> : <BsCaretDownFill /> : ""}</button></div></th>

                        </tr>
                    </thead>
                    <tbody>
                        {listaCrediario.map((data, index) => (
                            <tr key={index} className={index % 2 && 'bg-gray-100'}>
                                <td className="border px-4 py-2">{utcStringToDateLocal(data.data_vencimento.replace("Z", ""))}</td>
                                <td className="border px-4 py-2">{data.nome_cliente}</td>
                                <td className="border px-4 py-2">{data.celular}</td>
                                <td className="border px-4 py-2">{data.venda_id}</td>
                                <td className="border px-4 py-2">{data.nome}</td>
                                <td className="border px-4 py-2">{Brl(data.valor_a_receber)}</td>
                                <td className="border px-4 py-2">{data.status}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200">
                            <th className='border px-4 py-2'></th>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">{totalQuantidade}</th>
                            <th className="border px-4 py-2"></th>
                            <th className="border px-4 py-2">{Brl(totalValor)}</th>
                            <th className="border px-4 py-2"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}