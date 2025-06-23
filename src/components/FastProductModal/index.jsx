import { useEffect, useState } from 'react';
import { BsX } from 'react-icons/bs';
import { get, post, put, remove } from '../../services/api';
import Router from "next/router";

let quantidadeVariacaoProduto = 0;
export const FastProductModal = (props) => {
    const [atualizarCategoria, setAtualizarCategoriaList] = useState(true);
    const [corList, setCorList] = useState([]);
    const [tamanhoList, setTamanhoList] = useState([]);
    const [tipoProdutoList, setTipoProdutoList] = useState([]);
    const [unidadeList, setUnidadeList] = useState([]);
    const [colecaoList, setColecaoList] = useState([]);
    const [marcaList, setMarcaList] = useState([]);
    const [categoriaList, setCategoriaList] = useState([]);
    const [subcategoriaList, setSubcategoriaList] = useState([]);
    const [listaprecosList, setListaprecosList] = useState([]);
    const [htmlVariacaoProduto, setHtmlVariacaoProduto] = useState([]);
    const [resetarModal, setResetarModal] = useState(true);


    const closeModal = () => {
        quantidadeVariacaoProduto = 0;
        if (props.closeProdutcModal == "") {
            props.setCloseProdutcModal("hidden")
            setSubcategoriaList([]);
        }
    }

    const loadAll = async () => {

        get(process.env.NEXT_PUBLIC_API_URL + '/cores').then((data) => {
            if (data.mensagem) {
                if (data.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                for (let i = 0; i < data.length; i++) {
                    let cor = {
                        id: data[i].id,
                        nome: data[i].nome,
                    }

                    setCorList(old => [...old, cor]);
                }
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/tamanhos').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let tamanho = {
                    id: data[i].id,
                    nome: data[i].nome,
                }

                setTamanhoList(old => [...old, tamanho]);
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/tipoprodutos').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let tipoProduto = {
                    id: data[i].id,
                    nome: data[i].nome,
                }

                setTipoProdutoList(old => [...old, tipoProduto]);
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/unidades').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let unidade = {
                    id: data[i].id,
                    nome: data[i].nome,
                }

                setUnidadeList(old => [...old, unidade]);
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/origens').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let origem = {
                    id: data[i].id,
                    nome: data[i].descricao,
                }

                setOrigemList(old => [...old, origem]);
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/colecoes').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let colecao = {
                    id: data[i].id,
                    nome: data[i].nome,
                }

                setColecaoList(old => [...old, colecao]);
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/marcas').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let marca = {
                    id: data[i].id,
                    nome: data[i].nome,
                }

                setMarcaList(old => [...old, marca]);
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/categorias').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let categoria = {
                    id: data[i].id,
                    nome: data[i].nome,
                }

                setCategoriaList(old => [...old, categoria]);
            }
        })

        get(process.env.NEXT_PUBLIC_API_URL + '/listaprecos').then((data) => {
            for (let i = 0; i < data.length; i++) {
                let listapreco = {
                    id: data[i].id,
                    nome: data[i].nome,
                }

                setListaprecosList(old => [...old, listapreco]);
            }
        })
    }

    useEffect(() => {
        setCorList([]);
        setTamanhoList([]);
        setTipoProdutoList([]);
        setUnidadeList([]);
        setColecaoList([]);
        setMarcaList([]);
        setCategoriaList([]);
        setSubcategoriaList([]);
        setListaprecosList([]);
        loadAll();
    }, [props.atualizar]);

    useEffect(() => {

    }, [atualizarCategoria]);

    useEffect(() => {
        setHtmlVariacaoProduto([])
        document.getElementById('nomeProduto').value = '';
        document.getElementById('tipoProduto').value = '1';
        document.getElementById('unidade').value = '';
        document.getElementById('colecao').value = '';
        document.getElementById('marca').value = '';
        document.getElementById('categoria').value = '';
        document.getElementById('subcategoria').value = '';
        document.getElementById('codigoBarras').value = '';
        document.getElementById('cor').value = '';
        document.getElementById('tamanho').value = '';
        document.getElementById('valor').value = '';
        document.getElementById('markup').value = '';
        document.getElementById('quantidade').value = '';
        document.getElementById('quantidadeMax').value = '';
        document.getElementById('quantidadeMin').value = '';
        document.getElementById('localizacao').value = '';
    }, [resetarModal]);

    const handleCategoria = () => {
        setSubcategoriaList([]);
        let idCategoria = document.getElementById('categoria').value

        if (idCategoria != '') {
            get(process.env.NEXT_PUBLIC_API_URL + '/subcategorias/' + idCategoria + "").then((data) => {
                if (data.mensagem) {
                    if (data.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {
                    for (let i = 0; i < data.length; i++) {
                        let subcategoria = {
                            id: data[i].id,
                            nome: data[i].nome,
                        }

                        setSubcategoriaList(old => [...old, subcategoria]);
                        setAtualizarCategoriaList(!atualizarCategoria);
                    }
                }
            })
        }
    }

    const salvar = () => {
        let nomeProduto = document.getElementById('nomeProduto').value;
        let tipoProduto = document.getElementById('tipoProduto').value;
        let unidade = null;
        let localizacao = null;
        let origem = null;
        let colecao = null;
        let marca = null;
        let categoria = null;
        let subcategoria = null;
        let cor = null;
        let tamanho = null;
        let listaPrecos = null;
        let valor = 0;
        let valorCusto = 0;
        let markup = 0;
        let quantidade = 0;
        let quantidadeMax = 0;
        let quantidadeMin = 0;
        let codigoBarras = null;
        let codigoProduto = null;
        let empresa_id = localStorage.getItem("applojaweb_user_empresa");
        let ncm = null;
        let classeImposto = null;

        if (document.getElementById('marca').value != "") {
            marca = document.getElementById('marca').value;
        }
        if (document.getElementById('categoria').value != "") {
            categoria = document.getElementById('categoria').value;
        }
        if (document.getElementById('subcategoria').value != "") {
            subcategoria = document.getElementById('subcategoria').value;
        }
        if (document.getElementById('unidade').value != "") {
            unidade = document.getElementById('unidade').value;
        }
        if (document.getElementById('colecao').value != "") {
            colecao = document.getElementById('colecao').value;
        }
        if (document.getElementById('cor').value != "") {
            cor = document.getElementById('cor').value;
        }
        if (document.getElementById('tamanho').value != "") {
            tamanho = document.getElementById('tamanho').value;
        }
        if (document.getElementById('valor').value != "") {
            valor = document.getElementById('valor').value;
        }
        if (document.getElementById('valorCusto').value != "") {
            valorCusto = document.getElementById('valorCusto').value;
        }
        if (document.getElementById('markup').value != "") {
            markup = document.getElementById('markup').value;
        }
        if (document.getElementById('quantidade').value != "") {
            quantidade = document.getElementById('quantidade').value;
        }
        if (document.getElementById('quantidadeMax').value != "") {
            quantidadeMax = document.getElementById('quantidadeMax').value;
        }
        if (document.getElementById('quantidadeMin').value != "") {
            quantidadeMin = document.getElementById('quantidadeMin').value;
        }
        if (document.getElementById('codigoBarras').value != "") {
            codigoBarras = document.getElementById('codigoBarras').value;
        }
        if (document.getElementById('codigoProduto').value != "") {
            codigoProduto = document.getElementById('codigoProduto').value;
        }
        if (document.getElementById('localizacao').value != "") {
            localizacao = document.getElementById('localizacao').value;
        }
        if (document.getElementById('ncm').value != "") {
            ncm = document.getElementById('ncm').value;
        }
        if (document.getElementById('classeImposto').value != "") {
            classeImposto = document.getElementById('classeImposto').value;
        }

        if (ncm !== null && ncm.length !== 10) {
            alert("NCM está incorreto");
            return;
        }

        const dataProduto = {
            tipoProdutoId: tipoProduto,
            marcaId: marca,
            categoriaId: categoria,
            fornecedorId: null,
            unidadeId: unidade,
            origemId: origem,
            colecaoId: colecao,
            subCategoriaId: subcategoria,
            nome: nomeProduto,
            cstIcmsId: null,
            status: 0,
            icms: null,
            ipi: null,
            pis: null,
            cofins: null,
            cest: null,
            ncm: ncm,
            observacao: null,
            kitProduto: null,
            comissao: null,
            descontoMax: null,
            insumo: null,
            empresaId: empresa_id,
            classeImposto: classeImposto
        }
        if (tipoProduto != "") {
            post(process.env.NEXT_PUBLIC_API_URL + '/produtos', dataProduto).then((res) => {
                if (res.mensagem) {
                    if (res.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {
                    if (res.message == undefined) {
                        console.log("Salvou produto");

                        const dataVariacaoProduto = {
                            produtoId: res.insertId,
                            corId: cor,
                            tamanhoId: tamanho,
                            codigoBarras: codigoBarras,
                            codigoProduto: codigoProduto,
                            descricao: null,
                            empresaId: empresa_id
                        }

                        post(process.env.NEXT_PUBLIC_API_URL + '/variacaoprodutos', dataVariacaoProduto).then((res) => {
                            if (res.message == undefined) {
                                console.log("Salvou variação do produto");

                                const dataPrecoProduto = {
                                    variacaoProdutoId: res.insertId,
                                    listaPrecoId: 1,
                                    valor: valor,
                                    markup: markup,
                                    empresaId: empresa_id,
                                    valorCusto: valorCusto
                                }

                                const dataEstoque = {
                                    variacaoProdutoId: res.insertId,
                                    validade: null,
                                    localizacao: localizacao,
                                    quantidade: quantidade,
                                    quantidadeMin: quantidadeMin,
                                    quantidadeMax: quantidadeMax,
                                    empresaId: empresa_id
                                }

                                post(process.env.NEXT_PUBLIC_API_URL + '/precoprodutos', dataPrecoProduto).then((res) => {
                                    console.log(res)
                                    if (res.message == undefined) {
                                        console.log("Salvou preço do produto");
                                    } else {
                                        console.log(res.message)
                                    }
                                })

                                post(process.env.NEXT_PUBLIC_API_URL + '/estoques', dataEstoque).then((res) => {
                                    if (res.message == undefined) {
                                        console.log("Salvou estoque");
                                        closeModal();
                                        setResetarModal(!resetarModal)
                                        quantidadeVariacaoProduto = 0;
                                    } else {
                                        console.log(res.message)
                                    }
                                })
                            } else {
                                console.log(res.message)
                            }
                        })

                        for (let i = 0; i < quantidadeVariacaoProduto; i++) {
                            let cor1 = null;
                            let tamanho1 = null;
                            let codigoBarras1 = null;
                            let codigoProduto1 = null;

                            if (document.getElementById('cor' + i).value != "") {
                                cor1 = document.getElementById('cor' + i).value;
                            }
                            if (document.getElementById('tamanho' + i).value != "") {
                                tamanho1 = document.getElementById('tamanho' + i).value;
                            }
                            if (document.getElementById('codigoBarras' + i).value != "") {
                                codigoBarras1 = document.getElementById('codigoBarras' + i).value;
                            }
                            if (document.getElementById('codigoProduto' + i).value != "") {
                                codigoProduto1 = document.getElementById('codigoProduto' + i).value;
                            }

                            const dataVariacaoProduto = {
                                produtoId: res.insertId,
                                corId: cor1,
                                tamanhoId: tamanho1,
                                codigoBarras: codigoBarras1,
                                codigoProduto: codigoProduto1,
                                descricao: null,
                                empresaId: empresa_id
                            }

                            post(process.env.NEXT_PUBLIC_API_URL + '/variacaoprodutos', dataVariacaoProduto).then((res) => {
                                if (res.message == undefined) {
                                    console.log("Salvou variação do produto " + i);

                                    let valor1 = 0;
                                    let valorCusto1 = 0;
                                    let markup1 = 0;
                                    let quantidade1 = 0;
                                    let quantidadeMax1 = 0;
                                    let quantidadeMin1 = 0;

                                    if (document.getElementById('valor' + i).value != "") {
                                        valor1 = document.getElementById('valor' + i).value;
                                    }
                                    if (document.getElementById('valorCusto' + i).value != "") {
                                        valorCusto1 = document.getElementById('valorCusto' + i).value;
                                    }
                                    if (document.getElementById('markup' + i).value != "") {
                                        markup1 = document.getElementById('markup' + i).value;
                                    }
                                    if (document.getElementById('quantidade' + i).value != "") {
                                        quantidade1 = document.getElementById('quantidade' + i).value;
                                    }
                                    if (document.getElementById('quantidadeMax' + i).value != "") {
                                        quantidadeMax1 = document.getElementById('quantidadeMax' + i).value;
                                    }
                                    if (document.getElementById('quantidadeMin' + i).value != "") {
                                        quantidadeMin1 = document.getElementById('quantidadeMin' + i).value;
                                    }

                                    const dataPrecoProduto = {
                                        variacaoProdutoId: res.insertId,
                                        listaPrecoId: 1,
                                        valor: valor1,
                                        markup: markup1,
                                        empresaId: empresa_id,
                                        valorCusto: valorCusto1
                                    }

                                    const dataEstoque = {
                                        variacaoProdutoId: res.insertId,
                                        validade: null,
                                        localizacao: localizacao,
                                        quantidade: quantidade1,
                                        quantidadeMin: quantidadeMin1,
                                        quantidadeMax: quantidadeMax1,
                                        empresaId: empresa_id
                                    }

                                    post(process.env.NEXT_PUBLIC_API_URL + '/precoprodutos', dataPrecoProduto).then((res) => {
                                        if (res.message == undefined) {
                                            console.log("Salvou preço do produto");

                                        } else {
                                            console.log(res.message)
                                        }
                                    })

                                    post(process.env.NEXT_PUBLIC_API_URL + '/estoques', dataEstoque).then((res) => {
                                        if (res.message == undefined) {
                                            console.log("Salvou estoque");
                                            closeModal();
                                        } else {
                                            console.log(res.message)
                                        }
                                    })
                                } else {
                                    console.log(res.message)
                                }
                            })
                        }

                    } else {
                        console.log(res.message)
                    }
                }
            })
        } else {
            alert("Tipo produto deve ser preenchido");
        }
    }

    const addVariação = () => {
        setHtmlVariacaoProduto([])
        quantidadeVariacaoProduto = quantidadeVariacaoProduto + 1;
        for (let i = 0; i < quantidadeVariacaoProduto; i++) {
            setHtmlVariacaoProduto(old => [...old,
            <div key={i} className='flex flex-col gap-6'>
                <div className='border-t border-white'>
                    <div className='my-4'>
                        <h3 className='font-bold text-white'>Variação do produto: {i + 2}</h3>
                    </div>
                    <div className='flex flex-col gap-4 md:flex-row md:gap-4'>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Código de Barras</label>
                            <div className='flex'>
                                <input id={'codigoBarras' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                            </div>
                        </div>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Código do Produto</label>
                            <div className='flex'>
                                <input id={'codigoProduto' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                            </div>
                        </div>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Cor</label>
                            <div className='flex'>
                                <select id={'cor' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                    <option value=''></option>
                                    {corList.map((item, key) => (
                                        <option key={key} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Tamanho</label>
                            <div className='flex'>
                                <select id={'tamanho' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                    <option value=''></option>
                                    {tamanhoList.map((item, key) => (
                                        <option key={key} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-8'>
                    <div className='flex w-full flex-col gap-4 md:flex-row md:gap-8'>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Valor</label>
                                <input id={'valor' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Valor de Custo</label>
                                <input id={'valorCusto' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Markup</label>
                                <input id={'markup' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100%" required />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Qtda</label>
                                <input id={'quantidade' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Qtda Max</label>
                                <input id={'quantidadeMax' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="10" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Qtda Min</label>
                                <input id={'quantidadeMin' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100" required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ])
        }
    }

    const removeVariação = () => {
        setHtmlVariacaoProduto([])
        if (quantidadeVariacaoProduto != 0) {
            quantidadeVariacaoProduto = quantidadeVariacaoProduto - 1;
        }
        for (let i = 0; i < quantidadeVariacaoProduto; i++) {
            setHtmlVariacaoProduto(old => [...old,
            <div key={i} className='flex flex-col gap-6'>
                <div className='border-t border-white'>
                    <div className='my-4'>
                        <h3 className='font-bold text-white'>Variação do produto: {i + 2}</h3>
                    </div>
                    <div className='flex flex-col gap-4 md:flex-row md:gap-4'>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Código de Barras</label>
                            <div className='flex'>
                                <input id={'codigoBarras' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                            </div>
                        </div>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Código do Produto</label>
                            <div className='flex'>
                                <input id={'codigoProduto' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                            </div>
                        </div>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Cor</label>
                            <div className='flex'>
                                <select id={'cor' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                    <option value=''></option>
                                    {corList.map((item, key) => (
                                        <option key={key} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='w-full'>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Tamanho</label>
                            <div className='flex'>
                                <select id={'tamanho' + i} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                    <option value=''></option>
                                    {tamanhoList.map((item, key) => (
                                        <option key={key} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex gap-8'>
                    <div className='flex w-full flex-col gap-4 md:flex-row md:gap-8'>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Valor</label>
                                <input id={'valor' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Valor de Custo</label>
                                <input id={'valorCusto' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Markup</label>
                                <input id={'markup' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100%" required />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Qtda</label>
                                <input id={'quantidade' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Qtda Max</label>
                                <input id={'quantidadeMax' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="10" required />
                            </div>
                            <div className='flex-1'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Qtda Min</label>
                                <input id={'quantidadeMin' + i} type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100" required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ])
        }
    }

    return (
        <div id="medium-modal" className={props.closeProdutcModal + " first-letter:overflow-y-auto overflow-x-hidden absolute z-50 right-0 md:right-56 w-full h-modal md:h-auto md:w-1/2"}>
            <div className="relative p-4 w-full h-full sm:h-auto">
                {/*<!-- Modal content --> */}
                <div className="relative rounded-lg shadow bg-applojaDark2">
                    {/*<!-- Modal header --> */}
                    <div className="flex justify-between items-center p-5 rounded-t border-b border-applojaDark">
                        <h3 className="text-xl font-medium text-white">
                            Produto Rápido
                        </h3>
                        <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-applojaDark hover:text-white">
                            <BsX className='text-white' size={24} />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/*!-- Modal body --> */}
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Nome</label>
                            <input id='nomeProduto' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                        </div>
                        <div className='flex gap-8'>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Tipo do Produto</label>
                                <div className='flex'>
                                    <select id='tipoProduto' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required>
                                        {tipoProdutoList.map((item, key) => (
                                            <option key={key} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Localização</label>
                            <input id='localizacao' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                        </div>
                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Unidade</label>
                                <div className='flex'>
                                    <select id='unidade' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                        <option value=''></option>
                                        {unidadeList.map((item, key) => (
                                            <option key={key} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">NCM (Obrigatório para emissão de Nota Fiscal)</label>
                                <div className='flex'>
                                    <input id='ncm' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                                </div>
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Classe Imposto</label>
                                <div className='flex'>
                                    <input id='classeImposto' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Coleção</label>
                                <div className='flex'>
                                    <select id='colecao' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                        <option value=''></option>
                                        {colecaoList.map((item, key) => (
                                            <option key={key} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Marca</label>
                                <div className='flex'>
                                    <select id='marca' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                        <option value=''></option>
                                        {marcaList.map((item, key) => (
                                            <option key={key} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Categoria</label>
                                <div className='flex'>
                                    <select onChange={handleCategoria} id='categoria' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                        <option value=''></option>
                                        {categoriaList.map((item, key) => (
                                            <option key={key} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Subcategoria</label>
                                <div className='flex'>
                                    <select id='subcategoria' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                        <option value=''></option>
                                        {subcategoriaList.map((item, key) => (
                                            <option key={key} value={item.id}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='border-t border-applojaDark'>
                            <h3 className='pt-3 font-bold text-white text-base'>Variações do Produto: 1</h3>
                        </div>
                        <div className='flex flex-col gap-6'>
                            <div className='flex flex-col gap-4 md:flex-row md:gap-4'>
                                <div className='w-full'>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Código de Barras</label>
                                    <div className='flex'>
                                        <input id='codigoBarras' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Código do Produto</label>
                                    <div className='flex'>
                                        <input id='codigoProduto' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" required />
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Cor</label>
                                    <div className='flex'>
                                        <select id='cor' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                            <option value=''></option>
                                            {corList.map((item, key) => (
                                                <option key={key} value={item.id}>{item.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Tamanho</label>
                                    <div className='flex'>
                                        <select id='tamanho' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="Ex: Branco" required>
                                            <option value=''></option>
                                            {tamanhoList.map((item, key) => (
                                                <option key={key} value={item.id}>{item.nome}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-8'>
                                <div className='flex w-full flex-col gap-4 md:flex-row md:gap-8'>
                                    <div className='flex gap-4'>
                                        <div className='flex-1'>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Valor</label>
                                            <input id='valor' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" required />
                                        </div>
                                        <div className='flex-1'>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Valor de Custo</label>
                                            <input id='valorCusto' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" required />
                                        </div>
                                        <div className='flex-1'>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Markup</label>
                                            <input id='markup' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100%" required />
                                        </div>
                                    </div>
                                    <div className='flex gap-4'>
                                        <div className='flex-1'>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Qtda</label>
                                            <input id='quantidade' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100" required />
                                        </div>
                                        <div className='flex-1'>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Qtda Max</label>
                                            <input id='quantidadeMax' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="10" required />
                                        </div>
                                        <div className='flex-1'>
                                            <label className="block mb-2 text-sm font-medium text-gray-300">Qtda Min</label>
                                            <input id='quantidadeMin' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="100" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {htmlVariacaoProduto}
                        <div className='flex justify-between'>
                            <span onClick={removeVariação} className='text-red-500 underline text-base cursor-pointer hover:no-underline'>Remover Variação</span>
                            <span onClick={addVariação} className='text-blue-500 underline text-base cursor-pointer hover:no-underline'>Adicionar Variação</span>
                        </div>
                    </div>
                    {/*<!-- Modal footer --> */}
                    <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-applojaDark">
                        <button onClick={salvar} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}