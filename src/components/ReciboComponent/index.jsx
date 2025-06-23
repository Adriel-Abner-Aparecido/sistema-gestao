import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { get } from '../../services/api';
import Router from "next/router";

// components
import { ReciboA4 } from "../ReciboA4";
import { Recibo80mm } from "../Recibo80mm";
import { Recibo58mm } from "../Recibo58mm";

export const ReciboComponent = (props) => {
  // useStates
  const [controllerA4, setControllerA4] = useState(true);
  const [controller80mm, setController80mm] = useState(false);
  const [controller58mm, setController58mm] = useState(false);
  const [dadosRecibo, setDadosRecibo] = useState();
  const [idVenda, setIdVenda] = useState();
  const [produtosDaVenda, setProdutosDaVenda] = useState([]);

  const loadAll = () => {
    if (idVenda == null) {

    } else {
      get(process.env.NEXT_PUBLIC_API_URL + '/vendas/' + idVenda).then((data) => {
        if (data.mensagem) {
          if (data.mensagem == "falha na autenticação") {
            console.log('falha na autenticação');

            localStorage.removeItem("applojaweb_token");
            Router.push('/login');
          }
        } else {
          get(process.env.NEXT_PUBLIC_API_URL + '/minhaempresa').then((dataEmpresa) => {

            get(process.env.NEXT_PUBLIC_API_URL + '/clientes/' + data[0].cliente_id).then((dataCliente) => {

              get(process.env.NEXT_PUBLIC_API_URL + '/enderecoscliente/' + data[0].cliente_id).then((enderecoCliente) => {

                get(process.env.NEXT_PUBLIC_API_URL + '/produtosdasvendas/' + idVenda).then((dataProdutoVenda) => {

                  const valorTotalReduce = dataProdutoVenda.reduce((acc, produto) => {
                    return acc + (produto.valor * produto.quantidade)
                  }, 0)

                  let dataRecibo = {};

                  dataRecibo = {
                    nomeEmpresa: dataEmpresa[0].nome,
                    numeroPedido: idVenda,
                    dataPedido: data[0].data,
                    vendedor: data[0].nome_vendedor,
                    telefoneEmpresa: dataEmpresa[0].telefone,
                    emailEmpresa: dataEmpresa[0].email,
                    cnpjEmpresa: dataEmpresa[0].cnpj,
                    enderecoEmpresa: null,
                    cepEmpresa: null,
                    nomeCliente: dataCliente[0] ? dataCliente[0].nome : null,
                    enderecoCliente: enderecoCliente[0] ? `${enderecoCliente[0].rua} - ${enderecoCliente[0].numero}, ${enderecoCliente[0].bairro}, ${enderecoCliente[0].cidade} - ${enderecoCliente[0].uf}` : null,
                    cepCliente: null,
                    telefoneCliente: dataCliente[0] ? dataCliente[0].celular : null,
                    emailCliente: dataCliente[0] ? dataCliente[0].email : null,
                    cpfcnpj: dataCliente[0] ? dataCliente[0].cnpj_cpf : null,
                    valorTotalProdutos: valorTotalReduce,
                    valorFrete: data[0].valor_frete,
                    valorTotalPedido: data[0].valor,
                    observacao: data[0].observacao,
                    desconto: data[0].desconto
                  };

                  Promise.all(
                    dataProdutoVenda.map(async (produto) => {
                      const valorTotal = produto.valor * produto.quantidade;

                      const dataEstoque = await get(process.env.NEXT_PUBLIC_API_URL + '/estoques/' + produto.estoque_id);

                      const produtoVenda = {
                        id: produto.id,
                        nome: dataEstoque[0].nome,
                        codigo: dataEstoque[0].codigo_barras,
                        quantidade: produto.quantidade,
                        valor: produto.valor,
                        total: valorTotal,
                        cor: dataEstoque[0].cor_nome,
                        tamanho: dataEstoque[0].tamanho_nome
                      };

                      setProdutosDaVenda((old) => [...old, produtoVenda]);
                    })
                  )
                    .then(() => {
                      // Configurando dataRecibo uma vez no final
                      setDadosRecibo(dataRecibo);
                    })
                    .catch((error) => {
                      console.error("Erro ao processar produtos da venda:", error);
                    });

                })
              })
            })
          })
        }
      })
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      var url_string = window.location.href
      var url = new URL(url_string);
      var pedido = url.searchParams.get("pedido");
      setIdVenda(pedido);
    }
    if (typeof props.tamRecibo != "undefined") {
      if (props.tamRecibo == "a4") {
        setControllerA4(true);
        setController80mm(false)
        setController58mm(false)
      } else if (props.tamRecibo == "80mm") {
        setControllerA4(false);
        setController80mm(true)
        setController58mm(false)
      } else if (props.tamRecibo == "58mm") {
        setControllerA4(false);
        setController80mm(false)
        setController58mm(true)
      } else {
      }
    }
  }, [props.tamRecibo]);

  useEffect(() => {
    loadAll();
  }, [idVenda])

  useEffect(() => {

  }, [produtosDaVenda])

  const handleconvert = () => {
    // instanciando o jsPDF
    const doc = new jsPDF("p", "pt", "a4");
    // conteudo html que deve estar no pdf
    doc.html(document.getElementById("recibo"), {
      callback: function (pdf) {
        //gerar pdf
        pdf.save(`recibo ${date}.pdf`);
      },
    });
  };

  return (
    <div>
      {controllerA4 ? <ReciboA4 dadosRecibo={dadosRecibo} produtosDaVenda={produtosDaVenda} /> : <></>}
      {controller80mm ? <Recibo80mm dadosRecibo={dadosRecibo} produtosDaVenda={produtosDaVenda} /> : <></>}
      {controller58mm ? <Recibo58mm dadosRecibo={dadosRecibo} produtosDaVenda={produtosDaVenda} /> : <></>}
    </div>
  );
};
