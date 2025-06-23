import { useEffect, useState } from "react";
import { get } from "../../services/api";
import { LoadingComponent } from "../LoadingComponent";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { ButtonNew } from "../../ui/button/button-new";

export const UserTable = (props) => {
    const [usuarioList, setUsuarioList] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const openUserModal = (user) => {
        props.setUserSelecionado(user);
        if (props.hiddenUserModal == "hidden") {
            props.setHiddenUserModal("");
        }
    }

    const loadAll = async () => {
        setIsLoading(true)
        try {
            const usuarios = await get(`${process.env.NEXT_PUBLIC_API_URL}/usuariosempresa`)
            setUsuarioList(usuarios)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log('Atualizado')
        setUsuarioList([])
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
                        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                            <div className="flex flex-row gap-2 md:gap-4">
                                <ButtonNew onClick={() => props.setHiddenUserModal('')} >Novo</ButtonNew>
                            </div>
                        </div>
                        <div className="my-5 w-full overflow-x-auto relative shadow-md rounded-lg">
                            <Table>
                                <TableHead>
                                    <tr>
                                        <th className="hidden py-3 px-6">
                                            ID
                                        </th>
                                        <th className="py-3 px-6 sm:table-cell">
                                            Nome
                                        </th>
                                        <th className="hidden py-3 px-6 sm:table-cell">
                                            E-mail
                                        </th>
                                        <th className="text-center py-3 px-6">
                                        </th>
                                    </tr>
                                </TableHead>
                                <TableBody>
                                    {usuarioList.map((item, key) => (
                                        <TableRow key={key}>
                                            <TableCell className="hidden font-medium text-white">
                                                {item.id}
                                            </TableCell>
                                            <TableCell className="sm:table-cell">
                                                {item.username}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {item.email}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <a onClick={() => openUserModal(item)} className="font-medium text-blue-500 hover:underline cursor-pointer">Editar</a>
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