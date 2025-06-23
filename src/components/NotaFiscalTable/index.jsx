import { useEffect, useRef, useState } from "react";
import { get, post } from "../../services/api";
import Router from "next/router";
import { LoadingComponent } from "../LoadingComponent";
import { FaEllipsisVertical, FaPrint } from "react-icons/fa6";
import Link from "next/link";
import { BsArrowCounterclockwise, BsBan, BsFiletypeXml, BsX } from "react-icons/bs";
import { utcStringToDateLocal } from "../../services/date";
import { saveAs } from "file-saver";
import { Brl } from "../../services/real"
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableRow } from "../../ui/table/row";
import { TableBody } from "../../ui/table/body";
import { TableCell } from "../../ui/table/cell";

export const NotaFiscalTable = (props) => {
    const [notaFiscalList, setNotaFiscalList] = useState([]);
    const [pageAtual, setPageAtual] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState();
    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(null)

    const openNotaFiscalModal = (notaFiscal) => {
        props.setNotaFiscalSelecionado(notaFiscal);
        if (props.statusModal == "hidden") {
            props.setStatusModal("")
        }
    }

    const loadAll = async () => {
        setLoading(true);
        get(process.env.NEXT_PUBLIC_API_URL + '/nfepage/10/' + props.atualPagina + '').then((data) => {
            if (data.mensagem) {
                if (data.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setUltimaPagina(data.total_notasFiscais);
                setNotaFiscalList(data.notasFiscais);
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        props.lastPage(Math.ceil(ultimaPagina / 10))
        setPageAtual(props.atualPagina)
    }, [ultimaPagina, props.atualPagina])

    useEffect(() => {
        loadAll();
    }, [props.atualPagina]);

    useEffect(() => {
        loadAll()
        props.setReload(false)
    }, [props.reload])

    const toggleMenu = (id) => {
        if (openMenu === id) {
            setOpenMenu(null)
        } else {
            setOpenMenu(id)
        }
    }

    const consultaEAtualizaNfe = async (uuid) => {

        setLoading(true)

        try {
            const busca = await get(`${process.env.NEXT_PUBLIC_API_URL}/consultanfe/${uuid}`)
            console.log("resultado da busca!", busca)
            if (busca.message) {
                props.setReload(true)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }

    }

    const tempoParaCancelarNota = (date) => {

        const dataEmissao = new Date(date)
        const dataAtual = new Date()

        const tempoInicial = dataEmissao.getTime()
        const tempoFinal = dataAtual.getTime()

        const tempoRestante = (tempoFinal - tempoInicial) / (1000 * 60 * 60)

        return parseInt(tempoRestante)
    }

    const baixarXml = async (url, filename) => {

        try {

            const res = await fetch(url)

            if (!res.ok) {
                throw new Error(`Erro ao tentar baixar arquivo:`)
            }

            const xmlContent = await res.text()

            const blob = new Blob([xmlContent], { type: "application/xml" })

            saveAs(blob, `nota_fiscal_${filename}.xml`)

        } catch (error) {
            console.error(error)
        }

    }

    const cancelaNota = (nota) => {
        props.setPopUpCancelarNota(true)
        props.setNotaParaCancelar(nota)
    }

    // console.log(notaFiscalList)

    return (<>
        <div className="flex flex-col w-4/5 max-w-screen-xl">
            {loading ? <LoadingComponent /> :
                <div className="w-full relative">
                    <div className="w-full shadow-md rounded-lg">
                        <Table>
                            <TableHead>
                                <tr>
                                    <th className="hidden font-medium px-2 py-3 sm:py-4 sm:table-cell rounded-tl-lg">
                                        ID
                                    </th>
                                    <th className="font-medium px-2 py-3 sm:py-4 sm:table-cell rounded-tl-lg sm:rounded-tl-none">
                                        NF
                                    </th>
                                    <th className="font-medium px-2 py-3 sm:py-4 sm:table-cell">
                                        Data
                                    </th>
                                    <th className="font-medium px-2 py-3 sm:py-4 hidden sm:table-cell">
                                        Venda
                                    </th>
                                    <th className="font-medium px-2 py-3 sm:py-4 hidden sm:table-cell">
                                        Valor
                                    </th>
                                    <th className="font-medium px-2 py-3 sm:py-4 sm:table-cell">
                                        Status
                                    </th>
                                    <th className="font-medium px-2 py-3 sm:py-4 hidden md:table-cell">
                                        Motivo
                                    </th>
                                    <th className="font-medium px-2 py-3 sm:py-4 sm:table-cell">
                                        Tipo
                                    </th>
                                    <th className="font-medium text-center sm:table-cell rounded-tr-lg">
                                        <button onClick={() => openNotaFiscalModal({})} className="bg-green-500 hidden rounded px-4 py-1 hover:bg-green-400 cursor-pointer">Nova</button>
                                    </th>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {notaFiscalList.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell className="hidden sm:py-4 font-medium sm:table-cell">
                                            {item.id}
                                        </TableCell>
                                        <TableCell className="sm:py-4 sm:table-cell">
                                            {item.nfe_numero}
                                        </TableCell>
                                        <TableCell className="sm:py-4 sm:table-cell">
                                            {utcStringToDateLocal(item.log?.dhRecbto || item.created_at)}
                                        </TableCell>
                                        <TableCell className="hidden sm:py-4 font-medium sm:table-cell">
                                            <a className="hover:underline" href={`/newPdv/${item.venda_id}`}>{item.venda_id}</a>
                                        </TableCell>
                                        <TableCell className="sm:py-4 sm:table-cell uppercase">
                                            {Brl(item.valor)}
                                        </TableCell>
                                        <TableCell className="sm:py-4 sm:table-cell uppercase">
                                            {item.status}
                                        </TableCell>
                                        <TableCell className="hidden sm:py-4 md:table-cell">
                                            {item.motivo}
                                        </TableCell>
                                        <TableCell className="sm:py-4 sm:table-cell uppercase">
                                            {item.modelo}
                                        </TableCell>
                                        <TableCell className="text-center sm:py-4 sm:table-cell">
                                            <button onClick={() => toggleMenu(item.id)} className={`relative p-1 rounded-full ${openMenu === item.id && ' bg-gray-400'}`}>
                                                <FaEllipsisVertical />
                                                {
                                                    openMenu === item.id &&
                                                    <div className={`absolute z-10 right-0 border-2 rounded-lg border-gray-400 divide-y bg-gray-100 divide-gray-200 shadow-lg ${key > notaFiscalList.length / 2 ? "bottom-full" : "top-full"}`}>
                                                        <ul className="list-none">
                                                            <li className="p-2">
                                                                <a href={item.danfe} target="_blank" rel="noopener noreferrer" className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                    <FaPrint /> Danfe
                                                                </a>
                                                            </li>
                                                            <li className="flex flex-row items-center p-2">
                                                                <a onClick={() => baixarXml(item.xml, item.nfe_numero)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                    <BsFiletypeXml className="font-bold" /> XML
                                                                </a>
                                                            </li>
                                                            <li className="flex flex-row items-center p-2">
                                                                <a onClick={() => consultaEAtualizaNfe(item.uuid)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                    <BsArrowCounterclockwise className="font-bold" /> Atualizar
                                                                </a>
                                                            </li>
                                                            {
                                                                item.status !== "cancelado" && tempoParaCancelarNota(item.log?.dhRecbto) < 24 &&
                                                                <li className="flex flex-row items-center p-2">
                                                                    <a onClick={() => cancelaNota(item)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer">
                                                                        <BsBan className="font-bold" /> Cancelar
                                                                    </a>
                                                                </li>
                                                            }

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
            }
        </div>
    </>)
}