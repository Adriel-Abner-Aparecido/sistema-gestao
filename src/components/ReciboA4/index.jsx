import { useEffect, useState } from "react";
import { Brl } from "../../services/real";

export const ReciboA4 = ({ dadosRecibo }) => {
  const [dados, setDados] = useState({
    venda: {},
    produtos: [{}],
    total: {}
  });
  const [recebido, setRecebido] = useState(0)


  useEffect(() => {
    if (dadosRecibo) {
      setDados(dadosRecibo)
      setRecebido(() => dadosRecibo.formasPagamento.reduce((acc, item) => acc + (item.total_pago + item.troco || 0), 0))
    }
  }, [dadosRecibo]);

  const convertUtcToLocal = (dateUtc) => {
    let localDate = new Date(dateUtc);

    return localDate.toLocaleString();
  }

  return (
    <div id="recibo" className="px-12 w-full flex flex-col items-center">
      {
        dados && dados.venda ? (
          <>
            <header className="w-[800px] print:w-full">
              <div className="flex flex-row items-center justify-between print:w-full p-2">
                <div className="flex flex-col items-center">
                  {dados.venda.logo_image ? (
                    <img src={dados.venda.logo_image} className="w-16 h-16" alt="Logo da Empresa" />
                  ) : (
                    <img src="/images/logoAPPLoja.png" alt="Logo da Empresa" className="h-16 w-16 m-auto" />
                  )}
                  <h1 className="text-xl font-bold print:text-sm">{dados.venda.nomeEmpresa}</h1>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl print:text-xs">Pedido nº {dados.venda.vendaId}</h2>
                  {dados.venda.nomeVendedor && <p className="font-medium print:text-xs">Vendedor(a): {dados.venda.nomeVendedor}</p>}
                  <p className="font-medium print:text-xs">Data: {convertUtcToLocal(dados.venda.data)}</p>
                </div>
              </div>
              <div className="border-b-2 border-black border-dashed"></div>
            </header>
            <section className="w-[800px] print:w-full">
              <h2 className="text-xl font-bold text-center">
                Informações da Empresa
              </h2>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  {dados.venda.nomeEmpresa && <p>Razão social: {dados.venda.nomeEmpresa}</p>}
                  {dados.venda.celularEmpresa && <p>Telefone: {dados.venda.celularEmpresa}</p>}
                  {dados.venda.emailEmpresa && <p>E-mail: {dados.venda.emailEmpresa}</p>}
                  {dados.venda.cnpjEmpresa && <p>CPNJ: {dados.venda.cnpjEmpresa}</p>}
                </div>
                <div className="flex flex-col">
                  {dados.venda.ruaEmpresa && <p className="mb-2">Endereço: {`${dados.venda.ruaEmpresa}, ${dados.venda.numeroEmpresa}`}</p>}
                  {dados.venda.cidadeEmpresa && dados.venda.ufEmpresa && <p className="mb-2 font-bold">{`${dados.venda.cidadeEmpresa} - ${dados.venda.ufEmpresa}`}</p>}
                  {dados.venda.cepEmpresa && <p className="mb-2">CEP: {dados.venda.cepEmpresa}</p>}
                </div>
              </div>
              <div className="border-b-2 border-black border-dashed"></div>
            </section>
            {
              dados.venda.clienteId &&
              <section className="w-[800px] print:w-full">
                <h2 className="text-xl font-bold text-center">
                  Informações do Cliente
                </h2>
                <div className="flex justify-between">
                  <div className="flex flex-col ">
                    <p>Nome: {dados.venda.nomeCliente}</p>
                    {dados.venda.telefoneCliente && <p>Telefone:{dados.venda.telefoneCliente}</p>}
                    {dados.venda.emailCliente && <p>E-mail: {dados.venda.emailCliente}</p>}
                  </div>
                  <div className="flex flex-col">
                    {dados.venda.enderecoId && <p className="mb-2">Endereço: {`${dados.venda.cep} - ${dados.venda.rua} - ${dados.venda.numero} , ${dados.venda.cidade} - ${dados.venda.uf}`}</p>}
                  </div>
                </div>
                <div className="border-b-2 border-black border-dashed"></div>
              </section>
            }
            <section className="w-[800px] print:w-full">
              <h2 className="text-xl font-bold text-center">
                Dados do pagamento
              </h2>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p>Total de produtos (qnt): {dados.total.quantidadeProdutos}</p>
                  <p>Valor total dos produtos: {Brl(dados.total.valorTotal)}</p>
                  <p>Valor total de descontos: {Brl(dados.venda.desconto)}</p>
                  <p>Valor total do pedido: {Brl(dados.total.valorTotal - dados.venda.desconto + dados.venda.valor_frete)}</p>
                  <p>Total Recebido: {Brl(recebido)}</p>
                  <p>Troco: {Brl(recebido > (dados.total.valorTotal - dados.venda.desconto) ? recebido - (dados.total.valorTotal - dados.venda.desconto) : 0)}</p>
                </div>
                <div className="flex flex-col">
                  <p>Número total de produtos: {dados.produtos.length}</p>
                  <p>Valor total do frete: {Brl(dados.venda.valor_frete)}</p>
                </div>
              </div>
              <div className="border-b-2 border-black border-dashed"></div>
            </section>
            {
              dados.venda.observacaoVenda && dados.venda.observacaoVenda !== '' && (
                <section className="w-[800px] print:w-full">
                  <h2 className="text-xl font-bold text-center">Observações</h2>
                  <div className="flex justify-between">
                    <p className="mb-2">{dados.venda.observacaoVenda}</p>
                  </div>
                  <div className="border-b-2 border-black border-dashed"></div>
                </section>
              )
            }
            <section className="w-[800px]">
              <h2 className="text-xl font-bold text-center">Formas de pagamento</h2>
              {
                dados.formasPagamento && dados.formasPagamento.map((forma, i) => (
                  <p key={i}>
                    {(forma.forma_pagamento || 'Boleto')}: {Brl(forma.total_pago || forma.valor_receber || 0)}
                  </p>
                ))
              }
            </section>
            <section className="w-[800px] print:w-full border-t-2 border-black border-dashed">
              <h2 className="text-xl font-bold text-center">
                Detalhes do Pedido
              </h2>
              <table className="table-auto text-black w-full">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="py-2 border border-black print:text-xs">Código</th>
                    <th className="w-2/4 py-2 border border-black print:text-xs">Nome</th>
                    <th className="py-2 border border-black print:text-xs">Qnt</th>
                    <th className="py-2 border border-black print:text-xs">Preço Unitário</th>
                    <th className="py-2 border border-black print:text-xs">Total</th>
                  </tr>
                </thead>
                <tbody className="full">
                  {
                    dados.produtos && dados.produtos.map((item, key) => (
                      <tr key={key}>
                        <td className="py-2 border border-black text-center print:text-xs">{item.variacao_produto_id}</td>
                        <td className="py-2 border border-black text-center print:text-xs">{item.produto_nome}</td>
                        <td className="py-2 border border-black text-center print:text-xs">{(item.quantidade || 0).toFixed(2)}</td>
                        <td className="py-2 border border-black text-center print:text-xs">{Brl(item.valor)}</td>
                        <td className="py-2 border border-black text-center print:text-xs">{Brl(item.valor * item.quantidade)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className="border-b-2 mt-2 border-black border-dashed"></div>
            </section>
            <footer className="flex flex-col py-2 w-[800px] print:w-full">
              <div className="flex flex-row items-end justify-between gap-2">
                <div className="w-max">
                  Data:____/____/________ ASS.:___________________________________
                </div>
                <div>
                  <p className="print:text-xs">Pedido: {dados.venda.vendaId}</p>
                  {dados.venda.nomeCliente && <p className="print:text-xs">Nome: {dados.venda.nomeCliente}</p>}
                  {dados.venda.cnpj_cpf && <p className="print:text-xs">CPF: {dados.venda.cnpj_cpf}</p>}
                  {dados.venda.iECliente && <p className="print:text-xs">IE: {dados.venda.iECliente}</p>}
                </div>
              </div>
            </footer>
            <div className="pt-8">
              <button className="print:hidden border-2 p-2" onClick={() => window.print()}>Imprimir</button>
            </div>
          </>
        ) : (<p>Carregando dados</p>)
      }

    </div >
  );
};
