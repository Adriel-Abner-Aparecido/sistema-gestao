import React, { useState } from "react";

function EntradaMercadoria() {
    const [dadosFornecedor, setDadosFornecedor] = useState({
        razaoSocial: "Utilar Shop Industria e Comercio de Utensilios Domestico",
        cnpj: "17.929.588/0001-65",
        telefone: "(17) 3546-1943",
        email: "",
        endereco: "Rua Nazareno Volpiani",
        numero: "300",
        bairro: "Parque Industrial Abel Pasiani",
        complemento: "",
        cep: "15.840-000",
        uf: "SP",
        cidade: "Itajobi",
    });

    const [produtos, setProdutos] = useState([
        {
            descricao: "Portao Pet 70 x 80 cm - 2 Ext. 30 + 1 Ext. 15cm-Preto",
            quantidade: "12,00",
            valorUnitario: "R$ 10,99",
            valorTotal: "R$ 131,91",
        },
    ]);

    const [parcelas, setParcelas] = useState([
        { parcela: 1, data: "04/09/2024", valor: "R$ 26,39", pagamento: "Cartão de Crédito", obs: "1" },
        { parcela: 2, data: "04/10/2024", valor: "R$ 26,38", pagamento: "Cartão de Crédito", obs: "2" },
        { parcela: 3, data: "03/11/2024", valor: "R$ 26,38", pagamento: "Cartão de Crédito", obs: "3" },
        { parcela: 4, data: "03/12/2024", valor: "R$ 26,38", pagamento: "Cartão de Crédito", obs: "4" },
        { parcela: 5, data: "02/01/2025", valor: "R$ 26,38", pagamento: "Cartão de Crédito", obs: "5" },
    ]);

    return (
        <div className="container mx-auto p-4">
            <div className="text-center my-4">
                <h1 className="text-2xl font-bold">ENTRADA DE MERCADORIA 34</h1>
                <p>NF 1108937</p>
                <div className="mt-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded mr-4">Download em PDF</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => window.print()}>
                        Imprimir
                    </button>
                </div>
            </div>

            <div className="border-t border-gray-300 py-4">
                <h2 className="font-semibold">DADOS DO FORNECEDOR</h2>
                <div className="grid grid-cols-2 gap-4">
                    <p><strong>RAZÃO SOCIAL:</strong> {dadosFornecedor.razaoSocial}</p>
                    <p><strong>CNPJ:</strong> {dadosFornecedor.cnpj}</p>
                    <p><strong>TELEFONE:</strong> {dadosFornecedor.telefone}</p>
                    <p><strong>EMAIL:</strong> {dadosFornecedor.email}</p>
                    <p><strong>ENDEREÇO:</strong> {dadosFornecedor.endereco}</p>
                    <p><strong>NÚMERO:</strong> {dadosFornecedor.numero}</p>
                    <p><strong>BAIRRO:</strong> {dadosFornecedor.bairro}</p>
                    <p><strong>COMPLEMENTO:</strong> {dadosFornecedor.complemento}</p>
                    <p><strong>CEP:</strong> {dadosFornecedor.cep}</p>
                    <p><strong>UF:</strong> {dadosFornecedor.uf}</p>
                    <p><strong>CIDADE:</strong> {dadosFornecedor.cidade}</p>
                </div>
            </div>

            <div className="border-t border-gray-300 py-4">
                <h2 className="font-semibold">DADOS DA ENTRADA</h2>
                <table className="w-full table-auto mt-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">DESCRIÇÃO</th>
                            <th className="border px-4 py-2">QTDE.</th>
                            <th className="border px-4 py-2">V. UNIT.</th>
                            <th className="border px-4 py-2">V. TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((produto, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{produto.descricao}</td>
                                <td className="border px-4 py-2">{produto.quantidade}</td>
                                <td className="border px-4 py-2">{produto.valorUnitario}</td>
                                <td className="border px-4 py-2">{produto.valorTotal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-gray-300 py-4">
                <h2 className="font-semibold">DADOS DE PAGAMENTO</h2>
                <p><strong>VALOR TOTAL DOS PRODUTOS:</strong> R$ 131,91</p>
                <p><strong>VALOR DO FRETE:</strong> R$ 0,00</p>
                <p><strong>VALOR TOTAL DO PEDIDO:</strong> R$ 131,91</p>

                <table className="w-full table-auto mt-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Parcela</th>
                            <th className="border px-4 py-2">Data</th>
                            <th className="border px-4 py-2">Valor</th>
                            <th className="border px-4 py-2">Pagamento</th>
                            <th className="border px-4 py-2">OBS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcelas.map((parcela, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">Parcela {parcela.parcela}</td>
                                <td className="border px-4 py-2">{parcela.data}</td>
                                <td className="border px-4 py-2">{parcela.valor}</td>
                                <td className="border px-4 py-2">{parcela.pagamento}</td>
                                <td className="border px-4 py-2">{parcela.obs}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-gray-300 py-4">
                <h2 className="font-semibold">DADOS DA NOTA FISCAL</h2>
                <table className="w-full table-auto mt-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">NÚMERO NF</th>
                            <th className="border px-4 py-2">CHAVE DE ACESSO</th>
                            <th className="border px-4 py-2">PROTOCOLO</th>
                            <th className="border px-4 py-2">DATA EMISSÃO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">1108937</td>
                            <td className="border px-4 py-2">35240817929588000165550000011089371444634691</td>
                            <td className="border px-4 py-2">135241684485272</td>
                            <td className="border px-4 py-2">05/08/2024 11:14</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EntradaMercadoria;