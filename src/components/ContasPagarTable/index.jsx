import React, { useEffect, useState } from "react";
import { LoadingComponent } from "../LoadingComponent";
import { get, remove } from "../../services/api";
import { Brl } from "../../services/real";
import { utcStringToDateLocal } from "../../services/date";
import { BsEyeFill, BsTrashFill } from "react-icons/bs";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { ButtonNew } from "../../ui/button/button-new";

export const ContasPagarTable = ({ lastPage, ...props }) => {
  const [listContasPagar, setListContasPagar] = useState([]);
  const [pageAtual, setPageAtual] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState();
  const [loading, setLoading] = useState(false);
  const [openMenu, setOpenMenu] = useState(null)
  const [contaPagaParaApagar, setContaPagarParaAPagar] = useState(null)

  useEffect(() => {
    loadAll()
    props.setAtualizar(false)
  }, [props.atualizar])

  const openContasPagarModal = (contaPagar) => {
    props.setContaPagarSelecionado(contaPagar);
    if (props.hiddenContasPagarModal == "hidden") {
      props.setHiddenContasPagarModal("");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const contas = await get(`${process.env.NEXT_PUBLIC_API_URL}/contapagarpage/10/${pageAtual}`)
      setUltimaPagina(contas.total_contas)
      setListContasPagar(contas.contas)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    lastPage(Math.ceil(ultimaPagina / 10))
    setPageAtual(props.atualPagina)
  }, [ultimaPagina, props.atualPagina])

  useEffect(() => {
    setListContasPagar([])
    loadAll();
  }, [props.contaPagarSelecionado, pageAtual]);

  const toggleMenu = (id) => {
    if (openMenu === id) {
      setOpenMenu(null)
    } else {
      setOpenMenu(id)
    }
  }

  const deleteContaPagar = async (apagar) => {

    try {
      await remove(`${process.env.NEXT_PUBLIC_API_URL}/contapagar/${apagar.conta_pagar_id}`)
      apagar.pagamento_pago_id && await remove(`${process.env.NEXT_PUBLIC_API_URL}/pagamentopago/${apagar.pagamento_pago_id}`)
      apagar.operacao_id && await remove(`${process.env.NEXT_PUBLIC_API_URL}/deleteoperacao/${apagar.operacao_id}`)
      console.log("Conta Pagar Apagado")
    } catch (error) {
      console.error(error)
    } finally {
      props.setAtualizar(true)
      setContaPagarParaAPagar(null)
    }

  }

  return (
    <div className="w-4/5 max-w-screen-xl">
      {loading ? (
        <LoadingComponent />
      ) : (<>
        <div className="relative w-full">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-4">
              <ButtonNew onClick={() => openContasPagarModal(null)} >Novo</ButtonNew>
            </div>
          </div>
          <div className="my-4 w-full overflow-x-auto relative shadow-md rounded-lg">
            <Table>
              <TableHead className="text-xs uppercase bg-gray-300">
                <tr>
                  <th className="py-3 px-6 sm:table-cell">Data Vencimento</th>
                  <th className="py-3 px-6">Pagamento</th>
                  <th className="py-3 px-6 sm:table-cell">Fornecedor</th>
                  <th className="py-3 px-6 sm:table-cell">Valor</th>
                  <th className="py-3 px-6 sm:table-cell">Forma de pag</th>
                  <th className="py-3 px-6 sm:table-cell">Situação</th>
                  <th scope="col" className="text-center py-3 px-6">
                  </th>
                </tr>
              </TableHead>
              <TableBody>
                {listContasPagar.map((item, key) => (
                  <TableRow key={key}>
                    <TableCell>{utcStringToDateLocal(item.data_vencimento)}</TableCell>
                    <TableCell className={'font-bold'}>{item.tipo}</TableCell>
                    <TableCell>{item.fornecedor}</TableCell>
                    <TableCell>{Brl(item.valor)}</TableCell>
                    <TableCell>{item.forma_de_pagamento}</TableCell>
                    <TableCell className={'font-bold'}>{item.data_pagamento === '' || item.data_pagamento === null ? "Aberto" : "Pago"}</TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => toggleMenu(key)} className={`relative p-1 rounded-full ${openMenu === key && ' bg-gray-400'}`}>
                        <FaEllipsisVertical />
                        {
                          openMenu === key &&
                          <div className={`absolute z-10 right-0 border-2 rounded-lg border-gray-400 divide-y bg-gray-100 divide-gray-200 shadow-lg ${key > listContasPagar.length / 2 ? "bottom-full" : "top-full"}`}>
                            <ul className="list-none">
                              <li className="p-2">
                                <a onClick={() => openContasPagarModal(item)} target="_blank" rel="noopener noreferrer" className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                  <BsEyeFill /> Visualizar
                                </a>
                              </li>
                              <li className="flex flex-row items-center p-2">
                                <a onClick={() => setContaPagarParaAPagar(item)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                  <BsTrashFill className="font-bold" /> Apagar
                                </a>
                              </li>

                            </ul>
                          </div>
                        }
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className={contaPagaParaApagar ? "absolute flex flex-col w-full h-full bg-gray-700 bg-opacity-60 items-center justify-center top-0 left-0" : 'hidden'}>
          <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
            <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
            <div className="flex flex-row gap-4">
              <button onClick={() => deleteContaPagar(contaPagaParaApagar)} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
              <button onClick={() => setContaPagarParaAPagar(null)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
            </div>
          </div>
        </div>
      </>)}
    </div>
  );
};
