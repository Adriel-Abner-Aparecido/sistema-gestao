import React, { useEffect, useState } from "react";
import { LoadingComponent } from "../LoadingComponent";
import { get, remove } from "../../services/api";
import { Brl } from "../../services/real";
import { utcStringToDateLocal } from "../../services/date"
import { FaEllipsisVertical } from "react-icons/fa6";
import { BsEyeFill, BsTrashFill, BsX } from "react-icons/bs";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { ButtonNew } from "../../ui/button/button-new";

export const ContasReceberTable = ({ lastPage, ...props }) => {
  const [listContasReceber, setListContasReceber] = useState([]);
  const [pageAtual, setPageAtual] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState();
  const [openMenu, setOpenMenu] = useState(null)
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("")
  const [contaReceberParaApagar, setContaReceberParaApagar] = useState(null)

  const openContasReceberModal = (contaReceber) => {
    props.setContaReceberSelecionado(contaReceber);
    if (props.hiddenContasReceberModal == "hidden") {
      props.setHiddenContasReceberModal("");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await get(`${process.env.NEXT_PUBLIC_API_URL}/contareceberpage/10/${pageAtual}`)
      setListContasReceber(data.contas);
      setUltimaPagina(data.total_contas);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll()
    props.setAtualizar(false)
    console.log("Atualizou!")
  }, [props.atualizar])

  useEffect(() => {
    lastPage(Math.ceil(ultimaPagina / 10))
    setPageAtual(props.atualPagina)
  }, [ultimaPagina, props.atualPagina])

  useEffect(() => {
    if (busca) {
      loadByBusca()
    } else {
      loadAll();
    }
  }, [pageAtual]);

  const toggleMenu = (id) => {
    if (openMenu === id) {
      setOpenMenu(null)
    } else {
      setOpenMenu(id)
    }
  }

  const loadByBusca = async () => {
    try {
      const { contas, total_contas } = await get(`${process.env.NEXT_PUBLIC_API_URL}/buscarcontareceber/10/${pageAtual}/${busca}`)
      if (contas.length > 0) {
        setUltimaPagina(total_contas)
        setListContasReceber(contas)
      } else {
        setListContasReceber([])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const buscarConta = async (event) => {
    event.preventDefault()
    if (busca !== "") {
      const { contas, total_contas } = await get(`${process.env.NEXT_PUBLIC_API_URL}/buscarcontareceber/10/${pageAtual}/${busca}`)
      if (contas.length > 0) {
        setUltimaPagina(total_contas)
        setListContasReceber(contas)
      } else {
        setUltimaPagina(0)
        setListContasReceber([])
      }
    } else {
      loadAll()
    }
  }

  const limpaBusca = () => {
    setBusca("")
    loadAll()
  }

  const excluirContaReceber = async (conta) => {

    try {

      await remove(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/${conta.conta_receber_id}`)
      conta.pagamento_recebido_id && await remove(`${process.env.NEXT_PUBLIC_API_URL}/pagamentorecebido/${conta.pagamento_recebido_id}`)
      conta.operacao_id && await remove(`${process.env.NEXT_PUBLIC_API_URL}/deleteoperacao/${conta.operacao_id}`)
      console.log("Contareceber Apagada")

    } catch (error) {
      console.error(error)
    } finally {
      props.setAtualizar(true)
      setContaReceberParaApagar(null)
    }

  }

  console.log("Busca", busca)

  return (
    <div className="w-4/5 max-w-screen-xl">
      {loading ? (
        <LoadingComponent />
      ) : (<>
        <div className="w-full">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-4">
              <ButtonNew onClick={() => openContasReceberModal(null)} >Novo</ButtonNew>
            </div>
            <form onSubmit={buscarConta} className="flex flex-row flex-nowrap">
              <div className="relative flex items-center">
                <input onChange={(e) => setBusca(e.target.value)} value={busca} className="w-[220px] rounded-l-lg p-2.5 text-sm focus:outline-none placeholder-gray-400 text-gray-500 bg-gray-300" placeholder="Nome Cliente" />
                {
                  busca && <button onClick={limpaBusca} type="button" className="absolute flex items-center right-0 rounded-full bg-gray-700 mr-2"><BsX className="text-white" /></button>
                }
              </div>
              <button type="submit" className="p-2.5 text-sm font-medium text-gray-500 bg-gray-200 rounded-r-lg">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </form>
          </div>
          <div className="my-4 w-full overflow-x-auto relative shadow-md rounded-lg">
            <Table>
              <TableHead>
                <tr>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Data Vencimento</th>
                  <th scope="col" className="py-3 px-6">Recebimento</th>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Cliente</th>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Valor</th>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Forma de pag</th>
                  <th scope="col" className="py-3 px-6 sm:table-cell">Situação</th>
                  <th scope="col" className="text-center py-3 px-6">
                  </th>
                </tr>
              </TableHead>
              <TableBody>
                {listContasReceber.map((item, key) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{utcStringToDateLocal(item.data_vencimento)}</TableCell>
                    <TableCell className="font-medium">{item.tipo}</TableCell>
                    <TableCell className="font-medium">{item.cliente}</TableCell>
                    <TableCell className="font-medium">{item.valor_pago ? Brl(item.valor_pago) : Brl(item.valor)}</TableCell>
                    <TableCell className="sm:table-cell">{item.forma_de_pagamento || ""}</TableCell>
                    <TableCell className="sm:table-cell">{item.data_pagamento ? "Pago" : "Aberto"}</TableCell>
                    <TableCell className="text-center">
                      <button onClick={() => toggleMenu(key)} className={`relative p-1 rounded-full ${openMenu === key && ' bg-gray-400'}`}>
                        <FaEllipsisVertical />
                        {
                          openMenu === key &&
                          <div className={`absolute z-10 right-0 border-2 rounded-lg border-gray-400 divide-y bg-gray-100 divide-gray-200 shadow-lg ${key > listContasReceber.length / 2 ? "bottom-full" : "top-full"}`}>
                            <ul className="list-none">
                              <li className="p-2">
                                <a onClick={() => openContasReceberModal(item)} target="_blank" rel="noopener noreferrer" className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                  <BsEyeFill /> Visualizar
                                </a>
                              </li>
                              <li className="flex flex-row items-center p-2">
                                <a onClick={() => setContaReceberParaApagar(item)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
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
        <div className={contaReceberParaApagar ? "absolute flex flex-col w-full h-full bg-gray-700 bg-opacity-60 items-center justify-center top-0 left-0" : 'hidden'}>
          <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
            <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
            <div className="flex flex-row gap-4">
              <button onClick={() => excluirContaReceber(contaReceberParaApagar)} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
              <button onClick={() => setContaReceberParaApagar(null)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
            </div>
          </div>
        </div>
      </>)}
    </div>
  );
};
