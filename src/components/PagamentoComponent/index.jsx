import Link from "next/link";
import { useEffect, useState } from "react"
import { BsFillExclamationCircleFill, BsReceiptCutoff, BsX, BsFillTrashFill } from 'react-icons/bs';
import { get, post, put, remove } from "../../services/api";
import Router from "next/router";
import InputMask from "react-input-mask";

export const PagamentoComponent = (props) => {
    var jsonVenda = typeof window !== 'undefined' ? localStorage.getItem('applojaweb_venda') : null;
    var jsonProdutosDaVenda = typeof window !== 'undefined' ? localStorage.getItem('applojaweb_produtosDaVenda') : null;
    var jsonCliente = typeof window !== 'undefined' ? localStorage.getItem('applojaweb_cliente') : null;
    var jsonSubTotal = typeof window !== 'undefined' ? localStorage.getItem('applojaweb_subTotal') : null;

    const [produtosDaVenda, setProdutosDaVenda] = useState(JSON.parse(jsonProdutosDaVenda));
    const [cliente, setCliente] = useState();
    const [minhaEmpresa, setMinhaEmpresa] = useState();
    const [venda, setVenda] = useState(JSON.parse(jsonVenda));
    const [subTotal, setSubTotal] = useState(parseFloat(jsonSubTotal));
    const [formasPagamentoList, setFormasPagamentoList] = useState([]);
    const [hiddenPopUpCancelar, setHiddenPopUpCancelar] = useState('hidden');
    const [hiddenPopUpFinalizar, setHiddenPopUpFinalizar] = useState('hidden');
    const [hiddenPopUpRecibo, setHiddenPopUpRecibo] = useState('hidden');
    const [hiddenPopUpNotaFiscal, setHiddenPopUpNotaFiscal] = useState('hidden');
    const [hiddenPopUpCpfNaNotaFiscal, setHiddenPopUpCpfNaNotaFiscal] = useState('hidden');
    const [formasPagamento, setFormasPagamento] = useState(null);
    const [loadingCancelar, setLoadingCancelar] = useState(false);
    const [cpfNaNotaFiscal, setCpfNaNotaFiscal] = useState(null);
    const [loadingEmitirNotaFiscal, setLoadingEmitirNotaFiscal] = useState(false);
    let modeloRecibo = "";

    let total = parseFloat(jsonSubTotal);

    const closePopUpCancelar = () => {
        if (hiddenPopUpCancelar == 'hidden') {
            setHiddenPopUpCancelar('')
        } else {
            setHiddenPopUpCancelar('hidden')
        }
    }

    const closePopUpNotaFiscal = () => {
        if (hiddenPopUpNotaFiscal == 'hidden') {
            setHiddenPopUpNotaFiscal('')
        } else {
            setHiddenPopUpNotaFiscal('hidden')
        }
    }

    const closePopUpCpfNaNotaFiscal = () => {
        if (hiddenPopUpCpfNaNotaFiscal == 'hidden') {
            setHiddenPopUpCpfNaNotaFiscal('')
        } else {
            setHiddenPopUpCpfNaNotaFiscal('hidden')
        }
    }

    const closePopUpFinalizar = () => {
        if (venda) {
            if (venda.status == 'Finalizado') {
                //venda finalizada
                alert("Essa venda já está finalizada")
            } else {
                // venda aguardando
                if (subTotal > 0) {
                    alert('falta pagar: R$' + subTotal.toFixed(2) + '')
                } else {
                    if (hiddenPopUpFinalizar == 'hidden') {
                        setHiddenPopUpFinalizar('')
                    } else {
                        setHiddenPopUpFinalizar('hidden')
                    }
                }
            }
        } else {
            if (subTotal > 0) {
                alert('falta pagar: R$' + subTotal.toFixed(2) + '')
            } else {
                if (hiddenPopUpFinalizar == 'hidden') {
                    setHiddenPopUpFinalizar('')
                } else {
                    setHiddenPopUpFinalizar('hidden')
                }
            }
        }
    }

    const closePopUpRecibo = () => {
        if (hiddenPopUpRecibo == 'hidden') {
            setHiddenPopUpRecibo('')
        } else {
            setHiddenPopUpRecibo('hidden')
        }
    }

    useEffect(() => {
        if (venda) {
            if (venda.status == 'Finalizado') {
                loadFormaPagamento();
            }
        }

        localStorage.removeItem('applojaweb_venda');
        localStorage.removeItem('applojaweb_produtosDaVenda');
        localStorage.removeItem('applojaweb_cliente');

        if (jsonCliente != "undefined") {
            setCliente(JSON.parse(jsonCliente))
            document.getElementById('nomeCliente').value = JSON.parse(jsonCliente).nome;
        } else {
            setCliente(null)
            document.getElementById('nomeCliente').value = "";
        }

    }, [props.atualizar]);

    useEffect(() => {
        document.getElementById('parcelas').value = 1
        get(process.env.NEXT_PUBLIC_API_URL + '/formasPagamento').then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');
                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setFormasPagamento(res);
            }
        });

        get(process.env.NEXT_PUBLIC_API_URL + '/minhaempresa').then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');
                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                console.log("minha empresa: ", res)
                setMinhaEmpresa(res);
            }
        });

    }, []);

    const loadFormaPagamento = () => {

        get(process.env.NEXT_PUBLIC_API_URL + '/contareceberbyvenda/' + venda.id + '').then((resContaReceber) => {
            if (resContaReceber.length > 0) {
                let idContaReceber = resContaReceber[0].id
                get(process.env.NEXT_PUBLIC_API_URL + '/pagamentorecebidobycontareceber/' + idContaReceber + '').then((dataPagamentoRecebido) => {
                    dataPagamentoRecebido.forEach(pagamentoRecebido => {
                        const formaPagamento = {
                            formaPagamentoId: pagamentoRecebido.formas_pagamento_id,
                            formaPagamentoNome: pagamentoRecebido.forma_nome,
                            parcelas: pagamentoRecebido.parcelas,
                            valorRecebido: pagamentoRecebido.valor_pago
                        }

                        setFormasPagamentoList(old => [...old, formaPagamento])
                    })
                })
            } else {
                get(process.env.NEXT_PUBLIC_API_URL + '/formapagamentos/' + venda.id + '').then((dataFormaPagamento) => {
                    if (dataFormaPagamento.mensagem) {
                        if (dataFormaPagamento.mensagem == "falha na autenticação") {
                            console.log('falha na autenticação');

                            localStorage.removeItem("applojaweb_token");
                            Router.push('/login');
                        }
                    } else {
                        if (dataFormaPagamento[0].dinheiro != 0) {
                            let dinheiro = {
                                formaPagamentoNome: 'Dinheiro',
                                parcelas: 1,
                                valorRecebido: dataFormaPagamento[0].dinheiro
                            }

                            setFormasPagamentoList(old => [...old, dinheiro])
                        }
                        if (dataFormaPagamento[0].debito != 0) {
                            let debito = {
                                formaPagamentoNome: 'Debito',
                                parcelas: 1,
                                valorRecebido: dataFormaPagamento[0].debito
                            }

                            setFormasPagamentoList(old => [...old, debito])
                        }
                        if (dataFormaPagamento[0].credito != 0) {
                            let credito = {
                                formaPagamentoNome: 'Credito',
                                parcelas: dataFormaPagamento[0].parcela_credito,
                                valorRecebido: dataFormaPagamento[0].credito
                            }

                            setFormasPagamentoList(old => [...old, credito])
                        }
                    }
                })
            }
        })
    }

    const incluirFormaPagamento = () => {
        if (venda) {
            if (venda.status == 'Finalizado') {
                alert("Vendas finalizadas não podem ser Alteradas.")
            } else {
                let formaPagamentoId = document.getElementById('formaPagamentoNome').value;
                let parcelas = Number(document.getElementById('parcelas').value);
                let valorRecebido = Number(document.getElementById('valorRecebido').value);

                if (formaPagamentoId != '') {
                    get(process.env.NEXT_PUBLIC_API_URL + '/formaspagamento/' + formaPagamentoId + '').then((res) => {

                        let formaPagamento = {
                            formaPagamentoId: formaPagamentoId,
                            formaPagamentoNome: res[0].nome,
                            parcelas: parcelas,
                            valorRecebido: valorRecebido
                        }

                        if (valorRecebido != '' && parcelas != "") {
                            setFormasPagamentoList(old => [...old, formaPagamento])
                        } else {
                            alert("Coloque a quantidade de parcelas e o valor");
                        }
                    })
                }
            }
        } else {
            let formaPagamentoId = document.getElementById('formaPagamentoNome').value;
            let parcelas = Number(document.getElementById('parcelas').value);
            let valorRecebido = Number(document.getElementById('valorRecebido').value);

            if (formaPagamentoId != '') {
                get(process.env.NEXT_PUBLIC_API_URL + '/formaspagamento/' + formaPagamentoId + '').then((res) => {

                    let formaPagamento = {
                        formaPagamentoId: formaPagamentoId,
                        formaPagamentoNome: res[0].nome,
                        parcelas: parcelas,
                        valorRecebido: valorRecebido
                    }

                    if (valorRecebido != '' && parcelas != "") {
                        setFormasPagamentoList(old => [...old, formaPagamento])
                    } else {
                        alert("Coloque a quantidade de parcelas e o valor");
                    }
                })
            }
        }
    }

    useEffect(() => {
        calcTotal();

        if (formasPagamentoList.length != 0) {
            document.getElementById('descontoReal').disabled = true;
            document.getElementById('acrescimo').disabled = true;
            document.getElementById('taxaEntrega').disabled = true;
        } else {
            document.getElementById('descontoReal').disabled = false;
            document.getElementById('acrescimo').disabled = false;
            document.getElementById('taxaEntrega').disabled = false;
        }
    }, [formasPagamentoList]);

    const calcTotal = () => {
        let desconto = Number(document.getElementById('descontoReal').value);
        let acrescimo = Number(document.getElementById('acrescimo').value);
        let taxaEntrega = Number(document.getElementById('taxaEntrega').value);
        let totalRecebido = 0;

        for (let i = 0; i < formasPagamentoList.length; i++) {
            totalRecebido = totalRecebido + formasPagamentoList[i].valorRecebido;
        }
        setSubTotal((total - desconto - totalRecebido) + acrescimo + taxaEntrega);
    }

    const listarFormasPagamento = () => {
        if (formasPagamentoList) {
            return formasPagamentoList.map((item, key) => (
                <tr key={key} className="border-b bg-applojaDark border-gray-700 text-white">
                    <td scope="row" className="py-4 px-6 font-medium whitespace-nowrap">
                        {item.formaPagamentoNome}
                    </td>
                    <td className="hidden py-4 px-6 sm:table-cell">
                        {item.parcelas}
                    </td>
                    <td className="hidden py-4 px-6 w-1/3 sm:table-cell">
                        R$ {pontoPorVirgula(item.valorRecebido.toFixed(2))}
                    </td>
                    <td className="py-4 px-6">
                        <button onClick={() => removerFormaPagamento(item.formaPagamentoNome)} className="cursor-pointer">
                            <BsFillTrashFill />
                        </button>
                    </td>
                </tr>
            ))
        }
    }

    const removerFormaPagamento = (formaPagamentoNome) => {
        if (venda) {
            if (venda.status == 'Finalizado') {
                alert("Vendas finalizadas não podem ser alteradas.");
            } else {
                var listaNova = formasPagamentoList;

                listaNova = listaNova.filter(item => item.formaPagamentoNome != formaPagamentoNome);

                calcTotal();
                setFormasPagamentoList(listaNova);
            }
        } else {
            var listaNova = formasPagamentoList;

            listaNova = listaNova.filter(item => item.formaPagamentoNome != formaPagamentoNome);

            calcTotal();
            setFormasPagamentoList(listaNova);
        }
    }

    const listarProdutosVenda = () => {
        if (produtosDaVenda) {
            return produtosDaVenda.map((item, key) => (
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
                    <td className="hidden py-4 px-6 sm:table-cell">
                        {item.qtd}
                    </td>
                    <td className="hidden py-4 px-6 sm:table-cell">
                        {pontoPorVirgula(item.preco.toFixed(2))}
                    </td>
                    <td className="hidden py-4 px-6 sm:table-cell">
                        {pontoPorVirgula(item.total.toFixed(2))}
                    </td>
                </tr>
            ))
        }
    }

    const finalizarVenda = () => {
        let empresa_id = localStorage.getItem("applojaweb_user_empresa");
        let observacaoVenda = localStorage.getItem("applojaweb_venda_observacao");

        if (venda) {
            if (venda.status == 'Finalizado') {
                //venda finalizada
                alert("Vendas finalizadas não podem ser canceladas.")
            } else {
                // venda aguardando
                let clienteId = null;
                if (cliente != null) {
                    clienteId = cliente.id;
                }
                let data = new Date(Date.now());
                let desconto = Number(document.getElementById('descontoReal').value);
                let valor = total;
                let valorFrete = Number(document.getElementById('taxaEntrega').value);

                const dataVenda = {
                    clienteId: clienteId,
                    transportadoraId: null,
                    vendedorId: null,
                    referenciaVenda: null,
                    data: data,
                    desconto: desconto,
                    valor: valor,
                    prazoEntrega: null,
                    valorFrete: valorFrete,
                    valorBaseSt: null,
                    valorSt: null,
                    status: "Finalizado",
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

                put(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + venda.id + '', dataVenda).then((res) => {
                    if (res.mensagem) {
                        if (res.mensagem == "falha na autenticação") {
                            console.log('falha na autenticação');

                            localStorage.removeItem("applojaweb_token");
                            Router.push('/login');
                        }
                    } else {
                        //setVendaId(res.insertId);
                        alert('Venda Alterada')

                        localStorage.removeItem('applojaweb_cliente');
                        localStorage.removeItem('applojaweb_produtosDaVenda');
                        localStorage.removeItem('applojaweb_subTotal');
                        localStorage.removeItem('applojaweb_venda')

                        Router.push('/pdv');
                    }
                })
            }
        } else {
            //venda não existe
            let clienteId = null;
            if (cliente != null) {
                clienteId = cliente.id;
            }
            let data = new Date(Date.now());
            let desconto = Number(document.getElementById('descontoReal').value);
            let valor = total;
            let valorFrete = Number(document.getElementById('taxaEntrega').value);

            const dataVenda = {
                clienteId: clienteId,
                transportadoraId: null,
                vendedorId: null,
                referenciaVenda: null,
                data: data,
                desconto: desconto,
                valor: valor,
                prazoEntrega: null,
                valorFrete: valorFrete,
                valorBaseSt: null,
                valorSt: null,
                status: "Finalizado",
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

            post(process.env.NEXT_PUBLIC_API_URL + '/vendas/', dataVenda).then((res) => {
                if (res.mensagem) {
                    if (res.mensagem == "falha na autenticação") {
                        console.log('falha na autenticação');

                        localStorage.removeItem("applojaweb_token");
                        Router.push('/login');
                    }
                } else {
                    if (res.message == undefined) {
                        let idVendaCriada = res.insertId;
                        alert('salvou venda');
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
                                } else {
                                    console.log(res.message)
                                }
                            })

                            get(process.env.NEXT_PUBLIC_API_URL + '/estoques/' + produtosDaVenda[i].id).then((res) => {
                                let resultQtde = res[0].quantidade - produtosDaVenda[i].qtd;

                                let dataEstoque = {
                                    variacaoProdutoId: res[0].variacao_produto_id,
                                    validade: res[0].validade,
                                    localizacao: res[0].localizacao,
                                    quantidade: resultQtde,
                                    quantidadeMin: res[0].quantidade_min,
                                    quantidadeMax: res[0].quantidade_max,
                                    empresaId: empresa_id
                                }

                                put(process.env.NEXT_PUBLIC_API_URL + '/estoques/' + produtosDaVenda[i].id, dataEstoque).then((res) => {
                                })
                            })
                        }

                        // Cria uma conta a receber para esta venda
                        const dataContaReceber = {
                            vendaId: res.insertId,
                            clienteId: clienteId,
                            valor: valor,
                            dataVencimento: data,
                            tipo: 'Venda',
                            categoriaConta: null
                        }
                        post(process.env.NEXT_PUBLIC_API_URL + '/contareceber', dataContaReceber).then((resContaReceber) => {
                            if (resContaReceber.message == undefined) {
                                console.log('Conta a receber criada com sucesso')
                                // Forma de pagamento
                                // código existente...
                                formasPagamentoList.forEach(formaPagamento => {
                                    const dataPagamentoRecebido = {
                                        valorPago: formaPagamento.valorRecebido,
                                        dataPagamento: data,
                                        contaReceberId: resContaReceber.insertId,
                                        formasPagamentoId: Number(formaPagamento.formaPagamentoId),
                                        parcelas: Number(formaPagamento.parcelas)
                                    }
                                    post(process.env.NEXT_PUBLIC_API_URL + '/pagamentorecebido', dataPagamentoRecebido).then((resPagamentoRecebido) => {
                                        if (resPagamentoRecebido.message == undefined) {
                                            console.log('Pagamento recebido registrado com sucesso')
                                            console.log("modelo recibo: ", modeloRecibo)
                                            if (modeloRecibo == "A4") {
                                                console.log("A4");
                                                window.open("/recibo/a4?pedido=" + idVendaCriada + "", "_blank");
                                                if (minhaEmpresa[0].plano_id == 4) {
                                                    closePopUpNotaFiscal();
                                                } else {
                                                    Router.push('/pdv');
                                                }
                                            } else if (modeloRecibo == "58mm") {
                                                console.log("58mm");
                                                window.open("/recibo/58mm?pedido=" + idVendaCriada + "", "_blank");
                                                if (minhaEmpresa[0].plano_id == 4) {
                                                    closePopUpNotaFiscal();
                                                } else {
                                                    Router.push('/pdv');
                                                }
                                            } else if (modeloRecibo == "80mm") {
                                                console.log("80mm");
                                                window.open("/recibo/80mm?pedido=" + idVendaCriada + "", "_blank");
                                                if (minhaEmpresa[0].plano_id == 4) {
                                                    closePopUpNotaFiscal();
                                                } else {
                                                    Router.push('/pdv');
                                                }
                                            } else {
                                                console.log("não A4");
                                                if (minhaEmpresa[0].plano_id == 4) {
                                                    closePopUpNotaFiscal();
                                                } else {
                                                    Router.push('/pdv');
                                                }
                                            }
                                        } else {
                                            console.log(resPagamentoRecebido.message)
                                        }
                                    });
                                });
                            } else {
                                console.log(resContaReceber.message)
                            }
                        });
                    } else {
                        alert(res.message);
                    }
                }
            })
        }
        closePopUpFinalizar();
        closePopUpRecibo();
    }

    const mostrarRecibo = (modelo) => {
        console.log("modeloRecibo: ", modeloRecibo)
        console.log("modelo: ", modelo)
        modeloRecibo = modelo;
        console.log("modeloRecibo: ", modeloRecibo)

        finalizarVenda()
    }

    const cancelar = () => {
        setLoadingCancelar(true);
        if (venda) {
            if (venda.status == 'Finalizado') {
                get(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + venda.id + '').then((res) => {

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

                    put(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + venda.id + '', dataVenda).then((res) => {
                        get(process.env.NEXT_PUBLIC_API_URL + '/produtosdasvendas/' + venda.id + '').then((res) => {
                            res.forEach((produtoDaVenda) => {
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
                                        closePopUpCancelar();
                                        alert("Venda Cancelada");
                                        setLoadingCancelar(false);
                                        Router.push("/pdv")
                                    })
                                })
                            })
                        })
                    })
                })
            } else {
                if (venda.id != null) {
                    remove(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + venda.id + '').then(() => {
                        if (res.mensagem) {
                            if (res.mensagem == "falha na autenticação") {
                                console.log('falha na autenticação');

                                localStorage.removeItem("applojaweb_token");
                                Router.push('/login');
                            }
                        } else {
                            alert("Venda cancelada com sucesso!")
                        }
                    });

                    closePopUpCancelar();
                    localStorage.removeItem('applojaweb_cliente');
                    localStorage.removeItem('applojaweb_produtosDaVenda');
                    localStorage.removeItem('applojaweb_subTotal');
                    localStorage.removeItem('applojaweb_venda');
                    setLoadingCancelar(false);
                    Router.push('/pdv');
                } else {
                    closePopUpCancelar();
                    localStorage.removeItem('applojaweb_cliente');
                    localStorage.removeItem('applojaweb_produtosDaVenda');
                    localStorage.removeItem('applojaweb_subTotal');
                    localStorage.removeItem('applojaweb_venda');
                    setLoadingCancelar(false);
                    Router.push('/pdv');
                }
            }
        } else {
            closePopUpCancelar();
            localStorage.removeItem('applojaweb_cliente');
            localStorage.removeItem('applojaweb_produtosDaVenda');
            localStorage.removeItem('applojaweb_subTotal');
            setLoadingCancelar(false);
            Router.push('/pdv');
        }
    }

    const pontoPorVirgula = (valor) => {
        let valorString;
        valorString = valor.toString().replace(".", ",");
        return valorString;
    }

    const verificarParcelaDinheiro = () => {
        let parcela = Number(document.getElementById('parcelas').value);
        let formaPagamentoNome = document.getElementById('formaPagamentoNome').value;

        if (formaPagamentoNome == '1' || formaPagamentoNome == '2') {
            if (parcela < 1) {
                document.getElementById('parcelas').value = 1
            };
            if (parcela > 1) {
                document.getElementById('parcelas').value = 1
            };
        }
    }

    const emitirNotaFiscal = () => {

        setLoadingEmitirNotaFiscal(true);

        let jsonNF = {
            operacao: 1,
            natureza_operacao: "Venda PDV",
            modelo: "2",
            finalidade: 1,
            cliente: {
                cpf: cpfNaNotaFiscal,
                nome_completo: null,
                endereco: null,
                complemento: null,
                numero: null,
                bairro: null,
                cidade: null,
                uf: null,
                cep: null,
                telefone: null,
                email: null
            },
            produtos: produtosDaVenda.map(produto => ({
                nome: produto.nome,
                codigo: produto.codigo || null,
                ncm: produto.ncm,
                cest: produto.cest || null,
                quantidade: Number(produto.qtd),
                unidade: "UN",
                peso: produto.peso || null,
                origem: 0,
                subtotal: produto.preco,
                total: produto.preco,
                classe_imposto: produto.classeImposto || minhaEmpresa[0].classe_imposto_padrao
            })),
            pedido: {
                pagamento: 0,
                presenca: 1,
                modalidade_frete: 9,
                frete: null,
                desconto: null,
                total: total,
            }
        }

        post(process.env.NEXT_PUBLIC_API_URL + '/nfe', jsonNF).then((res) => {
            console.log(res);
            if (res && res.idNfe) {
                alert("Nota Fiscal Emitida com Sucesso!");
                window.open(res.responseApi.danfe, "_blank");
                Router.push('/pdv');
            } else if (res && res.message == "Erro na comunicação com a Webmania" && res.details && res.details.error) {
                alert(res.details.error)
                Router.push('/pdv');
            } else if (res && res.message == "Erro na comunicação com a Webmania" && res.details && res.details.motivo) {
                alert(res.details.motivo)
                Router.push('/pdv');
            } else if (res && res.message == "Erro ao emitir nota fiscal" && res.details) {
                alert(res.details)
                Router.push('/pdv');
            }
            setLoadingEmitirNotaFiscal(false);
        });
    }

    const validarCpfNaNotaFiscal = () => {
        let cpf = document.getElementById("cpfNaNotaFiscal").value;

        if (cpf) {
            setCpfNaNotaFiscal(cpf);
        } else {
            alert("Cpf inválido")
        }
    }
    //useEffect para validar cpf e emitir NF
    useEffect(() => {
        if (cpfNaNotaFiscal !== null) {
            emitirNotaFiscal();
        }
    }, [cpfNaNotaFiscal]);

    return (
        <div className="flex flex-col bg-gray-200 w-full h-full p-4 mb-4 rounded md:flex-row">
            <div className="w-full p-4 flex flex-col justify-between md:w-2/5">
                <div>
                    <div className="flex flex-col gap-4 mb-2 md:flex-row">
                        <div className="md:w-2/4">
                            <label className="block mb-2 text-sm font-medium text-black">Forma de Pagamento</label>
                            <select
                                id='formaPagamentoNome'
                                className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black">
                                {formasPagamento && formasPagamento.length > 0 && formasPagamento.map((formaPagamento) => (
                                    <option key={formaPagamento.id} value={formaPagamento.id}>
                                        {formaPagamento.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="md:w-1/4">
                            <label className="block mb-2 text-sm font-medium text-black">Parcelas</label>
                            <input id='parcelas' onChange={verificarParcelaDinheiro} type="number" min="0" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-black">Valor Recebido</label>
                            <input id='valorRecebido' type="number" min="0" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                        </div>
                    </div>
                    <div className="flex justify-between mb-2">
                        {(() => {
                            if (subTotal >= 0) {
                                return <span className="text-blue-600 font-bold text-2xl">A pagar: R$ {pontoPorVirgula(subTotal.toFixed(2))}</span>
                            } else {
                                return <span className="text-blue-600 font-bold text-2xl">Troco: R$ {pontoPorVirgula((subTotal * -1).toFixed(2))}</span>
                            }
                        })()}
                        <button onClick={incluirFormaPagamento} className="bg-blue-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            Adicionar
                        </button>
                    </div>
                    <div className="w-full h-96 overflow-auto bg-applojaLight2 rounded">
                        <table className="w-full text-sm text-left text-white ">
                            <thead className="sticky top-0 text-xs uppercase bg-applojaDark2">
                                <tr>
                                    <th scope="col" className="py-3 px-6 w-2/4">
                                        Forma de Pagamento
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Parcelas
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Valor
                                    </th>
                                    <th scope="col" className="py-3 px-6">

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listarFormasPagamento()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="hidden">
                    <div className="mb-2">
                        <label className="block mb-2 text-sm font-medium text-black">Observações</label>
                        <textarea id='valor' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" />
                    </div>
                    <div className="bg-blue-400 flex flex-row rounded p-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <span className="text-white">Operador</span>
                            <span className="text-white">Administrador</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col p-4 justify-between md:w-3/5">
                <div className="mb-2 w-full">
                    <div className="w-full h-96 overflow-auto bg-applojaLight2 rounded">
                        <table className="w-full text-sm text-left text-white ">
                            <thead className="sticky top-0 text-xs uppercase bg-applojaDark2">
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
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Qtd.
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Preço
                                    </th>
                                    <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listarProdutosVenda()}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-2 w-full flex items-center gap-4 mt-4">
                        <label className="block mb-2 text-sm font-medium text-black">Cliente</label>
                        <input id='nomeCliente' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-white border-gray-500 text-black" disabled />
                    </div>
                    <div className="w-full flex flex-col md:flex-row justify-between">
                        <div className="mb-2 w-auto flex gap-1 items-center justify-between md:justify-start">
                            <label className="block md:m-0 sm:mb-2 text-sm font-medium text-black">Desconto: R$</label>
                            <input onChange={calcTotal} id='descontoReal' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 bg-white border-gray-500 text-black w-1/2" />
                        </div>
                        <div className="mb-2 w-auto flex gap-1 items-center justify-between md:justify-start">
                            <label className="block md:m-0 sm:mb-2 text-sm font-medium text-black">Acréscimo: R$</label>
                            <input onChange={calcTotal} id='acrescimo' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 bg-white border-gray-500 text-black w-1/2" />
                        </div>
                        <div className="mb-2 w-auto flex gap-1 items-center justify-between md:justify-start">
                            <label className="block md:m-0 sm:mb-2 text-sm font-medium text-black">Taxa Entrega: R$</label>
                            <input onChange={calcTotal} id='taxaEntrega' type="number" className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 bg-white border-gray-500 text-black w-1/2" />
                        </div>
                    </div>
                </div>
                <div className="mb-2 w-full flex flex-col gap-4">
                    <div className="flex flex-col justify-end gap-6 md:flex-row md:gap-4">
                        <div className="flex justify-between gap-4">
                            <button onClick={closePopUpCancelar} className="flex-1 bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded">Cancelar</button>
                            <button className="hidden flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">NFC-E</button>
                            <button onClick={closePopUpFinalizar} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Finalizar</button>
                        </div>
                    </div>
                </div>
                {/*Popup cancelar venda */}
                <div id="popup-modal" className={"fixed top-20 right-1 left-1 md:top-0 md:left-0 md:right-0 z-50 p-4 " + hiddenPopUpCancelar + " overflow-x-hidden overflow-y-auto md:inset-0 md:h-full"}>
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
                {/*Popup Recibo */}
                <div className={"fixed top-20 right-1 left-1 md:top-0 md:left-0 md:right-0 z-50 p-4 " + hiddenPopUpFinalizar + " overflow-x-hidden overflow-y-auto md:inset-0 md:h-full"}>
                    <div className="relative md:left-1/2 md:top-1/3 w-full h-full max-w-md md:h-auto">
                        <div className="relative rounded-lg shadow bg-applojaDark">
                            <button onClick={closePopUpFinalizar} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-applojaDark2 hover:text-white" data-modal-hide="popup-modal">
                                <div className="flex w-5 h-5">
                                    <BsX className="text-2xl" />
                                </div>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-center">
                                <div className="mt-6 mx-auto mb-4 text-white w-14 h-14">
                                    <BsReceiptCutoff size={60} />
                                </div>
                                <h3 className="mb-5 text-lg font-normal text-white">Deseja ver o Recibo dessa venda?</h3>
                                <button onClick={closePopUpRecibo} type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    Sim, Eu quero
                                </button>
                                <button onClick={finalizarVenda} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-applojaDark border-applojaLight2 text-white hover:bg-applojaLight">Não</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Popup modelo do Recibo */}
                <div className={"fixed top-20 right-1 left-1 md:top-0 md:left-0 md:right-0 z-50 p-4 " + hiddenPopUpRecibo + " overflow-x-hidden overflow-y-auto md:inset-0 md:h-full"}>
                    <div className="relative md:left-1/2 md:top-1/3 w-full h-full max-w-md md:h-auto">
                        <div className="relative rounded-lg shadow bg-applojaDark">
                            <button onClick={closePopUpRecibo} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-applojaDark2 hover:text-white" data-modal-hide="popup-modal">
                                <div className="flex w-5 h-5">
                                    <BsX className="text-2xl" />
                                </div>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-center">
                                <div className="mt-6 mx-auto mb-4 text-white w-14 h-14">
                                    <BsReceiptCutoff size={60} />
                                </div>
                                <h3 className="mb-5 text-lg font-normal text-white">Qual o formato do Recibo?</h3>
                                <button onClick={() => { mostrarRecibo('A4') }} type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    A4
                                </button>
                                <button onClick={() => { mostrarRecibo('58mm') }} type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    58mm
                                </button>
                                <button onClick={() => { mostrarRecibo('80mm') }} type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    80mm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Popup Nota fiscal */}
                <div className={"fixed top-20 right-1 left-1 md:top-0 md:left-0 md:right-0 z-50 p-4 " + hiddenPopUpNotaFiscal + " overflow-x-hidden overflow-y-auto md:inset-0 md:h-full"}>
                    <div className="relative md:left-1/2 md:top-1/3 w-full h-full max-w-md md:h-auto">
                        <div className="relative rounded-lg shadow bg-applojaDark">
                            <button onClick={closePopUpNotaFiscal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-applojaDark2 hover:text-white" data-modal-hide="popup-modal">
                                <div className="flex w-5 h-5">
                                    <BsX className="text-2xl" />
                                </div>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-center">
                                <div className="mt-6 mx-auto mb-4 text-white w-14 h-14">
                                    <BsReceiptCutoff size={60} />
                                </div>
                                <h3 className="mb-5 text-lg font-normal text-white">Deseja emitir nota fiscal dessa venda?</h3>
                                <button onClick={closePopUpCpfNaNotaFiscal} type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    Sim, Eu quero
                                </button>
                                <button onClick={() => Router.push('/pdv')} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-applojaDark border-applojaLight2 text-white hover:bg-applojaLight">Não</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Popup CPF na Nota fiscal */}
                <div className={"fixed top-20 right-1 left-1 md:top-0 md:left-0 md:right-0 z-50 p-4 " + hiddenPopUpCpfNaNotaFiscal + " overflow-x-hidden overflow-y-auto md:inset-0 md:h-full"}>
                    <div className="relative md:left-1/2 md:top-1/3 w-full h-full max-w-md md:h-auto">
                        <div className="relative rounded-lg shadow bg-applojaDark">
                            <button onClick={closePopUpCpfNaNotaFiscal} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-applojaDark2 hover:text-white" data-modal-hide="popup-modal">
                                <div className="flex w-5 h-5">
                                    <BsX className="text-2xl" />
                                </div>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-6 text-center">
                                <div className="mt-6 mx-auto mb-4 text-white w-14 h-14">
                                    <BsReceiptCutoff size={60} />
                                </div>
                                <h3 className="mb-5 text-lg font-normal text-white">CPF na Nota Fiscal?</h3>
                                <InputMask
                                    id="cpfNaNotaFiscal"
                                    className="border mb-4 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                                    placeholder="Ex: 999.999.999-99"
                                    mask="999.999.999-99"
                                />
                                {loadingEmitirNotaFiscal ?
                                    <button type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                        Aguarde...
                                    </button> :
                                    <button onClick={validarCpfNaNotaFiscal} type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                        Sim, Eu quero
                                    </button>
                                }
                                {loadingEmitirNotaFiscal ?
                                    <button type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-applojaDark border-applojaLight2 text-white hover:bg-applojaLight">
                                        Aguarde...
                                    </button> :
                                    <button onClick={emitirNotaFiscal} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-applojaDark border-applojaLight2 text-white hover:bg-applojaLight">Não</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}