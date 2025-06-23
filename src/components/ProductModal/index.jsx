import { useEffect, useState } from 'react';
import { BsUpcScan, BsX } from 'react-icons/bs';
import { get, post, put, remove } from '../../services/api';
import { LoadingComponent } from '../LoadingComponent';
import { useEmpresa } from '../../context/empresaContext';

export const ProductModal = (props) => {

    const { empresa } = useEmpresa()

    const produtoPadrao = {
        fornecedorId: '',
        tipoProdutoId: '',
        marcaId: '',
        categoriaId: '',
        unidadeId: '',
        origemId: null,
        colecaoId: '',
        subCategoriaId: '',
        nome: '',
        cstIcmsId: null,
        status: 0,
        icms: null,
        ipi: null,
        pis: null,
        cofins: null,
        cest: null,
        ncm: '',
        observacao: null,
        kitProduto: null,
        comissao: null,
        descontoMax: null,
        insumo: null,
        classeImposto: empresa.classeImpostoPadrao || ''
    }

    const variacaoPadrao = [{
        produtoId: null,
        corId: null,
        tamanhoId: null,
        codigoBarras: '',
        codigoProduto: '',
        descricao: '',
    }]

    const precoPadrao = [{
        variacaoProdutoId: null,
        listaPrecoId: 1,
        valor: '',
        markup: '',
        valorCusto: ''
    }]

    const estoquePadrao = [{
        variacaoProdutoId: null,
        validade: null,
        localizacao: null,
        quantidade: '',
        quantidadeMin: '',
        quantidadeMax: '',
    }]

    const [tipos, setTipos] = useState([])
    const [unidades, setUnidades] = useState([])
    const [colecoes, setColecoes] = useState([])
    const [marcas, setMarcas] = useState([])
    const [categorias, setCategorias] = useState([])
    const [subcategorias, setSubcategorias] = useState([])
    const [cores, setCores] = useState([])
    const [tamanhos, setTamanhos] = useState([])
    const [loading, setLoading] = useState(false)
    const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)
    const [produto, setProduto] = useState(produtoPadrao)
    const [variacaoProduto, setVariacaoProduto] = useState(variacaoPadrao)
    const [variacaoPreco, setVariacaoPreco] = useState(precoPadrao)
    const [estoque, setEstoque] = useState(estoquePadrao)
    const [listaFornecedores, setListaFornecedores] = useState()

    useEffect(() => {
        if (props.produtoSelecionado) {
            const produtoSelecionado = props.produtoSelecionado
            setLoading(true)
            loadProduto(produtoSelecionado)
        }
    }, [props.produtoSelecionado])

    useEffect(() => {
        loadCategoria()
        loadColecao()
        loadColor()
        loadMarca()
        loadUnidades()
        loadTipoProduto()
        loadFornecedores()
    }, [])

    useEffect(() => {
        setColecoes([]);
        loadColecao();
    }, [props.atualizarColecao]);

    useEffect(() => {
        setMarcas([]);
        loadMarca();
    }, [props.atualizarMarca]);

    useEffect(() => {
        setCategorias([]);
        loadCategoria();
    }, [props.atualizarCategoria]);

    useEffect(() => {
        setCores([]);
        loadColor();
    }, [props.atualizarColor]);

    useEffect(() => {
        setTamanhos([]);
        loadTamanho();
    }, [props.atualizarTamanho]);

    useEffect(() => {
        setSubcategorias([]);
    }, [props.atualizarSubcategoria]);

    const loadProduto = async (produtoSelecionado) => {

        if (produtoSelecionado.categoria_id != null) {
            const listasubcategorias = await get(`${process.env.NEXT_PUBLIC_API_URL}/subcategorias/${produtoSelecionado.categoria_id}`)
            setSubcategorias(listasubcategorias)
        }

        setProduto({
            tipoProdutoId: produtoSelecionado.tipo_produto_id,
            marcaId: produtoSelecionado.marca_id,
            categoriaId: produtoSelecionado.categoria_id,
            fornecedorId: produtoSelecionado.fornecedor_id,
            unidadeId: produtoSelecionado.unidade_id,
            origemId: produtoSelecionado.origem_id,
            colecaoId: produtoSelecionado.colecao_id,
            subCategoriaId: produtoSelecionado.sub_categoria_id,
            nome: produtoSelecionado.nome,
            cstIcmsId: produtoSelecionado.cst_icms_id,
            status: 0,
            icms: null,
            ipi: null,
            pis: null,
            cofins: null,
            cest: null,
            ncm: produtoSelecionado.ncm,
            observacao: null,
            kitProduto: produtoSelecionado.kitProduto || null,
            comissao: null,
            descontoMax: null,
            insumo: null,
            classeImposto: produtoSelecionado.classe_imposto || empresa.classeImpostoPadrao
        })

        setVariacaoProduto([{
            id: produtoSelecionado.variacao_produto_id,
            produtoId: produtoSelecionado.produto_id,
            corId: produtoSelecionado.cor_id,
            tamanhoId: produtoSelecionado.tamanho_id,
            codigoBarras: produtoSelecionado.codigo_barras,
            codigoProduto: produtoSelecionado.codigo_produto,
            descricao: null,
        }])

        setVariacaoPreco([{
            id: produtoSelecionado.preco_produto_id,
            variacaoProdutoId: produtoSelecionado.variacao_produto_id,
            listaPrecoId: 1,
            valor: parseFloat((produtoSelecionado.valor || 0).toFixed(2)),
            markup: Number.isInteger(produtoSelecionado.markup) ? (produtoSelecionado.markup || 0) : parseFloat(produtoSelecionado.markup || 0).toFixed(2),
            valorCusto: parseFloat((produtoSelecionado.valor_custo || 0).toFixed(2))
        }])

        setEstoque([{
            variacaoProdutoId: produtoSelecionado.variacao_produto_id,
            validade: null,
            localizacao: produtoSelecionado.localizacao,
            quantidade: produtoSelecionado.quantidade || 0,
            quantidadeMin: produtoSelecionado.quantidade_min || 0,
            quantidadeMax: produtoSelecionado.quantidade_max || 0,
        }])
        setLoading(false)
    }

    const loadColecao = async () => {
        try {
            const listacolecoes = await get(`${process.env.NEXT_PUBLIC_API_URL}/colecoes`)
            setColecoes(listacolecoes)
        } catch (error) {
            console.error(error)
        }
    }

    const loadCategoria = async () => {
        try {
            const listacategorias = await get(`${process.env.NEXT_PUBLIC_API_URL}/categorias`)
            setCategorias(listacategorias)
        } catch (error) {
            console.error(error)
        }
    }

    const loadMarca = async () => {
        try {
            const listamarcas = await get(`${process.env.NEXT_PUBLIC_API_URL}/marcas`)
            setMarcas(listamarcas)
        } catch (error) {
            console.error(error)
        }
    }

    const loadColor = async () => {
        try {
            const listacores = await get(`${process.env.NEXT_PUBLIC_API_URL}/cores`)
            setCores(listacores)
        } catch (error) {
            console.error(error)
        }
    }

    const loadTamanho = async () => {
        try {
            const listatamanhos = await get(`${process.env.NEXT_PUBLIC_API_URL}/tamanhos`)
            setTamanhos(listatamanhos)
        } catch (error) {
            console.error(error)
        }
    }

    const loadUnidades = async () => {
        try {
            const listaunidades = await get(`${process.env.NEXT_PUBLIC_API_URL}/unidades`)
            setUnidades(listaunidades)
        } catch (error) {
            console.error(error)
        }
    }

    const loadTipoProduto = async () => {
        try {
            const listatipos = await get(`${process.env.NEXT_PUBLIC_API_URL}/tipoprodutos`)
            setTipos(listatipos)
        } catch (error) {
            console.error(error)
        }
    }

    const loadFornecedores = async () => {
        try {
            const fornecedores = await get(`${process.env.NEXT_PUBLIC_API_URL}/fornecedores`)
            if (fornecedores) {
                setListaFornecedores(fornecedores)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleCategoria = async (id) => {
        setProduto({ ...produto, categoriaId: id })
        props.setCategoriaId(id)
        if (id) {
            const listasubcategorias = await get(`${process.env.NEXT_PUBLIC_API_URL}/subcategorias/${id}`)
            setSubcategorias(listasubcategorias)
        } else {
            setSubcategorias([])
        }
    }

    const handleProduto = (event) => {
        setProduto((prev) => ({
            ...prev, [event.target.name]: event.target.value
        }))
    }

    const handleVariacaoProduto = (index, event) => {
        setVariacaoProduto(prev =>
            prev.map((variacao, i) =>
                i === index
                    ? { ...variacao, [event.target.name]: event.target.value }
                    : variacao
            )
        )
    }

    const handleMarkup = (index, event) => {
        const { name, value } = event.target;
        const parsedValue = parseFloat(value);

        setVariacaoPreco(prevVariacoes =>
            prevVariacoes.map((variacao, i) =>
                i === index
                    ? {
                        ...variacao,
                        [name]: parsedValue,
                        valor: name === 'valorCusto' || name === 'markup'
                            ? (name === 'valorCusto'
                                ? parsedValue + (parsedValue * (variacao.markup / 100))
                                : variacao.valorCusto + (variacao.valorCusto * (parsedValue / 100)))
                            : variacao.valorCusto && variacao.markup
                                ? (variacao.valorCusto + (variacao.valorCusto * (variacao.markup / 100)))
                                : undefined
                    }
                    : variacao
            )
        );
    }

    const handleValor = (index, event) => {
        const { name, value } = event.target;
        const parsedValue = parseFloat(parseFloat(value).toFixed(2));

        setVariacaoPreco(prev =>
            prev.map((valor, i) =>
                i === index ? {
                    ...valor, [name]: parsedValue
                } : valor
            )
        )
    }

    const handleEstoque = (index, event) => {
        setEstoque(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [event.target.name]: event.target.value }
                    : item
            )
        )
    }

    const estoqueLocalizacao = (event) => {
        setEstoque((prevEstoque) =>
            prevEstoque.map((item) => ({
                ...item,
                localizacao: event.target.value,
            }))
        );
    }

    const incluirVariacao = () => {
        setVariacaoProduto((prev) => [
            ...prev, {
                produtoId: '',
                corId: '',
                tamanhoId: '',
                codigoBarras: '',
                codigoProduto: '',
                descricao: '',
                empresaId: ''
            }
        ])
        setVariacaoPreco((prev) => [
            ...prev, {
                variacaoProdutoId: '',
                listaPrecoId: 1,
                valor: '',
                markup: '',
                empresaId: '',
                valorCusto: ''
            }
        ])
        setEstoque((prev) => [
            ...prev, {
                variacaoProdutoId: '',
                validade: null,
                localizacao: null,
                quantidade: '',
                quantidadeMin: '',
                quantidadeMax: '',
                empresaId: ''
            }
        ])
    }

    const removerVariacao = (index) => {
        setVariacaoProduto((prev) => {
            const novoArray = prev.filter((_, i) => i !== index);
            return novoArray.length > 0 ? novoArray : [{
                variacaoProdutoId: undefined,
                validade: '',
                localizacao: '',
                quantidade: '',
                quantidadeMin: '',
                quantidadeMax: '',
                empresaId: ''
            }];
        });
        setVariacaoPreco((prev) => {
            const novoArray = prev.filter((_, i) => i !== index);
            return novoArray.length > 0 ? novoArray : [{
                variacaoProdutoId: undefined,
                listaPrecoId: 1,
                valor: '',
                markup: '',
                empresaId: '',
                valorCusto: ''
            }];
        });
        setEstoque((prev) => {
            const novoArray = prev.filter((_, i) => i !== index);
            return novoArray.length > 0 ? novoArray : [{
                variacaoProdutoId: undefined,
                validade: '',
                localizacao: '',
                quantidade: '',
                quantidadeMin: '',
                quantidadeMax: '',
                empresaId: ''
            }];
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (props.produtoSelecionado) {
                await Promise.all([
                    atualizaDadosProduto(),
                    atualizaDadosVariacao(),
                    atualizaDadosPreco(),
                    atualizaEstoque()
                ]);
                props.setAtualizar(true);
                if (variacaoProduto.length > 1) {
                    salvaVariacaoProduto(props.produtoSelecionado.produto_id);
                }
                alert("Produto Atualizado com sucesso")
                fecharModal();
            } else {

                const dadosProduto = {
                    fornecedorId: produto.fornecedorId || null,
                    tipoProdutoId: produto.tipoProdutoId || null,
                    marcaId: produto.marcaId || null,
                    categoriaId: produto.categoriaId || null,
                    unidadeId: produto.unidadeId || null,
                    origemId: produto.origemId || null,
                    colecaoId: produto.colecaoId || null,
                    subCategoriaId: produto.subCategoriaId || null,
                    nome: produto.nome,
                    cstIcmsId: null,
                    status: 0,
                    icms: null,
                    ipi: null,
                    pis: null,
                    cofins: null,
                    cest: null,
                    ncm: produto.ncm || null,
                    observacao: null,
                    kitProduto: null,
                    comissao: null,
                    descontoMax: null,
                    insumo: null,
                    classeImposto: empresa.classeImpostoPadrao || null
                }

                const salvaProduto = await post(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, dadosProduto);
                if (salvaProduto.insertId) {
                    await salvaVariacaoProduto(salvaProduto.insertId);
                    props.setAtualizar(true);
                    alert("Produto cadastrado com Sucesso")
                    fecharModal();
                } else {
                    alert(`Erro ao salvar o produto: ${salvaProduto.message}`);
                }
            }
        } catch (error) {
            console.error('Erro ao submeter o formulário:', error);
        }
    };

    const salvaVariacaoProduto = async (id) => {
        try {
            Promise.all(
                variacaoProduto.map(async (variacao, i) => {

                    const dataVariacao = {
                        produtoId: id,
                        corId: variacao.corId || null,
                        tamanhoId: variacao.tamanhoId || null,
                        codigoBarras: variacao.codigoBarras || null,
                        codigoProduto: variacao.codigoProduto || null,
                        descricao: variacao.descricao || null
                    }
                    if (!variacao.id) {
                        const salvarVariacao = await post(`${process.env.NEXT_PUBLIC_API_URL}/variacaoprodutos`, dataVariacao)

                        if (salvarVariacao.insertId) {


                            const dataPreco = {
                                listaPrecoId: variacaoPreco[i].listaPrecoId,
                                variacaoProdutoId: salvarVariacao.insertId,
                                valor: variacaoPreco[i].valor || 0,
                                markup: variacaoPreco[i].markup || 0,
                                valorCusto: variacaoPreco[i].valorCusto || 0
                            }
                            await post(`${process.env.NEXT_PUBLIC_API_URL}/precoprodutos`, dataPreco)

                            const dataEstoque = {
                                variacaoProdutoId: salvarVariacao.insertId,
                                quantidade: estoque[i].quantidade || 0,
                                quantidadeMax: estoque[i].quantidadeMax || 0,
                                quantidadeMin: estoque[i].quantidadeMin || 0,
                                validade: estoque[i].validade || null,
                                localizacao: estoque[i].localizacao || null
                            }
                            await post(`${process.env.NEXT_PUBLIC_API_URL}/estoques`, dataEstoque)
                        }
                        props.setAtualizar(true)
                    }
                }),
            )
        } catch (error) {
            console.error(error)
        }
    }

    const atualizaDadosProduto = async () => {
        try {
            await put(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${props.produtoSelecionado.produto_id}`, produto)
        } catch (error) {
            console.error(error)
        }
    }

    const atualizaDadosVariacao = async () => {
        try {
            await put(`${process.env.NEXT_PUBLIC_API_URL}/variacaoprodutos/${props.produtoSelecionado.variacao_produto_id}`, variacaoProduto[0])
        } catch (error) {
            console.error(error)
        }
    }

    const atualizaDadosPreco = async () => {

        const dadosTratados = {
            ...variacaoPreco[0],
            valor: variacaoPreco[0].valor || 0,
            valorCusto: variacaoPreco[0].valorCusto || 0,
            markup: variacaoPreco[0].markup || 0
        }

        try {
            if (variacaoPreco[0].id) {
                await put(`${process.env.NEXT_PUBLIC_API_URL}/precoprodutos/${props.produtoSelecionado.preco_produto_id}`, dadosTratados)
            } else {
                await post(`${process.env.NEXT_PUBLIC_API_URL}/precoprodutos`, dadosTratados)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const atualizaEstoque = async () => {
        try {
            await put(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${props.produtoSelecionado.estoque_id}`, estoque[0])
        } catch (error) {
            console.error(error)
        }
    }

    const fecharModal = () => {
        setProduto(produtoPadrao)
        setVariacaoProduto(variacaoPadrao)
        setVariacaoPreco(precoPadrao)
        setEstoque(estoquePadrao)
        props.setProdutoSelecionado(null)
        props.setStatusModal('hidden')
    }

    const excluirProduto = async () => {
        setLoading(true);
        if (props.produtoSelecionado) {
            try {
                const removerEstoque = await remove(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${props.produtoSelecionado.estoque_id}`)
                if (removerEstoque) {
                    const removerPreco = await remove(`${process.env.NEXT_PUBLIC_API_URL}/precoprodutos/${props.produtoSelecionado.preco_produto_id}`)
                    if (removerPreco) {
                        const removeVariacaoProduto = await remove(`${process.env.NEXT_PUBLIC_API_URL}/variacaoprodutos/${props.produtoSelecionado.variacao_produto_id}`)
                        if (removeVariacaoProduto) {
                            alert('Produto Excluido')
                            props.setAtualizar(true)
                            setPopUpConfirmacao(false)
                            fecharModal()
                        }
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
    }

    const generateCode = async (index) => {

        try {
            const { codigo } = await get(`${process.env.NEXT_PUBLIC_API_URL}/geradordecodigo`)

            setVariacaoProduto(
                prev => prev.map((variacao, i) =>
                    i === index ? { ...variacao, codigoProduto: codigo } : variacao
                ))

        } catch (error) {
            console.error(error)
        }

    }

    // console.log(props.produtoSelecionado)
    // console.log('Produto', produto)
    console.log('Variacao', variacaoProduto)
    // console.log('Estoque', estoque)
    // console.log('Preco', variacaoPreco)
    // console.log("Empresa", empresa)

    return (
        <div id="medium-modal" className={props.statusModal + " flex flex-col absolute z-10 w-full min-h-full bg-gray-700 bg-opacity-60"}>
            {
                loading ? <LoadingComponent /> :
                    <div className='flex flex-col w-full items-center'>
                        <div className="relative p-2 lg:p-4 lg:w-3/4">
                            <div className="relative rounded-lg shadow bg-gray-200">
                                <div className="flex justify-between items-center p-5 rounded-t">
                                    <h3 className="text-xl font-medium text-gray-700">
                                        Produto
                                    </h3>
                                    <button onClick={fecharModal} type="reset" form='productForm' className="text-gray-700 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
                                        <BsX className='text-gray-700' size={24} />
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div>
                                    <form onSubmit={handleSubmit} className="p-6 space-y-6" id='productForm'>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Nome</label>
                                            <input type='text' name='nome' className="border text-sm rounded-lg block w-full p-2.5" value={produto.nome} onChange={handleProduto} required />
                                        </div>
                                        <div className='flex gap-8'>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Fornecedor</label>
                                                <div className='flex'>
                                                    <select name='fornecedorId' className="border text-sm rounded-lg block w-full p-2.5" value={produto.fornecedorId} onChange={handleProduto}>
                                                        <option value={''}></option>
                                                        {
                                                            listaFornecedores && listaFornecedores.map((fornecedor, i) => (
                                                                <option key={i} value={fornecedor.id}>{fornecedor.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-8'>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Tipo do Produto</label>
                                                <div className='flex'>
                                                    <select name='tipoProdutoId' className="border text-sm rounded-lg block w-full p-2.5" value={produto.tipoProdutoId} onChange={handleProduto} required>
                                                        <option value={''}></option>
                                                        {
                                                            tipos && tipos.map((tipo, i) => (
                                                                <option key={i} value={tipo.id}>{tipo.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700">Localização</label>
                                            <input name='localizacao' type='text' className="border text-sm rounded-lg block w-full p-2.5" value={estoque[0].localizacao} onChange={estoqueLocalizacao} />
                                        </div>
                                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Unidade</label>
                                                <div className='flex'>
                                                    <select name='unidadeId' className="border text-sm rounded-lg block w-full p-2.5" value={produto.unidadeId} onChange={handleProduto} >
                                                        <option value={null}></option>
                                                        {
                                                            unidades && unidades.map((unidade, i) => (
                                                                <option key={i} value={unidade.id}>{unidade.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">NCM (Obrigatório para emissão de Nota Fiscal)</label>
                                                <div className='flex'>
                                                    <input name='ncm' className="border text-sm rounded-lg block w-full p-2.5" value={produto.ncm} onChange={handleProduto} />
                                                </div>
                                            </div>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Classe Imposto</label>
                                                <div className='flex'>
                                                    <input name='classeImposto' className="border text-sm rounded-lg block w-full p-2.5" defaultValue={produto.classeImposto} onChange={handleProduto} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Coleção</label>
                                                <div className='flex gap-4'>
                                                    <select name='colecaoId' className="border text-sm rounded-lg block w-full p-2.5" value={produto.colecaoId} onChange={handleProduto}>
                                                        <option value={null}></option>
                                                        {
                                                            colecoes && colecoes.map((colecao, i) => (
                                                                <option key={i} value={colecao.id}>{colecao.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" onClick={() => props.setStatusColecaoModal('')}>Novo</button>
                                                </div>
                                            </div>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Marca</label>
                                                <div className='flex gap-4'>
                                                    <select name='marcaId' className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Branco" value={produto.marcaId} onChange={handleProduto}>
                                                        <option value={null}></option>
                                                        {
                                                            marcas && marcas.map((marca, i) => (
                                                                <option key={i} value={marca.id}>{marca.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" onClick={() => props.setStatusMarcaModal('')}>Novo</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-4 md:flex-row md:gap-8'>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
                                                <div className='flex gap-4'>
                                                    <select name='categoriaId' className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Branco" value={produto.categoriaId} onChange={(e) => handleCategoria(e.target.value)}>
                                                        <option value={null}></option>
                                                        {
                                                            categorias && categorias.map((categoria, i) => (
                                                                <option key={i} value={categoria.id}>{categoria.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" onClick={() => props.setStatusCategoriaModal('')}>Novo</button>
                                                </div>
                                            </div>
                                            <div className='w-full'>
                                                <label className="block mb-2 text-sm font-medium text-gray-700">Subcategoria</label>
                                                <div className='flex gap-4'>
                                                    <select name='subCategoriaId' className="border text-sm rounded-lg block w-full p-2.5" value={produto.subCategoriaId} onChange={handleProduto}>
                                                        <option value={null}></option>
                                                        {
                                                            subcategorias && subcategorias.map((sub, i) => (
                                                                <option key={i} value={sub.id}>{sub.nome}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" onClick={() => props.setStatusSubcategoriaModal('')}>Novo</button>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            variacaoProduto && variacaoProduto.map((variacao, i) => (
                                                <div key={i}>
                                                    <div className='flex flex-row border-t border-white justify-between py-3'>
                                                        <h3 className='font-bold text-gray-700 text-base'>Variações do Produto: {i + 1}</h3>
                                                        <span onClick={() => removerVariacao(i)} className="text-red-500 text-base cursor-pointer uppercase">Remover Variação</span>
                                                    </div>
                                                    <div className='flex flex-col gap-6'>
                                                        <div className='flex flex-col gap-4 md:flex-row md:gap-4'>
                                                            <div className='w-full'>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">Código de Barras</label>
                                                                <div className='flex'>
                                                                    <input name='codigoBarras' className="border text-sm rounded-lg block w-full p-2.5" value={variacao.codigoBarras} onChange={(event) => handleVariacaoProduto(i, event)} />
                                                                </div>
                                                            </div>
                                                            <div className='w-full'>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">Código do Produto</label>
                                                                <div className="flex gap-4">
                                                                    <input name='codigoProduto' className="border text-sm rounded-lg block w-full p-2.5" value={variacao.codigoProduto} onChange={(event) => handleVariacaoProduto(i, event)} />
                                                                    <button onClick={() => generateCode(i)} type='button' className='mt-auto text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700'><BsUpcScan size={20} /></button>
                                                                </div>
                                                            </div>
                                                            <div className='w-full'>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">Cor</label>
                                                                <div className='flex gap-4'>
                                                                    <select name='corId' className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Branco" value={variacao.corId} onChange={(event) => handleVariacaoProduto(i, event)}>
                                                                        <option value={null}></option>
                                                                        {
                                                                            cores && cores.map((cor, i) => (
                                                                                <option key={i} value={cor.id}>{cor.nome}</option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                    <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" onClick={() => props.setStatusColorModal('')}>Novo</button>
                                                                </div>
                                                            </div>
                                                            <div className='w-full'>
                                                                <label className="block mb-2 text-sm font-medium text-gray-700">Tamanho</label>
                                                                <div className='flex gap-4'>
                                                                    <select name='tamanhoId' className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Branco" value={variacao.tamanhoId} onChange={(event) => handleVariacaoProduto(i, event)}>
                                                                        <option value={null}></option>
                                                                        {
                                                                            tamanhos && tamanhos.map((tamanho, i) => (
                                                                                <option key={i} value={tamanho.id}>{tamanho.nome}</option>
                                                                            ))
                                                                        }
                                                                    </select>
                                                                    <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" onClick={() => props.setStatusTamanhoModal('')}>Novo</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-8'>
                                                            <div className='flex w-full flex-col gap-4 md:flex-row md:gap-8'>
                                                                <div className='flex gap-4'>
                                                                    <div className='flex-1'>
                                                                        <label className="block mb-2 text-sm font-medium text-gray-700">Custo</label>
                                                                        <input name='valorCusto' type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="1999.99" value={variacaoPreco[i].valorCusto} onChange={(event) => handleMarkup(i, event)} />
                                                                    </div>
                                                                    <div className='flex-1'>
                                                                        <label className="block mb-2 text-sm font-medium text-gray-700">Markup</label>
                                                                        <input name='markup' type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="100%" value={variacaoPreco[i].markup} onChange={(event) => handleMarkup(i, event)} />
                                                                    </div>
                                                                    <div className='flex-1'>
                                                                        <label className="block mb-2 text-sm font-medium text-gray-700">Valor</label>
                                                                        <input name='valor' type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="1999.99" value={variacaoPreco[i].valor} onChange={(event) => handleValor(i, event)} required />
                                                                    </div>
                                                                </div>
                                                                <div className='flex gap-4'>
                                                                    <div className='flex-1'>
                                                                        <label className="block mb-2 text-sm font-medium text-gray-700">Qtda</label>
                                                                        <input name='quantidade' type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="100" value={estoque[i].quantidade} onChange={(event) => handleEstoque(i, event)} required />
                                                                    </div>
                                                                    <div className='flex-1'>
                                                                        <label className="block mb-2 text-sm font-medium text-gray-700">Qtda Max</label>
                                                                        <input name='quantidadeMax' type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="10" value={estoque[i].quantidadeMax} onChange={(event) => handleEstoque(i, event)} required />
                                                                    </div>
                                                                    <div className='flex-1'>
                                                                        <label className="block mb-2 text-sm font-medium text-gray-700">Qtda Min</label>
                                                                        <input name='quantidadeMin' type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="100" value={estoque[i].quantidadeMin} onChange={(event) => handleEstoque(i, event)} required />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className="flex flex-row justify-end">
                                            <span onClick={incluirVariacao} className="text-blue-500 text-base cursor-pointer uppercase">Adicionar Variação</span>
                                        </div>
                                    </form>
                                </div>
                                <div className="flex items-center justify-between p-6 space-x-2 rounded-bk">
                                    <button onClick={() => setPopUpConfirmacao(true)} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600">Excluir</button>
                                    <button type="submit" form='productForm' className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Salvar</button>
                                </div>
                            </div>
                        </div>
                        <div className={popUpConfirmacao ? "absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
                            <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
                                <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
                                <div className="flex flex-row gap-4">
                                    <button onClick={excluirProduto} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                                    <button onClick={() => setPopUpConfirmacao(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}