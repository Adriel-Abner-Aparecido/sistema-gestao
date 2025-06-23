import { useEffect, useState } from "react";
import { get, remove } from "../../services/api";
import { BsCardHeading, BsEnvelopeFill, BsEye, BsEyeFill, BsPrinter, BsTrash, BsX } from 'react-icons/bs';
import Router from "next/router";
import { LoadingComponent } from "../LoadingComponent";
import { utcStringToDateLocal } from "../../services/date";
import { Brl } from "../../services/real";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { SearchForm } from "../../ui/search/search";

export const VendaTable = ({ lastPage, ...props }) => {
    const [vendaList, setVendaList] = useState([]);
    const [pageAtual, setPageAtual] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState();
    const [loading, setLoading] = useState(false);
    const [busca, setBusca] = useState("")
    const [openMenu, setOpenMenu] = useState(null)
    const [pedidoParaExlusao, setPedidoParaExclusao] = useState(null)
    const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)

    const loadAll = async () => {
        setLoading(true);
        try {
            const data = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendaspage/10/${pageAtual}`)
            setUltimaPagina(data.total_vendas);
            setVendaList(data.vendas);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        lastPage(Math.ceil(ultimaPagina / 10));
        setPageAtual(props.atualPagina);
    }, [ultimaPagina, props.atualPagina])

    useEffect(() => {
        if (busca) {
            loadByBusca()
        } else {
            loadAll();
        }
    }, [pageAtual]);

    useEffect(() => {
        if (busca) {
            loadByBusca()
        } else {
            loadAll()
        }
        props.setAtualizar(false)
    }, [props.atualizar])

    const buscarVenda = async (event) => {
        event.preventDefault()
        if (busca !== "") {
            const { vendas, total_vendas } = await get(`${process.env.NEXT_PUBLIC_API_URL}/buscarvendas/10/${pageAtual}/${busca}`)
            setUltimaPagina(total_vendas)
            setVendaList(vendas)
        } else {
            loadAll()
        }
    }

    const loadByBusca = async () => {
        try {
            const { vendas, total_vendas } = await get(`${process.env.NEXT_PUBLIC_API_URL}/buscarvendas/10/${pageAtual}/${busca}`)
            setUltimaPagina(total_vendas)
            setVendaList(vendas)
        } catch (error) {
            console.error(error)
        }
    }

    const toggleMenu = (id) => {
        if (openMenu === id) {
            setOpenMenu(null)
        } else {
            setOpenMenu(id)
        }
    }

    const selecionaPedidoParaExclusao = (pedido) => {
        setPedidoParaExclusao(pedido)
        setPopUpConfirmacao(true)
    }

    const cancelarExclusao = () => {
        setPopUpConfirmacao(false)
        setPedidoParaExclusao(null)
    }

    const excluirPedido = async () => {
        try {
            await remove(`${process.env.NEXT_PUBLIC_API_URL}/vendas/${pedidoParaExlusao}`)
        } catch (error) {
            console.error(error)
        } finally {
            setPopUpConfirmacao(false)
            setPedidoParaExclusao(null)
            props.setAtualizar(true)
        }
    }

    const limpaBusca = () => {
        setBusca("")
        loadAll()
    }

    // console.log("Pedido para exclusao", pedidoParaExlusao)

    return (<>
        <div className="w-4/5 justify-center max-w-screen-xl">
            {loading ? <LoadingComponent /> :
                <div className="w-full relative">
                    <SearchForm onSubmit={buscarVenda} placeholder={"ID Venda ou Cliente"} busca={busca} buscar={setBusca} limpaBusca={limpaBusca} />
                    <div className="my-4 w-full relative shadow-md rounded-lg overflow-x-auto xl:overflow-visible">
                        <Table>
                            <TableHead>
                                <tr>
                                    <th className="py-3 px-6 rounded-tl-lg">
                                        Pedido
                                    </th>
                                    <th className="py-3 px-6 sm:table-cell">
                                        Data
                                    </th>
                                    <th className="py-3 px-6 sm:table-cell">
                                        Cliente
                                    </th>
                                    <th className="py-3 px-6 sm:table-cell">
                                        Valor
                                    </th>
                                    <th className="py-3 px-6 sm:table-cell">
                                        Status
                                    </th>
                                    <th className="text-center sm:table-cell">
                                        Imprimir
                                    </th>
                                    <th className="text-center px-6 sm:table-cell rounded-tr-lg">
                                        Detalhes
                                    </th>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {vendaList.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-medium">
                                            {item.id}
                                        </TableCell>
                                        <TableCell>
                                            {utcStringToDateLocal(item.data)}
                                        </TableCell>
                                        <TableCell className="sm:table-cell">
                                            {item.nome_cliente}
                                        </TableCell>
                                        <TableCell className="sm:table-cell">
                                            {Brl(item.valor || 0)}
                                        </TableCell>
                                        <TableCell className="sm:table-cell">
                                            {item.status}
                                        </TableCell>
                                        <TableCell className="relative text-center sm:table-cell">
                                            <div onClick={() => toggleMenu(item.id)} className={`relative p-1 rounded-full w-6 h-6 mx-auto ${openMenu === item.id && ' bg-gray-400'}`}>
                                                <BsPrinter className="w-4 h-4 cursor-pointer font-bold" />
                                                {
                                                    openMenu === item.id &&
                                                    <div className={`absolute right-0 bg-gray-100 flex flex-col z-10 rounded-lg border-2 border-gray-400 ${key > vendaList.length / 2 ? "bottom-full" : "top-full"}`}>
                                                        <ul className="flex flex-col">
                                                            <li className="list-none">
                                                                <a onClick={() => window.open(`/recibo/a4/${item.id}`, "_blank")} rel="noopener noreferrer" className="flex gap-2 hover:underline py-2 px-4 items-center cursor-pointer font-medium">
                                                                    <BsCardHeading /> a4
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a onClick={() => window.open(`/recibo/80mm/${item.id}`, "_blank")} rel="noopener noreferrer" className="flex gap-2 hover:underline py-2 px-4 items-center cursor-pointer font-medium">
                                                                    <BsCardHeading /> 80mm
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a onClick={() => window.open(`/recibo/58mm/${item.id}`, "_blank")} rel="noopener noreferrer" className="flex gap-2 hover:underline py-2 px-4 items-center cursor-pointer font-medium">
                                                                    <BsCardHeading /> 58mm
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href={`/carne-crediario/${item.id}`} target="_blank" rel="noopener noreferrer" className="flex gap-2 hover:underline py-2 px-4 items-center cursor-pointer font-medium">
                                                                    <BsEnvelopeFill /> Carnes
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                }
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center sm:table-cell">
                                            <div onClick={() => toggleMenu(key)} className={`relative mx-auto p-1 rounded-full w-6 h-6 ${openMenu === key && ' bg-gray-400'}`}>
                                                <FaEllipsisVertical className="flex justify-center items-center cursor-pointer w-4 h-4" />
                                                {
                                                    openMenu === key &&
                                                    <div className={`absolute z-10 right-0 border-2 rounded-lg border-gray-400 divide-y bg-gray-100 divide-gray-200 shadow-lg ${key > vendaList.length / 2 ? "bottom-full" : "top-full"}`}>
                                                        <ul className="list-none">
                                                            <li className="p-2">
                                                                <a href={`/newPdv/${item.id}`} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                    <BsEyeFill /> Visualizar
                                                                </a>
                                                            </li>
                                                            {
                                                                item.status === "Aguardando" || item.status === "Cancelado" ?
                                                                    <li className="p-2">
                                                                        <button onClick={() => selecionaPedidoParaExclusao(item.id)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                            <BsTrash /> Excluir
                                                                        </button>
                                                                    </li>
                                                                    : null
                                                            }

                                                        </ul>
                                                    </div>
                                                }
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            }
        </div>
        <div className={popUpConfirmacao ? "fixed flex flex-col w-full h-full bg-gray-700 bg-opacity-60 items-center justify-center" : 'hidden'}>
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
                <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
                <div className="flex flex-row gap-4">
                    <button onClick={excluirPedido} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                    <button onClick={cancelarExclusao} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
                </div>
            </div>
        </div>
    </>)
}