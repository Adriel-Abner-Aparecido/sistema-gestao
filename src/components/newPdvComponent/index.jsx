import { useState, useEffect, useRef } from "react";
import { BsArrowReturnLeft, BsFillTrashFill, BsX, BsXCircleFill } from "react-icons/bs";
import { get, post, put, remove } from "../../services/api";
import Router from "next/router";
import { LoadingComponent } from "../LoadingComponent";
import { FaX } from "react-icons/fa6";
import InputMask from "react-input-mask";
import { useEmpresa } from "../../context/empresaContext";
import hotkeys from "hotkeys-js";
import { Brl } from '../../services/real';
import { utcStringToDateLocal } from "../../services/date";

export const NewPdvComponent = (props) => {

    const jsonPadrao = {
        operacao: 1,
        natureza_operacao: "Venda PDV",
        modelo: "1",
        finalidade: 1,
        ambiente: 1,
        venda: {},
        cliente: {},
        produtos: [],
        observacao: "",
        pedido: {
            pagamento: 0,
            presenca: 1,
            modalidade_frete: 9,
            frete: "0.00",
            desconto: "",
            total: "0.00"
        },
        subTotal: "0.00"
    }

    const caixaPadrao = {
        status: "Aberto",
        valorAbertura: 0,
        observacao: "Caixa aberto automaticamente no PDV"
    }

    const formaPagamentoPadrao = {
        forma_pagamento: 1,
        desconto: "",
        parcelas: 1,
        valor_pagamento: "",
        dia_vencimento: 1,
    }

    const [produtoIncluido, setProdutoIncluido] = useState(false)
    const [produtoPesquisa, setProdutoPesquisa] = useState("")
    const [produtosEncontrados, setProdutosEncontrados] = useState([])
    const [produtoSelecionado, setProdutoSelecionado] = useState(null)
    const [clientePesquisa, setClientePesquisa] = useState("")
    const [clientesEncontrados, setClientesEncontrados] = useState([])
    const [clienteSelecionado, setClienteSelecionado] = useState(null)
    const [isHidden, setIsHidden] = useState(true)
    const [popPupLimpaTudo, setPopUpLimpaTudo] = useState(true)
    const [popPupAbrirCaixa, setPopPupAbrirCaixa] = useState(false)
    const [visualizarFormasPagamento, setVisualizarFormasPagamento] = useState([])
    const [emitirNf, setEmitirNf] = useState(false)
    const [addAuto, setAddAuto] = useState(true)
    const [caixa, setCaixa] = useState(undefined)
    const [popUpCancelarVenda, setPopUpCancelarVenda] = useState(false)
    const [loading, setLoading] = useState(false);
    const [listaCaixas, setListaCaixas] = useState([])
    const [dataCaixa, setDataCaixa] = useState(caixaPadrao)
    const [formaPagamento, setFormaPagamento] = useState(formaPagamentoPadrao)
    const [listaFormaPagamento, setListaFormaPagamento] = useState(null)
    const [planId, setPlanId] = useState(null)
    const [finalizado, setFinalizado] = useState(false)
    const [tipoImpressao, setTipoImpressao] = useState('a4')
    const [ambiente, setAmbiente] = useState(1)
    const [finalizando, setFinalizando] = useState(false)
    const [popUpCpfNaNota, setPopUpCpfNaNota] = useState(false)
    const [semCpf, setSemCpf] = useState(false)
    const [operador, setOperador] = useState()
    const [listaVendedores, setListaVendedores] = useState()
    const [vendedorSelecionado, setVendedorSelecionado] = useState(null)
    const [vendedorObrigatorio, setVendedorObrigatorio] = useState(false)
    const [parcelasCrediario, setParcelasCrediario] = useState([])
    const [guiaObservacao, setGuiaObservacao] = useState('obs')
    const [total, setTotal] = useState(0)
    const [recebido, setRecebido] = useState(0)
    const [troco, setTroco] = useState(0)
    const [restante, setRestante] = useState(0)
    const [tipoDesconto, setTipoDesconto] = useState(0)
    const [desconto, setDesconto] = useState(0)

    const timeOutProduto = useRef()

    const [jsonNF, setJsonNF] = useState(jsonPadrao)

    const { empresa } = useEmpresa()

    useEffect(() => {
        if (props.idVenda) {
            if (empresa.id) {
                loadVenda(props.idVenda)
            }
        }
    }, [props.idVenda, empresa])

    useEffect(() => {
        if (empresa && empresa.planoId && empresa.planoId !== 1 || empresa.dias_para_expirar > 373) {
            console.log("Plano id", empresa.plano_id)
            verificaCaixa()
        }
    }, [empresa])

    useEffect(() => {
        if (jsonNF.subTotal === 0) {
            setIsHidden(true)
            props.setSairPdv(true)
        }
    }, [jsonNF.subTotal])

    useEffect(() => {
        setTotal(() => jsonNF.produtos.reduce((acc, item) => parseFloat((acc + item.total).toFixed(2)), 0))
        setRestante(() => jsonNF.produtos.reduce((acc, item) => acc + item.total, 0))
    }, [jsonNF.produtos])

    useEffect(() => {
        setFormaPagamento({
            forma_pagamento: 1,
            desconto: "",
            parcelas: 1,
            valor_pagamento: total > (recebido + desconto) ? parseFloat(parseFloat(total - (recebido + desconto)).toFixed(2)) : 0,
            dia_vencimento: 1,
        });
        setJsonNF((prev) => ({
            ...prev,
            subTotal: total.toFixed(2),
            pedido: {
                ...prev.pedido,
                desconto: desconto.toFixed(2),
                total: (total - desconto).toFixed(2)
            }
        }))
        setRestante((recebido + desconto + troco) <= total ? parseFloat(parseFloat(total - (recebido + desconto + troco)).toFixed(2)) : 0)
    }, [recebido, total, desconto, troco])

    useEffect(() => {
        const valorRecebido = visualizarFormasPagamento.reduce((acc, item) => (item.status && item.status === 'Recebido' && item.forma_pagamento !== 0 ? acc + item.valor_pagamento : acc), 0)
        const descontoAplicado = visualizarFormasPagamento.reduce((acc, item) => (item.status && item.status === 'Recebido' ? acc + item.desconto : acc), 0)
        const valorTroco = visualizarFormasPagamento.reduce((acc, item) => (item.status && item.status === 'Recebido' ? acc + item.troco : acc), 0)

        setRecebido(parseFloat((valorRecebido + valorTroco).toFixed(2)))
        setDesconto(parseFloat(descontoAplicado.toFixed(2)))
        setTroco(parseFloat(valorTroco.toFixed(2)))
    }, [visualizarFormasPagamento])

    useEffect(() => {
        if (emitirNf) {
            if (empresa.planoId === 4) {
                finalizarVenda();
            } else {
                alert("Faça upgrade da conta para o plano Ouro para emitir Notas!!")
                setEmitirNf(false)
            }
        }
    }, [emitirNf]);

    useEffect(() => {
        if (produtoIncluido) {
            props.setSairPdv(false);
            setProdutoIncluido(false);
        }
    }, [produtoIncluido, props])

    useEffect(() => {
        setLoading(true)
        if (empresa) {
            setPlanId(empresa.planoId)
            setLoading(false)
        }
    }, [empresa])

    useEffect(() => {
        setTimeout(() => setFinalizado(false), 2000)
    }, [finalizado])

    useEffect(() => {
        if (produtosEncontrados.length === 1) {
            selecionarProduto(produtosEncontrados[0])
        }
    }, [produtosEncontrados])

    useEffect(() => {
        if (semCpf) {
            emitirNFCe()
        }
    }, [semCpf])

    useEffect(() => {
        if (localStorage.getItem("applojaweb_tipo_impressão")) {
            const tipo = localStorage.getItem("applojaweb_tipo_impressão")
            setTipoImpressao(tipo)
        }
        if (localStorage.getItem("applojaweb_ambiente")) {
            const ambiente = localStorage.getItem("applojaweb_ambiente")
            setJsonNF({
                ...jsonNF,
                ambiente: Number(ambiente)
            })
            setAmbiente(Number(ambiente))
        }
        if (localStorage.getItem("applojaweb_user_name")) {
            const userName = localStorage.getItem("applojaweb_user_name")
            setOperador(userName)
        }
        if (localStorage.getItem("applojaweb_vendedor_obrigatorio")) {
            const vendedorobrigatorio = localStorage.getItem("applojaweb_vendedor_obrigatorio") === "true"
            setVendedorObrigatorio(vendedorobrigatorio)
        }
        if (localStorage.getItem("auto_insert_product")) {
            const addauto = localStorage.getItem("auto_insert_product") === "true"
            setAddAuto(addauto)
        }
        if (localStorage.getItem("tipo_desconto")) {
            const tipodesconto = localStorage.getItem("tipo_desconto")
            setTipoDesconto(Number(tipodesconto))
        }
        listarVendedores()
        listarFormasPagamento()
        listarCaixasAbertos()

    }, [])

    useEffect(() => {
        hotkeys('esc', (event) => {
            event.preventDefault();
            setPopUpLimpaTudo((prev) => !prev)
        })
        hotkeys('f2', (event) => {
            event.preventDefault();
            if (props.idVenda) {
                atualizarVendaSalva()
            } else {
                aguardar()
            }
        })
        hotkeys('f3', (event) => {
            event.preventDefault();
            if (props.idVenda) {
                emiteNotaFiscal()
            } else {
                emitirNFe()
            }
        })
        hotkeys('f4', (event) => {
            event.preventDefault();
            if (props.idVenda) {
                emiteNFCe()
            } else {
                emiteNFCe()
            }
        })
        hotkeys('enter', (event) => {
            event.preventDefault();
            if (isHidden) {
                setIsHidden(false)
            } else {
                finalizarVenda()
            }
        })

        return () => {
            hotkeys.unbind('esc');
            hotkeys.unbind('f2');
            hotkeys.unbind('f3');
            hotkeys.unbind('f4');
            hotkeys.unbind('enter');
        }
    }, [
        props.idVenda,
        isHidden,
        jsonNF.produtos,
        recebido,
        vendedorObrigatorio,
        tipoDesconto,
        total,
        desconto,
        troco,
        emitirNf
    ])

    const listarVendedores = async () => {
        setLoading(true)
        try {
            const vendedores = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendedores`)
            if (vendedores) {
                setListaVendedores(vendedores)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const listarFormasPagamento = async () => {
        try {
            const formaspagamento = await get(`${process.env.NEXT_PUBLIC_API_URL}/formaspagamento`)
            if (formaspagamento) {
                setListaFormaPagamento(formaspagamento)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const verificaCaixa = async () => {
        if (!localStorage.getItem("apploja_caixa")) {
            console.log("Não esta aberto o caixa")
            await listarCaixasAbertos()
            setPopPupAbrirCaixa(true)
        } else {
            const caixaLocal = JSON.parse(localStorage.getItem("apploja_caixa"))
            const dateCaixaLocal = caixaLocal.expiresIn
            const id_caixa = caixaLocal.caixaId
            const dateNow = new Date().getTime()

            const caixaAberto = await get(`${process.env.NEXT_PUBLIC_API_URL}/caixa/${id_caixa}`)

            if (caixaAberto[0].status === "Fechado") {
                localStorage.removeItem("apploja_caixa")
                setPopPupAbrirCaixa(true)
            }


            if (dateCaixaLocal < dateNow) {
                const operacoes = await get(`${process.env.NEXT_PUBLIC_API_URL}/operacaocaixa/${id_caixa}`)
                const fechaCaixa = await put(`${process.env.NEXT_PUBLIC_API_URL}/fecharcaixa/${id_caixa}`, {
                    valor_abertura: caixaAberto[0].valor_abertura,
                    status: "Fechado",
                    valor_fechamento: parseFloat(caixaAberto[0].valor_abertura) + parseFloat(operacoes.saldos[0].saldo),
                    observacao: "Caixa fechado automaticamente no PDV"
                })
                if (fechaCaixa.affectedRows > 0) {
                    localStorage.removeItem("apploja_caixa")
                }
                setPopPupAbrirCaixa(true)
            }
            setCaixa(id_caixa)
        }
        setDataCaixa(caixaPadrao)
    }

    const abrirCaixa = async () => {

        try {
            const iniciarcaixa = await post(`${process.env.NEXT_PUBLIC_API_URL}/caixa`, dataCaixa)

            if (iniciarcaixa.insertId) {
                const datacaixa = {
                    caixaId: iniciarcaixa.insertId,
                    valorInicial: parseFloat(dataCaixa.valorAbertura),
                    expiresIn: new Date().getTime() + 12 * 60 * 60 * 1000
                }
                localStorage.setItem("apploja_caixa", JSON.stringify(datacaixa))
                setCaixa(iniciarcaixa.insertId)
                setPopPupAbrirCaixa(false)
            }
        } catch (error) {
            console.error(error)
        }

    }

    const abrirCaixaSelecionado = (event) => {

        if (event.target.value) {
            const caixa = listaCaixas[event.target.value]

            const data = {
                caixaId: caixa.id,
                valorInicial: parseFloat(caixa.valor_abertura),
                expiresIn: new Date().getTime() + 12 * 60 * 60 * 1000
            }
            setCaixa(caixa.id)
            localStorage.setItem("apploja_caixa", JSON.stringify(data))
            setPopPupAbrirCaixa(false)
        }

    }

    const handleCaixa = (event) => {
        setDataCaixa({
            ...dataCaixa, [event.target.name]: parseFloat(event.target.value)
        })
    }

    const listarCaixasAbertos = async () => {

        const caixasAbertos = await get(`${process.env.NEXT_PUBLIC_API_URL}/caixasabertos`)

        setListaCaixas(caixasAbertos)

    }

    const loadVenda = async (idVenda) => {
        setLoading(true)
        setPopPupAbrirCaixa(false)
        try {
            const { venda, produtosDaVenda, contaReceber } = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendas/${idVenda}`);
            if (venda[0].mensagem === "falha na autenticação") {
                localStorage.removeItem("applojaweb_token");
                Router.push("/login");
            } else {
                if (venda[0].cliente_id) {
                    setClienteSelecionado({
                        nome: venda[0].nome_cliente,
                        cnpj_cpf: venda[0].cnpj_cpf
                    })

                    const cliente = {
                        id: venda[0].cliente_id,
                        nome_completo: venda[0].nome_cliente,
                        endereco: venda[0].rua_cliente,
                        complemento: venda[0].complemento_cliente || "",
                        numero: venda[0].numero_cliente,
                        bairro: venda[0].bairro_cliente,
                        cidade: venda[0].cidade_cliente,
                        uf: venda[0].uf_cliente,
                        cep: venda[0].cep_cliente,
                        telefone: venda[0].celular_cliente,
                        email: venda[0].email_cliente,
                    }

                    const clienteEspecifico = venda[0].tipo_cliente == "Pessoa Física" ?
                        {
                            cpf: venda[0].cnpj_cpf,
                        } :
                        {
                            cnpj: venda[0].cnpj_cpf || "",
                            razao_social: venda[0].nome_cliente || "",
                            ie: venda[0].inscricao_estadual || "",
                        }


                    setJsonNF({
                        ...jsonNF,
                        cliente: {
                            ...cliente,
                            ...clienteEspecifico
                        }
                    })
                }

                setVendedorSelecionado(venda[0].vendedor_id)

                const dadosVendaCarregados = {
                    id: venda[0].id,
                    clienteId: venda[0].cliente_id || null,
                    valor: venda[0].valor,
                    observacao: venda[0].observacao,
                    transportadoraId: venda[0].transportadora_id,
                    vendedorId: venda[0].vendedor_id,
                    referenciaVenda: venda[0].referencia_venda,
                    data: venda[0].data,
                    desconto: venda[0].desconto || "0.00",
                    prazoEntrega: venda[0].prazo_entrega,
                    valorFrete: venda[0].valor_frete,
                    valorBaseSt: null,
                    valorSt: null,
                    status: venda[0].status,
                    valorIpi: null,
                    pesoTotalNota: null,
                    pesoTotalNotaLiq: null,
                    origemVenda: null,
                    dataEntrega: null,
                    observacaoInterna: null,
                    observacao: venda[0].observacao,
                    observacaoExterna: null,
                    enderecoEntrega: null,
                    modalidadeFrete: null,
                    dataPostagem: null,
                    codigoRastreio: null,
                }

                const subtotal = produtosDaVenda.reduce((acc, p) => acc + (p.valor_produto * p.quantidade_produto), 0).toFixed(2);

                const produtosdavenda = produtosDaVenda.map((produto) => ({
                    produtoVendaId: produto.produto_venda_id,
                    produto_id: produto.produto_id,
                    estoqueId: produto.estoque_id,
                    nome: produto.nome_produto,
                    codigo: produto.codigo_barras,
                    cor: produto.cor_nome,
                    tamanho: produto.tamanho_nome,
                    quantidade: Number(produto.quantidade_produto),
                    subtotal: parseFloat(Number(produto.valor_produto).toFixed(2)),
                    total: parseFloat((produto.valor_produto * produto.quantidade_produto).toFixed(2)),
                    origem: 0,
                    ncm: produto.ncm,
                    cest: produto.cst_icms_id,
                    classe_imposto: produto.classe_imposto || empresa.classeImpostoPadrao,
                    unidade: produto.unidade_sigla,
                    peso: "1",
                    cest: produto.cst_icms_id
                }))


                setVisualizarFormasPagamento(contaReceber.map((conta) => ({
                    id: conta.id,
                    forma_pagamento: conta.formas_pagamento_id || 5,
                    desconto: Number(conta.desconto || 0),
                    parcelas: conta.parcelas || 1,
                    valor_pagamento: conta.valor_pago || conta.valor || 0,
                    status: conta.valor_pago ? "Recebido" : "Aberto",
                    caixa_id: conta.caixa_id,
                    operacao_id: conta.operacao_id,
                    troco: conta.troco || 0
                })))

                if (venda[0].desconto) {
                    setVisualizarFormasPagamento((prev) => [
                        ...prev,
                        {
                            forma_pagamento: 0,
                            desconto: venda[0].desconto,
                            parcelas: 1,
                            valor_pagamento: venda[0].desconto,
                            troco: 0,
                            status: "Recebido"
                        }
                    ])
                }

                const formaPagamentoAgrupada = contaReceber.reduce((acc, item) => {

                    const existe = acc.find(obj => obj.formas_pagamento_id === item.formas_pagamento_id);

                    if (existe) {
                        existe.valor += item.valor;
                    } else {
                        acc.push({ formas_pagamento_id: item.formas_pagamento_id, valor: item.valor });
                    }

                    return acc;

                }, [])

                const dataVencimentoParcela = (dateVenc) => {
                    const date = new Date(dateVenc)
                    const y = date.getUTCFullYear()
                    const m = String(date.getUTCMonth() + 1).padStart(2, '0')
                    const d = String(date.getUTCDate()).padStart(2, '0')
                    return `${y}-${m}-${d}`
                }

                const parcelasDaVenda = contaReceber.filter(item => item.formas_pagamento_id === 5).sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento)).map(item => ({
                    vencimento: dataVencimentoParcela(item.data_vencimento),
                    valor: item.valor.toFixed(2)
                }));

                const totalFatura = contaReceber.reduce((acc, item) => item.formas_pagamento_id === 5 ? acc + item.valor : acc, 0)

                const montaParcelas = parcelasDaVenda.length > 0 ? {
                    fatura: {
                        numero: String(venda[0].id),
                        valor: totalFatura.toFixed(2),
                        desconto: venda[0].desconto.toFixed(2),
                        valor_liquido: (totalFatura - venda[0].desconto).toFixed(2)
                    },
                    parcelas: parcelasDaVenda,
                } : {}

                const formapagamentoreceita = formaPagamentoAgrupada.map((conta) => {

                    switch (conta.formas_pagamento_id) {
                        case 1: return "01";
                        case 4: return "02";
                        case 3: return "03";
                        case 2: return "04";
                        case 36: return "05";
                        case 24: return "10";
                        case 27: return "11";
                        case 26: return "12";
                        case 25: return "13";
                        case 17: return "14";
                        case 5: return "15";
                        case 13: return "16";
                        case 29: return "17";
                        case 7: return "18";
                        case 38: return "19";
                        case 37: return "90";
                        default: return "99";
                    }

                })

                const valorpagamento = formaPagamentoAgrupada.map((valor) => {
                    return parseFloat(valor.valor).toFixed(2)
                })

                setJsonNF((prevState) => ({
                    ...prevState,
                    ...montaParcelas,
                    pedido: {
                        ...prevState.pedido,
                        total: (subtotal - venda[0].desconto).toFixed(2),
                        desconto: venda[0].desconto?.toFixed(2),
                        forma_pagamento: [...formapagamentoreceita],
                        valor_pagamento: [...valorpagamento]
                    },
                    venda: dadosVendaCarregados,
                    produtos: produtosdavenda,
                    subTotal: subtotal,
                    observacao: venda[0].observacao
                }));

                const totalrecebido = contaReceber.reduce((acc, item) => acc + item.valor_pagamento, 0)

                setRecebido(totalrecebido)

            }

        } catch (error) {
            console.error("Erro ao carregar venda:", error);
        } finally {
            setLoading(false)
        }
    }

    const buscarCliente = async (pesquisaCliente) => {
        try {
            setClientePesquisa(pesquisaCliente);
            if (pesquisaCliente !== "") {
                const clientes = await get(`${process.env.NEXT_PUBLIC_API_URL}/clientenomecpf/${pesquisaCliente}`);
                setClientesEncontrados(clientes);
            } else {
                setClientesEncontrados([]);
            }
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        }
    }

    const selecionarCliente = async (cliente) => {

        setClienteSelecionado(cliente);

        const dadoscliente = {
            id: cliente.id,
            nome_completo: cliente.nome,
            endereco: cliente.rua || "",
            complemento: cliente.complemento || "",
            numero: cliente.numero || "",
            bairro: cliente.bairro || "",
            cidade: cliente.cidade || "",
            uf: cliente.uf || "",
            cep: cliente.cep || "",
            telefone: cliente.celular || "",
            email: cliente.email || "",
        }

        const clienteEspecifico = cliente.tipo_pessoa === "Pessoa Física" ?
            {
                cpf: cliente.cnpj_cpf || "",
            } :
            {
                cnpj: cliente.cnpj_cpf || "",
                razao_social: cliente.nome || "",
                ie: cliente.inscricao_estadual || "",
            }

        setJsonNF((prevState) => ({
            ...prevState,
            cliente: {
                ...dadoscliente,
                ...clienteEspecifico
            }
        }));

        setClientesEncontrados([]);
        setClientePesquisa("");
    }

    const removerCliente = () => {
        setJsonNF({
            ...jsonNF,
            cliente: {}
        })
        setClienteSelecionado(null)
    }

    const selecionarFormaPagamento = (event) => {
        setFormaPagamento({
            ...formaPagamento, [event.target.name]: Number(event.target.value)
        })
    }

    const incluirFormasPagamento = (dados) => {

        if (dados.valor_pagamento === 0 || dados.valor_pagamento === '') {
            return
        }

        if (total <= recebido) {
            return
        }

        const verificarFormaPagamento = visualizarFormasPagamento.find((item) => item.forma_pagamento === dados.forma_pagamento)

        if (verificarFormaPagamento) {
            return alert("Selecione uma outra forma de pagamento")
        }

        const descontoFormaPagamento = tipoDesconto === 0 ? Number(dados.desconto || 0) : restante * ((dados.desconto || 0) / 100)

        setVisualizarFormasPagamento(prev => [
            ...prev,
            {
                forma_pagamento: dados.forma_pagamento,
                desconto: descontoFormaPagamento,
                parcelas: dados.parcelas || 1,
                valor_pagamento: dados.valor_pagamento + descontoFormaPagamento > restante ? restante - descontoFormaPagamento : dados.valor_pagamento,
                troco: (restante - descontoFormaPagamento) < dados.valor_pagamento ? dados.valor_pagamento - (restante - descontoFormaPagamento) : 0,
                status: "Recebido"
            }
        ]);

        const date = new Date();
        date.setDate(dados.dia_vencimento);

        setJsonNF(prev => {

            let parcelas = [];

            if (Number(dados.forma_pagamento) === 36 && dados.parcelas >= 1) {
                parcelas = Array.from({ length: dados.parcelas }, (_, i) => {
                    const vencimento = new Date(date);
                    vencimento.setMonth((vencimento.getMonth() + 1) + i);

                    const day = String(dados.dia_vencimento).padStart(2, '0');
                    const month = String(vencimento.getMonth() + 1).padStart(2, '0');
                    const year = vencimento.getFullYear();

                    return {
                        vencimento: `${year}-${month}-${day}`,
                        valor: String((Number(dados.valor_pagamento) / dados.parcelas).toFixed(2))
                    };
                });

                setParcelasCrediario(parcelas)
            }

            const getFormaPagamento = () => {
                switch (dados.forma_pagamento) {
                    case 1: return "01";
                    case 4: return "02";
                    case 3: return "03";
                    case 2: return "04";
                    case 36: return "05";
                    case 24: return "10";
                    case 27: return "11";
                    case 26: return "12";
                    case 25: return "13";
                    case 17: return "14";
                    case 5: return "15";
                    case 13: return "16";
                    case 29: return "17";
                    case 7: return "18";
                    case 38: return "19";
                    case 37: return "90";
                    default: return "99";
                }
            };

            const formaPagamento = getFormaPagamento();

            return {
                ...prev,
                pedido: {
                    ...prev.pedido,
                    forma_pagamento: [...(prev.pedido.forma_pagamento || []), formaPagamento],
                    valor_pagamento: [...(prev.pedido.valor_pagamento || []), String(Number(dados.valor_pagamento + descontoFormaPagamento > restante ? restante - descontoFormaPagamento : dados.valor_pagamento).toFixed(2))]
                },
                ...(parcelas.length > 0 ? { parcelas, fatura: { valor: dados.valor_pagamento.toFixed(2), desconto: (descontoFormaPagamento).toFixed(2), valor_liquido: (restante - dados.desconto).toFixed(2) } } : {})
            };
        });
    }

    const removerFormaPagamento = (indice, pagamento) => {
        setVisualizarFormasPagamento(prev =>
            prev.filter((_, index) => index !== indice)
        );

        setJsonNF(prev => {
            const formasPagamentoAtualizadas = prev.pedido.forma_pagamento.filter((_, index) => index !== indice);
            const valoresPagamentoAtualizados = prev.pedido.valor_pagamento.filter((_, index) => index !== indice);

            let updatedState = {
                ...prev,
                pedido: {
                    ...prev.pedido,
                    forma_pagamento: formasPagamentoAtualizadas,
                    valor_pagamento: valoresPagamentoAtualizados
                }
            };

            if (pagamento === 36) {
                setParcelasCrediario([]);

                const { fatura, parcelas, ...rest } = updatedState;

                updatedState = rest;
            }

            return updatedState;
        });
    }

    const buscarProduto = async (pesquisaProduto) => {
        setProdutoPesquisa(pesquisaProduto);

        if (pesquisaProduto !== "") {
            try {
                const produtos = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoquenomecodigo/${pesquisaProduto}`);
                setProdutosEncontrados(produtos);
            } catch (error) {
                console.error("Erro ao buscar produto:", error);
            }
        } else {
            setProdutosEncontrados([]);
            setProdutoSelecionado(undefined)
        }
    }

    const handleProdutoInput = (produto) => {
        setProdutoPesquisa(produto)

        if (timeOutProduto.current) {
            clearTimeout(timeOutProduto.current)
        }

        timeOutProduto.current = setTimeout(() => {
            buscarProduto(produto);
        }, 1000)
    }

    const incluirProduto = (produto) => {
        if (!produto || !produto.nome || produto.nome === "") {
            return alert("Selecione um produto!!")
        }

        setJsonNF((prevState) => {
            const produtoExistente = prevState.produtos.find((p) => p.estoqueId === produto.estoque_id);
            let produtosAtualizados;

            if (produtoExistente) {
                produtosAtualizados = prevState.produtos.map((p) =>
                    p.estoqueId === produto.estoque_id
                        ? {
                            ...p,
                            quantidade: Number(p.quantidade) + Number(produto.quantidade),
                            total: parseFloat((Number(p.quantidade) + Number(produto.quantidade)) * Number(p.subtotal).toFixed(2))
                        }
                        : p
                );
            } else {
                const novoProduto = {
                    produto_id: produto.produto_id,
                    estoqueId: produto.estoque_id,
                    nome: produto.nome,
                    codigo: produto.codigo_barras,
                    cor: produto.cor_nome,
                    tamanho: produto.tamanho_nome,
                    quantidade: Number(produto.quantidade),
                    subtotal: parseFloat(Number(produto.valor).toFixed(2)),
                    total: parseFloat((produto.valor * produto.quantidade).toFixed(2)),
                    origem: 0,
                    ncm: produto.ncm,
                    cest: produto.cst_icms_id,
                    classe_imposto: produto.classe_imposto || empresa.classeImpostoPadrao,
                    unidade: produto.unidade_sigla,
                    peso: "1",
                    cest: produto.cst_icms_id,
                    tipo: produto.tipo_produto_id
                };
                produtosAtualizados = [...prevState.produtos, novoProduto];
            }

            return {
                ...prevState,
                produtos: produtosAtualizados
            };
        });
        setProdutoIncluido(true);
        setProdutosEncontrados([]);
        setProdutoPesquisa("");
        setProdutoSelecionado(null);

    }

    const handleProdutoSelecionado = (event) => {
        setProdutoSelecionado({
            ...produtoSelecionado, [event.target.name]: parseFloat(event.target.value)
        })
    }

    const selecionarProduto = (produto) => {

        // if (produto.tipo_produto_id !== 2 && produto.quantidade <= 0) {
        //     return alert("Produto fora de Estoque")
        // }

        if (addAuto) {
            const novoProduto = {
                ...produto,
                quantidade: 1,
                valor: parseFloat(produto.valor.toFixed(2))
            };
            incluirProduto(novoProduto)
            setProdutosEncontrados([]);
            setProdutoPesquisa("");
            setProdutoSelecionado(undefined)
        } else {
            const produtoAtualizado = {
                ...produto,
                quantidade: 1,
                valor: parseFloat(produto.valor.toFixed(2))
            }
            setProdutoSelecionado(produtoAtualizado);
            setProdutoPesquisa(produtoAtualizado.nome)
            setProdutosEncontrados([]);
        }

    }

    const adicionarQtdProduto = (produtoId) => {
        setJsonNF((prevState) => {
            const produtosAtualizados = prevState.produtos.map((produto) =>
                produto.estoqueId === produtoId
                    ? { ...produto, quantidade: produto.quantidade + 1, total: parseFloat(((produto.quantidade + 1) * produto.subtotal).toFixed(2)) }
                    : produto
            );

            return {
                ...prevState,
                pedido: { ...prevState.pedido, total: parseFloat(produtosAtualizados.reduce((acc, p) => acc + p.total, 0).toFixed(2)) },
                produtos: produtosAtualizados,
                subTotal: parseFloat(produtosAtualizados.reduce((acc, p) => acc + p.total, 0).toFixed(2)),
            };
        });
    }

    const removerQtdProduto = (produtoId) => {
        setJsonNF((prevState) => {
            const produtosAtualizados = prevState.produtos.map((produto) =>
                produto.estoqueId === produtoId && produto.quantidade > 1
                    ? { ...produto, quantidade: produto.quantidade - 1, total: parseFloat(((produto.quantidade - 1) * produto.subtotal).toFixed(2)) }
                    : produto
            );

            return {
                ...prevState,
                pedido: { ...prevState.pedido, total: parseFloat(produtosAtualizados.reduce((acc, p) => acc + p.total, 0).toFixed(2)) },
                produtos: produtosAtualizados,
                subTotal: parseFloat(produtosAtualizados.reduce((acc, p) => acc + p.total, 0).toFixed(2)),
            };
        });
    }

    const removerProduto = (index) => {
        setJsonNF((prevState) => {
            const produtosAtualizados = prevState.produtos.filter((_, i) => i !== index);

            if (produtosAtualizados.length === 0) {
                setFormaPagamento({
                    valor_pagamento: "",
                    desconto: "",
                    parcelas: 1,
                    valor_pagamento: "",
                    dia_vencimento: 1,
                })
                props.setSairPdv(true);
            }

            return {
                ...prevState,
                produtos: produtosAtualizados
            };
        });

    }

    const finalizarVenda = async () => {

        if (parcelasCrediario.length > 0 && !jsonNF.cliente.nome_completo) {
            return alert("Para vender no crediario é necessario informar um cliente!!!")
        }

        if (emitirNf && jsonNF.modelo === '1' && !jsonNF.cliente.nome_completo) {
            return alert("É necessario informar um cliente para emissão de NF-e")
        }

        if (emitirNf && jsonNF.modelo === '1' && !(jsonNF.cliente.cpf || jsonNF.cliente.cnpj)) {
            return alert("É necessario adicionar um numero de documento valido ao cliente")
        }

        if (restante > 0) {
            setIsHidden(false);
            return alert("Falta receber")
        }

        if (jsonNF.produtos.length === 0) {
            return alert("Você precisa adicionar produtos!");
        }

        if (vendedorObrigatorio && !vendedorSelecionado) {
            return alert("E obrigatorio informar um vendedor.")
        }

        setFinalizando(true)

        const date = new Date(Date.now());
        try {
            const vendaData = {
                ...jsonNF.venda,
                clienteId: jsonNF.cliente.id || null,
                observacao: jsonNF.observacao,
                empresaId: jsonNF.empresaId,
                transportadoraId: null,
                vendedorId: vendedorSelecionado || null,
                referenciaVenda: null,
                data: date,
                desconto: calculaTotalDesconto(),
                valor: total - desconto,
                prazoEntrega: null,
                valorFrete: null,
                valorBaseSt: null,
                valorSt: null,
                status: "Finalizado",
                valorIpi: null,
                pesoTotalNota: null,
                pesoTotalNotaLiq: null,
                origemVenda: null,
                dataEntrega: null,
                observacaoInterna: null,
                observacaoExterna: null,
                enderecoEntrega: null,
                modalidadeFrete: null,
                dataPostagem: null,
                codigoRastreio: null,
            };

            // Verifica se a venda já existe para atualizar ou se é uma nova venda
            if (jsonNF.venda.id) {
                if (jsonNF.venda.status !== "Finalizado") {
                    const atualizaVenda = await put(`${process.env.NEXT_PUBLIC_API_URL}/vendas/${jsonNF.venda.id}`, vendaData);
                    if (atualizaVenda.affectedRows === 1) {
                        await atualizaEstoque()
                        await salvarFormasPagamento(jsonNF.venda.id)
                        if (parcelasCrediario) {
                            await salvarParcelasCrediario(jsonNF.venda.id)
                        }
                        setFinalizado(false)
                        alert("Venda finalizada com sucesso!");
                        return Router.reload()
                    }
                } else {
                    return alert("Pedidos Finalizados não podem ser alterados!");
                }
            }

            // Caso seja uma nova venda, insere os dados no banco de dados
            const res = await post(`${process.env.NEXT_PUBLIC_API_URL}/vendas/`, vendaData);
            if (res.insertId) {
                // Atualiza o ID da venda no jsonNF e aguarda a atualização do estado
                await new Promise((resolve) => {
                    setJsonNF(prev => {
                        const pagamento = prev.pedido.forma_pagamento.find(pagamento => pagamento === 36);

                        if (pagamento) {
                            resolve({
                                ...prev,
                                fatura: { ...prev.fatura, numero: res.insertId }
                            });
                            return {
                                ...prev,
                                fatura: { ...prev.fatura, numero: res.insertId }
                            };
                        } else {
                            resolve(prev);
                            return prev;
                        }
                    });
                });

                // Garante que os produtos e formas de pagamento foram salvos antes de prosseguir
                await salvarProdutosDaVenda(res.insertId);
                await salvarFormasPagamento(res.insertId);
                await salvarParcelasCrediario(res.insertId)

                // Chama a função de emissão de nota fiscal ou finaliza a venda
                if (emitirNf) {
                    await emiteNotaFiscal(res.insertId);
                    setFinalizando(false) // Aguarda a emissão da nota fiscal
                } else {
                    window.open(`/recibo/${tipoImpressao}/${res.insertId}`, "_blank");
                    if (parcelasCrediario.length > 0) {
                        window.open(`/carne-crediario/${res.insertId}`, "_blank");
                    }
                    setFinalizando(false)
                }

                // Finaliza a venda e gera o recibo
                setFinalizando(false)
                vendaFinalizada();
            }

        } catch (error) {
            setFinalizando(false)
            console.error("Erro ao finalizar venda:", error);
        }
    }

    const emiteNotaFiscal = async (id) => {

        const newJson = {
            ...jsonNF,
            venda: {
                id: id
            }
        }

        if (jsonNF.modelo === '1' && !jsonNF.cliente.nome_completo) {
            return alert("É necessario informar um cliente para emissão de NF-e")
        }

        if (jsonNF.modelo === '1' && !(jsonNF.cliente.cpf || jsonNF.cliente.cnpj)) {
            return alert("É necessario adicionar um numero de documento valido ao cliente")
        }

        if (empresa.planoId === 4) {

            setFinalizando(true)

            const emiteNf = await post(`${process.env.NEXT_PUBLIC_API_URL}/nfe`, newJson);

            if (emiteNf.responseApi && emiteNf.responseApi.danfe) {
                setFinalizando(false)
                setEmitirNf(false)
                alert("Venda finalizada Nota Fiscal emitida com sucesso!");
                window.open(emiteNf.responseApi.danfe, "_blank");
            }

            if (emiteNf.responseApi && emiteNf.responseApi.status === "contingencia") {
                setFinalizando(false)
                setEmitirNf(false)
                alert(`Nota fiscal emitida em contigência, acompanhe o status em "Nota Fiscal", Motivo: ${emiteNf.responseApi.motivo}`)
            }

            if (emiteNf.message) {
                setFinalizando(false)
                setEmitirNf(false)
                return alert(`Erro ao emitir Nota Fiscal: ${emiteNf.message}.`);
            }

        } else {
            alert("Faça upgrade da conta para emitir Notas!!")
        }
    }

    const emiteNFCe = async (id) => {

        if (empresa.planoId === 4) {

            const dataNfcE = {
                ...jsonNF,
                modelo: "2",
                venda: {
                    id: id
                }
            }

            setFinalizando(true)

            const emiteNf = await post(`${process.env.NEXT_PUBLIC_API_URL}/nfe`, dataNfcE)

            if (emiteNf.responseApi && emiteNf.responseApi.danfe) {
                setFinalizando(false)
                setEmitirNf(false)
                alert("Venda finalizada Nota Fiscal emitida com sucesso!");
                window.open(emiteNf.responseApi.danfe, "_blank");
            }

            if (emiteNf.responseApi && emiteNf.responseApi.status === "contingencia") {
                setFinalizando(false)
                setEmitirNf(false)
                return alert(`Nota fiscal emitida em contigência, acompanhe o status em "Nota Fiscal", Motivo: ${emiteNf.responseApi.motivo}`)
            }

            if (emiteNf.message) {
                setFinalizando(false)
                setEmitirNf(false)
                return alert(`Erro ao emitir Nota Fiscal: ${emiteNf.message}.`)
            }

        } else {
            alert("Faça upgrade da conta para emitir Notas!!")
        }
    }

    const aguardar = async () => {

        if (jsonNF.produtos.length === 0) {
            return alert("Voce precisa adicionar produtos!")
        }

        const date = new Date(Date.now())
        try {
            const vendaData = {
                ...jsonNF.venda,
                clienteId: jsonNF.cliente?.id || null,
                valor: total,
                observacao: jsonNF.observacao,
                empresaId: jsonNF.empresaId,
                transportadoraId: null,
                vendedorId: null,
                referenciaVenda: null,
                data: date,
                desconto: formaPagamento.desconto || "0.00",
                prazoEntrega: null,
                valorFrete: null,
                valorBaseSt: null,
                valorSt: null,
                status: "Aguardando",
                valorIpi: null,
                pesoTotalNota: null,
                pesoTotalNotaLiq: null,
                origemVenda: null,
                dataEntrega: null,
                observacaoInterna: null,
                observacao: jsonNF.observacao,
                observacaoExterna: null,
                enderecoEntrega: null,
                modalidadeFrete: null,
                dataPostagem: null,
                codigoRastreio: null,
            };

            const res = await post(`${process.env.NEXT_PUBLIC_API_URL}/vendas`, vendaData);

            if (res.insertId) {

                await Promise.all(
                    jsonNF.produtos.map(async (produto) => {
                        await post(`${process.env.NEXT_PUBLIC_API_URL}/produtosdasvendas`, {
                            vendaId: res.insertId,
                            estoqueId: produto.estoqueId,
                            valor: produto.subtotal,
                            quantidade: produto.quantidade,
                            empresaId: jsonNF.empresaId,
                        });
                    })
                )
                alert("Pedido Salvo")
                limpar()
            }

        } catch (error) {
            console.error("Erro ao finalizar venda:", error);
        }

    }

    const atualizarVendaSalva = async () => {
        setFinalizando(true)
        try {
            const atualizaVenda = await put(`${process.env.NEXT_PUBLIC_API_URL}/vendas/${props.idVenda}`, {
                ...jsonNF.venda,
                valor: jsonNF.subTotal,
                vendedorId: jsonNF.venda.vendedorId || null,
                clienteId: jsonNF.cliente.id || null
            })
            if (atualizaVenda.affectedRows === 1) {
                console.log("Atualizou dados da venda!")
                await Promise.all(
                    jsonNF.produtos.map(async (produto) => {

                        try {
                            if (produto.produtoVendaId) {
                                const atualizaProdutoDaVenda = await put(`${process.env.NEXT_PUBLIC_API_URL}/produtosdasvendas/${produto.produtoVendaId}`,
                                    {
                                        ...produto,
                                        vendaId: props.idVenda,
                                        valor: produto.subtotal
                                    }
                                )
                                if (atualizaProdutoDaVenda.affectedRows === 1) {
                                    console.log("Atualizou os dados do produto da venda")
                                }
                            } else {
                                const adicionaNovosProdutosAVenda = await post(`${process.env.NEXT_PUBLIC_API_URL}/produtosdasvendas`,
                                    {
                                        ...produto,
                                        vendaId: props.idVenda,
                                        valor: produto.subtotal
                                    }
                                )
                                if (adicionaNovosProdutosAVenda.insertId) {
                                    console.log("Novos produtos adicionado a venda")
                                }
                            }
                        } catch (error) {
                            console.error(error)
                        }

                    })
                )
            }
        } catch (error) {
            console.error(error)
        } finally {
            setFinalizando(false)
            alert("Venda Salva Atualizada com sucesso!!!")
            loadVenda(props.idVenda)
        }
    }

    const removerProdutoDaVenda = async (id, index) => {

        try {
            const removeProdutoVenda = await remove(`${process.env.NEXT_PUBLIC_API_URL}/produtosdasvendas/${id}`)
            if (removeProdutoVenda) {
                setJsonNF((prevState) => {
                    const produtosAtualizados = prevState.produtos.filter((_, i) => i !== index);

                    if (produtosAtualizados.length === 0) {
                        props.setSairPdv(true);
                    }

                    return {
                        ...prevState,
                        produtos: produtosAtualizados,
                        subTotal: parseFloat(produtosAtualizados.reduce((acc, p) => acc + p.total, 0).toFixed(2)),
                    };
                });
            }
        } catch (error) {
            console.error(error)
        } finally {
            atualizarVendaSalva()
            loadVenda(props.idVenda)
        }

    }

    const emitirNFe = () => {
        setJsonNF({
            ...jsonNF,
            modelo: "1"
        })
        if (Object.keys(jsonNF.cliente).length > 0) {
            setEmitirNf(true);
        } else {
            alert("Voce precisa selecionar um cliente!")
        }

    }

    const emitirNFCe = () => {
        if (jsonNF.produtos.length === 0) {
            return alert("Adicione produtos a venda")
        }

        if (calculaTotalPagamento() === 0) {
            return alert("Precisa receber!!")
        }

        setJsonNF({
            ...jsonNF,
            modelo: "2"
        })
        if (Object.keys(jsonNF.cliente).length > 0) {
            setEmitirNf(true);
        } else {
            if (semCpf) {
                setEmitirNf(true)
            } else {
                setPopUpCpfNaNota(true)
            }
        }
    }

    const emitirNFCeComCpf = (event) => {
        event.preventDefault()
        emitirNFCe()
    }

    const emiteNfcESemCpf = async () => {
        setSemCpf(true)
        setPopUpCpfNaNota(false)
    }

    const handleEmitirComCpf = (event) => {
        setJsonNF(
            (prev) =>
            ({
                ...prev,
                cliente:
                {
                    cpf: event.target.value,
                    nome_completo: "Consumidor",
                    endereco: "Consumidor",
                    complemento: "Consumidor",
                    numero: "Consumidor",
                    bairro: "Consumidor",
                    cidade: "Consumidor",
                    uf: "NI",
                    cep: empresa.cep
                }
            })
        )
    }

    const salvarProdutosDaVenda = async (vendaId) => {
        await Promise.all(
            jsonNF.produtos.map(async (produto) => {
                await post(`${process.env.NEXT_PUBLIC_API_URL}/produtosdasvendas/`, {
                    vendaId,
                    estoqueId: produto.estoqueId,
                    valor: produto.subtotal,
                    quantidade: produto.quantidade,
                    empresaId: jsonNF.empresaId,
                });

                if (parseInt(produto.tipo) !== 2) {

                    const estoque = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${produto.estoqueId}`);

                    let deduzir = estoque[0].quantidade <= 0 ? 0 : produto.quantidade > estoque[0].quantidade ? 0 : estoque[0].quantidade - produto.quantidade;

                    const newEstoque = {
                        variacaoProdutoId: estoque[0].variacao_produto_id,
                        validade: estoque[0].validade,
                        localizacao: estoque[0].localizacao,
                        quantidadeMin: estoque[0].quantidade_min,
                        quantidadeMax: estoque[0].quantidade_max,
                        quantidade: deduzir
                    };

                    await put(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${produto.estoqueId}`, newEstoque);

                }

            })
        );
    }

    const atualizaEstoque = async () => {

        await Promise.all(
            jsonNF.produtos.map(async (produto) => {
                if (parseInt(produto.tipo) !== 2) {

                    const estoque = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${produto.estoqueId}`);

                    let deduzir = estoque[0].quantidade - produto.quantidade;

                    const newEstoque = {
                        variacaoProdutoId: estoque[0].variacao_produto_id,
                        validade: estoque[0].validade,
                        localizacao: estoque[0].localizacao,
                        quantidadeMin: estoque[0].quantidade_min,
                        quantidadeMax: estoque[0].quantidade_max,
                        quantidade: deduzir
                    };

                    await put(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${produto.estoqueId}`, newEstoque);

                }
            })
        )
    }

    const salvarFormasPagamento = async (vendaId) => {

        await Promise.all(

            visualizarFormasPagamento.map(async (formaPagamento) => {

                if (Number(formaPagamento.forma_pagamento) !== 36 && Number(formaPagamento.forma_pagamento) !== 37) {

                    const dataContaReceber = {
                        vendaId: vendaId,
                        clienteId: jsonNF.cliente?.id || null,
                        valor: parseFloat(formaPagamento.valor_pagamento.toFixed(2)),
                        dataVencimento: new Date(Date.now()),
                        tipo: "Venda",
                        empresaId: jsonNF.empresaId,
                        categoriaConta: null,
                        formaPagamento: formaPagamento.forma_pagamento,
                        liquidado: 1
                    };

                    const resContaReceber = await post(`${process.env.NEXT_PUBLIC_API_URL}/contareceber`, dataContaReceber);

                    if (resContaReceber.insertId) {

                        if (formaPagamento.forma_pagamento !== 5) {

                            const pagamentorecebidosalvo = await post(`${process.env.NEXT_PUBLIC_API_URL}/pagamentorecebido`, {
                                valorPago: formaPagamento.valor_pagamento,
                                dataPagamento: new Date(Date.now()),
                                contaReceberId: resContaReceber.insertId,
                                formasPagamentoId: formaPagamento.forma_pagamento,
                                parcelas: formaPagamento.parcelas || 1,
                                troco: parseFloat(formaPagamento.troco.toFixed(2))
                            })
                            if (pagamentorecebidosalvo.insertId) {
                                if (empresa && empresa.planoId && empresa.planoId !== 1 || empresa.dias_para_expirar > 373) {
                                    post(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa`, {
                                        caixaId: caixa,
                                        formaPagamento: parseInt(formaPagamento.forma_pagamento),
                                        valorPagamento: parseFloat((parseFloat(formaPagamento.valor_pagamento.toFixed(2)) + parseFloat(formaPagamento.troco.toFixed(2))).toFixed(2)),
                                        horaPagamento: new Date().toISOString(),
                                        tipoOperacao: "Entrada",
                                        observacao: `Venda PDV ${vendaId}`,
                                        contaReceberId: resContaReceber.insertId
                                    })
                                }
                            }
                        }
                    }
                }
            })
        );

        if (troco) {
            if (empresa && empresa.planoId && empresa.planoId !== 1 || empresa.dias_para_expirar > 373) {
                post(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa`, {
                    caixaId: caixa,
                    formaPagamento: 1,
                    valorPagamento: troco,
                    horaPagamento: new Date().toISOString(),
                    tipoOperacao: "Saída",
                    observacao: `Troco Venda PDV ${vendaId}`
                })
            }
        }

    }

    const salvarParcelasCrediario = async (idVenda) => {

        if (parcelasCrediario.length > 0) {

            const parcelasOrdenadas = parcelasCrediario.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))

            for (const parcela of parcelasOrdenadas) {
                const dataContaReceber = {
                    vendaId: idVenda,
                    clienteId: jsonNF.cliente?.id || null,
                    valor: parseFloat(parseFloat(parcela.valor).toFixed(2)),
                    dataVencimento: new Date(parcela.vencimento).toISOString(),
                    tipo: `Parcela Crediario Venda ${idVenda}`,
                    empresaId: jsonNF.empresaId,
                    categoriaConta: null,
                    formaPagamento: 36,
                    liquidado: 0
                };

                try {
                    const resContaReceber = await post(`${process.env.NEXT_PUBLIC_API_URL}/contareceber`, dataContaReceber);

                    if (resContaReceber.insertId) {
                        console.log("Parcela Criada")
                    }
                } catch (error) {
                    console.error(error)
                }
            }

        }

    }

    const limpar = () => {
        setJsonNF(jsonPadrao)
        setDataCaixa(caixaPadrao)
        setFormaPagamento(formaPagamentoPadrao)
        setProdutoSelecionado(null)
        setProdutoPesquisa("")
        setVisualizarFormasPagamento([])
        setClienteSelecionado(null)
        setPopUpLimpaTudo(true)
        setIsHidden(true)
        setPopUpCpfNaNota(false)
        setSemCpf(false)
        setFinalizando(false)
        setEmitirNf(false)
        setVendedorSelecionado(null)
        setRestante(0)
        props.setSairPdv(true)
        setParcelasCrediario([])
    }

    const calculaTotalPagamento = () => {
        return visualizarFormasPagamento.reduce((acc, valor) => {
            if (valor.forma_pagamento !== 0) {
                return acc + Number(valor.valor_pagamento)
            }
            return acc
        }, 0)
    }

    const calculaTotalDesconto = () => {
        return visualizarFormasPagamento.reduce((acc, valor) => {
            return acc + Number(valor.desconto)
        }, 0)
    }

    const cancelarVenda = async () => {

        try {
            const dataVenda = {
                clienteId: jsonNF.venda.clienteId,
                transportadoraId: jsonNF.venda.transportadoraId,
                vendedorId: jsonNF.venda.vendedorId,
                referenciaVenda: jsonNF.venda.referenciaVenda,
                data: jsonNF.venda.data,
                desconto: jsonNF.venda.desconto,
                valor: jsonNF.venda.valor,
                prazoEntrega: jsonNF.venda.prazoEntrega,
                valorFrete: jsonNF.venda.valorFrete,
                valorBaseSt: jsonNF.venda.valorBaseSt,
                valorSt: jsonNF.venda.valorSt,
                status: 'Cancelado',
                valorIpi: jsonNF.venda.valorIpi,
                pesoTotalNota: jsonNF.venda.pesoTotalNota,
                pesoTotalNotaLiq: jsonNF.venda.pesoTotalNotaLiq,
                origemVenda: jsonNF.venda.origemVenda,
                dataEntrega: jsonNF.venda.dataEntrega,
                observacaoInterna: jsonNF.venda.observacaoInterna,
                observacao: jsonNF.venda.observacao,
                observacaoExterna: jsonNF.venda.observacaoExterna,
                enderecoEntrega: jsonNF.venda.enderecoEntrega,
                modalidadeFrete: jsonNF.venda.modalidadeFrete,
                dataPostagem: jsonNF.venda.dataPostagem,
                codigoRastreio: jsonNF.venda.codigoRastreio,
                empresaId: jsonNF.venda.empresaId
            }

            const cancelaVenda = await put(`${process.env.NEXT_PUBLIC_API_URL}/vendas/${jsonNF.venda.id}`, dataVenda)

            if (cancelaVenda.affectedRows === 1) {

                await Promise.all(visualizarFormasPagamento && visualizarFormasPagamento.map(async (conta) => {
                    await remove(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/${conta.id}`)
                    console.log("Conta receber removida com sucesso!!!")
                    await remove(`${process.env.NEXT_PUBLIC_API_URL}/deleteoperacao/${conta.operacao_id}`)
                }))
                const produtosvenda = await get(`${process.env.NEXT_PUBLIC_API_URL}/produtosdasvendas/${jsonNF.venda.id}`)
                await Promise.all(
                    produtosvenda.map(async (produto) => {
                        const estoque = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${produto.estoque_id}`)
                        let quantidadeNova = estoque[0].quantidade + produto.quantidade;
                        let dataEstoque = {
                            variacaoProdutoId: estoque[0].variacao_produto_id,
                            validade: estoque[0].validade,
                            localizacao: estoque[0].localizacao,
                            quantidade: quantidadeNova,
                            quantidadeMin: estoque[0].quantidade_min,
                            quantidadeMax: estoque[0].quantidade_max
                        }
                        await put(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${produto.estoque_id}`, dataEstoque)
                    })
                )
                alert('Venda cancelada!!')
            }

            loadVenda(jsonNF.venda.id)
            setPopUpCancelarVenda(false)

        } catch (error) {
            console.error(error)
        }

    }

    const vendaFinalizada = () => {
        setFinalizado(true)
        limpar()
    }

    const setTipo = (tipo) => {
        if (tipo === 'a4') {
            localStorage.setItem("applojaweb_tipo_impressão", tipo)
        }
        if (tipo === '58mm') {
            localStorage.setItem("applojaweb_tipo_impressão", tipo)
        }
        if (tipo === '80mm') {
            localStorage.setItem("applojaweb_tipo_impressão", tipo)
        }
        setTipoImpressao(tipo)
    }

    const handleAmbiente = (event) => {
        const { value } = event.target
        const amb = Number(value)

        localStorage.setItem("applojaweb_ambiente", amb)
        setAmbiente(amb)
        setJsonNF({
            ...jsonNF,
            ambiente: amb
        })
    }

    const handleVendedor = (event) => {
        setVendedorSelecionado(event.target.value)
        setJsonNF({
            ...jsonNF,
            venda: {
                ...jsonNF.venda,
                vendedorId: event.target.value
            }
        })
    }

    const handleInformacoesFisco = (event) => {
        setJsonNF((prevState) => ({
            ...prevState,
            pedido: {
                ...prevState.pedido,
                informacoes_fisco: event.target.value,
            },
        }))
    }

    const handleInformacoesComplementares = (event) => {
        setJsonNF((prevState) => ({
            ...prevState,
            pedido: {
                ...prevState.pedido,
                informacoes_complementares: event.target.value,
            },
        }))
    }

    const handleVendedorObrigatorio = (value) => {
        setVendedorObrigatorio(value)
        localStorage.setItem("applojaweb_vendedor_obrigatorio", value.toString())
    }

    const nomeFormaPagamento = (idForma) => {
        const forma = listaFormaPagamento.find((pagamento) => pagamento.id === idForma)
        if (idForma === 0) {
            return "Desconto"
        }
        return forma ? forma.nome : "Nenhum"
    }

    const handleDesconto = (event) => {
        if (tipoDesconto === 0) {
            setFormaPagamento({
                ...formaPagamento,
                desconto: event.target.value < 0 ? 0 : event.target.value,
                valor_pagamento: event.target.value > restante ? restante : restante - (event.target.value < 0 ? 0 : event.target.value),
            })
        }
        if (tipoDesconto === 1) {
            setFormaPagamento({
                ...formaPagamento,
                desconto: event.target.value < 100 ? event.target.value < 0 ? 0 : event.target.value : 100,
                valor_pagamento: parseFloat((restante - (restante * ((event.target.value < 100 ? event.target.value < 0 ? 0 : event.target.value : 100) / 100))).toFixed(2)),
            })
        }
    }

    const handleTipoDesconto = (tipo) => {
        localStorage.setItem("tipo_desconto", tipo)
        setTipoDesconto(tipo)
    }

    const handleAddAuto = (set) => {
        setAddAuto(set)
        localStorage.setItem("auto_insert_product", set.toString())
    }

    // console.log("Tipo de impressão", tipoImpressao)
    // console.log("Ambiente", ambiente)
    console.log("Dados WebMania", jsonNF)
    // console.log(vendedorObrigatorio)
    console.log("Formas de Pagamento", visualizarFormasPagamento)
    // console.log("Lista formas pagamento", listaFormaPagamento)
    // console.log("Forma pagamento", formaPagamento)
    // console.log(calculaTotalPagamento())
    // console.log("pagamento?", isHidden)
    // console.log("Produtos", jsonNF.produtos)
    // console.log("Produtos", jsonNF.produtos.length)
    console.log("Empresa", empresa)
    console.log("Subtotal", total)
    console.log("Recebido", recebido)
    console.log("Restante", restante)
    console.log("Troco", troco)
    console.log("Desconto", desconto)
    // console.log("Tipo desconto", tipoDesconto)
    // console.log("Cliente Selecionado", clienteSelecionado)
    console.log("Caixa selecionado", caixa)

    if (loading) {
        return (
            <LoadingComponent />
        )
    }

    return (
        <>
            {
                !finalizado && (
                    <div className="relative flex flex-col lg:flex-row min-w-full md:h-full px-4 pb-4">
                        <div className="flex flex-col bg-gray-200 h-full w-full rounded lg:flex-row gap-4">
                            {
                                /* Parte de seleção de produto e informações gerais */

                                isHidden &&
                                <div className={'flex flex-col w-full h-full p-4 sm:w-full lg:w-2/5 gap-2'}>
                                    <div className="relative flex flex-col">
                                        <div className="flex flex-row justify-between">
                                            <div className="relative w-full gap-2">
                                                <label className="text-sm font-medium text-black">Produto</label>
                                                <div className="relative flex flex-row items-center gap-2">
                                                    <input onChange={(e) => handleProdutoInput(e.target.value)} value={produtoPesquisa} id="produto" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" autoFocus readOnly={jsonNF.venda.status === "Finalizado" ? true : false} autoComplete="off" />
                                                    <div className="relative inline-block group">
                                                        <div className="absolute z-10 right-full lg:left-full top-1/2 mr-2 lg:ml-2 w-64 p-2 bg-gray-700 text-white text-sm rounded-lg opacity-0 pointer-events-none transition-opacity duration-300 transform -translate-y-1/2 group-hover:opacity-100 group-hover:pointer-events-auto">
                                                            <p>Adicionar produtos a lista Automaticamente!</p><p>Desmarque esta opção caso queira alterar a quantidade ou o preço do produto!</p>
                                                        </div>
                                                        <input onChange={() => handleAddAuto(!addAuto)} className="h-5 w-5" type="checkbox" name="auto" id="auto" checked={addAuto} />
                                                    </div>
                                                </div>
                                                {produtosEncontrados.length > 0 && (
                                                    <ul className="absolute z-10 bg-white border border-gray-500 top-full w-full lg:max-w-[1000px] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {produtosEncontrados.map((produto, i) => (
                                                            <li key={i} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => selecionarProduto(produto)}>
                                                                Qtd: {produto.quantidade < 0 ? 0 : produto.quantidade} - {produto.estoque_id} - {produto.nome} {produto.codigo_barras && `- ${produto.codigo_barras}`}  {produto.cor_nome && `- Cor: ${produto.cor_nome}`}  {produto.tamanho_nome && `- Tamanho: ${produto.tamanho_nome}`} {produto.unidade_sigla && `- ${produto.unidade_sigla}`} {produto.valor && `- R$${produto.valor.toFixed(2).replace('.', ',')}`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-black">Quantidade</label>
                                            <input onChange={handleProdutoSelecionado} name="quantidade" id="quantidade" type="number" min="0" value={produtoSelecionado ? produtoSelecionado.quantidade : ""} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" readOnly={jsonNF.venda.status === "Finalizado" ? true : false} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-black">Valor unitário</label>
                                            <input name="valor" type="number" min="0" value={produtoSelecionado ? produtoSelecionado.valor : ""} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" onChange={handleProdutoSelecionado} readOnly={jsonNF.venda.status === "Finalizado" ? true : false} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-black">Valor total</label>
                                            <input id="valorTotal" type="number" min="0" defaultValue={produtoSelecionado ? produtoSelecionado.quantidade * produtoSelecionado.valor : ""} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" readOnly />
                                        </div>
                                    </div>
                                    <div className="flex">

                                        <button onClick={() => incluirProduto(produtoSelecionado)} className="bg-applojaLight hover:bg-applojaLight2 text-white font-bold py-2 px-4 w-full rounded">
                                            Incluir
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-row justify-between">
                                            <button onClick={() => setGuiaObservacao('obs')} className={`flex-1 border-l-2 border-t-2 border-black text-xs font-bold ${guiaObservacao === 'obs' ? 'bg-white' : ''} `}>Observações</button>
                                            <button onClick={() => setGuiaObservacao('infcomp')} className={`flex-1 border-t-2 border-black p-2 text-xs font-bold ${guiaObservacao === 'infcomp' ? 'bg-white' : ''}`}>Informações Complementares</button>
                                            <button onClick={() => setGuiaObservacao('inffisc')} className={`flex-1 border-t-2 border-r-2  border-black p-2 text-xs font-bold ${guiaObservacao === 'inffisc' ? 'bg-white' : ''}`}>Informações Fisco</button>
                                        </div>
                                        <div className="flex-1 ">

                                            {
                                                guiaObservacao === 'obs' ?
                                                    <textarea onChange={(e) => setJsonNF((prevState) => ({ ...prevState, observacao: e.target.value }))} value={jsonNF.observacao || ''} name="observacao" className="flex-1 w-full min-h-[180px] resize-none border-l-2 border-r-2 border-b-2 border-black text-sm p-2.5 bg-white focus:border-white text-black" readOnly={jsonNF.venda.status === "Finalizado" ? true : false} placeholder="Observações internas" />
                                                    :

                                                    guiaObservacao === 'infcomp' ?
                                                        <textarea onChange={handleInformacoesComplementares} value={jsonNF.pedido.informacoes_complementares || ''} name="infcomp" className="flex-1 w-full min-h-[180px] resize-none border-l-2 border-r-2 border-b-2 border-black text-sm p-2.5 bg-white focus:border-white text-black" placeholder="Informações complementares da nota fiscal" />
                                                        :
                                                        guiaObservacao === 'inffisc' ?
                                                            <textarea onChange={handleInformacoesFisco} value={jsonNF.pedido.informacoes_fisco || ''} name="inffisc" className="flex-1 w-full min-h-[180px] resize-none border-l-2 border-r-2 border-b-2 border-black text-sm p-2.5 bg-white focus:border-white text-black" placeholder="Informações fiscais da nota fiscal" />
                                                            :
                                                            null
                                            }
                                        </div>

                                    </div>

                                    <div className="flex flex-col py-4 rounded-lg text-gray-700 gap-4 text-lg font-medium">
                                        <div className="flex flex-row items-center gap-4">
                                            <h1 className="text-base">Operador:</h1>
                                            <span className="text-base">{operador}</span>
                                        </div>
                                        <div className="flex flex-row gap-4 items-center">
                                            <label className="text-base" htmlFor="vendedor">Vendedor:</label>
                                            <select name="vendedor" className="rouded-lg p-1 text-base" value={jsonNF.venda.vendedorId} onChange={handleVendedor}>
                                                <option value="">Sem Vendedor</option>
                                                {
                                                    listaVendedores && listaVendedores.map((vendedor, i) => (
                                                        <option key={i} value={vendedor.id}>{vendedor.nome}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {
                                        jsonNF.venda.status === 'Finalizado' && <div className="w-full flex flex-1 items-end justify-end">
                                            <button onClick={() => setIsHidden(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Pagamento</button>
                                        </div>
                                    }
                                </div>
                            }

                            {
                                /* Parte de seleção de cliente e forma de pagamento */

                                !isHidden &&
                                <div className={'flex flex-col w-full p-4 lg:w-2/5 gap-2'}>

                                    <div className="flex flex-col gap-2">
                                        <label className="block text-sm font-medium text-black">Forma de Pagamento</label>
                                        <select onChange={selecionarFormaPagamento} value={formaPagamento.forma_pagamento} name="forma_pagamento" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" >
                                            {
                                                listaFormaPagamento && listaFormaPagamento.map((forma, i) => (
                                                    <option key={i} value={forma.id}>{forma.nome}</option>
                                                ))
                                            }
                                        </select>

                                    </div>
                                    <div className="flex flex-col justify-between gap-4 lg:flex-row">
                                        <div className="flex-1 flex-col gap-2">
                                            <div className="flex justify-between">
                                                <label className="flex text-sm font-medium text-black">Desconto</label>
                                                <div className="flex gap-2"><button onClick={() => handleTipoDesconto(0)} className={`text-sm font-bold ${tipoDesconto === 0 ? `text-gray-800` : `text-gray-400`}`}>$</button><button onClick={() => handleTipoDesconto(1)} className={`text-sm font-bold ${tipoDesconto === 1 ? `text-gray-800` : `text-gray-400`}`}>%</button></div>
                                            </div>
                                            <input onChange={handleDesconto} value={formaPagamento.desconto} name="desconto" type="number" min={0} max={tipoDesconto === 0 ? '' : 100} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                                        </div>
                                        <div className="flex-1 flex-col gap-2">
                                            <label className="block text-sm font-medium text-black">Parcelas</label>
                                            <input onChange={(event) => setFormaPagamento({ ...formaPagamento, parcelas: parseInt(event.target.value) })} value={formaPagamento.parcelas} name="parcelas" type="number" min={1} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                                        </div>
                                        <div className="flex-1 lg:flex-col gap-2">
                                            <label className="block text-sm font-medium text-black">Recebido</label>
                                            <input onChange={(event) => setFormaPagamento({ ...formaPagamento, valor_pagamento: parseFloat(event.target.value) })} value={formaPagamento.valor_pagamento} name="valor_pagamento" type="number" min={0} className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                                        </div>

                                    </div>

                                    <div className="flex flex-row">
                                        <button onClick={() => incluirFormasPagamento(formaPagamento)} className="bg-applojaLight hover:bg-applojaLight2 text-white font-bold py-2 px-4 w-full rounded" >Incluir</button>
                                    </div>

                                    {
                                        Number(formaPagamento.forma_pagamento) === 36 && (
                                            <div className="flex flex-row gap-2 justify-between">
                                                <div className="flex flex-col gap-2">
                                                    <label className="block text-sm font-medium text-black">Dia Vencimento</label>
                                                    <select onChange={selecionarFormaPagamento} className="border text-sm w-16 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 bg-white border-gray-500 text-black" name="dia_vencimento" id="dia_vencimento">
                                                        <option value="01">01</option>
                                                        <option value="02">02</option>
                                                        <option value="03">03</option>
                                                        <option value="04">04</option>
                                                        <option value="05">05</option>
                                                        <option value="06">06</option>
                                                        <option value="07">07</option>
                                                        <option value="08">08</option>
                                                        <option value="09">09</option>
                                                        <option value="10">10</option>
                                                        <option value="11">11</option>
                                                        <option value="12">12</option>
                                                        <option value="13">13</option>
                                                        <option value="14">14</option>
                                                        <option value="15">15</option>
                                                        <option value="16">16</option>
                                                        <option value="17">17</option>
                                                        <option value="18">18</option>
                                                        <option value="19">19</option>
                                                        <option value="20">20</option>
                                                        <option value="21">21</option>
                                                        <option value="22">22</option>
                                                        <option value="23">23</option>
                                                        <option value="24">24</option>
                                                        <option value="25">25</option>
                                                        <option value="26">26</option>
                                                        <option value="27">27</option>
                                                        <option value="28">28</option>
                                                    </select>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="block text-sm font-medium text-black" htmlFor="">Valor da Parcela</label>
                                                    <input className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" type="number" value={parseFloat(parseFloat(formaPagamento.valor_pagamento) / parseFloat(parseFloat(formaPagamento.parcelas).toFixed(2))).toFixed(2)} readOnly />
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className="w-full overflow-x-auto h-full min-h-[200px] max-h-[200px] bg-applojaLight2 rounded">
                                        <table className="w-full text-sm text-left text-white ">
                                            <thead className="sticky top-0 text-xs uppercase bg-applojaDark2">
                                                <tr>
                                                    <th scope="col" className="p-2">
                                                        Forma de Pagamento
                                                    </th>
                                                    <th scope="col">
                                                        Parcelas
                                                    </th>
                                                    <th scope="col">
                                                        Valor
                                                    </th>
                                                    <th scope="col">
                                                        Status
                                                    </th>
                                                    <th scope="col">

                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    visualizarFormasPagamento && visualizarFormasPagamento.map((pagamento, i) => (

                                                        <tr key={i} className="border-b bg-applojaDark border-gray-700 text-white">
                                                            <td scope="row" className="py-4 px-6 font-medium whitespace-nowrap">
                                                                {nomeFormaPagamento(pagamento.forma_pagamento)}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {pagamento.parcelas}
                                                            </td>
                                                            <td className="hidden py-4 w-1/3 sm:table-cell">
                                                                {Brl(pagamento.valor_pagamento)}
                                                            </td>
                                                            <td>
                                                                {pagamento.status ? pagamento.status : null}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {
                                                                    jsonNF.venda.status !== "Finalizado" &&
                                                                    <button onClick={() => removerFormaPagamento(i, pagamento.forma_pagamento)} className="cursor-pointer">
                                                                        <BsFillTrashFill />
                                                                    </button>
                                                                }

                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        {
                                            jsonNF.parcelas && (
                                                <table className="w-full text-sm text-left text-white ">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" className="p-2">
                                                                Data Vencimento
                                                            </th>
                                                            <th scope="col">
                                                                Parcela
                                                            </th>
                                                            <th scope="col">
                                                                Valor
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            jsonNF.parcelas.map((p, i) => (
                                                                <tr key={i}>
                                                                    <td className="py-3 px-6 w-2/4">
                                                                        {utcStringToDateLocal(p.vencimento)}
                                                                    </td>
                                                                    <td className="py-3 px-6 sm:table-cell">
                                                                        {i + 1}/{jsonNF.parcelas.length}
                                                                    </td>
                                                                    <td className="py-3 px-6 sm:table-cell">
                                                                        {Brl(parseFloat(p.valor))}
                                                                    </td>
                                                                    <td></td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                            )
                                        }
                                    </div>
                                    <div className="w-full flex flex-1 items-end">
                                        <button onClick={() => setIsHidden(true)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Produtos</button>
                                    </div>
                                </div>
                            }

                            {/* Parte de exibição de produtos selecionados e finalização */}

                            <div className="w-full h-full flex flex-col justify-between p-4 lg:w-3/5 gap-2">

                                {
                                    clienteSelecionado ? (
                                        <div className="flex flex-row h-[5%] justify-between py-4">
                                            <div className="flex flex-row items-center gap-2">
                                                <h1 className="text-2xl">{clienteSelecionado?.nome} {clienteSelecionado.cnpj_cpf ? `- ${clienteSelecionado.cnpj_cpf}` : ''}</h1>
                                                {
                                                    jsonNF.venda.status !== "Finalizado" && <button><BsXCircleFill onClick={removerCliente} /></button>
                                                }

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="flex flex-col gap-2">
                                                <label className="block text-sm font-medium text-black">Cliente</label>
                                                <input onChange={(e) => buscarCliente(e.target.value)} value={clientePesquisa} id="cliente" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" readOnly={jsonNF.venda.status === "Finalizado"} autoComplete="off" />
                                            </div>
                                            {clientesEncontrados.length > 0 && (
                                                <ul className="absolute z-10 bg-white border border-gray-500 w-[400px] rounded-lg shadow-lg max-h-60 overflow-auto">
                                                    {clientesEncontrados.map((cliente) => (
                                                        <li key={cliente.id} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => selecionarCliente(cliente)} >
                                                            {cliente.nome} - {cliente.cnpj_cpf}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )
                                }

                                <div className="flex-1 w-full sm:h-[300px] md:h-[350px] xl:h-[400px] 2xl:h-[550px] overflow-y-auto bg-applojaLight2 rounded">
                                    <div className="flex w-full h-auto bg-applojaLight2 rounded">
                                        <table className="w-full text-left text-white">
                                            <thead className="sticky top-0 text-xs uppercase bg-applojaDark2">
                                                <tr>
                                                    <th scope="col" className="py-3 px-6 table-cell lg:w-2/4">Produto</th>
                                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">Código</th>
                                                    <th scope="col" className="py-3 px-6 sm:table-cell">Qtd.</th>
                                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">Preço</th>
                                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">Total</th>
                                                    <th scope="col" className="py-3 px-6 sm:table-cell"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    jsonNF.produtos.map((item, i) => (
                                                        <tr key={i} className="border-b bg-applojaDark border-gray-700 text-white">
                                                            <th scope="row" className="py-2 px-4 font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">{item.nome.length > 30 ? item.nome.slice(0, 30) : item.nome}</th>
                                                            <td className="hidden py-2 px-4 sm:table-cell max-w-[100px] truncate">{item.estoqueId}</td>
                                                            <td className="py-4 px-6 sm:table-cell">
                                                                <div className="flex flex-col h-full items-center justify-center gap-2">
                                                                    <div className="flex gap-2">
                                                                        {
                                                                            jsonNF.venda.status !== "Finalizado" &&
                                                                            <button onClick={() => removerQtdProduto(item.estoqueId)} className="text-red-500 hover:text-red-700">
                                                                                -
                                                                            </button>
                                                                        }

                                                                        <span>{item.quantidade}</span>
                                                                        {
                                                                            jsonNF.venda.status !== "Finalizado" &&
                                                                            <button onClick={() => adicionarQtdProduto(item.estoqueId)} className="text-green-500 hover:text-green-700">
                                                                                +
                                                                            </button>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="hidden py-4 px-6 sm:table-cell">R${Number(item.subtotal).toFixed(2).replace(".", ",")}</td>
                                                            <td className="hidden py-4 px-6 sm:table-cell">R${Number(item.total).toFixed(2).replace(".", ",")}</td>
                                                            <td className="py-4 px-6">
                                                                {
                                                                    jsonNF.venda.status === "Aguardando" ?
                                                                        <button onClick={() => removerProdutoDaVenda(item.produtoVendaId, i)} className="cursor-pointer"><BsFillTrashFill /></button>
                                                                        :
                                                                        jsonNF.venda.status !== "Finalizado" && <button onClick={() => removerProduto(i)} className="cursor-pointer"><BsFillTrashFill /></button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-applojaLight h-12 flex items-center p-4 rounded justify-between">
                                    <span className="text-white font-bold">SUBTOTAL {Brl(total - desconto)}</span>
                                    <span className="text-white font-bold">RECEBIDO {Brl(recebido)}</span>
                                    <span className="text-white font-bold">RESTANTE {Brl(restante)}</span>
                                    <span className="text-white font-bold">TROCO {Brl(troco)}</span>
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-4">
                                        <button onClick={() => setPopUpLimpaTudo(false)} className="text-sm 2xl:text-lg flex-1 bg-red-500 hover:bg-red-700 text-white font-bold  py-2 rounded">Cancelar <span className="text-xs">(ESC)</span></button>
                                        {
                                            jsonNF.venda.status === "Aguardando" ? (
                                                finalizando ?
                                                    <button className="text-sm 2xl:text-lg flex-1 cursor-wait bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 rounded">Aguarde...</button>
                                                    :
                                                    <button onClick={atualizarVendaSalva} className="text-sm 2xl:text-lg flex-1 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 rounded">Salvar <span className="text-xs">(F2)</span></button>
                                            ) : (
                                                <button onClick={aguardar} className="text-sm 2xl:text-lg flex-1 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 rounded">Salvar <span className="text-xs">(F2)</span></button>
                                            )
                                        }

                                        {
                                            jsonNF.venda.status === "Finalizado" ? (
                                                <button onClick={() => emiteNotaFiscal(jsonNF.venda.id)} className="text-sm 2xl:text-lg flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded">Emitir NF-e <span className="text-xs">(F3)</span></button>
                                            ) : (
                                                finalizando ?
                                                    <button className="text-sm 2xl:text-lg flex-1 cursor-wait bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded">Aguarde...</button>
                                                    :
                                                    <button onClick={emitirNFe} className="text-sm 2xl:text-lg flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded">Emitir NF-e <span className="text-xs">(F3)</span></button>
                                            )
                                        }

                                        {
                                            jsonNF.venda.status === "Finalizado" ? (
                                                <button onClick={() => emiteNFCe(jsonNF.venda.id)} className="text-sm 2xl:text-lg flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded">Emitir NFC-e <span className="text-xs">(F4)</span></button>
                                            ) : (
                                                finalizando ?
                                                    <button className="text-sm 2xl:text-lg flex-1 cursor-wait bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded">Aguarde...</button>
                                                    :
                                                    <button onClick={emitirNFCe} className="text-sm 2xl:text-lg flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded">Emitir NFC-e <span className="text-xs">(F4)</span></button>
                                            )
                                        }

                                        {
                                            jsonNF.venda.status === "Finalizado" ? (
                                                <button onClick={() => setPopUpCancelarVenda(true)} className="text-sm 2xl:text-lg flex-1 bg-red-500 hover:bg-red-700 text-white py-2 font-bold rounded">Cancelar Venda</button>
                                            ) : (

                                                isHidden ? (
                                                    finalizando ?
                                                        <button className="text-lg flex-1 cursor-wait bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">Aguarde...</button>
                                                        :
                                                        <button onClick={() => setIsHidden(false)} className="text-sm 2xl:text-lg flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"><p className="flex flex-row items-center gap-2 justify-center">Pagamento <span className="text-xs"><BsArrowReturnLeft /></span></p></button>
                                                ) : (
                                                    finalizando ?
                                                        <button className="text-sm 2xl:text-lg flex-1 cursor-wait bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">Aguarde...</button>
                                                        :
                                                        <button onClick={finalizarVenda} className="text-sm 2xl:text-lg flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">Finalizar</button>
                                                )

                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                )

            }

            {
                finalizado && (
                    <div className="flex flex-col lg:flex-row min-w-full h-full lg:h-4/5 p-4 overflow-x-hidden">
                        <div className="flex flex-col bg-gray-200 w-full p-4 rounded gap-4 justify-center items-center">
                            <p className="text-gray-700 text-4xl font-bold">Venda Finalizada!!</p>
                            <p className="text-gray-700 text-4xl font-bold">Volte Sempre!!</p>
                        </div>
                    </div>
                )
            }

            <div className={popPupLimpaTudo ? "hidden" : "absolute inset-0 flex items-center justify-center bg-applojaDark2 bg-opacity-50"}>
                <div className="bg-applojaDark2 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
                    <h1 className="text-2xl text-white text-center">Tem certeza?</h1>
                    <div className="flex flex-row gap-4">
                        <button onClick={limpar} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                        <button onClick={() => setPopUpLimpaTudo(true)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
                    </div>
                </div>
            </div>
            <div className={popPupAbrirCaixa ? "absolute inset-0 flex items-center justify-center bg-applojaDark2 bg-opacity-50" : "hidden"}>
                <div className="bg-applojaDark2 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl text-white text-center">Valor Inicial</h1>
                        <div className="flex flex-row gap-4">
                            <input className="p-2" type="number" name="valorAbertura" defaultValue={dataCaixa.valorAbertura} onChange={handleCaixa} />
                            <button onClick={abrirCaixa} className="flex-1 bg-green-500 hover:bg-green-700  text-white font-bold py-2 px-4 rounded">Abrir</button>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex flex-col w-full gap-2">
                            <h1 className="text-xl text-white text-center">Selecionar Caixa Aberto</h1>
                            <select className="w-full p-2" name="caixa" onChange={abrirCaixaSelecionado}>
                                <option value={null}></option>
                                {
                                    listaCaixas && listaCaixas.map((caixa, i) => (
                                        <option key={i} value={i}>Caixa {caixa.id}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className={popUpCancelarVenda ? "absolute inset-0 flex items-center justify-center bg-applojaDark2 bg-opacity-50" : "hidden"}>
                <div className="bg-applojaDark2 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-4">
                    <h1 className="text-2xl text-white text-center">Cancelar {jsonNF.venda.id}</h1>
                    <div className="flex flex-col">
                        <label className="text-white" htmlFor="observacao">Observação:</label>
                        <textarea type="text" name="observacao" onChange={(event) => setJsonNF((prev) => ({ ...prev, venda: { ...prev.venda, observacao: event.target.value } }))} />
                    </div>
                    <div className="flex flex-row gap-4">
                        <button onClick={cancelarVenda} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                        <button onClick={() => setPopUpCancelarVenda(false)} className="flex-1 bg-red-500 hover:bg-red-700  text-white font-bold py-2 px-4 rounded">Não</button>
                    </div>
                </div>
            </div>
            <div className={popUpCpfNaNota ? "absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
                <div className="bg-gray-300 rounded-lg shadow-lg max-w-sm w-full flex flex-col">
                    <div className="flex flex-row justify-end p-2"><button onClick={() => setPopUpCpfNaNota(false)} className="p-2 hover:bg-gray-400 rounded-lg"><BsX className="text-gray-700 font-medium text-lg" /></button></div>
                    <h1 className="text-2xl text-gray-700 text-center">CPF na Nota? {jsonNF.venda.id}</h1>
                    <form onSubmit={emitirNFCeComCpf}>
                        <div className="flex flex-col p-6">
                            <InputMask className="p-2" type="text" name="observacao" value={jsonNF.cliente.cpf ? jsonNF.cliente.cpf : ''} onChange={handleEmitirComCpf} mask={'999.999.999-99'} required />
                        </div>
                        <div className="flex flex-row gap-4 p-6 ">
                            <button type="submit" className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                            <button type="button" onClick={emiteNfcESemCpf} className="flex-1 bg-red-500 hover:bg-red-700  text-white font-bold py-2 px-4 rounded">Não</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className={props.config ? "absolute flex w-full h-full justify-center bg-gray-700 bg-opacity-60 p-20" : "hidden"}>
                <div className="flex flex-col h-max bg-gray-200 rounded-lg shadow-lg">
                    <div className="flex flex-row justify-end p-2">
                        <button onClick={() => props.setConfig(false)} className="hover:bg-gray-400 p-4 rounded-lg">
                            <FaX />
                        </button>
                    </div>
                    <div className="flex flex-col p-6">
                        <h1 className="text-xl font-medium text-gray-700 text-center uppercase">Selecione o Tipo de impressão do cupom fiscal</h1>
                        <p className="text-center font-medium">{tipoImpressao}</p>
                    </div>

                    <div className="flex flex-row gap-4 px-6">
                        <button onClick={() => setTipo('a4')} className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">A4</button>
                        <button onClick={() => setTipo('58mm')} className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">58mm</button>
                        <button onClick={() => setTipo('80mm')} className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">80mm</button>
                    </div>

                    <div className="flex flex-row p-6 items-center gap-2">
                        <h1 className="text-xl font-medium text-gray-700 text-center uppercase">Tornar vendedor obrigatorio?</h1>
                        <input className="w-5 h-5" type="checkbox" name="obrigatorioVendedor" checked={vendedorObrigatorio} onChange={() => handleVendedorObrigatorio(!vendedorObrigatorio)} />
                    </div>

                    {
                        planId && planId === 4 &&
                        (
                            <div className="flex flex-col gap-4 px-6 pb-6">
                                <label className="text-xl font-medium text-gray-700 uppercase" htmlFor="ambiente">Ambiente De emissão da nota</label>
                                <select name="ambiente" className="p-2" onChange={handleAmbiente} value={ambiente}>
                                    <option value={1}>Produção</option>
                                    <option value={2}>Homologação</option>
                                </select>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
};
