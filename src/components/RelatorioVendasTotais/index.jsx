import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export const RelatorioVendasTotais = () => {
    const [hiddenTable, setHiddenTable] = useState('hidden');
    const [listVendasTotais, setListVendasTotais] = useState([]);
    const [totalValor, setTotalValor] = useState(0);

    useEffect(() => {
        if (listVendasTotais.length != 0) {
            const totalValue = listVendasTotais.reduce((total, venda) => total + venda.valor - venda.desconto, 0);
            setTotalValor(totalValue);
        }
    }, [listVendasTotais])

    useEffect(() => {
        document.getElementById("vendasTotaisDataInicio").value = getPrimeiroDiaDoMesAtual();
        document.getElementById("vendasTotaisDataFinal").value = getUltimoDiaDoMesAtual();
    }, [])

    const gerarRelatorio = () => {
        let dataInicio = document.getElementById("vendasTotaisDataInicio").value;
        let dataFinal = document.getElementById("vendasTotaisDataFinal").value;

        if (dataInicio != "" && dataFinal != "") {

            if (checkDates(dataInicio, dataFinal)) {
                get(process.env.NEXT_PUBLIC_API_URL + '/vendas/periodo/' + dataInicio + '/' + dataFinal + '').then((res) => {
                    if (res.mensagem) {
                        if (res.mensagem == "falha na autenticação") {
                            console.log('falha na autenticação');

                            localStorage.removeItem("applojaweb_token");
                            Router.push('/login');
                        }
                    } else {
                        setListVendasTotais(res)
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
        let dataInicio = document.getElementById("vendasTotaisDataInicio").value;
        let dataFinal = document.getElementById("vendasTotaisDataFinal").value;

        if (dataInicio != "" && dataFinal != "") {
            if (checkDates(dataInicio, dataFinal)) {
                get(process.env.NEXT_PUBLIC_API_URL + '/vendas/periodo/' + dataInicio + '/' + dataFinal + '').then((res) => {
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
                            const vendasParaExcel = res.map(venda => ({
                                id: venda.id,
                                nome_cliente: venda.nome_cliente,
                                valor: venda.valor?.toFixed(2),
                                data: formatDate(venda.data),
                                status: venda.status,
                                observacao: venda.observacao
                            }));

                            // converte os dados para o formato de planilha
                            const ws = XLSX.utils.json_to_sheet(vendasParaExcel);

                            // adiciona a planilha ao livro de trabalho
                            XLSX.utils.book_append_sheet(wb, ws, "Vendas Totais");

                            // exporta o livro de trabalho
                            XLSX.writeFile(wb, "vendas_totais_" + formatDate(dataAgora) + ".xlsx");
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

    const pontoPorVirgula = (valor) => {
        let valorString;
        valorString = valor.toString().replace(".", ",");
        return valorString;
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

    return (
        <div id="medium-modal" className="first-letter:overflow-y-auto overflow-x-hidden w-full h-modal sm:h-auto">
            <div className="relative py-4 w-full h-full sm:h-auto">
                <div className="relative rounded bg-gray-200">
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Vendas Totais
                        </h3>
                    </div>
                    <div className="px-2 py-4 md:p-6 flex flex-row gap-4">
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Data Inicio</label>
                            <input id='vendasTotaisDataInicio' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300" required />
                        </div>
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Data Final</label>
                            <input id='vendasTotaisDataFinal' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-300" required />
                        </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end p-6 space-x-2 rounded-b border-applojaDark">
                        <button onClick={gerarRelatorio} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Relatório</button>
                        <button onClick={gerarExcel} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Excel</button>
                    </div>
                </div>
            </div>
            <div className={hiddenTable + " pt-4 pb-12 w-full overflow-auto"}>
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Cliente</th>
                            <th className="px-4 py-2">Data</th>
                            <th className="px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listVendasTotais.map((data, index) => (
                            <tr key={data.id} className={index % 2 ? 'bg-gray-100' : ''}>
                                <td className="border px-4 py-2">{data.id}</td>
                                <td className="border px-4 py-2">{data.nome_cliente}</td>
                                <td className="border px-4 py-2">{formatDate(data.data)}</td>
                                <td className="border px-4 py-2">{"R$ " + pontoPorVirgula(data.valor?.toFixed(2))}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200">
                            <td colSpan="3" className="border px-4 py-2 font-bold text-right">Valor Total:</td>
                            <td className="border font-bold px-4 py-2">{"R$ " + pontoPorVirgula(totalValor?.toFixed(2))}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}