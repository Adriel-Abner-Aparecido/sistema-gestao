import { useEffect, useState } from "react";
import { get } from "../../services/api";
import { BsFiletypeXlsx, BsPencilSquare, BsSearch } from "react-icons/bs";
import { LoadingComponent } from "../LoadingComponent";
import { ImportarFornecedoresPlanilhaComponent } from "../importarFornecedoresPlanilhaComponent";
import { Table } from "../../ui/table/table";
import { TableHead, } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { ButtonNew } from "../../ui/button/button-new";

export const ProviderTable = (props) => {

    const [fornecedorList, setFornecedorList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageAtual, setPageAtual] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState();
    const [importar, setImportar] = useState(false);
    const [nome, setNome] = useState({
        nomecnpj: ""
    });

    useEffect(() => {
        props.lastPage(Math.ceil(ultimaPagina / 10))
        setPageAtual(props.atualPagina)
    }, [ultimaPagina, props.atualPagina])

    useEffect(() => {
        loadAll();
    }, []);

    useEffect(() => {
        loadAll();
        props.setAtualizar(false)
    }, [props.atualizar, pageAtual]);

    const openProviderModal = (fornecedor) => {
        props.setFornecedorSelecionado(fornecedor);
        if (props.statusModal == "hidden") {
            props.setStatusModal("")
        }
    }

    const loadAll = async () => {
        setLoading(true)
        try {
            const fornecedores = await get(`${process.env.NEXT_PUBLIC_API_URL}/fornecedores/10/${pageAtual}`)
            setFornecedorList(fornecedores.fornecedores)
            setUltimaPagina(fornecedores.total_fornecedores)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (event) => {
        setNome({ ...nome, [event.target.name]: event.target.value })
    }

    const buscarFornecedor = async (event) => {
        event.preventDefault()
        setLoading(true)
        if (nome.nomecnpj !== "") {
            try {
                const fornecedor = await get(`${process.env.NEXT_PUBLIC_API_URL}/fornecedornomecnpj/${nome.nomecnpj}`)
                setFornecedorList(fornecedor)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
                setNome({
                    nomecnpj: ""
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
                            <form onSubmit={buscarFornecedor} className="flex flex-row">
                                <input onChange={handleSearch} name="nomecnpj" className="w-[220px] rounded-l-lg p-2.5 text-sm focus:outline-none placeholder-gray-400 text-gray-500 bg-gray-300" placeholder="Nome ou CNPJ/CPF" />
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
                                        CNPJ
                                    </th>
                                    <th className="text-center py-3 px-6">
                                    </th>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {
                                    fornecedorList && fornecedorList.map((item, key) => (
                                        <TableRow key={key}>
                                            <TableCell className="font-medium ">
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
                                                <a onClick={() => openProviderModal(item)} className="font-medium text-gray-700 cursor-pointer flex justify-center"><BsPencilSquare className="w-4 h-4" /></a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                    {
                        importar && <ImportarFornecedoresPlanilhaComponent setImportar={setImportar} setUpdate={props.setAtualizar} />
                    }
                </div>
            }
        </div>
    )
}