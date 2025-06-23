import { useEffect, useState } from "react";
import { Brl } from "../../services/real";

export const Recibo58mm = ({ dadosRecibo }) => {

  const [dados, setDados] = useState({
    venda: {},
    produtos: [{}],
    total: {}
  })
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
    <div id="recibo" className="bg-white px-4 w-58mm h-80 text-sm">
      {
        dados && dados.venda ? (<>
          <header className="flex flex-row justify-between items-center gap-2 p-1">
            <div className="flex flex-col items-center">
              {dados.venda.logo_image ? (
                <img src={dados.venda.logo_image} className="w-16" alt="Logo da Empresa" />
              ) : (
                <img src="/images/logoAPPLoja.png" alt="Logo da Empresa" className="w-16" />
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs">{dados.venda.nomeEmpresa}</h1>
              <h2 className="text-xs">Recibo nº {dados.venda.vendaId}</h2>
              <p className="text-xs">Data: {convertUtcToLocal(dados.venda.data)}</p>
            </div>
          </header>
          <div className="border border-black border-dashed"></div>
          <section className="text-left">
            {
              (dados.venda.nomeCliente || dados.venda.nomeVendedor) &&
              <div>
                {dados.venda.nomeVendedor && <p className="text-xs">Vendedor(a): {dados.venda.nomeVendedor}</p>}
                {dados.venda.nomeCliente && <p className="text-xs">Cliente: {dados.venda.nomeCliente}</p>}
                {dados.venda.enderecoId && <p className="text-xs">Endereço: {`${dados.venda.rua}, ${dados.venda.numero} - ${dados.venda.cidade} - ${dados.venda.uf}`}</p>}
                {dados.venda.telefoneCliente && <p className="text-xs">Telefone: {dados.venda.telefoneCliente}</p>}
                {dados.venda.emailCliente && <p className="">E-mail: {dados.venda.emailCliente}</p>}
                <div className="border border-black border-dashed"></div>
              </div>
            }
          </section>

          <section className=" text-center">
            <div className="flex flex-col text-xs">
              <table className="">
                <thead>
                  <tr>
                    <th className="w-1/6 text-center font-normal">Cod.</th>
                    <th className="w-1/6 text-center font-normal">Quant</th>
                    <th className="w-1/4 text-center font-normal">Val unit</th>
                    <th className="w-1/4 text-center font-normal">Val tot</th>
                  </tr>
                </thead>
                <tbody className="">
                  {
                    dados.produtos && dados.produtos.map((item, key) => (
                      <>
                        <tr className="w-58mm">
                          <td colSpan={4} className="w-58mm text-left">{item.produto_nome}</td>
                        </tr>
                        <tr key={key}>
                          <td className="w-1/6 text-center">{item.variacao_produto_id}</td>
                          <td className="w-1/6 text-center">{(item.quantidade || 0).toFixed(2)}</td>
                          <td className="w-1/4 text-center">{Brl(item.valor || 0)}</td>
                          <td className="w-1/4 text-center">{Brl((item.valor * item.quantidade) || 0)}</td>
                        </tr>
                      </>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <div className="border-b-2 border-black border-dashed"></div>
            <table className="w-full">
              {
                dados.formasPagamento && dados.formasPagamento.map((forma, i) => (
                  <tr key={i}>
                    <td className="text-xs">
                      {forma.forma_pagamento || 'Boleto'}
                    </td>
                    <td className="text-right text-xs">
                      {Brl(forma.total_pago || forma.valor_receber || 0)}
                    </td>
                  </tr>
                ))
              }
            </table>
          </section>
          <section className=" text-center">
            <div className="border border-black border-dashed"></div>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-left text-xs">Produtos</td>
                    <td className="text-right text-xs">{dados.produtos.length}</td>
                  </tr>
                  <tr>
                    <td className="text-left text-xs">Total de produtos (qnt): </td>
                    <td className="text-right text-xs">{(dados.total.quantidadeProdutos || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="text-left text-xs">Sub Total</td>
                    <td className="text-right text-xs">{Brl(dados.total.valorTotal)}</td>
                  </tr>
                  <tr>
                    <td className="text-left text-xs">Desconto</td>
                    <td className="text-right text-xs">{Brl(dados.venda.desconto)}</td>
                  </tr>
                  <tr>
                    <td className="text-left text-xs">Frete</td>
                    <td className="text-right text-xs">{Brl(dados.venda.valor_frete)}</td>
                  </tr>
                  <tr>
                    <td className="text-left text-xs">Total</td>
                    <td className="text-right text-xs">{Brl((dados.total.valorTotal - dados.venda.desconto) + dados.venda.valor_frete || 0)}</td>
                  </tr>
                  <tr>
                    <td className="text-left text-xs">Recebido</td>
                    <td className="text-right text-xs">{Brl(recebido)}</td>
                  </tr>
                  <tr>
                    <td className="text-left text-xs">Troco</td>
                    <td className="text-right text-xs">{Brl(recebido > (dados.total.valorTotal - dados.venda.desconto) ? recebido - (dados.total.valorTotal - dados.venda.desconto) : 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {
            dados.venda.observacaoVenda &&
            <section className="text-center">
              <div className="border border-black border-dashed"></div>
              <p className="text-xs">Observações: {dados.venda.observacaoVenda}</p>
              <div className="border border-black border-dashed"></div>
            </section>
          }
          <section className="p-2">
            <p className="text-xs uppercase text-center">EMITIDO POR <a href="https://app.apploja.com/cadastro" rel="noreferrer">APPLOJA.COM</a></p>
          </section>
        </>) : (<p>Carregando dados</p>)
      }
    </div>
  );
};
