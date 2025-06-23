import { useEffect, useState } from "react";
import { Brl } from "../../services/real";
const qz = require('qz-tray')

export const Recibo80mm = ({ dadosRecibo }) => {

  const [dados, setDados] = useState({
    venda: {},
    produtos: [{}],
    total: {},
  })
  const [recebido, setRecebido] = useState(0)

  useEffect(() => {
    if (dadosRecibo) {
      setDados(dadosRecibo)
      setRecebido(() => (dadosRecibo.formasPagamento || []).reduce((acc, item) => acc + (item.total_pago + item.troco || 0), 0))
    }
  }, [dadosRecibo]);


  const convertUtcToLocal = (dateUtc) => {
    let localDate = new Date(dateUtc);

    return localDate.toLocaleString();
  }

  console.log(dados)

  return (
    <div id="recibo" className="bg-white px-4 w-80mm h-80">
      {
        dados && dados.venda ? (<>
          <header className="flex flex-row justify-between items-center gap-3 p-2">
            <div className="flex flex-col items-center justify-center">
              {dados.venda.logo_image ? (
                <img src={dados.venda.logo_image} className="w-16 h-16" alt="Logo da Empresa" />
              ) : (
                <img src="/images/logoAPPLoja.png" alt="Logo da Empresa" className="h-16 w-16 m-auto" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xs font-medium">{dados.venda.nomeEmpresa}</h1>
              <h2 className="text-xs">Recibo nº {dados.venda.vendaId}</h2>
              <div>
                {/* <p>Otavio vieira</p> */}
                <p className="text-center text-xs">Data: {convertUtcToLocal(dados.venda.data)}</p>
                {/* <p>{fulldata}</p> */}
              </div>
            </div>
          </header>
          <div className="border-b-2 border-black border-dashed"></div>
          {/* <section className=" text-left">
            <div>
            <h2 className="text-xl font-medium text-center">Informações da Empresa</h2>
            <p className="">Razão social: {dados.venda.nomeEmpresa}</p>
            
              {dados.venda.ruaEmpresa && <p className="">Endereço: {dados.venda.ruaEmpresa} {dados.venda.numeroEmpresa && `- ${dados.venda.numeroEmpresa}`}</p>}
              {dados.venda.ruaEmpresa && <p className="">{dados.venda.cidadeEmpresa}, {dados.venda.ufEmpresa}</p>}
              {dados.venda.telefoneEmpresa && <p className="">Telefone: {dados.venda.telefoneEmpresa}</p>}
              {dados.venda.cnpjEmpresa && <p className="">CPNJ: {dados.venda.cnpjEmpresa}</p>}
              <div className="border border-black border-dashed"></div>
              </div>
              </section> */}
          <section className=" text-left">
            {
              (dados.venda.nomeCliente || dados.venda.nomeVendedor) &&
              <div className="border-b-2 border-black border-dashed">
                {dados.venda.nomeVendedor && <p className="text-xs">Vendedor(a): {dados.venda.nomeVendedor}</p>}
                {dados.venda.nomeCliente && <p className="text-xs">Cliente: {dados.venda.nomeCliente}</p>}
                {dados.venda.enderecoId && <p className="text-xs">Endereço: {`${dados.venda.rua}, ${dados.venda.numero} - ${dados.venda.cidade} - ${dados.venda.uf}`}</p>}
                {dados.venda.telefoneCliente && <p className="text-xs">Telefone: {dados.venda.telefoneCliente}</p>}
                {dados.venda.emailCliente && <p className="text-xs">E-mail: {dados.venda.emailCliente}</p>}
              </div>
            }

          </section>


          <section className="text-center m-auto">
            {/* <h2 className="text-xl font-bold">Detalhes do Pedido</h2> */}
            <div className="flex flex-col">
              <table>
                <thead>
                  <tr>
                    <th className="w-auto text-center text-xs font-normal">Cod.</th>
                    <th className="w-auto text-center text-xs font-normal">Qtd</th>
                    <th className="w-1/4 text-center text-xs font-normal">Un</th>
                    <th className="w-1/4 text-center text-xs font-normal">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.produtos && dados.produtos.map((item, i) => (
                    <>
                      <tr className="w-58mm">
                        <td colSpan={4} className="w-58mm text-xs text-left">{item.produto_nome}</td>
                      </tr>
                      <tr key={i}>
                        <td className="w-auto text-center text-xs" >{item.variacao_produto_id}</td>
                        <td className="w-auto text-center text-xs" >{(item.quantidade || 0).toFixed(2)}</td>
                        <td className="w-auto text-center text-xs" >{Brl(item.valor || 0)}</td>
                        <td className="w-auto text-center text-xs" >{Brl((item.valor * item.quantidade) || 0)}</td>
                      </tr>
                    </>
                  ))}
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
            <div className="border-b-2 border-black border-dashed"></div>
            <div>
              {/* <h2 className="text-xl font-medium ">Pagamento</h2> */}
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-left text-xs">Items</td>
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
              <div>
                <div className="border border-black border-dashed"></div>
                <p className="text-xs text-left">Observações: {dados.venda.observacaoVenda}</p>
                <div className="border border-black border-dashed"></div>
              </div>
            </section>
          }
          <section className="p-2">
            <p className="text-[7px] uppercase font-medium text-center">EMITIDO POR <a href="https://app.apploja.com/cadastro" rel="noreferrer" target="_blank">APPLOJA.COM</a></p>
          </section>
        </>) : (<p>Carregando dados</p>)
      }
    </div>
  );
};
