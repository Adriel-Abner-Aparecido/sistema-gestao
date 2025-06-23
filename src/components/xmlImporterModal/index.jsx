import { useEffect, useState } from "react"
import { BsPlusCircleFill, BsTrashFill, BsX } from "react-icons/bs";
import { XMLParser } from "fast-xml-parser";
import InputMask from "react-input-mask";
import { get, post, put, remove } from "../../services/api";

export const XmlImporter = (props) => {

    const fornecedorPadrao = {
        id: null,
        nome: "",
        fantasia: "",
        celular: "",
        telefone: "",
        email: "",
        tipoPessoa: "Pessoa Jurídica",
        cnpjCpf: "",
        observacao: "",
        inscricaoEstadual: ""
    }

    const enderecoFornecedorPadrao = {
        clienteId: null,
        fornecedorId: "",
        vendedorId: null,
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        complemento: ''
    }

    const contasPagarPadrao = {
        vendaId: null,
        fornecedorId: null,
        valor: "",
        dataVencimento: "",
        tipo: "Compra",
        categoriaConta: null
    }

    const contaPagaPadrao = {
        valorPago: "",
        dataPagamento: "",
        contaPagarId: null,
        formasPagamentoId: 1,
        parcelas: 1
    }

    const dadosNfPadrao = {
        numeronfe: '',
        dataemissao: '',
        totalnfe: '',
        tipopag: ''
    }

    const dadosTransportePadrao = {
        cnpjtransp: "",
        nometransp: "",
        valorfrete: ""
    }

    const produtosPadrao = [{
        fornecedorId: null,
        tipoProdutoId: 3,
        marcaId: null,
        categoriaId: null,
        unidadeId: 1,
        origemId: null,
        colecaoId: null,
        subCategoriaId: null,
        nome: "",
        cstIcmsId: null,
        status: 0,
        icms: null,
        ipi: null,
        pis: null,
        cofins: null,
        cest: null,
        ncm: "",
        observacao: null,
        kitProduto: null,
        comissao: null,
        descontoMax: null,
        insumo: null,
        classeImposto: null
    }]

    const variacaoPadrao = [{
        produtoId: null,
        corId: null,
        tamanhoId: null,
        codigoBarras: '',
        codigoProduto: '',
        descricao: '',
    }]

    const variacaoPrecoPadrao = [{
        variacaoProdutoId: '',
        listaPrecoId: 1,
        valor: '',
        markup: '',
        valorCusto: ''
    }]

    const estoquePadrao = [{
        variacaoProdutoId: '',
        validade: null,
        localizacao: null,
        quantidade: '',
        quantidadeMin: '',
        quantidadeMax: '',
    }]

    const entradaPadrao = {
        fornecedorId: null,
        motivo: '',
        numeroNota: '',
        valorNota: '',
        observacao: ''
    }

    const [file, setFile] = useState();
    const [dados, setDados] = useState(false);
    const [salvaFornecedor, setSalvaFornecedor] = useState(true)
    const [movimentaEstoque, setMovimentaEstoque] = useState(true)
    const [geraContaPagar, setGeraContaPagar] = useState(true)
    const [refData, setRefData] = useState([])
    const [isReadOnly, setIsReadyOnly] = useState(true)
    const [listaFornecedores, setListaFornecedores] = useState([])
    const [unidades, setUnidades] = useState([])
    const [fornecedor, setFornecedor] = useState(fornecedorPadrao)
    const [enderecoFornecedor, setEnderecoFornecedor] = useState(enderecoFornecedorPadrao)
    const [contasPagar, setContasPagar] = useState(contasPagarPadrao)
    const [contaPaga, setContaPaga] = useState(contaPagaPadrao)
    const [parcelas, setParcelas] = useState([])
    const [dadosNf, setDadosNf] = useState(dadosNfPadrao)
    const [dadosTransporte, setDadosTransporte] = useState(dadosTransportePadrao)
    const [produtos, setProdutos] = useState(produtosPadrao)
    const [variacaoProduto, setVariacaoProduto] = useState(variacaoPadrao)
    const [variacaoPreco, setVariacaoPreco] = useState(variacaoPrecoPadrao)
    const [estoque, setEstoque] = useState(estoquePadrao)
    const [entrada, setEntrada] = useState(entradaPadrao)
    const [marked, setMarked] = useState([])
    const [alteraValor, setAlteraValor] = useState(true)
    const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)
    const [loading, setLoading] = useState(false)

    const converteXml = () => {
        if (file) {

            const reader = new FileReader();
            const parser = new XMLParser({
                ignoreDeclaration: true,
                ignorePiTags: true,
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });

            reader.onload = (e) => {
                const nfexmlarquive = e.target.result;
                const jsonObj = parser.parse(nfexmlarquive);

                const { emit, transp, ide } = jsonObj.nfeProc.NFe.infNFe;
                const { ICMSTot } = jsonObj.nfeProc.NFe.infNFe.total;
                const { detPag } = jsonObj.nfeProc.NFe.infNFe.pag;
                const dup = jsonObj.nfeProc.NFe.infNFe.cobr?.dup ? Array.isArray(jsonObj.nfeProc.NFe.infNFe.cobr?.dup) ? jsonObj.nfeProc.NFe.infNFe.cobr?.dup : [jsonObj.nfeProc.NFe.infNFe.cobr?.dup] : [];
                const det = Array.isArray(jsonObj.nfeProc.NFe.infNFe.det) ? jsonObj.nfeProc.NFe.infNFe.det : [jsonObj.nfeProc.NFe.infNFe.det];
                const date = new Date(ide.dhEmi);

                // Configurando o fornecedor
                setFornecedor({
                    nome: String(emit.xNome).replace(/[^a-zA-Z\s]/g, '').trimStart(),
                    fantasia: emit.xFant || "",
                    celular: String(emit.enderEmit.celular).replace(/\D/g, '').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') || "",
                    telefone: String(emit.enderEmit.fone).replace(/\D/g, '').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') || "",
                    email: "",
                    tipoPessoa: "Pessoa Jurídica",
                    cnpjCpf: String(emit.CNPJ).replace(/\D/g, '').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'),
                    observacao: "",
                });

                // Configurando o endereço do fornecedor
                setEnderecoFornecedor({
                    clienteId: null,
                    fornecedorId: null,
                    vendedorId: null,
                    cep: String(emit.enderEmit.CEP).replace(/\D/g, '').padStart(8, '0').replace(/(\d{5})(\d{3})/, '$1-$2'),
                    rua: emit.enderEmit.xLgr,
                    numero: emit.enderEmit.nro,
                    bairro: emit.enderEmit.xBairro,
                    cidade: emit.enderEmit.xMun,
                    uf: emit.enderEmit.UF,
                    complemento: ""
                });

                // Configurando contas a pagar
                setContasPagar({
                    categoriaConta: null,
                    dataVencimento: date.toISOString().slice(0, 16),
                    fornecedorId: null,
                    tipo: "Compra",
                    valor: ICMSTot.vNF,
                    vendaId: null,
                });

                setContaPaga({
                    contaPagarId: null,
                    dataPagamento: date.toISOString().slice(0, 16),
                    formasPagamentoId: 1,
                    parcelas: String(dup.length === 0 ? 1 : dup.length),
                    valorPago: ICMSTot.vNF
                })

                // Configurando parcelas
                setParcelas(dup.map((dup) => ({
                    contaPagarId: null,
                    numero: dup.nDup,
                    vencimento: dup.dVenc,
                    valor: dup.vDup,
                })));

                // Configurando dados da nota fiscal
                setDadosNf({
                    numeronfe: ide.nNF,
                    dataemissao: date.toISOString().slice(0, 16),
                    totalnfe: ICMSTot.vNF,
                    tipopag: detPag.xPag,
                });

                // Configurando dados de transporte
                setDadosTransporte({
                    cnpjtransp: transp.transporta?.CNPJ
                        ? String(transp.transporta?.CNPJ).replace(/\D/g, '').padStart(14, '0').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
                        : '',
                    nometransp: transp.transporta?.xNome || '',
                    valorfrete: ICMSTot.vFrete || '',
                });

                // Configurando produtos
                setProdutos(
                    det.map((produto) => ({
                        fornecedorId: null,
                        tipoProdutoId: 3,
                        marcaId: null,
                        categoriaId: null,
                        unidadeId: 1,
                        origemId: null,
                        colecaoId: null,
                        subCategoriaId: null,
                        nome: produto.prod.xProd.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚãõÃÕçÇ ]/g, '').padStart(),
                        cstIcmsId: null,
                        status: 0,
                        icms: null,
                        ipi: null,
                        pis: null,
                        cofins: null,
                        cest: null,
                        ncm: produto.prod.NCM,
                        observacao: null,
                        kitProduto: null,
                        comissao: null,
                        descontoMax: null,
                        insumo: null,
                        classeImposto: null,
                    }))
                );

                // Configurando variações de produto
                setVariacaoProduto(
                    det.map((produto) => ({
                        produtoId: null,
                        descricao: produto.prod.xProd.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚãõÃÕçÇ ]/g, '').padStart(),
                        corId: null,
                        tamanhoId: null,
                        codigoBarras: Number(produto.prod.cEAN),
                        codigoProduto: produto.prod.cProd,
                    }))
                );

                // Configurando preços de variação de produto
                setVariacaoPreco(
                    det.map((produto) => ({
                        variacaoProdutoId: null,
                        listaPrecoId: 1,
                        valor: "",
                        markup: "",
                        valorCusto: parseFloat(produto.prod.vUnCom),
                    }))
                );

                // Configurando estoque
                setEstoque(
                    det.map((produto) => ({
                        variacaoProdutoId: null,
                        validade: null,
                        localizacao: null,
                        quantidade: produto.prod.qCom,
                        quantidadeMin: "",
                        quantidadeMax: "",
                    }))
                );

                setEntrada({
                    fornecedorId: null,
                    motivo: "",
                    numeroNota: ide.nNF,
                    observacao: "",
                    valorNota: ICMSTot.vNF
                })

                procuraFornecedor(String(emit.xNome).replace(/[^a-zA-Z\s]/g, '').trimStart())

            };
            reader.readAsText(file);
            setIsReadyOnly(true);
            setDados(true)
        }
    };

    const procuraFornecedor = async (nome) => {
        const pesquisanome = nome.trimStart()
        if (nome) {
            const fornecedor = await get(`${process.env.NEXT_PUBLIC_API_URL}/fornecedornomecnpj/${pesquisanome}`)
            if (fornecedor[0]) {
                selecionaFornecedor(fornecedor[0].id)
            }
        }
    }

    useEffect(() => {
        listarProdutos()
        listarUnidades()
        listarFornecedores()
    }, [props.newData, props.entradaSelecionada])

    useEffect(() => {
        if (props.newData) {
            props.setvisivel("")
            setDados(true)
            setIsReadyOnly(false)
            listarProdutos()
            listarUnidades()
            listarFornecedores()
        }
    }, [props.newData])

    useEffect(() => {
        if (props.entradaSelecionada) {
            props.setvisivel("")
            setDados(true)
            setIsReadyOnly(false)
            listarProdutos()
            listarUnidades()
            listarFornecedores()
            fetchFornecedorEntradaSelecionada(props.entradaSelecionada.fornecedor_id)
            fetchProdutosEntradaSelecionada(props.entradaSelecionada.id)
            fetchNotaDaEntrada(props.entradaSelecionada.id)
            setEntrada({
                id: props.entradaSelecionada.id,
                fornecedorId: props.entradaSelecionada.fornecedor_id,
                motivo: props.entradaSelecionada.motivo,
                numeroNota: props.entradaSelecionada.numero_nota_fiscal,
                observacao: props.entradaSelecionada.observacao,
                valorNota: props.entradaSelecionada.valor_nota.toFixed(2)
            })
            setDadosNf({
                ...dadosNf,
                totalnfe: parseFloat(parseFloat(props.entradaSelecionada.valor_nota).toFixed(2))
            })
        }

    }, [props.entradaSelecionada])

    const fetchFornecedorEntradaSelecionada = async (fornecedorId) => {
        try {
            const fornecedorEntrada = await get(`${process.env.NEXT_PUBLIC_API_URL}/fornecedorid/${fornecedorId}`)
            if (fornecedorEntrada[0]) {
                setFornecedor({
                    id: fornecedorEntrada[0].id,
                    celular: fornecedorEntrada[0].celular,
                    cnpjCpf: fornecedorEntrada[0].cnpj_cpf,
                    email: fornecedorEntrada[0].email,
                    fantasia: fornecedorEntrada[0].fantasia,
                    nome: fornecedorEntrada[0].nome,
                    tipoPessoa: fornecedorEntrada[0].tipo_pessoa,
                    telefone: fornecedorEntrada[0].telefone
                })
                const enderecoFornecedorEntrada = await get(`${process.env.NEXT_PUBLIC_API_URL}/enderecosfornecedor/${fornecedorEntrada[0].id}`)
                if (enderecoFornecedorEntrada[0]) {
                    setEnderecoFornecedor({
                        bairro: enderecoFornecedorEntrada[0].bairro,
                        cep: enderecoFornecedorEntrada[0].cep,
                        cidade: enderecoFornecedorEntrada[0].cidade,
                        fornecedorId: enderecoFornecedorEntrada[0].fornecedor_id,
                        vendedorId: null,
                        clienteId: null,
                        bairro: enderecoFornecedorEntrada[0].bairro,
                        numero: enderecoFornecedorEntrada[0].numero,
                        rua: enderecoFornecedorEntrada[0].rua,
                        uf: enderecoFornecedorEntrada[0].uf,
                        complemento: enderecoFornecedorEntrada[0].complemento
                    })
                } else {
                    setEnderecoFornecedor(enderecoFornecedorPadrao)
                }
            } else {
                setFornecedor(fornecedorPadrao)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchProdutosEntradaSelecionada = async (entradaId) => {
        const produtosDaEntrada = await get(`${process.env.NEXT_PUBLIC_API_URL}/produtosdaentrada/${entradaId}`)
        if (produtosDaEntrada.length > 0) {
            setProdutos(produtosDaEntrada.map((produto) => ({
                fornecedorId: null,
                tipoProdutoId: 3,
                marcaId: null,
                categoriaId: null,
                unidadeId: 1,
                origemId: null,
                colecaoId: null,
                subCategoriaId: null,
                nome: produto.nome,
                cstIcmsId: null,
                status: 0,
                icms: null,
                ipi: null,
                pis: null,
                cofins: null,
                cest: null,
                ncm: produto.ncm,
                observacao: null,
                kitProduto: null,
                comissao: null,
                descontoMax: null,
                insumo: null,
                classeImposto: null
            })))
            setVariacaoProduto(produtosDaEntrada.map((produto) => ({
                ...variacaoProduto,
                codigoBarras: produto.codigo_barras || '',
                codigoProduto: produto.codigo_produto || ''
            })))
            setVariacaoPreco(produtosDaEntrada.map((produto) => ({
                ...variacaoPreco,
                variacaoProdutoId: produto.variacao_produto_id,
                listaPrecoId: produto.listaPrecoId,
                produtoId: produto.produto_id,
                valor: produto.markup ? (produto.valor_custo + (produto.valor_custo * (produto.markup / 100))).toFixed(2) : (produto.valor || 0).toFixed(2),
                valorCusto: (produto.valor_custo || 0).toFixed(2),
                markup: produto.markup || ''
            })))
            setEstoque(produtosDaEntrada.map((produto) => ({
                variacaoProdutoId: produto.variacao_produto_id,
                validade: produto.validade,
                localizacao: produto.localizacao,
                quantidadeMin: produto.quantidade_min,
                quantidadeMax: produto.quantidade_max,
                estoqueId: produto.estoqueId,
                quantidade: produto.quantidade
            })))
        } else {
            setProdutos(produtosPadrao)
        }
    }

    const fetchNotaDaEntrada = async (entradaId) => {

        try {

            const notaentrada = await get(`${process.env.NEXT_PUBLIC_API_URL}/notafiscalentrada/${entradaId}`)

            if (notaentrada[0]) {
                setDadosNf({
                    dataemissao: notaentrada[0].data_emissao,
                    numeronfe: notaentrada[0].numero_nf,
                    tipopag: notaentrada[0].tipo_pag,
                    totalnfe: parseFloat(notaentrada[0].valor_nf.toFixed(2))
                })
                setDadosTransporte({
                    cnpjtransp: notaentrada[0].cnpj_transp,
                    nometransp: notaentrada[0].nome_transp,
                    valorfrete: parseFloat(notaentrada[0].valor_frete?.toFixed(2))
                })
            }

        } catch (error) {
            console.error("Erro ao buscar dados da nota de entrada")
        }

    }

    const listarProdutos = async () => {
        const dataprod = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoquecompleto`)
        setRefData(dataprod)

    }

    const listarFornecedores = async () => {
        const fornecedores = await get(`${process.env.NEXT_PUBLIC_API_URL}/fornecedores`)
        console.log(fornecedores)
        setListaFornecedores(fornecedores)
    }

    const listarUnidades = async () => {
        const unidades = await get(`${process.env.NEXT_PUBLIC_API_URL}/unidades`)
        setUnidades(unidades)
    }

    const selecionaFornecedor = async (fornecedorId) => {

        const fornecedorSelecionado = listaFornecedores.find(fornecedor => fornecedor.id === Number(fornecedorId));

        setFornecedor({
            id: fornecedorId,
            nome: fornecedorSelecionado.nome,
            fantasia: fornecedorSelecionado.fantasia || "",
            celular: fornecedorSelecionado.celular || fornecedor.celular || "",
            telefone: fornecedorSelecionado.telefone || fornecedor.telefone || "",
            email: fornecedorSelecionado.email || "",
            tipoPessoa: fornecedorSelecionado.tipo_pessoa,
            cnpjCpf: fornecedorSelecionado.cnpj_cpf,
            observacao: fornecedorSelecionado.observacao || "",
            inscricaoEstadual: fornecedorSelecionado.inscricao_estadual
        })

        const endereco = await get(`${process.env.NEXT_PUBLIC_API_URL}/enderecosfornecedor/${fornecedorId}`)

        if (endereco[0]) {

            setEnderecoFornecedor({
                enderecoId: endereco[0].id,
                fornecedorId: endereco[0].fornecedor_id || enderecoFornecedor.fornecedorId || "",
                clienteId: null,
                vendedorId: null,
                cep: endereco[0]?.cep || enderecoFornecedor.cep || "",
                rua: endereco[0]?.rua || enderecoFornecedor.rua || "",
                numero: endereco[0]?.numero || enderecoFornecedor.numero || "",
                bairro: endereco[0]?.bairro || enderecoFornecedor.bairro || "",
                cidade: endereco[0]?.cidade || enderecoFornecedor.cidade || "",
                uf: endereco[0]?.uf || enderecoFornecedor.uf || "",
                complemento: endereco[0].complemento || ""
            })
        }

    }

    const handleFornecedor = (event) => {
        setFornecedor({ ...fornecedor, [event.target.name]: event.target.value })
    }

    const handleEnderecoFornecedor = (event) => {
        setEnderecoFornecedor({ ...enderecoFornecedor, [event.target.name]: event.target.value })
    }

    const handleProdutos = (event, index) => {
        setProdutos((prevProdutos) =>
            prevProdutos.map((produto, i) =>
                i === index ? { ...produto, [event.target.name]: event.target.value } : produto
            )
        );
    }

    const handleVariacaoProduto = (event, index) => {
        setVariacaoProduto(prevVariacaoProcuto =>
            prevVariacaoProcuto.map((variacao, i) =>
                i === index ? { ...variacao, [event.target.name]: event.target.value } : variacao
            )
        )
    }

    const handleVariacaoPreco = (event, index) => {
        setVariacaoPreco(prevPreco =>
            prevPreco.map((preco, i) =>
                i === index ? { ...preco, [event.target.name]: event.target.value } : preco
            )
        )
    }

    const handleEstoque = (event, index) => {
        setEstoque(prevEstoque =>
            prevEstoque.map((estoque, i) =>
                i === index ? { ...estoque, [event.target.name]: event.target.value } : estoque
            )
        )
    }

    const handleEntrada = (event) => {
        setEntrada({ ...entrada, [event.target.name]: event.target.value })
    }

    const handleDadosNf = (event) => {
        setDadosNf({ ...dadosNf, [event.target.name]: event.target.value || null })
    }

    const handleDadosTransporte = (event) => {
        setDadosTransporte({ ...dadosTransporte, [event.target.name]: event.target.value })
    }

    const markupPadrao = (novoMarkup) => {
        setVariacaoPreco((prevEstoque) =>
            prevEstoque.map((est) => ({
                ...est,
                markup: novoMarkup,
                valor: parseFloat(est.valorCusto) + (parseFloat(est.valorCusto) * (parseFloat(novoMarkup) / 100))
            }))
        );
    };

    const handleSelectProduto = (event) => {

        const { item, index } = JSON.parse(event.target.value)

        console.log(JSON.parse(event.target.value))

        setProdutos(prevProdutos =>
            prevProdutos.map((produto, i) =>
                i === index ? {
                    ...produto,
                    codigo: item.estoque_id,
                    ean: item.codigo_barras,
                    nome: item.nome,
                    ncm: item.ncm,
                    cfop: null,
                    unidadeId: item.unidade_id,
                    custo: prevProdutos.custo,
                    markup: item.markup,
                } : produto
            )
        )
        setVariacaoProduto(prevVariacaoProduto =>
            prevVariacaoProduto.map((variacao, i) =>
                i === index ? {
                    ...variacao,
                    codigoBarras: item.codigo_barras,
                    codigoProduto: item.codigo_produto,
                    corId: item.cor_id,
                    descricao: null,
                    produtoId: item.produto_id,
                    tamanhoId: item.tamanho_id
                } : variacao
            )
        )
        setVariacaoPreco(prevVariacaoPreco =>
            prevVariacaoPreco.map((preco, i) =>
                i === index ? {
                    ...preco,
                    markup: item.markup
                } : preco
            )
        )
        setEstoque(prevEstoque =>
            prevEstoque.map((estoque, i) =>
                i === index ? {
                    ...estoque,
                } : estoque
            )
        )
    }

    const handleMarked = (event) => {
        const value = parseInt(event.target.value, 10);
        if (event.target.checked) {
            setMarked((prevMarked) => [...prevMarked, value]);
        } else {
            setMarked((prevMarked) => prevMarked.filter((item) => item !== value));
        }
    }

    const addProduct = () => {
        setProdutos((prevProdutos) => [
            ...prevProdutos,
            {
                fornecedorId: null,
                tipoProdutoId: 3,
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
                empresaId: null,
                classeImposto: ''
            }
        ]);

        setVariacaoProduto((prevVariacaoProduto) => [
            ...prevVariacaoProduto,
            {
                produtoId: '',
                corId: '',
                tamanhoId: '',
                codigoBarras: '',
                codigoProduto: '',
                descricao: null,
                empresaId: ''
            }
        ]);

        setVariacaoPreco((prevVariacaoPreco) => [
            ...prevVariacaoPreco,
            {
                variacaoProdutoId: '',
                listaPrecoId: 1,
                valor: '',
                markup: '',
                empresaId: '',
                valorCusto: ''
            }
        ]);

        setEstoque((prevEstoque) => [
            ...prevEstoque,
            {
                variacaoProdutoId: '',
                validade: null,
                localizacao: null,
                quantidade: '',
                quantidadeMin: '',
                quantidadeMax: '',
                empresaId: ''
            }
        ]);
    };

    const delProduct = (index) => {
        setProdutos((prevProdutos) => {
            const updatedProdutos = prevProdutos.filter((_, i) => i !== index);
            return updatedProdutos.length === 0
                ? [
                    {
                        fornecedorId: null,
                        tipoProdutoId: "",
                        marcaId: "",
                        categoriaId: "",
                        unidadeId: "",
                        origemId: null,
                        colecaoId: "",
                        subCategoriaId: "",
                        nome: "",
                        cstIcmsId: null,
                        status: 0,
                        icms: null,
                        ipi: null,
                        pis: null,
                        cofins: null,
                        cest: null,
                        ncm: "",
                        observacao: null,
                        kitProduto: null,
                        comissao: null,
                        descontoMax: null,
                        insumo: null,
                        empresaId: null,
                        classeImposto: "",
                    },
                ]
                : updatedProdutos;
        });

        setVariacaoProduto((prevVariacaoProduto) => {
            const updatedVariacaoProduto = prevVariacaoProduto.filter((_, i) => i !== index);
            return updatedVariacaoProduto.length === 0
                ? [
                    {
                        produtoId: "",
                        corId: "",
                        tamanhoId: "",
                        codigoBarras: "",
                        codigoProduto: "",
                        descricao: null,
                        empresaId: "",
                    },
                ]
                : updatedVariacaoProduto;
        });

        setVariacaoPreco((prevVariacaoPreco) => {
            const updatedVariacaoPreco = prevVariacaoPreco.filter((_, i) => i !== index);
            return updatedVariacaoPreco.length === 0
                ? [
                    {
                        variacaoProdutoId: "",
                        listaPrecoId: 1,
                        valor: "",
                        markup: "",
                        empresaId: "",
                        valorCusto: "",
                    },
                ]
                : updatedVariacaoPreco;
        });

        setEstoque((prevEstoque) => {
            const updatedEstoque = prevEstoque.filter((_, i) => i !== index);
            return updatedEstoque.length === 0
                ? [
                    {
                        variacaoProdutoId: "",
                        validade: null,
                        localizacao: null,
                        quantidade: "",
                        quantidadeMin: "",
                        quantidadeMax: "",
                        empresaId: "",
                    },
                ]
                : updatedEstoque;
        });
    };

    const salvarEntrada = async (event) => {

        event.preventDefault()

        const dataEntrada = {
            cadastraFornecedor: salvaFornecedor,
            fornecedor: {
                id: fornecedor.id,
                nome: fornecedor.nome,
                fantasia: fornecedor.fantasia,
                celular: fornecedor.celular,
                telefone: fornecedor.telefone,
                email: fornecedor.email,
                tipoPessoa: fornecedor.tipoPessoa,
                cnpjCpf: fornecedor.cnpjCpf,
                observacao: fornecedor.observacao,
                enderecoId: enderecoFornecedor.enderecoId,
                clienteId: null,
                fornecedorId: fornecedor.id,
                vendedorId: null,
                cep: enderecoFornecedor.cep,
                rua: enderecoFornecedor.rua,
                numero: enderecoFornecedor.numero,
                bairro: enderecoFornecedor.bairro,
                cidade: enderecoFornecedor.cidade,
                uf: enderecoFornecedor.uf,
                complemento: enderecoFornecedor.complemento,
                inscricaoEstadual: fornecedor.inscricaoEstadual || null
            },
            duplicatas: parcelas.length > 0 ? parcelas.map((parcela) => ({
                vendaId: null,
                fornecedorId: '',
                valor: parcela.valor,
                dataVencimento: parcela.vencimento,
                tipo: "Compra",
                categoriaConta: null
            })) : [],
            cadastrarContaPagar: geraContaPagar,
            notafiscal: {
                valorNota: dadosNf.totalnfe,
                numeronfe: parseInt(dadosNf.numeronfe),
                dataemissao: dadosNf.dataemissao,
                totalnfe: parseFloat(parseFloat(dadosNf.totalnfe).toFixed(2)),
                tipopag: dadosNf.tipopag || null,
                cnpjtransp: dadosTransporte.cnpjtransp || null,
                nometransp: dadosTransporte.nometransp || null,
                valorfrete: dadosTransporte.valorfrete || null
            },
            movimentaEstoque: movimentaEstoque,
            alteraValor: alteraValor,
            produtos: produtos.map((produto, i) => ({
                fornecedorId: fornecedor.id || null,
                tipoProdutoId: produto.tipoProdutoId || 3,
                marcaId: produto.marcaId || null,
                categoriaId: produto.categoriaId || null,
                unidadeId: produto.unidadeId || null,
                origemId: produto.origemId || null,
                colecaoId: produto.colecaoId || null,
                subCategoriaId: produto.subCategoriaId,
                nome: produto.nome,
                cstIcmsId: produto.cstIcmsId || null,
                status: produto.status || 0,
                icms: produto.icms || null,
                ipi: produto.ipi || null,
                pis: produto.pis || null,
                cofins: produto.cofins || null,
                cest: produto.cest || null,
                ncm: String(produto.ncm),
                observacao: produto.observacao || null,
                kitProduto: produto.kitProduto || null,
                comissao: produto.comissao || null,
                descontoMax: produto.descontoMax || null,
                insumo: produto.insumo || null,
                classeImposto: produto.classeImposto || null,
                corId: variacaoProduto[i].cor || null,
                tamanhoId: variacaoProduto[i].tamanhoId || null,
                codigoBarras: variacaoProduto[i].codigoBarras || null,
                codigoProduto: variacaoProduto[i].codigoProduto || null,
                descricao: variacaoProduto[i].descricao,
                listaPrecoId: 1,
                valor: parseFloat(parseFloat(variacaoPreco[i].valor || 0).toFixed(2)),
                markup: variacaoPreco[i].markup || 0,
                valorCusto: parseFloat(parseFloat(variacaoPreco[i].valorCusto || 0).toFixed(2)),
                validade: estoque[i].validade || null,
                localizacao: estoque[i].localizacao || null,
                quantidade: parseFloat(parseFloat(estoque[i].quantidade).toFixed(2)),
                quantidadeMin: estoque[i].quantidadeMin || 1,
                quantidadeMax: estoque[i].quantidadeMax || 999999,
                valorTotal: parseFloat(parseFloat(parseFloat(variacaoPreco[i].valorCusto) * Number(estoque[i].quantidade) || 0).toFixed(2))
            })),

        }

        console.log(dataEntrada)

        try {

            setLoading(true)

            const res = await post(`${process.env.NEXT_PUBLIC_API_URL}/salvarentrada`, dataEntrada)

            if (res.message) {
                console.log(res.message)
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            props.setAtualizar(true)
            closeclearall()
        }

    }

    const closeclearall = () => {
        props.setvisivel("hidden");
        setDados(null)
        clearall()
    }

    const clearall = () => {
        props.delNewData(null);
        setSalvaFornecedor(true);
        setMovimentaEstoque(true);
        setGeraContaPagar(true);
        setMarked([])
        setFornecedor(fornecedorPadrao)
        setEnderecoFornecedor(enderecoFornecedorPadrao)
        setDadosTransporte(dadosTransportePadrao)
        setContasPagar(contasPagarPadrao)
        setContaPaga(contaPagaPadrao)
        setDadosNf(dadosNfPadrao)
        setParcelas([])
        setProdutos(produtosPadrao)
        setVariacaoProduto(variacaoPreco)
        setVariacaoPreco(variacaoPrecoPadrao)
        setEstoque(estoquePadrao)
        setEntrada(entradaPadrao)
        setAlteraValor(true)
        props.setEntradaSelecionada(null)
    }

    const deleteEntrada = async () => {

        setLoading(true)

        try {
            await remove(`${process.env.NEXT_PUBLIC_API_URL}/entradas/${props.entradaSelecionada.id}`)
            await removerEstoqueProdutosDaEntrada()
        } catch (error) {
            console.error("Erro ao tentar apagar entrada")
        } finally {
            setPopUpConfirmacao(false)
            props.setAtualizar(true)
            closeclearall()
            setLoading(false)
        }

    }

    const removerEstoqueProdutosDaEntrada = async () => {

        try {

            await Promise.all(
                estoque.map(async (itemEstoque) => {
                    // Verifica o estoque atual
                    const verestoque = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${itemEstoque.estoqueId}`);

                    if (!verestoque || verestoque.length === 0) {
                        throw new Error(`Estoque não encontrado para o ID: ${itemEstoque.estoqueId}`);
                    }

                    const novoEstoque = {
                        variacaoProdutoId: verestoque[0].variacao_produto_id,
                        validade: verestoque[0].validade,
                        localizacao: verestoque[0].localizacao,
                        quantidadeMin: verestoque[0].quantidade_min,
                        quantidadeMax: verestoque[0].quantidade_max,
                        quantidade: parseFloat(verestoque[0].quantidade) - parseFloat(itemEstoque.quantidade),
                    };

                    if (novoEstoque.quantidade < 0) {
                        throw new Error(`Quantidade negativa detectada no estoque para o ID: ${itemEstoque.estoqueId}`);
                    }

                    // Atualiza o estoque
                    await put(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${itemEstoque.estoqueId}`, novoEstoque);
                })
            );
            console.log("Estoque atualizado com sucesso.");

        } catch (error) {
            console.error("Erro ao atualizar o estoque:", error.message);
            throw error;
        }

    };


    //console.log("Estoque", estoque)
    console.log("Endereco fornecedor", enderecoFornecedor)
    console.log("Dados Transporte", dadosTransporte)
    console.log("Dados Fornecedor", fornecedor)
    console.log("Dados entrada", entrada)
    console.log("Parcelas", parcelas)
    console.log("produtos", produtos)

    if (!dados) {
        return (
            <div className={props.visivel + " flex flex-col absolute w-full h-full items-center bg-gray-700 bg-opacity-60"}>
                <div className="relative p-4 w-3/4 h-full sm:h-auto">
                    <div className="relative rounded-lg shadow bg-gray-300">
                        <div className="flex justify-between items-center p-5 rounded-t">
                            <h3 className="text-xl font-medium text-gray-700">
                                Entrada
                            </h3>
                            <button onClick={closeclearall} type="button" className="text-gray-700 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
                                <BsX className='text-gray-700' size={24} />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-8">
                            <form className='p-5 flex flex-col items-center justify-center gap-4' onSubmit={(e) => e.preventDefault()}>
                                <input className="border-2 border-dashed p-4" type="file" name="notaxml" id="notaxml" onChange={(e) => setFile(e.target.files[0])} accept=".xml" />
                                <button className="bg-green-500 text-white p-2 uppercase rounded-lg" type='submit' onClick={converteXml}>Importar</button>
                            </form >
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (<>
            <div className={props.visivel + " flex flex-col absolute w-full mb-10 items-center bg-gray-700 bg-opacity-60"}>
                <div className="relative p-4 w-4/5 h-full sm:h-auto">
                    <div className="relative rounded-lg shadow bg-gray-300">
                        <div className="flex justify-between items-center p-5 rounded-t">
                            <h3 className="text-xl font-medium text-gray-700">
                                Entrada
                            </h3>
                            <button onClick={closeclearall} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
                                <BsX className='text-gray-700' size={24} />
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-8 flex flex-col gap-8 bg-gray-200 text-gray-700">
                            <form onSubmit={salvarEntrada} id="formEntrada">
                                <div className="flex flex-col border-b border-slate-500 pb-4">
                                    <div className="flex justify-between">
                                        <h1 className="text-xl">Dados do Fornecedor</h1>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="salvafornecedor">Salvar Fornecedor:</label>
                                            <input className="w-5 h-5" type="checkbox" name="salvafornecedor" id="salvafornecedor" onChange={() => setSalvaFornecedor(!salvaFornecedor)} checked={salvaFornecedor} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="selectfornecedor">Selecionar um fornecedor:</label>
                                        <select onChange={(e) => selecionaFornecedor(e.target.value)} className="p-2 w-full focus:outline-none" name="selectfornecedor" id="selectfornecedor">
                                            <option value={undefined}></option>
                                            {
                                                listaFornecedores.map((fornecedor, i) => (
                                                    <option key={i} value={fornecedor.id}>{fornecedor.nome} - {fornecedor.fantasia} - {fornecedor.cnpj_cpf} </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="w-full flex flex-col md:flex-row flex-wrap xl:flex-nowrap gap-4">
                                        <div className="flex flex-col w-full xl:w-10/12">
                                            <label htmlFor="nome">Nome:</label>
                                            <input className="p-2 focus:outline-none" type="text" name="nome" id="nome" value={fornecedor.nome} onChange={handleFornecedor} />
                                        </div>
                                        <div className="flex flex-col w-full xl:w-2/12">
                                            <label htmlFor="cnpjCpf">CNPJ:</label>
                                            <InputMask className="p-2 focus:outline-none" type="text" name="cnpjCpf" id="cnpjCpf" value={fornecedor.cnpjCpf} onChange={handleFornecedor} mask={"99.999.999/9999-99"} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col md:flex-row flex-wrap xl:flex-nowrap gap-4">
                                        <div className="flex flex-col w-full xl:w-12/12">
                                            <label htmlFor="fantasia">Nome Fantasia:</label>
                                            <input className="p-2 focus:outline-none" type="text" name="fantasia" id="fantasia" value={fornecedor.fantasia} onChange={handleFornecedor} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row flex-wrap xl:flex-nowrap gap-4">
                                        <div className="flex flex-col w-full md:w-1/2 xl:w-3/12">
                                            <label htmlFor="celular">Celular:</label>
                                            <InputMask className="p-2 focus:outline-none" min={11} max={11} type="text" name="celular" id="celular" value={fornecedor.celular} onChange={handleFornecedor} mask={"(99) 99999-9999"} />
                                        </div>
                                        <div className="flex flex-col w-full md:w-1/2 xl:w-3/12">
                                            <label htmlFor="telefone">Telefone:</label>
                                            <InputMask className="p-2 focus:outline-none" type="text" name="telefone" id="telefone" value={fornecedor.telefone} onChange={handleFornecedor} min={10} max={10} mask={"(99) 9999-9999"} />
                                        </div>
                                        <div className="flex flex-col w-full xl:w-6/12">
                                            <label htmlFor="email">Email:</label>
                                            <input className="p-2 focus:outline-none" type="email" name="email" id="email" value={fornecedor.email} onChange={handleFornecedor} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row flex-wrap xl:flex-nowrap gap-4">
                                        <div className="flex flex-col w-full md:w-1/12">
                                            <label htmlFor="cep">Cep:</label>
                                            <InputMask className="p-2 focus:outline-none" type="text" name="cep" id="cep" value={enderecoFornecedor.cep} onChange={handleEnderecoFornecedor} mask={"99999-999"} />
                                        </div>
                                        <div className="flex flex-col w-full md:w-4/12">
                                            <label htmlFor="rua">Endereço:</label>
                                            <input className="p-2 focus:outline-none" type="text" name="rua" id="rua" value={enderecoFornecedor.rua} onChange={handleEnderecoFornecedor} />
                                        </div>
                                        <div className="flex flex-col w-full md:w-1/12">
                                            <label htmlFor="numero">Numero:</label>
                                            <input className="p-2 focus:outline-none" type="text" name="numero" id="numero" value={enderecoFornecedor.numero} onChange={handleEnderecoFornecedor} />
                                        </div>
                                        <div className="flex flex-col w-full md:w-2/12">
                                            <label htmlFor="beirro">Bairro:</label>
                                            <input className="p-2 focus:outline-none" type="text" name="beirro" id="beirro" value={enderecoFornecedor.bairro} onChange={handleEnderecoFornecedor} />
                                        </div>
                                        <div className="flex flex-col w-full md:w-3/12">
                                            <label htmlFor="cidade">Cidade:</label>
                                            <input className="p-2 focus:outline-none" type="text" name="cidade" id="cidade" value={enderecoFornecedor.cidade} onChange={handleEnderecoFornecedor} />
                                        </div>
                                        <div className="flex flex-col w-full md:w-1/12">
                                            <label htmlFor="uf">UF:</label>
                                            <input className="p-2 focus:outline-none" type="text" name="uf" id="uf" value={enderecoFornecedor.uf} onChange={handleEnderecoFornecedor} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-4 border-b border-slate-500 pb-4">
                                    <div className="flex fle-col md:flex-row">
                                        <h1 className="text-xl">Dados da Nota fiscal</h1>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                            <label htmlFor="numernfe">Numero da NF:</label>
                                            <input className="p-1 focus:outline-none" type="text" name="numeronfe" id="numeronfe" value={dadosNf.numeronfe} size={4} readOnly={isReadOnly} onChange={handleDadosNf} />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                            <label htmlFor="dataemissao">Data de Emissão:</label>
                                            <input className="p-1 focus:outline-none" type="datetime-local" name="dataemissao" id="dataemissao" value={dadosNf.dataemissao} size={16} readOnly={isReadOnly} onChange={handleDadosNf} />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                            <label htmlFor="totalnfe">Valor da NF:</label>
                                            <input className="p-1 focus:outline-none text-right" type="number" name="totalnfe" id="totalnfe" value={dadosNf.totalnfe} size={8} readOnly={isReadOnly} onChange={handleDadosNf} />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                            <label htmlFor="tipopag">Tipo Pagamento:</label>
                                            <input className="p-1 focus:outline-none" type="text" name="tipopag" id="tipopag" value={dadosNf.tipopag} size={20} onChange={handleDadosNf} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-4 border-b border-slate-500 pb-4">
                                    <div className="flex fle-col md:flex-row justify-between items-center">
                                        <h1 className="text-xl">Valores à Pagar</h1>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="geraduplicata">Gerar contas a Pagar:</label>
                                            <input className="h-5 w-5" type="checkbox" name="geraduplicata" id="geraduplicata" onChange={() => setGeraContaPagar(!geraContaPagar)} checked={geraContaPagar} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                                        <div className="flex flex-col md:flex-row gap-4 items-center">
                                            <label htmlFor="valornf">Valor da NF:</label>
                                            <input className="p-1 text-right" type="number" name="valornf" value={dadosNf.totalnfe} readOnly size={8} />
                                        </div>
                                    </div>
                                    {
                                        parcelas && parcelas.length > 0 && (

                                            <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                                                <h1>Duplicatas:</h1>
                                                {
                                                    parcelas.map((dup, i) => (
                                                        <div className="flex flex-col" key={i}>
                                                            <label className="text-gray-700" htmlFor="parcela">{dup.numero}</label>
                                                            <input className="p-1 focus:outline-none text-right" type="number" name="parcela" id="parcela" value={dup.valor} size={4} readOnly />
                                                            <label className="text-gray-700" htmlFor="vencimentodup">Vencimento:</label>
                                                            <input type="date" name="vencimentodup" value={dup.vencimento} readOnly />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="w-full flex flex-col gap-4 border-b border-slate-500 pb-4">
                                    <div className="flex fle-col md:flex-row">
                                        <h1 className="text-xl">Dados do Transporte</h1>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                            <label htmlFor="cnpjtransp">CNPJ:</label>
                                            <input className="p-1 focus:outline-none" type="text" name="cnpjtransp" id="cnpjtransp" value={dadosTransporte.cnpjtransp} size={20} onChange={handleDadosTransporte} />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                            <label htmlFor="nometransp">Razão Social:</label>
                                            <input className="p-1 focus:outline-none" type="text" name="nometransp" id="nometransp" value={dadosTransporte.nometransp} size={35} onChange={handleDadosTransporte} />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 md:items-center">
                                            <label htmlFor="valorfrete">Valor:</label>
                                            <input className="p-1 focus:outline-none text-right" type="number" name="valorfrete" id="valorfrete" value={dadosTransporte.valorfrete} size={8} onChange={(e) => setDadosTransporte({ ...dadosTransporte, valorfrete: parseFloat(e.target.value || '') })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-4 border-b border-slate-500 pb-4">
                                    <div className="flex fle-col md:flex-row">
                                        <h1 className="text-xl">Motivo</h1>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                                        <label htmlFor="motivo">Motivo da entrada:</label>
                                        <select className="p-1 focus:outline-none active:rounded-none" name="motivo" id="motivo" value={entrada.motivo} onChange={handleEntrada} required>
                                            <option value={''}></option>
                                            <option value="Mercadoria para venda">Produtos para venda</option>
                                            <option value="Retorno de mercadoria">Retorno de mercadoria</option>
                                            <option value="Produtos para consumo">Insumos</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-row justify-between items-center">
                                        <h1 className="text-xl">Produtos</h1>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <label htmlFor="movimentaestoque">Atualiza Valor:</label>
                                                <input className="h-5 w-5" type="checkbox" name="movimentaestoque" id="movimentaestoque" onChange={() => setAlteraValor(!alteraValor)} checked={alteraValor} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <label htmlFor="movimentaestoque">Movimentar estoque:</label>
                                                <input className="h-5 w-5" type="checkbox" name="movimentaestoque" id="movimentaestoque" onChange={() => setMovimentaEstoque(!movimentaEstoque)} checked={movimentaEstoque} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col overflow-x-auto">
                                        <table className="table-auto min-w-[1000px]">
                                            <thead className="text-xs uppercase text-left bg-gray-300">
                                                <tr>
                                                    <th></th>
                                                    <th scope="col" className="p-2 w-1/12">Produto Rel</th>
                                                    <th scope="col" className="p-2 w-1/12">Código Forn</th>
                                                    <th scope="col" className="p-2 w-1/12">EAN</th>
                                                    <th scope="col" className="p-2 w-3/12">Descrição</th>
                                                    <th scope="col" className="p-2 w-1/12">NCM</th>
                                                    <th scope="col" className="p-2 w-[4%]">CFOP</th>
                                                    <th scope="col" className="p-2 w-[4%]">Medida</th>
                                                    <th scope="col" className="p-2 w-1/12">Valor Un</th>
                                                    <th scope="col" className="p-2 w-[4%]">Markup</th>
                                                    <th scope="col" className="p-2 w-[4%]">Valor Venda</th>
                                                    <th scope="col" className="p-2 w-[4%]">Qtd</th>
                                                    <th scope="col" className="p-2 w-1/12">Valor Total</th>
                                                    <th scope="col" className="p-2">
                                                        <button type="button" className="flex items-center justify-center p-1 w-full" onClick={addProduct}><BsPlusCircleFill className="w-6 h-6" /></button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="py-2">
                                                {
                                                    produtos.map((item, i) => (
                                                        <tr key={i}>
                                                            <td className="p-2">
                                                                <input className="flex w-[15px] h-[15px]" type="checkbox" name="groupmark" onChange={handleMarked} value={i} />
                                                            </td>
                                                            <td className="p-0">
                                                                <select onChange={handleSelectProduto} className="p-1 focus:outline-none w-[150px] border-0 h-[32px]">
                                                                    <option value={""}></option>
                                                                    {
                                                                        refData.map((item, index) => (
                                                                            <option key={index} value={JSON.stringify({ item, index: i })}>{item.estoque_id} - {item.nome} - {item.cor_nome}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="text" name="codigoProduto" value={variacaoProduto[i].codigoProduto} onChange={(e) => handleVariacaoProduto(e, i)} size={12} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="number" name="codigoBarras" value={variacaoProduto[i].codigoBarras} onChange={(e) => handleVariacaoProduto(e, i)} size={12} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="text" name="nome" value={item.nome} onChange={(e) => handleProdutos(e, i)} size={40} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="text" name="ncm" value={item.ncm} onChange={(e) => handleProdutos(e, i)} size={8} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="number" name="cfop" value={item.cfop} onChange={(e) => handleProdutos(e, i)} size={4} />
                                                            </td>
                                                            <td>
                                                                <select className="p-1 focus:outline-none w-full border-0 h-[32px]" name="unidadeId" value={item.unidadeId} onChange={(e) => handleProdutos(e, i)} required>
                                                                    {
                                                                        unidades.map((uni, i) => (
                                                                            <option key={i} value={uni.id}>{uni.sigla}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none text-right w-full" type="number" name="valorCusto" value={variacaoPreco[i].valorCusto} onChange={(e) => handleVariacaoPreco(e, i)} size={4} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="number" name="markup" value={variacaoPreco[i].markup} onChange={(e) => handleVariacaoPreco(e, i)} size={3} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="number" step={"any"} name="valor" value={variacaoPreco[i].valor} onChange={(e) => handleVariacaoPreco(e, i)} size={4} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none w-full" type="number" name="quantidade" value={estoque[i].quantidade} onChange={(e) => handleEstoque(e, i)} size={4} />
                                                            </td>
                                                            <td>
                                                                <input className="p-1 focus:outline-none text-right w-full" type="number" value={variacaoPreco[i].valorCusto && estoque[i].quantidade ? parseFloat(parseFloat(parseFloat(variacaoPreco[i].valorCusto) * Number(estoque[i].quantidade)).toFixed(2)) : ""} readOnly size={4} />
                                                            </td>
                                                            <td className="flex items-center justify-center ">
                                                                <button type="button" className="flex items-center p-1" onClick={() => delProduct(i)}><BsTrashFill className="w-6 h-6" /></button>

                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className="flex-1 text-center">
                                                        <label className="text-xs font-medium">Markup Padrão:</label>
                                                    </td>
                                                    <td>
                                                        <input className="p-1 focus:outline-none w-full" type="number" name="markup" onChange={(event) => markupPadrao(parseFloat(event.target.value))} size={3} />
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="flex items-center justify-between p-6 space-x-2 rounded-b">
                            <button onClick={() => setPopUpConfirmacao(true)} type="reset" form="formEntrada" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600" disabled={loading}>{loading ? "Aguarde..." : "Excluir"}</button>
                            {
                                !entrada.id && <button form="formEntrada" type="submit" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" disabled={loading}>{loading ? "Aguarde..." : "Salvar"}</button>
                            }
                        </div>
                    </div>
                </div >
            </div >
            <div className={popUpConfirmacao ? "fixed inset-0 flex h-full items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
                <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
                    <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
                    <div className="flex flex-row gap-4">
                        <button onClick={deleteEntrada} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>{loading ? "Aguarde..." : "Sim"}</button>
                        <button onClick={() => setPopUpConfirmacao(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>{loading ? "Aguarde..." : "Não"}</button>
                    </div>
                </div>
            </div>
        </>)
    }
}