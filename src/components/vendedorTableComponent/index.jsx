import { useEffect, useState } from "react";
import { get } from "../../services/api";
import { LoadingComponent } from "../LoadingComponent";
import { BsPencilSquare } from "react-icons/bs";
import { ButtonNew } from "../../ui/button/button-new";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";

export const VendedorTable = (props) => {
    const [vendedores, setVendedores] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const openUserModal = (user) => {
        props.setVendedorSelecionado(user);
        if (props.hiddenUserModal == "hidden") {
            props.setHiddenUserModal("");
        }
    }

    const loadAll = async () => {
        setIsLoading(true)
        try {
            const usuarios = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendedores`)
            setVendedores(usuarios)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log('Atualizado')
        loadAll();
        props.setAtualizar(false)
    }, [props.atualizar]);

    useEffect(() => {
        loadAll()
    }, [])

    return (

        <div className="w-4/5 max-w-screen-xl">
            {
                isLoading ? <LoadingComponent /> :
                    <div className="w-full relative">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-row gap-4">
                                <ButtonNew onClick={() => props.setHiddenUserModal('')} >Novo</ButtonNew>
                            </div>
                        </div>
                        <div className="my-5 w-full overflow-x-auto relative shadow-md rounded-lg">
                            <Table>
                                <TableHead className="text-xs uppercase bg-gray-300">
                                    <tr>
                                        <th className="py-3 px-6">
                                            ID
                                        </th>
                                        <th className="py-3 px-6">
                                            Nome
                                        </th>
                                        <th className="hidden py-3 px-6 sm:table-cell">
                                            E-mail
                                        </th>
                                        <th className="hidden py-3 px-6 sm:table-cell">
                                            Celular
                                        </th>
                                        <th className="text-center py-3 px-6">
                                        </th>
                                    </tr>
                                </TableHead>
                                <TableBody>
                                    {vendedores.map((item, key) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium">
                                                {item.id}
                                            </TableCell>
                                            <TableCell>
                                                <a onClick={() => openUserModal(item)} className="cursor-pointer hover:underline">{item.nome}</a>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {item.email}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {item.celular}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <a onClick={() => openUserModal(item)} className="font-medium text-gray-700 cursor-pointer justify-center flex"><BsPencilSquare className="w-4 h-4" /></a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
            }
        </div>

    )
}