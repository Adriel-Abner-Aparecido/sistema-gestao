import { useState } from "react"
import * as XLSX from "xlsx";
import { post } from "../../services/api";
import { BsDownload, BsX } from "react-icons/bs";

export const ImportarProdutosPlanilhaComponent = ({ setImportar, setUpdate }) => {

    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)

    // Função para ler o arquivo Excel
    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Obtém o arquivo selecionado
        if (!file) return;

        const reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });

            // Obtém a primeira aba da planilha
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Converte a planilha para JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const dataTratada = jsonData.map((produto) => ({
                fornecedorId: null,
                tipoProdutoId: 3,
                marcaId: null,
                categoriaId: null,
                unidadeId: null,
                origemId: null,
                colecaoId: null,
                subCategoriaId: null,
                nome: produto.Descricao,
                cstIcmsId: null,
                status: 0,
                icms: null,
                ipi: null,
                pis: null,
                cofins: null,
                cest: null,
                ncm: produto.ncm ? String(produto.ncm).replace(/\s+/g, '') : null,
                observacao: null,
                kitProduto: null,
                comissao: null,
                descontoMax: null,
                insumo: null,
                classeImposto: '',
                corId: null,
                tamanhoId: null,
                codigoBarras: /^\d{8}$|^\d{13}$/.test(produto.Codigo) ? produto.Codigo : null,
                codigoProduto: /^\d{8}$|^\d{13}$/.test(produto.Codigo) ? null : produto.Codigo,
                descricao: produto.Descricao,
                listaPrecoId: 1,
                valor: produto.Preco || 0,
                markup: 0,
                valorCusto: produto.Custo || 0,
                validade: null,
                localizacao: null,
                quantidade: produto.Estoque > 0 ? produto.Estoque : 0,
                quantidadeMin: 0,
                quantidadeMax: 9999,
            }))

            // Exibe os dados no console e no estado
            //console.log("Dados da Planilha:", jsonData);
            setProdutos(processarProdutos(dataTratada));

        };
    };

    const processarProdutos = (produtos) => {
        const codigosUsados = new Set(); // Armazena os códigos já usados

        return produtos.map((produto) => {
            if (codigosUsados.has(produto.codigoBarras)) {
                // Se o código já apareceu antes, substitui por null
                return { ...produto, codigoBarras: null };
            }

            // Se for a primeira vez, mantém o código e adiciona ao Set
            codigosUsados.add(produto.codigoBarras);

            return produto;
        });
    };

    const enviarParaBackend = async () => {

        let contador = 0

        try {
            setLoading(true);

            const tamanhoLote = 500; // Define o tamanho do lote
            const totalProdutos = produtos.length;

            for (let i = 0; i < totalProdutos; i += tamanhoLote) {
                const lote = produtos.slice(i, i + tamanhoLote); // Divide os produtos em lotes

                const res = await post(`${process.env.NEXT_PUBLIC_API_URL}/importarplanilhaprodutos`, lote);

                contador = contador + res.total

                if (res.message) {
                    setMessage(`${res.message} ${contador} de ${totalProdutos}`);
                }
            }

        } catch (error) {
            console.error("Erro ao enviar para o backend:", error);
        } finally {
            setLoading(false);
        }

    }

    const closeAndUpdate = () => {
        setImportar(false)
        setUpdate(true)
    }

    console.log(produtos)

    return (<>

        <div className="flex fixed z-[999] w-full h-full top-0 left-0 flex-col bg-gray-700 bg-opacity-60 justify-center items-center">
            <div className="flex flex-col bg-gray-200 rounded-lg min-w-[400px]">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row p-4 border-b border-gray-700 justify-between">
                        <h2 className="text-lg font-bold uppercase">Importar Planilha de Produtos</h2>
                        <button onClick={closeAndUpdate}><BsX className="w-5 h-5" /></button>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                        <input className="border-dashed border-2 border-gray-700 p-4 rounded-lg" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
                        <p className="text-xs">Atenção: Utilize esta opção apenas para produtos não cadastrados na base de dados.</p>
                    </div>
                </div>

                {
                    message && <p className="p-4 text-center">{message}</p>
                }

                {
                    produtos.length > 0 ? (
                        <div className="flex flex-col gap-2 p-4">
                            <p className="text-center">{produtos && produtos.length} Produtos</p>
                            <button className="border-2 border-gray-700 rounded-lg p-2 disabled:cursor-wait" onClick={enviarParaBackend} disabled={loading}>{loading ? "Aguarde" : "Importar"}</button>
                        </div>

                    ) : <div className="flex flex-col gap-2 p-4">
                        <a className="border-2 border-gray-700 rounded-lg p-2 flex justify-center items-center gap-2" href={"/modelos/modelo_importacao_produtos.xlsx"}>Baixar exemplo <BsDownload /></a>
                    </div>
                }
            </div>
        </div>

    </>)
}