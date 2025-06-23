import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export const RelatorioEstoqueNivel = () => {
    const [hiddenTable, setHiddenTable] = useState('hidden');
    const [listEstoqueNivel, setListEstoqueNivel] = useState([]);
    const [totalQuantidade, setTotalQuantidade] = useState(0);

    useEffect(() => {
        if (listEstoqueNivel.length != 0) {
            const totalQuantidade = listEstoqueNivel.reduce((total, item) => total + item.quantidade, 0);
            setTotalQuantidade(totalQuantidade);
        }
    }, [listEstoqueNivel])

    const gerarRelatorio = () => {
        get(process.env.NEXT_PUBLIC_API_URL + '/estoquerelatorio').then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setListEstoqueNivel(res)
                setHiddenTable("")
            }
        })
    }

    const gerarExcel = () => {
        get(process.env.NEXT_PUBLIC_API_URL + '/estoquerelatorio').then((res) => {
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
                    const estoqueParaExcel = res.map(estoque => ({
                        nome_produto: estoque.nome_produto,
                        nome_marca: estoque.nome_marca,
                        nome_categoria: estoque.nome_categoria,
                        nome_subcategoria: estoque.nome_subcategoria,
                        nome_cor: estoque.nome_cor,
                        nome_tamanho: estoque.nome_tamanho,
                        localizacao: estoque.localizacao,
                        quantidade: estoque.quantidade,
                        quantidade_min: estoque.quantidade_min,
                        quantidade_max: estoque.quantidade_max
                    }));

                    // converte os dados para o formato de planilha
                    const ws = XLSX.utils.json_to_sheet(estoqueParaExcel);

                    // adiciona a planilha ao livro de trabalho
                    XLSX.utils.book_append_sheet(wb, ws, "Nível do Estoque");

                    // exporta o livro de trabalho
                    XLSX.writeFile(wb, "nível_do_estoque_" + formatDate(dataAgora) + ".xlsx");
                }
            }
        })
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

    return (
        <div id="medium-modal" className="first-letter:overflow-y-auto overflow-x-hidden w-full h-modal sm:h-auto">
            <div className="relative py-4 w-full h-full sm:h-auto">
                <div className="relative rounded bg-gray-200">
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Nível do Estoque
                        </h3>
                    </div>
                    <div className="flex items-center justify-between md:justify-end p-6 space-x-2 rounded-b">
                        <button onClick={gerarRelatorio} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Relatório</button>
                        <button onClick={gerarExcel} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Gerar Excel</button>
                    </div>
                </div>
            </div>
            <div className={hiddenTable + " pt-4 pb-12 w-full overflow-auto"}>
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Produto</th>
                            <th className="px-4 py-2">Cor</th>
                            <th className="px-4 py-2">Tamanho</th>
                            <th className="px-4 py-2">Marca</th>
                            <th className="px-4 py-2">Categoria</th>
                            <th className="px-4 py-2">Subcategoria</th>
                            <th className="px-4 py-2">Localização</th>
                            <th className="px-4 py-2">Qtda</th>
                            <th className="px-4 py-2">Qtda Min</th>
                            <th className="px-4 py-2">Qtda Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listEstoqueNivel.map((data, index) => (
                            <tr key={index} className={index % 2 ? 'bg-gray-100' : ''}>
                                <td className="border px-4 py-2 max-w-md">{data.nome_produto}</td>
                                <td className="border px-4 py-2">{data.nome_cor}</td>
                                <td className="border px-4 py-2">{data.nome_tamanho}</td>
                                <td className="border px-4 py-2">{data.nome_marca}</td>
                                <td className="border px-4 py-2">{data.nome_categoria}</td>
                                <td className="border px-4 py-2">{data.nome_subcategoria}</td>
                                <td className="border px-4 py-2">{data.localizacao}</td>
                                <td className="border px-4 py-2">{data.quantidade}</td>
                                <td className="border px-4 py-2">{data.quantidade_min}</td>
                                <td className="border px-4 py-2">{data.quantidade_max}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200">
                            <th colSpan="7" className="px-4 py-2 text-right">Qtda. Total:</th>
                            <th className="px-4 py-2">{totalQuantidade}</th>
                            <th className="px-4 py-2"></th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}