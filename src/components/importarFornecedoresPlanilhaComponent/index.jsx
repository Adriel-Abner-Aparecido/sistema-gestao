import { useState } from "react"
import * as XLSX from "xlsx";
import { post } from "../../services/api";
import { BsDownload, BsX } from "react-icons/bs";

export const ImportarFornecedoresPlanilhaComponent = ({ setImportar, setUpdate }) => {

    const [fornecedores, setClientes] = useState([]);
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

            const dataTratada = jsonData.map((fornecedor) => ({
                id: null,
                nome: fornecedor.nome,
                telefone: fornecedor.telefone ? formatarTelefone(fornecedor.telefone) : null,
                celular: fornecedor.celular ? formatarTelefone(fornecedor.celular) : null,
                email: fornecedor.email || null,
                tipoPessoa: fornecedor.cnpj_cpf ? fornecedor.cnpj_cpf.toString().length >= 13 ? "Pessoa Jurídica" : "Pessoa Física" : "Pessoa Física",
                cnpjCpf: fornecedor.cnpj_cpf ? fornecedor.cnpj_cpf.toString().length >= 13 ? corrigirCnpj(fornecedor.cnpj_cpf) : fornecedor.cnpj_cpf : null,
                fantasia: fornecedor.nome_fantasia || null,
                observacao: fornecedor.observacao || null,
                inscricaoEstadual: fornecedor.inscricao_estadual ? fornecedor.inscricao_estadual.toString().replace(/\D/g, '') : null,
                dataNascimento: null,
                fornecedorId: null,
                clienteId: null,
                vendedorId: null,
                rua: fornecedor.rua || null,
                numero: fornecedor.numero || null,
                bairro: fornecedor.bairro || null,
                cep: fornecedor.cep ? fornecedor.cep.toString().padStart(8, "0").replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2-$3") : null,
                cidade: fornecedor.cidade || null,
                uf: fornecedor.uf || null,
                complemento: fornecedor.complemento ? fornecedor.complemento.replace(/[\/\\\*&$#@!"']/g, "") : null
            }))

            // Exibe os dados no console e no estado
            // console.log("Dados da Planilha:", jsonData);
            setClientes(dataTratada);

        };
    };

    const enviarParaBackend = async () => {

        let contador = 0

        try {
            setLoading(true);

            const tamanhoLote = 500; // Define o tamanho do lote
            const totalClientes = fornecedores.length;

            for (let i = 0; i < totalClientes; i += tamanhoLote) {
                const lote = fornecedores.slice(i, i + tamanhoLote); // Divide os produtos em lotes

                const res = await post(`${process.env.NEXT_PUBLIC_API_URL}/importarplanilhafornecedores`, lote);


                if (res.message) {
                    contador = contador + (res.total || 0)
                    setMessage(`${res.message} ${contador} de ${totalClientes}`);
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

    const corrigirCnpj = (cnpj) => {
        let cnpjNumeros = cnpj.toString().replace(/\D/g, ""); // Remove tudo que não for número

        if (cnpjNumeros.length === 13) {
            // Se estiver faltando um dígito, adicionamos um zero na posição correta
            cnpjNumeros = cnpjNumeros.slice(0, 8) + "0" + cnpjNumeros.slice(8);
        }

        if (cnpjNumeros.length !== 14) return null; // Validação final

        return `${cnpjNumeros.slice(0, 2)}.${cnpjNumeros.slice(2, 5)}.${cnpjNumeros.slice(5, 8)}/${cnpjNumeros.slice(8, 12)}-${cnpjNumeros.slice(12)}`;
    }

    function formatarTelefone(numero) {
        const numStr = numero.toString().replace(/\D/g, ""); // Remove qualquer caractere não numérico

        if (numStr.length === 11) {
            // Caso tenha 11 dígitos (celular com nono dígito)
            return `(${numStr.slice(0, 2)}) ${numStr.slice(2, 7)}-${numStr.slice(7)}`;
        } else if (numStr.length === 10) {
            // Caso tenha 10 dígitos (telefone fixo ou celular antigo)
            return `(${numStr.slice(0, 2)}) ${numStr.slice(2, 6)}-${numStr.slice(6)}`;
        } else {
            return null; // Caso tenha menos de 10 ou mais de 11 dígitos
        }
    }

    console.log(fornecedores)

    return (<>

        <div className="flex fixed z-[999] w-full h-full top-0 left-0 flex-col bg-gray-700 bg-opacity-60 justify-center items-center">
            <div className="flex flex-col bg-gray-200 rounded-lg min-w-[400px]">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row p-4 border-b border-gray-700 justify-between">
                        <h2 className="text-lg font-bold uppercase">Importar Planilha de fornecedores</h2>
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
                    fornecedores.length > 0 ? (
                        <div className="flex flex-col gap-2 p-4">
                            <p className="text-center">{fornecedores && fornecedores.length} fornecedores</p>
                            <button className="border-2 border-gray-700 rounded-lg p-2 disabled:cursor-wait" onClick={enviarParaBackend} disabled={loading}>{loading ? "Aguarde" : "Importar"}</button>
                        </div>

                    ) : <div className="flex flex-col gap-2 p-4">
                        <a className="border-2 border-gray-700 rounded-lg p-2 flex justify-center items-center gap-2" href={"/modelos/modelo_importacao_fornecedores.xlsx"}>Baixar exemplo <BsDownload /></a>
                    </div>
                }
            </div>
        </div>

    </>)
}