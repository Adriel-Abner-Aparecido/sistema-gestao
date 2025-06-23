import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';
import { Brl } from '../../services/real'
import { getPrimeiroDiaDoMesAtual, getUltimoDiaDoMesAtual, utcStringToDateLocal } from '../../services/date';
import ExcelJS from "exceljs"
import { saveAs } from 'file-saver';

export const RelatorioFormasPagamento = () => {
    const [hiddenTable, setHiddenTable] = useState('hidden');
    const [listFormasPagamento, setListFormasPagamento] = useState([]);
    const [totalValor, setTotalValor] = useState(0);
    const [dataInicio, setDataInicio] = useState(() => getPrimeiroDiaDoMesAtual())
    const [dataFinal, setDataFinal] = useState(() => getUltimoDiaDoMesAtual())

    const gerarRelatorio = () => {

        if (dataInicio === "" || dataFinal === "") { alert('Preencha os campos "Data Inicio" e "Data Final"') }

        if (dataInicio > dataFinal) { alert('A "Data Inicio" não pode ser maior que a "Data Final"') }

        get(`${process.env.NEXT_PUBLIC_API_URL}/formaspagamento/periodo/${dataInicio}/${dataFinal}`).then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setListFormasPagamento(res)

                const totalpago = res.reduce((acc, item) => {
                    if (item.forma_pagamento === 'Desconto') {
                        return acc
                    }
                    return acc + item.total_pago
                }, 0)

                console.log(totalpago)

                setTotalValor(totalpago)
                setHiddenTable("")
            }
        })
    }

    const gerarExcel = async () => {

        const dataAgora = new Date();

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Formas de Pagamento", { views: [{ showGridLines: true }] })

        ws.columns = [
            { header: "Forma de pagamento", key: "forma_pagamento", width: 25 },
            { header: "Total Pago", key: "total_pago", width: 25 }
        ]

        listFormasPagamento.forEach((receita) => {
            ws.addRow({
                forma_pagamento: receita.forma_pagamento,
                total_pago: parseFloat(receita.total_pago?.toFixed(2)),
            })
        });

        const headerRow = ws.getRow(1)
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FF4F81BD" },
            }
            cell.alignment = {
                horizontal: "center"
            }
            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            }
        })

        ws.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: "thin", color: { argb: "FF000000" } },
                    left: { style: "thin", color: { argb: "FF000000" } },
                    bottom: { style: "thin", color: { argb: "FF000000" } },
                    right: { style: "thin", color: { argb: "FF000000" } },
                }
            })
        })

        const nomeArquivo = `formas_de_pagamento_${utcStringToDateLocal(dataAgora)}.xlsx`;
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        saveAs(blob, nomeArquivo)

    }

    return (
        <div id="medium-modal" className="first-letter:overflow-y-auto overflow-x-hidden w-full h-modal sm:h-auto">
            <div className="relative py-4 w-full h-full sm:h-auto">
                <div className="relative rounded border border-white bg-gray-200">
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Financeiro por Formas de Pagamento
                        </h3>
                    </div>
                    <div className="px-2 py-4 md:p-6 flex flex-row gap-4">
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Data Inicio</label>
                            <input name='dataInicio' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-700" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
                        </div>
                        <div className="w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Data Final</label>
                            <input name='dataFinal' type="date" className="border text-sm rounded-lg block w-full p-2.5 placeholder-gray-700" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} required />
                        </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end p-6 space-x-2 rounded-b">
                        <button onClick={gerarRelatorio} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Relatório</button>
                        {
                            listFormasPagamento.length > 0 && (
                                <button onClick={gerarExcel} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Excel</button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={hiddenTable + " pt-4 pb-12 w-full overflow-auto"}>
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Forma de Pagamento</th>
                            <th className="px-4 py-2">Valor Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listFormasPagamento.map((data, index) => (
                            <tr key={index} className={index % 2 ? 'bg-gray-100' : ''}>
                                <td className="border px-4 py-2">{data.forma_pagamento}</td>
                                <td className="border px-4 py-2">{Brl(data.total_pago)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200">
                            <td className="px-4 py-2 font-bold">Total</td>
                            <td className="px-4 py-2 font-bold">
                                {Brl(totalValor)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}