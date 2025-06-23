import { useEffect, useState } from "react";
import { LoadingComponent } from "../LoadingComponent";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { get } from "../../services/api";
import { Brl } from "../../services/real";

export const FluxoDeCaixaTable = (props) => {
  const [loading, setLoading] = useState(false);
  const [dataFluxo, setDataFluxo] = useState([])
  const [total, setTotal] = useState(0)
  const [pageAtual, setPageAtual] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState();
  const [dataInformada, setDataInformada] = useState(() => props.dataInformada)

  console.log(pageAtual)

  const loadAll = async () => {
    setLoading(true);
    try {
      const { fluxo_caixa, total, total_fluxo } = await get(`${process.env.NEXT_PUBLIC_API_URL}/fluxodecaixa/${dataInformada}-01/10/${pageAtual}`)
      setDataFluxo(fluxo_caixa);
      setTotal(total)
      setUltimaPagina(total_fluxo)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    loadAll();
  }, [pageAtual]);

  useEffect(() => {
    loadAll();
    props.setPaginaAtual(1)
  }, [dataInformada])

  useEffect(() => {
    props.setUltimaPagina(Math.ceil(ultimaPagina / 10))
    setPageAtual(props.paginaAtual)
    setDataInformada(props.dataInformada)
  }, [ultimaPagina, props.paginaAtual, props.dataInformada])

  const utcStringToDateLocal = (utcString) => {
    var date = new Date(utcString);
    return date.toLocaleDateString();
  }

  return (<>
    <div className="w-4/5 max-w-screen-xl">
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="w-full">
          <div className="my-4 w-full overflow-x-auto relative shadow-md rounded-lg">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-300">
                <tr>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Data</th>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Descrição</th>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Categoria</th>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Valor</th>
                  <th scope="col" className="py-3 px-6 sm:tabble-cell">Forma Pgto</th>
                  <th scope="col" className="py-3 px-6 sm:tabble-cell">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {
                  dataFluxo && dataFluxo.map((item, key) => (
                    <tr
                      key={key + 1}
                      className="border-b bg-gray-100 hover:bg-gray-200"
                    >
                      <td className="py-4 px-6 font-medium">{utcStringToDateLocal(item.data_pagamento)}</td>
                      <td className="py-4 px-6 font-medium">{item.descricao}</td>
                      <td className="py-4 px-6 font-medium">{item.categoria === null ? "Vendas" : item.categoria}</td>
                      <td className="py-4 px-6 font-medium">{(item.tipo === 'saida' ? '- ' : '') + Brl(item.valor_pago)}</td>
                      <td className="py-4 px-6 sm:table-cell">{item.forma_Pagamento}</td>
                      <td className="py-4 px-6 font-medium">
                        {item.tipo === "entrada" ? <FaArrowUp size={24} className="text-green rounded-full" /> : ""}
                        {item.tipo === "saida" ? <FaArrowDown size={24} className="text-red rounded-full" /> : ""}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr className="border-b bg-gray-100 hover:bg-gray-200">
                  <td className="py-4 px-6 font-medium"></td>
                  <td className="py-4 px-6 font-medium"></td>
                  <td className="py-4 px-6 font-medium"></td>
                  <td className="py-4 px-6 font-medium"></td>
                  <td className="py-4 px-6 font-medium text-right">Total</td>
                  <td className="py-4 px-6 font-medium">{Brl(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div >
  </>)
}