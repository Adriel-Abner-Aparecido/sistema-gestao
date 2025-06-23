import { useEffect, useState } from "react";
import { get } from "../../services/api";
import Router from "next/router";
import { LoadingComponent } from "../LoadingComponent";
import { BsFiletypeXlsx, BsPencilSquare, BsSearch } from "react-icons/bs";
import { ImportarClientesPlanilhaComponent } from "../importarClientesPlanilhaComponent";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { ButtonNew } from "../../ui/button/button-new";

export const CustomerTable = (props) => {
    const [clienteList, setClienteList] = useState([]);
    const [pageAtual, setPageAtual] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState();
    const [loading, setLoading] = useState(false);
    const [importar, setImportar] = useState(false)
    const [nome, setNome] = useState({
        nomecpf: ""
    })

    useEffect(() => {
        props.lastPage(Math.ceil(ultimaPagina / 10))
        setPageAtual(props.atualPagina)
    }, [ultimaPagina, props.atualPagina])

    useEffect(() => {
        loadAll();
        props.setAtualizar(false)
    }, [props.atualizar, pageAtual])

    const openCustomerModal = (cliente) => {
        props.setClienteSelecionado(cliente);
        if (props.statusModal == "hidden") {
            props.setStatusModal("")
        }
    }

    const loadAll = () => {
        setLoading(true);
        get(process.env.NEXT_PUBLIC_API_URL + '/clientespage/10/' + pageAtual).then((data) => {
            if (data.mensagem) {
                if (data.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');
                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setUltimaPagina(data.total_clientes);
                setClienteList(data.clientes);
                setLoading(false);
            }
        })
    }

    const handleSearch = (event) => {
        setNome({
            ...nome, [event.target.name]: event.target.value
        })
    }

    const buscarCliente = async (event) => {
        event.preventDefault()
        setLoading(true)
        if (nome.nomecpf !== "") {
            try {
                const cliente = await get(`${process.env.NEXT_PUBLIC_API_URL}/clientenomecpf/${nome.nomecpf}`)
                setClienteList(cliente)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
                setNome({
                    nomecpf: ""
                })
            }
        } else {
            loadAll()
        }
    }

    return (
        <div className="w-4/5 max-w-screen-xl">
            {loading ? <LoadingComponent /> :
                <div className="w-full relative">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-4">
                            <ButtonNew onClick={() => props.setStatusModal('')} >Novo</ButtonNew>
                            <button className="flex items-center gap-2 p-2 border-2 border-gray-700 rounded-lg" onClick={() => setImportar(!importar)}><BsFiletypeXlsx className='w-5 h-5' /> Importar Planilha</button>
                        </div>
                        <div className="flex flex-row flex-wrap-reverse">
                            <form onSubmit={buscarCliente} className="flex flex-row">
                                <input onChange={handleSearch} name="nomecpf" className="w-[220px] rounded-l-lg p-2.5 text-sm focus:outline-none placeholder-gray-400 text-gray-500 bg-gray-300" placeholder="Nome ou CPF/CNPJ" />
                                <button type="submit" className="p-2.5 text-sm font-medium text-gray-500 bg-gray-200 rounded-r-lg">
                                    <BsSearch className="w-5 h-5" />
                                    <span className="sr-only">Search</span>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="my-5 w-full overflow-x-auto relative shadow-md rounded-lg">
                        <Table>
                            <TableHead>
                                <tr>
                                    <th className="py-3 px-6">
                                        Nome
                                    </th>
                                    <th className="hidden py-3 px-6 sm:table-cell">
                                        Celular
                                    </th>
                                    <th className="hidden py-3 px-6 sm:table-cell">
                                        E-mail
                                    </th>
                                    <th className="hidden py-3 px-6 sm:table-cell">
                                        Cpf
                                    </th>
                                    <th className="text-center py-3 px-6">
                                    </th>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {
                                    clienteList && clienteList.map((item, key) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium">
                                                {item.nome}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {item.celular}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {item.email}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {item.cnpj_cpf}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <a onClick={() => openCustomerModal(item)} className="font-medium text-gray-700 cursor-pointer flex justify-center"><BsPencilSquare className="w-4 h-4" /></a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                    {
                        importar && <ImportarClientesPlanilhaComponent setImportar={setImportar} setUpdate={props.setAtualizar} />
                    }
                </div>
            }
        </div>
    )
}