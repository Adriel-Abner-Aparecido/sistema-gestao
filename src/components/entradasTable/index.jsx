import { useEffect, useState } from "react";
import { get } from "../../services/api";
import { LoadingComponent } from "../LoadingComponent";
import { convertDate } from "../../services/date";
import { FaEllipsisVertical, FaPenToSquare } from "react-icons/fa6";
import { BsFiletypeXml } from "react-icons/bs";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { ButtonNew } from "../../ui/button/button-new";

export const EntradasTable = (props) => {
    const [entradas, setEntradas] = useState(null);
    const [pageAtual, setPageAtual] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState();
    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(null)

    useEffect(() => {
        props.lastPage(Math.ceil(ultimaPagina / 10))
        setPageAtual(props.atualPagina)
    }, [ultimaPagina, props.atualPagina])

    useEffect(() => {
        loadAll();
        props.setAtualizar(false)
    }, [props.atualizar, pageAtual]);


    const loadAll = async () => {
        setLoading(true);
        try {
            const entradas = await get(`${process.env.NEXT_PUBLIC_API_URL}/entradas/10/${pageAtual}`)
            setUltimaPagina(entradas.total_entradas)
            setEntradas(entradas.entradas)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
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
        <div className="w-4/5 max-w-screen-xl">
            {loading ? <LoadingComponent /> :
                <div className="w-full">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex gap-4">
                            <ButtonNew onClick={() => props.newEntrada(true)} >Novo</ButtonNew>
                            <button className="flex items-center gap-2 p-2 border-2 border-gray-700 rounded-lg" onClick={() => props.importar("")}>
                                <BsFiletypeXml className='w-5 h-5' />Importar
                            </button>
                        </div>
                    </div>
                    <div className="my-4 w-full relative shadow-md rounded-lg overflow-hidden">
                        <Table>
                            <TableHead>
                                <tr>
                                    <th scope="col" className="py-3 px-6">
                                        id
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Fornecedor
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        NF
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Data
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Motivo
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Valor
                                    </th>
                                    <th scope="col" className="text-center py-3 px-6">
                                    </th>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {
                                    entradas && entradas.map((entrada, key) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium">
                                                {entrada.id}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {entrada.nome}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {entrada.numero_nota_fiscal}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {convertDate(entrada.created_at)}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {entrada.motivo}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                R$ {entrada.valor_nota?.toFixed(2).replace('.', ',')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <button className={`relative p-1 rounded-full ${openMenu === entrada.id && ' bg-gray-400'}`} onClick={() => toggleMenu(entrada.id)}>
                                                    <FaEllipsisVertical />
                                                    {
                                                        openMenu === entrada.id &&
                                                        <div className={`absolute z-10 right-0 border-2 rounded-lg border-gray-400 divide-y bg-gray-100 divide-gray-200 shadow-lg ${key > parseInt((entradas.length - 1) / 2) ? "bottom-full" : "top-full"}`}>
                                                            <ul className="list-none">
                                                                <li className="p-2">
                                                                    <button onClick={() => props.setEntradaSelecionada(entrada)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
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
    )
}