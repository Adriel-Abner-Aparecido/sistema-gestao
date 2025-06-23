import { useEffect, useState } from "react";
import { LoadingComponent } from "../LoadingComponent"
import { get } from "../../services/api";
import { convertDate } from "../../services/date";
import { FaEllipsisVertical, FaPenToSquare } from "react-icons/fa6";
import { Brl } from "../../services/real";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { TableBody } from "../../ui/table/body";
import { ButtonNew } from "../../ui/button/button-new";

export const CaixaTable = (props) => {
    const [pageAtual, setPageAtual] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState();
    const [loading, setLoading] = useState(false);
    const [caixas, setCaixas] = useState([])
    const [saldos, setSaldos] = useState({});
    const [openMenu, setOpenMenu] = useState(null)


    useEffect(() => {
        buscarcaixas()
    }, [pageAtual])

    useEffect(() => {
        buscarcaixas()
        props.setupdate(false)
    }, [props.update])


    useEffect(() => {
        props.ultimapagina(Math.ceil(ultimaPagina / 10))
        setPageAtual(props.atualPagina)
    }, [ultimaPagina, props.atualPagina])

    const buscarcaixas = async () => {
        setLoading(true)
        try {
            const buscalista = await get(`${process.env.NEXT_PUBLIC_API_URL}/caixaspages/10/${pageAtual}`)
            setCaixas(buscalista.caixa)
            setUltimaPagina(buscalista.total_caixas)
            setLoading(false)
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

    return (
        <>
            <div className="w-4/5 max-w-screen-xl">
                {loading ? <LoadingComponent /> :
                    <div className="w-full">
                        <div className="flex flex-row justify-between items-center">
                            <ButtonNew onClick={() => props.newcaixa('')} >Novo</ButtonNew>
                        </div>
                        <div className="my-4 w-full overflow-x-auto relative shadow-md rounded-lg">
                            <Table>
                                <TableHead>
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            id
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Data
                                        </th>
                                        <th scope="col" className="text-center py-3 px-6 sm:table-cell">
                                            Valor Abertura
                                        </th>
                                        <th scope="col" className="text-center py-3 px-6 sm:table-cell">
                                            Valor Atual
                                        </th>
                                        <th scope="col" className="text-center py-3 px-6 sm:table-cell">
                                            Valor Fechamento
                                        </th>
                                        <th scope="col" className="text-center py-3 px-6 sm:table-cell">
                                            Status
                                        </th>
                                        <th scope="col" className="text-center py-3 px-6">
                                            Operador
                                        </th>
                                        <th scope="col" className="text-center py-3 px-6">
                                        </th>
                                    </tr>
                                </TableHead>
                                <TableBody>
                                    {
                                        caixas && caixas.map((caixa, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="py-4 px-6 font-medium">{caixa.id}</TableCell>
                                                <TableCell className="py-4 px-6 font-medium">{convertDate(caixa.hora_abertura || 0)}</TableCell>
                                                <TableCell className="py-4 px-6 text-right">{Brl(caixa.valor_abertura || 0)}</TableCell>
                                                <TableCell className="py-4 px-6 text-right">{Brl(caixa.saldo_final || 0)}</TableCell>
                                                <TableCell className="py-4 px-6 text-right">{Brl(caixa.valor_fechamento || 0)}</TableCell>
                                                <TableCell className="py-4 px-6 text-center">{caixa.status}</TableCell>
                                                <TableCell className="py-4 px-6 text-center">{caixa.nome_usuario}</TableCell>
                                                <TableCell className="py-4 px-6 text-center">
                                                    <button className={`relative p-1 rounded-full ${openMenu === caixa.id && ' bg-gray-400'}`} onClick={() => toggleMenu(caixa.id)}>
                                                        <FaEllipsisVertical />
                                                        {
                                                            openMenu === caixa.id &&
                                                            <div className={`absolute z-10 right-0 border-2 rounded-lg border-gray-400 divide-y bg-gray-100 divide-gray-200 shadow-lg ${i > caixas.length / 2 ? 'bottom-full' : 'top-full'}`}>
                                                                <ul className="list-none">
                                                                    <li className="p-2">
                                                                        <button onClick={() => props.data(caixa)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                            <FaPenToSquare /> Editar
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        }
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}