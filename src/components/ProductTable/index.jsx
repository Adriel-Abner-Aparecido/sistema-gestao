import { useEffect, useState } from "react";
import { get } from "../../services/api";
import Router from "next/router";
import { LoadingComponent } from "../LoadingComponent";
import { FaArrowCircleUp, FaArrowUp } from 'react-icons/fa';
import { ProtectedComponent, ProtectedOperation } from "../../context";
import { FaEllipsisVertical, FaPenToSquare } from "react-icons/fa6";
import { BsCaretDownFill, BsCaretUpFill, BsFiletypeXlsx, BsSearch } from "react-icons/bs";
import { Brl } from "../../services/real"
import { ImportarProdutosPlanilhaComponent } from "../importarProdutosPlanilhaComponent";
import { Table } from "../../ui/table/table";
import { TableHead } from "../../ui/table/head";
import { TableBody } from "../../ui/table/body";
import { TableRow } from "../../ui/table/row";
import { TableCell } from "../../ui/table/cell";
import { SearchForm } from "../../ui/search/search";
import { ButtonNew } from "../../ui/button/button-new";

export const ProductTable = ({ lastPage, ...props }) => {

    const [estoqueCompletoList, setEstoqueCompletoList] = useState([]);
    const [pageAtual, setPageAtual] = useState(1);
    const [ultimaPagina, setUltimaPagina] = useState();
    const [loading, setLoading] = useState(false);
    const [openMenu, setOpenMenu] = useState(null)
    const [orderBy, setOrderBy] = useState('estoque.id')
    const [order, setOrder] = useState('DESC')
    const [importar, setImportar] = useState(false)
    const [busca, setBusca] = useState('')

    useEffect(() => {
        const ordenamento = typeof window !== "undefined" ? localStorage.getItem("ordenar") : null;
        const ordem = typeof window !== "undefined" ? localStorage.getItem("ordem") : null;
        if (ordenamento) setOrderBy(ordenamento);
        if (ordem) setOrder(ordem);
    }, [])

    useEffect(() => {
        loadAll();
        props.setAtualizar(false)
    }, [props.atualizar, pageAtual, orderBy, order]);


    useEffect(() => {
        localStorage.setItem('ordenar', orderBy)
        localStorage.setItem("ordem", order)
    }, [orderBy, order])

    useEffect(() => {
        lastPage(Math.ceil(ultimaPagina / 10))
        setPageAtual(props.atualPagina)
    }, [ultimaPagina, props.atualPagina])

    const openProductModal = (produto) => {
        props.setProdutoSelecionado(produto);
        if (props.statusModal == "hidden") {
            props.setStatusModal("")
            props.setAtualizarModel(!props.atualizarModel)
        }
    }

    const openEntradaProdutoModal = (produto) => {
        props.setProdutoSelecionado(produto);
        if (props.hiddenEntradaProdutoModal == "hidden") {
            props.setHiddenEntradaProdutoModal("")
            props.setAtualizarModel(!props.atualizarModel)
        }
    }

    const loadAll = async () => {
        setLoading(true);
        try {
            const produtos = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoquepage/10/${pageAtual}/${orderBy}/${order}`)
            setUltimaPagina(produtos.total_estoque)
            setEstoqueCompletoList(produtos.estoque)
        } catch (error) {
            console.error("Erro ao buscar dados no banco de dados", error)
        } finally {
            setLoading(false)
        }
    }

    const handleBusca = (value) => {
        setBusca(value)
        console.log(encodeURIComponent(value).toLowerCase())
    }

    const limpaBusca = () => {
        setBusca('')
        loadAll()
    }

    const buscarProduto = () => {
        setLoading(true);
        setEstoqueCompletoList([])

        const encodeBusca = encodeURIComponent(busca).toLowerCase()

        if (busca == '') {
            loadAll();
        } else {
            get(`${process.env.NEXT_PUBLIC_API_URL}/estoquenomecodigo/${encodeBusca}`).then((dataEstoque) => {
                if (dataEstoque.mensagem) {
                    if (dataEstoque.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {
                    setUltimaPagina(dataEstoque.total_estoque);
                    setEstoqueCompletoList(dataEstoque);
                    setLoading(false);
                }
            })
        }
    }

    const keyPressInput = (event) => {
        if (event.keyCode == 13) {
            buscarProduto();
        }
    }

    const toggleMenu = (id) => {
        if (openMenu === id) {
            setOpenMenu(null)
        } else {
            setOpenMenu(id)
        }
    }

    const ordem = () => {
        setOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"))
    }

    const ordenarPor = (orderby) => {
        setOrderBy(orderby)
    }

    console.log("Ordenação", orderBy)

    return (
        <div className="w-4/5 justify-center max-w-screen-xl">
            {loading ? <LoadingComponent /> :
                <div className="w-full relative">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                        <div className="flex flex-row gap-2 md:gap-4">
                            <ButtonNew onClick={() => props.setStatusModal('')} >Novo</ButtonNew>
                            <button className="flex items-center gap-2 p-2 border-2 border-gray-700 rounded-lg" onClick={() => setImportar(!importar)}><BsFiletypeXlsx className='w-5 h-5' />Importar Planilha</button>
                        </div>
                        <SearchForm busca={busca} buscar={(e) => handleBusca(e)} limpaBusca={limpaBusca} onSubmit={buscarProduto} placeholder={"Nome ou Código do Produto"} />
                    </div>
                    <div className="my-4 w-full relative shadow-md overflow-x-scroll rounded-lg">
                        <Table>
                            <TableHead>
                                <tr>
                                    <th onClick={() => ordenarPor('estoque.id')} scope="col" className="hover:cursor-pointer hidden px-2 py-3 sm:px-2 sm:py-4 xl:px-6 md:table-cell">
                                        <div className="flex gap-2 justify-between items-center">
                                            id <button onClick={ordem}>{orderBy === 'estoque.id' ? order === 'ASC' ? <BsCaretUpFill /> : <BsCaretDownFill /> : null}</button>
                                        </div>
                                    </th>
                                    <th onClick={() => ordenarPor('produto.nome')} scope="col" className="hover:cursor-pointer px-2 py-3 sm:px-2 sm:py-4 xl:px-6">
                                        <div className="flex gap-2 justify-between items-center">
                                            Nome <button onClick={ordem}>{orderBy === 'produto.nome' ? order === 'ASC' ? <BsCaretUpFill /> : <BsCaretDownFill /> : null}</button>
                                        </div>
                                    </th>
                                    <th onClick={() => ordenarPor('variacao_produto.codigo_produto')} scope="col" className="hover:cursor-pointer hidden px-2 py-3 sm:px-2 sm:py-4 xl:px-6">
                                        <div className="flex gap-2 justify-between items-center">
                                            Código <button onClick={ordem}>{orderBy === 'variacao_produto.codigo_produto' ? order === 'ASC' ? <BsCaretUpFill /> : <BsCaretDownFill /> : null}</button>
                                        </div>
                                    </th>
                                    <th onClick={() => ordenarPor('variacao_produto.cor_id')} scope="col" className="hover:cursor-pointer hidden px-2 py-3 sm:px-2 sm:py-4 xl:px-6 xl:table-cell">
                                        <div className="flex gap-2 justify-between items-center">
                                            Cor <button onClick={ordem}>{orderBy === 'variacao_produto.cor_id' ? order === 'ASC' ? <BsCaretUpFill /> : <BsCaretDownFill /> : null}</button>
                                        </div>
                                    </th>
                                    <th onClick={() => ordenarPor('variacao_produto.tamanho_id')} scope="col" className="hover:cursor-pointer hidden px-2 py-3 sm:px-2 sm:py-4 xl:px-6 xl:table-cell">
                                        <div className="flex gap-2 justify-between items-center">
                                            Tamanho <button onClick={ordem}>{orderBy === 'variacao_produto.tamanho_id' ? order === 'ASC' ? <BsCaretUpFill /> : <BsCaretDownFill /> : null}</button>
                                        </div>
                                    </th>
                                    <th onClick={() => ordenarPor('preco_produto.valor')} scope="col" className="hover:cursor-pointer hidden px-2 py-3  sm:px-2 sm:py-4 xl:px-6 sm:table-cell">
                                        <div className="flex gap-2 justify-between items-center">
                                            Preço <button onClick={ordem}>{orderBy === 'preco_produto.valor' ? order === 'ASC' ? <BsCaretUpFill /> : <BsCaretDownFill /> : null}</button>
                                        </div>
                                    </th>
                                    <th onClick={() => ordenarPor('estoque.quantidade')} scope="col" className="hover:cursor-pointer hidden px-2 py-3 sm:px-2 sm:py-4 xl:px-6 sm:table-cell text-center">
                                        <div className="flex gap-2 justify-between items-center">
                                            Estoque <button onClick={ordem}>{orderBy === 'estoque.quantidade' ? order === 'ASC' ? <BsCaretUpFill /> : <BsCaretDownFill /> : null}</button>
                                        </div>
                                    </th>
                                    <th scope="col" className="hidden px-2 py-3 sm:px-2 sm:py-4 xl:px-6 text-center md:table-cell">
                                        Entrada
                                    </th>
                                    <th scope="col" className="px-2 py-1 sm:px-2 sm:py-4 lg:px-6 text-center">

                                    </th>
                                </tr>
                            </TableHead>
                            <TableBody>
                                {
                                    estoqueCompletoList.map((item, key) => (
                                        <TableRow key={key} className={`${item.tipo_produto_id === 2 ? 'bg-gray-100 hover:bg-gray-200' : item.quantidade <= 0 ? 'bg-red-100 hover:bg-red-200' : item.quantidade <= item.quantidade_min ? 'bg-yellow-100 hover:bg-yellow-200' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                            <TableCell className="hidden md:table-cell">
                                                {item.estoque_id}
                                            </TableCell>
                                            <TableCell className="md:text-xs text-gray-700 text-ellipsis lg:text-clip whitespace-nowrap overflow-hidden">
                                                <a className="hover:underline cursor-pointer font-bold" onClick={() => openProductModal(item)}>
                                                    {item.nome}
                                                </a>
                                            </TableCell>
                                            <TableCell className="hidden">
                                                {item.codigo_barras || item.codigo_produto}
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {item.cor_nome}
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {item.tamanho_nome}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {Brl(item.valor || 0)}
                                            </TableCell>
                                            <TableCell className="hidden text-center sm:table-cell">
                                                {item.quantidade < 0 ? 0 : Number.isInteger(item.quantidade) ? Number(item.quantidade) : parseFloat(item.quantidade).toFixed(2)}{item.unidade_sigla ? ` - ${item.unidade_sigla}` : ''}
                                            </TableCell>
                                            <ProtectedComponent allowedLevels={[1]}>
                                                <TableCell className="hidden md:table-cell text-center">
                                                    <ProtectedOperation allowedLevels={[1]}>
                                                        <button onClick={() => openEntradaProdutoModal(item)}>
                                                            <div className="p-1 rounded-full bg-blue-500 text-white">
                                                                <FaArrowUp size={12} />
                                                            </div>
                                                        </button>
                                                    </ProtectedOperation>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button className={`relative p-1 rounded-full ${openMenu === item.estoque_id && ' bg-gray-400'}`} onClick={() => toggleMenu(item.estoque_id)}>
                                                        <FaEllipsisVertical />
                                                        {
                                                            openMenu === item.estoque_id &&
                                                            <div className={`absolute z-10 right-0 border-2 rounded-lg border-gray-400 divide-y bg-gray-100 divide-gray-200 shadow-lg ${key > estoqueCompletoList.length / 2 ? 'bottom-full' : 'top-full'}`}>
                                                                <ul className="list-none">
                                                                    <li className="p-2">
                                                                        <a onClick={() => openProductModal(item)} target="_blank" rel="noopener noreferrer" className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                            <FaPenToSquare /> Editar
                                                                        </a>
                                                                    </li>
                                                                    <li className="p-2 md:hidden">
                                                                        <ProtectedOperation allowedLevels={[1]}>
                                                                            <a onClick={() => openEntradaProdutoModal(item)} className="flex gap-1 text-sm font-medium hover:underline cursor-pointer items-center">
                                                                                <FaArrowCircleUp /> Entrada
                                                                            </a>
                                                                        </ProtectedOperation>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        }
                                                    </button>
                                                </TableCell>
                                            </ProtectedComponent>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col">
                            <div className="flex flex-col md:flex-row gap-3 text-sm">
                                <div className="flex gap-2">
                                    <span className="w-10 h-4 bg-yellow-100"></span>Estoque minimo atingido
                                </div>
                                <div className="flex gap-2">
                                    <span className="w-10 h-4 bg-red-100"></span>Sem Estoque
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row text-xs">
                            {ultimaPagina > 10 ? pageAtual * 10 : ultimaPagina} - {ultimaPagina}
                        </div>
                    </div>
                    {importar && <ImportarProdutosPlanilhaComponent setImportar={setImportar} setUpdate={props.setAtualizar} />}
                </div>
            }
        </div>
    )
}