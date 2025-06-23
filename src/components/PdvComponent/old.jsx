import { useEffect, useState } from "react"
import { BsFillTrashFill, BsFillExclamationCircleFill, BsX } from 'react-icons/bs';
import { get, post, put, remove } from "../../services/api";
import Router from "next/router";
import { ProductModal } from "../ProductModal";
import { FastProductModal } from "../FastProductModal";

export const PdvComponent = (props) => {
    var idVenda = typeof window !== 'undefined' ? localStorage.getItem('applojaweb_idVenda') : null;

    const [vendaSelecionada, setVendaSelecionada] = useState({});
    const [clienteSelecionado, setClienteSelecionado] = useState();
    const [produtoSelecionado, setProdutoSelecionado] = useState();
    const [clienteList, setClienteList] = useState([]);
    const [produtosDaVenda, setProdutosDaVenda] = useState([]);
    const [estoqueCompletoList, setEstoqueCompletoList] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [hiddenPopUpCancelar, setHiddenPopUpCancelar] = useState('hidden');
    const [hiddenAutoCompleteProduto, setHiddenAutoCompleteProduto] = useState('hidden');
    const [hiddenAutoCompleteCliente, setHiddenAutoCompleteCliente] = useState('hidden');
    const [hiddenLoadingProduto, setHiddenLoadingProduto] = useState('hidden');
    const [intervalProduto, setIntervalProduto] = useState();
    const [intervalCliente, setIntervalCliente] = useState();
    const [closeProdutcModal, setCloseProdutcModal] = useState('hidden');
    const [loadingCancelar, setLoadingCancelar] = useState(false);

    const closePopUpCancelar = () => {
        if (hiddenPopUpCancelar == 'hidden') {
            setHiddenPopUpCancelar('')
        } else {
            setHiddenPopUpCancelar('hidden')
        }
    }

    const incluirProduto = () => {
        if (vendaSelecionada.status == 'Finalizado') {
            console.log("Vendas finalizadas não podem ser alteradas.");
        } else {
            if (produtoSelecionado) {
                let nome = produtoSelecionado.nome
                let id = produtoSelecionado.estoque_id;
                let codigoBarras = produtoSelecionado.codigo_barras;
                let tamanho = produtoSelecionado.cor_nome;
                let cor = produtoSelecionado.tamanho_nome;
                let ncm = produtoSelecionado.ncm;
                let classeImposto = produtoSelecionado.classeImposto;
                let quantidade = Number(document.getElementById('quantidade').value);
                let valorUnitario = Number(document.getElementById('valorUnitario').value);
                let valorTotal = Number(document.getElementById('valorTotal').value);
                let produto;

                if (quantidade != '0') {
                    produto = {
                        id: id,
                        nome: nome,
                        tamanho: tamanho,
                        cor: cor,
                        codigo: codigoBarras,
                        qtd: quantidade,
                        preco: valorUnitario,
                        total: valorTotal,
                        ncm: ncm,
                        classeImposto: classeImposto
                    }

                    if (nome != '') {
                        let deveIncluirProduto = true;
                        for (let i = 0; i < produtosDaVenda.length; i++) {
                            if (produtosDaVenda[i].id == produto.id) {
                                deveIncluirProduto = false;
                                produtosDaVenda[i].qtd = produtosDaVenda[i].qtd + produto.qtd;
                                produtosDaVenda[i].total = produtosDaVenda[i].preco * produtosDaVenda[i].qtd;
                                break;
                            }
                        }

                        if (deveIncluirProduto) {
                            setProdutosDaVenda(old => [...old, produto])
                            setSubTotal(subTotal + valorTotal)
                        } else {
                            setSubTotal(subTotal + valorTotal)
                        }
                        document.getElementById('produto').value = '';
                        document.getElementById('quantidade').value = 0;
                        document.getElementById('valorUnitario').value = 0;
                        document.getElementById('valorTotal').value = 0;

                        props.setSairPdv(false);
                    }

                    setProdutoSelecionado(null);
                } else {
                    console.log('Quantidade não pode ser 0')
                }
            } else {
                if (estoqueCompletoList.length != 1) {
                    console.log('Selecione um produto');
                }
            }
        }
    }

    const removerQtdProduto = (produto) => {
        if (vendaSelecionada.status == 'Finalizado') {
            console.log("Vendas finalizadas não podem ser alteradas.");
        } else {
            for (let i = 0; i < produtosDaVenda.length; i++) {
                if (produtosDaVenda[i].qtd > 1) {
                    if (produtosDaVenda[i].id == produto.id) {
                        produtosDaVenda[i].qtd = produtosDaVenda[i].qtd - 1;
                        produtosDaVenda[i].total = produtosDaVenda[i].preco * produtosDaVenda[i].qtd;
                        setSubTotal(subTotal - produtosDaVenda[i].preco);
                        break;
                    }
                }
            }
        }
    }

    const adicionarQtdProduto = (produto) => {
        if (vendaSelecionada.status == 'Finalizado') {
            console.log("Vendas finalizadas não podem ser alteradas.");
        } else {
            for (let i = 0; i < produtosDaVenda.length; i++) {
                if (produtosDaVenda[i].id == produto.id) {
                    produtosDaVenda[i].qtd = produtosDaVenda[i].qtd + 1;
                    produtosDaVenda[i].total = produtosDaVenda[i].preco * produtosDaVenda[i].qtd;
                    setSubTotal(subTotal + produtosDaVenda[i].preco);
                    break;
                }
            }
        }
    }

    const removerProduto = (idProduto) => {
        if (vendaSelecionada.status == 'Finalizado') {
            console.log("Vendas finalizadas não podem ser alteradas.");
        } else {
            var listaNova = produtosDaVenda;
            var produtoRemovido = produtosDaVenda;

            listaNova = listaNova.filter(item => item.id != idProduto);
            produtoRemovido = produtoRemovido.filter(item => item.id == idProduto);

            setSubTotal(subTotal - produtoRemovido[0].total);
            setProdutosDaVenda(listaNova);
        }
    }

    const calcTotal = () => {
        let qtd = Number(document.getElementById('quantidade').value);
        let valorUnitario = Number(document.getElementById('valorUnitario').value);

        let total = qtd * valorUnitario;

        document.getElementById('valorTotal').value = total.toFixed(2);
    }

    const loadVenda = () => {
        get(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + idVenda + '').then((dataVenda) => {
            if (dataVenda.mensagem) {
                if (dataVenda.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                let venda = {
                    id: dataVenda[0].id,
                    cliente_id: dataVenda[0].cliente_id,
                    vendedor_id: dataVenda[0].vendedor_id,
                    data: dataVenda[0].data,
                    desconto: dataVenda[0].desconto,
                    valor: dataVenda[0].valor,
                    status: dataVenda[0].status,
                    observacao: dataVenda[0].observacao,
                }

                document.getElementById("observacao").value = dataVenda[0].observacao;

                setVendaSelecionada(venda);
                setSubTotal(dataVenda[0].valor)
                get(process.env.NEXT_PUBLIC_API_URL + '/clientes/' + dataVenda[0].cliente_id + '').then((dataCliente) => {

                    let cliente = {
                        id: dataCliente[0]?.id,
                        nome: dataCliente[0]?.nome,
                        telefone: dataCliente[0]?.telefone,
                        celular: dataCliente[0]?.celular,
                        email: dataCliente[0]?.email,
                        tipoPessoa: dataCliente[0]?.tipo_pessoa,
                        cnpjCpf: dataCliente[0]?.cnpj_cpf,
                        fantasia: dataCliente[0]?.fantasia,
                        observacao: dataCliente[0]?.observacao,
                        dataNascimento: dataCliente[0]?.data_nascimento
                    }
                    setClienteSelecionado(cliente);
                    document.getElementById('cliente').value = dataCliente[0]?.nome;
                })

                get(process.env.NEXT_PUBLIC_API_URL + '/produtosdasvendas/' + dataVenda[0].id + '').then((dataProdutoVenda) => {
                    for (let i = 0; i < dataProdutoVenda.length; i++) {
                        let valorTotal = dataProdutoVenda[i].valor * dataProdutoVenda[i].quantidade;

                        get(process.env.NEXT_PUBLIC_API_URL + '/estoques/' + dataProdutoVenda[i].estoque_id + '').then((dataEstoque) => {
                            let produtoVenda = {
                                id: dataProdutoVenda[i].id,
                                nome: dataEstoque[0].nome,
                                codigo: dataEstoque[0].codigo_barras,
                                qtd: dataProdutoVenda[i].quantidade,
                                preco: dataProdutoVenda[i].valor,
                                total: valorTotal,
                                cor: dataEstoque[0].cor_nome,
                                tamanho: dataEstoque[0].tamanho_nome
                            }

                            setProdutosDaVenda(old => [...old, produtoVenda]);
                        })
                    }
                })
            }
        })

        localStorage.removeItem('applojaweb_idVenda')
    }

    useEffect(() => {
        setClienteList([])
        setEstoqueCompletoList([])
        if (idVenda != null) {
            loadVenda();
        }
    }, [props.atualizar]);

    const pontoPorVirgula = (valor) => {
        let valorString;
        valorString = valor.toString().replace(".", ",");
        return valorString;
    }

    const pagar = () => {
        if (produtosDaVenda.length != 0) {
            let observacaoVenda = document.getElementById("observacao").value
            if (vendaSelecionada.id) {
                localStorage.setItem("applojaweb_venda", JSON.stringify(vendaSelecionada))
            }
            localStorage.setItem("applojaweb_venda_observacao", JSON.stringify(observacaoVenda))
            localStorage.setItem("applojaweb_cliente", JSON.stringify(clienteSelecionado))
            localStorage.setItem("applojaweb_produtosDaVenda", JSON.stringify(produtosDaVenda))
            localStorage.setItem("applojaweb_subTotal", subTotal)

            Router.push('/pdv/pagamento')
        } else {
            console.log('Adicione produtos no carrinho')
        }
    }

    const aguardar = () => {
        if (vendaSelecionada.status == 'Finalizado') {
            console.log("Vendas finalizadas não podem ser alteradas.")
            Router.reload('/pdv')
        } else {
            let clienteId = null;
            if (typeof clienteSelecionado?.id !== "undefined") {
                clienteId = clienteSelecionado.id;
            }
            let observacaoVenda = document.getElementById("observacao").value
            let data = new Date(Date.now());
            let valor = subTotal;
            let empresa_id = localStorage.getItem("applojaweb_user_empresa");

            const dataVenda = {
                clienteId: clienteId,
                transportadoraId: null,
                vendedorId: null,
                referenciaVenda: null,
                data: data,
                desconto: null,
                valor: valor,
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
                observacao: observacaoVenda,
                observacaoExterna: null,
                enderecoEntrega: null,
                modalidadeFrete: null,
                dataPostagem: null,
                codigoRastreio: null,
                empresaId: empresa_id
            }
            if (clienteId == '') {
                console.log("Selecione um cliente")
            } else {
                if (produtosDaVenda.length == 0) {
                    console.log("Selecione pelo menos 1 produto")
                } else {
                    post(process.env.NEXT_PUBLIC_API_URL + '/vendas/', dataVenda).then((res) => {
                        if (res.mensagem) {
                            if (res.mensagem == "falha na autenticação") {
                                console.log('falha na autenticação');

                                localStorage.removeItem("applojaweb_token");
                                Router.push('/login');
                            }
                        } else {
                            if (res.message == undefined) {
                                console.log('salvou venda')
                                // Produtos da venda
                                for (let i = 0; i < produtosDaVenda.length; i++) {
                                    const dataProdutoDaVenda = {
                                        vendaId: res.insertId,
                                        estoqueId: produtosDaVenda[i].id,
                                        valor: produtosDaVenda[i].preco,
                                        quantidade: produtosDaVenda[i].qtd,
                                        empresaId: empresa_id
                                    }
                                    post(process.env.NEXT_PUBLIC_API_URL + '/produtosdasvendas/', dataProdutoDaVenda).then((res) => {
                                        if (res.message == undefined) {
                                            console.log('salvou produto da venda')

                                            limparTela();
                                        } else {
                                            console.log(res.message)
                                        }
                                    })
                                }
                            } else {
                                console.log(res.message);
                            }
                        }
                    })
                }
            }
        }
    }

    const cancelar = () => {
        setLoadingCancelar(true);
        if (vendaSelecionada.status == 'Finalizado') {
            get(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + vendaSelecionada.id + '').then((res) => {
                console.log(res[0].cliente_id)

                const dataVenda = {
                    clienteId: res[0].cliente_id,
                    transportadoraId: res[0].transportadora_id,
                    vendedorId: res[0].vendedor_id,
                    referenciaVenda: res[0].referencia_venda,
                    data: res[0].data,
                    desconto: res[0].desconto,
                    valor: res[0].valor,
                    prazoEntrega: res[0].prazo_entrega,
                    valorFrete: res[0].valor_frete,
                    valorBaseSt: res[0].valor_base_st,
                    valorSt: res[0].valor_st,
                    status: 'Cancelado',
                    valorIpi: res[0].valor_ipi,
                    pesoTotalNota: res[0].peso_total_nota,
                    pesoTotalNotaLiq: res[0].peso_total_nota_liq,
                    origemVenda: res[0].origem_venda,
                    dataEntrega: res[0].data_entrega,
                    observacaoInterna: res[0].observacao_interna,
                    observacao: res[0].observacao,
                    observacaoExterna: res[0].observacao_externa,
                    enderecoEntrega: res[0].endereco_entrega,
                    modalidadeFrete: res[0].modalidade_frete,
                    dataPostagem: res[0].data_postagem,
                    codigoRastreio: res[0].codigo_rastreio,
                    empresaId: res[0].empresa_id
                }

                put(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + vendaSelecionada.id + '', dataVenda).then((res) => {
                    console.log(res)
                    get(process.env.NEXT_PUBLIC_API_URL + '/produtosdasvendas/' + vendaSelecionada.id + '').then((res) => {
                        res.forEach((produtoDaVenda) => {
                            console.log(produtoDaVenda.quantidade)
                            get(process.env.NEXT_PUBLIC_API_URL + '/estoques/' + produtoDaVenda.estoque_id + '').then((res) => {

                                let quantidadeNova = res[0].quantidade + produtoDaVenda.quantidade;
                                let dataEstoque = {
                                    variacaoProdutoId: res[0].variacao_produto_id,
                                    validade: res[0].validade,
                                    localizacao: res[0].localizacao,
                                    quantidade: quantidadeNova,
                                    quantidadeMin: res[0].quantidade_min,
                                    quantidadeMax: res[0].quantidade_max
                                }
                                put(process.env.NEXT_PUBLIC_API_URL + '/estoques/' + produtoDaVenda.estoque_id + '', dataEstoque).then((res) => {
                                    console.log(res)
                                    closePopUpCancelar();
                                    limparTela();
                                    setLoadingCancelar(false);
                                    alert("Venda Cancelada");
                                })
                            })
                        })
                    })
                })
            })
        } else {
            if (vendaSelecionada.id != null) {
                remove(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + vendaSelecionada.id + '').then((res) => {
                    if (res.mensagem) {
                        if (res.mensagem == "falha na autenticação") {
                            console.log('falha na autenticação');

                            localStorage.removeItem("applojaweb_token");
                            Router.push('/login');
                        }
                    } else {
                        console.log("Venda cancelada com sucesso!")
                    }
                });
                setLoadingCancelar(false);
                closePopUpCancelar();
                limparTela();
            } else {
                setLoadingCancelar(false);
                closePopUpCancelar();
                limparTela();
            }
        }
    }

    const limparTela = () => {
        document.getElementById('produto').value = '';
        document.getElementById('quantidade').value = '';
        document.getElementById('valorUnitario').value = '';
        document.getElementById('valorTotal').value = '';
        document.getElementById('observacao').value = '';
        document.getElementById('vendedor').value = '';
        document.getElementById('cliente').value = '';

        setProdutosDaVenda([]);
        setSubTotal(0)
    }

    const buscarCliente = () => {
        let nomeCliente = document.getElementById('cliente').value;
        setClienteList([]);
        setHiddenAutoCompleteCliente('absolute');

        if (nomeCliente != "") {
            get(process.env.NEXT_PUBLIC_API_URL + '/clientenome/' + nomeCliente + '').then((data) => {
                if (data.mensagem) {
                    if (data.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {
                    for (let i = 0; i < data.length; i++) {
                        let cliente = {
                            id: data[i].id,
                            nome: data[i].nome,
                            telefone: data[i].telefone,
                            celular: data[i].celular,
                            email: data[i].email,
                            tipoPessoa: data[i].tipo_pessoa,
                            cnpjCpf: data[i].cnpj_cpf,
                            fantasia: data[i].fantasia,
                            observacao: data[i].observacao,
                            dataNascimento: data[i].data_nascimento
                        }

                        setClienteList(old => [...old, cliente]);
                    }
                }
            })
        } else {
            setHiddenAutoCompleteCliente('hidden');
        }
    }

    const selecionarCliente = (cliente) => {
        setClienteSelecionado(cliente);
        document.getElementById('cliente').value = cliente.nome;
        setHiddenAutoCompleteCliente('hidden');
    }

    const timeoutCliente = () => {
        clearTimeout(intervalCliente);
        setIntervalCliente(setTimeout(buscarCliente, 1000));
    }

    const buscarProduto = () => {
        let pesquisaProduto = document.getElementById('produto').value;
        setEstoqueCompletoList([]);
        setHiddenAutoCompleteProduto('absolute');

        if (pesquisaProduto != "") {
            get(process.env.NEXT_PUBLIC_API_URL + '/estoquenomecodigo/' + pesquisaProduto + '').then((dataEstoque) => {
                if (dataEstoque.mensagem) {
                    if (dataEstoque.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {
                    for (let i = 0; i < dataEstoque.length; i++) {

                        let estoque = {
                            estoque_id: dataEstoque[i].estoque_id,
                            quantidade: dataEstoque[i].quantidade,
                            cor_id: dataEstoque[i].cor_id,
                            cor_nome: dataEstoque[i].cor_nome,
                            tamanho_id: dataEstoque[i].tamanho_id,
                            tamanho_nome: dataEstoque[i].tamanho_nome,
                            codigo_barras: dataEstoque[i].codigo_barras,
                            valor: dataEstoque[i].valor,
                            nome: dataEstoque[i].nome,
                            localizacao: dataEstoque[i].localizacao,
                            ncm: dataEstoque[i].ncm,
                            classeImposto: dataEstoque[i].classe_imposto
                        }

                        setEstoqueCompletoList(old => [...old, estoque]);
                        setHiddenLoadingProduto("hidden");
                    }

                }
            })
        } else {
            setHiddenAutoCompleteProduto('hidden');
            setHiddenLoadingProduto("hidden");
        }
    }

    useEffect(() => {
        if (estoqueCompletoList.length == 1) {
            selecionarProduto(estoqueCompletoList[0]);
            document.getElementById('quantidade').value = 1;
            calcTotal();
        }
    }, [estoqueCompletoList])

    useEffect(() => {
        if (estoqueCompletoList.length == 1) {
            incluirProduto();
        }
    }, [produtoSelecionado])

    const selecionarProduto = (produto) => {
        setProdutoSelecionado(produto);
        document.getElementById('produto').value = produto.nome;
        document.getElementById('valorUnitario').value = produto?.valor?.toFixed(2);
        document.getElementById('quantidade').value = 1;
        calcTotal();
        setHiddenAutoCompleteProduto('hidden');
    }

    const timeoutProduto = () => {
        setHiddenLoadingProduto("absolute");
        clearTimeout(intervalProduto);
        setIntervalProduto(setTimeout(buscarProduto, 1000));
    }

    return (
        <div className="px-5">
            <div onClick={() => { setHiddenAutoCompleteProduto('hidden'); setHiddenAutoCompleteCliente('hidden'); }} className="flex flex-col bg-gray-200 w-full p-4 mb-4 rounded md:flex-row">
                <div className="p-4 flex flex-col justify-between md:w-1/3">
                    <div>
                        <div className="relative mb-2">
                            <label className="block mb-2 text-sm font-medium text-black">Produto</label>
                            <div className="flex w-full gap-4">
                                <div className="relative flex w-full">
                                    <input onChange={timeoutProduto} id='produto' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                                    <div className={hiddenLoadingProduto + ' top-0 right-0 z-10 mt-1'}>
                                        <svg className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                <button onClick={() => setCloseProdutcModal('')} type="button" className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700">Novo</button>
                            </div>
                            <div className={hiddenAutoCompleteProduto + " bg-white w-full h-80 z-50 mt-1 rounded-lg border border-gray-500 overflow-auto"}>
                                <ul>
                                    {estoqueCompletoList.map((item, key) => (
                                        <li key={key} onClick={() => { selecionarProduto(item) }} className="p-2 hover:bg-gray-200 hover:cursor-pointer">{item.codigo_barras + " - " + item.nome + " - " + item.cor_nome + " - " + item.tamanho_nome + " - " + item.localizacao}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mb-2 md:flex-row">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-black">Quantidade</label>
                                <input onChange={calcTotal} id='quantidade' type="number" min="0" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-black">Valor unitário</label>
                                <input onChange={calcTotal} id='valorUnitario' type="number" min="0" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-black">Valor total</label>
                                <input id='valorTotal' type="number" min="0" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                            </div>
                        </div>
                        <div className="mb-2">
                            <button onClick={incluirProduto} className="bg-applojaLight hover:bg-applojaLight2 text-white font-bold py-2 px-4 w-full rounded">
                                Incluir
                            </button>
                        </div>
                        <div className="mb-2">
                            <label className="block mb-2 text-sm font-medium text-black">Observações</label>
                            <textarea id='observacao' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                        </div>
                    </div>
                    <div className=" hidden bg-blue-400 flex-col gap-4 rounded p-4 md:flex-row">
                        <div className="flex flex-col gap-2 w-1/2">
                            <span className="text-white">Operador</span>
                            <span className="text-white">Administrador</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-white">Pedidos em Aberto</span>
                            <div className="flex flex-row gap-2">
                                <label className="text-white">Vendedor</label>
                                <select id="vendedor">
                                    <option></option>
                                    <option>teste 1</option>
                                    <option>teste 2</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                    <div className="relative mb-2 w-full">
                        <label className="block mb-2 text-sm font-medium text-black">Cliente</label>
                        <input onChange={timeoutCliente} id='cliente' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                        <div className={hiddenAutoCompleteCliente + " bg-white w-full h-80 z-50 mt-1 rounded-lg border border-gray-500 overflow-auto"}>
                            <ul className="">
                                {clienteList.map((item, key) => (
                                    <li key={key} onClick={() => { selecionarCliente(item) }} className="p-2 hover:bg-gray-200 hover:cursor-pointer">{item.nome}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mb-2 w-full">
                        <div className="w-full h-96 2xl:h-128 overflow-auto bg-applojaLight2 rounded">
                            <table className="w-full text-sm text-left text-gray-400 ">
                                <thead className="sticky top-0 text-xs uppercase bg-applojaDark2 text-white">
                                    <tr>
                                        <th scope="col" className="py-3 px-6 w-2/4">
                                            Produto
                                        </th>
                                        <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                            Código
                                        </th>
                                        <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                            Cor
                                        </th>
                                        <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                            Tamanho
                                        </th>
                                        <th scope="col" className="hidden py-3 px-6 sm:table-cell md:flex md:justify-center">
                                            Qtd.
                                        </th>
                                        <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                            Preço
                                        </th>
                                        <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                            Total
                                        </th>
                                        <th scope="col" className="py-3 px-6">

                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtosDaVenda.map((item, key) => (
                                        <tr key={key} className="border-b bg-applojaDark border-gray-700 text-white">
                                            <th scope="row" className="py-4 px-6 font-medium">
                                                {item.nome}
                                            </th>
                                            <td className="hidden py-4 px-6 sm:table-cell">
                                                {item.codigo}
                                            </td>
                                            <td className="hidden py-4 px-6 sm:table-cell">
                                                {item.cor}
                                            </td>
                                            <td className="hidden py-4 px-6 sm:table-cell">
                                                {item.tamanho}
                                            </td>
                                            <td className="hidden py-4 px-6 sm:table-cell md:flex md:justify-center">
                                                <div className="flex flex-row justify-center items-center gap-2">
                                                    <div onClick={() => removerQtdProduto(item)} className="font-bold text-red-600 hover:cursor-pointer text-base">-</div>
                                                    <div className="font-bold text-white">{item.qtd}</div>
                                                    <div onClick={() => adicionarQtdProduto(item)} className="font-bold text-green-600 hover:cursor-pointer text-base">+</div>
                                                </div>
                                            </td>
                                            <td className="hidden py-4 px-6 sm:table-cell">
                                                {pontoPorVirgula(item.preco.toFixed(2))}
                                            </td>
                                            <td className="hidden py-4 px-6 sm:table-cell">
                                                {pontoPorVirgula(item.total.toFixed(2))}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button onClick={() => removerProduto(item.id)} className="cursor-pointer">
                                                    <BsFillTrashFill />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mb-2 w-full flex flex-col gap-4">
                        <div className="bg-applojaLight h-12 flex items-center p-4 rounded justify-between">
                            <span className="text-white font-bold">SUBTOTAL</span>
                            <span className="text-white font-bold">R$ {pontoPorVirgula(subTotal.toFixed(2))}</span>
                        </div>
                        <div className="flex flex-col justify-end gap-6 md:flex-row md:gap-4">
                            <div className="flex justify-between gap-4">
                                <button className="hidden flex-1 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded">Crediário</button>
                                <button onClick={closePopUpCancelar} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                            </div>
                            <div className="flex justify-between gap-4">
                                <button onClick={aguardar} className="flex-1 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Aguardar</button>
                                <button onClick={pagar} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Pagamento</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* POPUP CANCELAR */}
                <div id="popup-modal" className={"fixed right-1 left-1 md:top-0 md:left-0 md:right-0 z-50 p-4 " + hiddenPopUpCancelar + " overflow-x-hidden overflow-y-auto md:inset-0 md:h-full"}>
                    <div className="relative md:left-1/2 md:top-1/3 w-full h-full max-w-md md:h-auto">
                        <div className="relative rounded-lg shadow bg-applojaDark">
                            <button onClick={closePopUpCancelar} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-applojaDark2 hover:text-white" data-modal-hide="popup-modal">
                                <div className="flex w-5 h-5">
                                    <BsX className="text-2xl" />
                                </div>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-center">
                                <div className="mt-6 mx-auto mb-4 text-white w-14 h-14">
                                    <BsFillExclamationCircleFill size={60} />
                                </div>
                                <h3 className="mb-5 text-lg font-normal text-white">Tem certeza que deseja cancelar essa venda?</h3>
                                {loadingCancelar ?
                                    <button type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                        Aguarde...
                                    </button> :
                                    <button onClick={cancelar} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                        Sim, Eu quero
                                    </button>
                                }
                                <button onClick={closePopUpCancelar} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-applojaDark border-applojaLight2 text-white hover:bg-applojaLight">Não</button>
                            </div>
                        </div>
                    </div>
                </div>
                <FastProductModal closeProdutcModal={closeProdutcModal} setCloseProdutcModal={setCloseProdutcModal} />
            </div>
        </div>
    )
}