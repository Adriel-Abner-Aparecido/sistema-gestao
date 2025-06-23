import { useEffect, useState } from "react";
import { BsX, BsFillTrashFill } from "react-icons/bs";
import { post, put, remove, get, getPublic } from "../../services/api";
import InputMask from "react-input-mask";
import Router from "next/router";

const initialClienteState = {
  cpf: "",
  nome_completo: "",
  endereco: "",
  complemento: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
  telefone: "",
  email: ""
};

const initialProdutoState = {
  nome: "",
  codigo: "",
  ncm: "",
  cest: "",
  quantidade: "",
  unidade: "",
  peso: "",
  origem: "0",
  subtotal: "",
  total: "",
  classe_imposto: ""
};

const initialPedidoState = {
  pagamento: "",
  presenca: "1",
  modalidade_frete: "0",
  frete: "",
  desconto: "",
  total: ""
};

export const NotaFiscalModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Cliente");
  const [dadosCliente, setDadosCliente] = useState(initialClienteState);
  const [dadosProduto, setDadosProduto] = useState(initialProdutoState);
  const [dadosPedido, setDadosPedido] = useState(initialPedidoState);
  const [listProdutos, setListProdutos] = useState([]);
  const [isNfe, setIsNfe] = useState(true);

  const handleInputChange = (event, setter) => {
    const { name, value, type } = event.target;

    // Se o tipo do evento for 'select-one', então usamos 'selectedOptions[0].value' em vez de 'value'.
    const newValue = type === "select-one" ? event.target.selectedOptions[0].value : value;

    // Atualize o estado usando a função setter passada como argumento.
    // Mantenha todos os outros valores no estado, mas atualize o valor do campo que foi alterado.
    setter(prevState => ({ ...prevState, [name]: newValue }));
  };

  const closeModal = () => {
    if (props.statusModal == "") {
      props.setStatusModal("hidden");
    }
  };

  useEffect(() => {
    if (props.notaFiscalSelecionado.nfe_id) {
      get(process.env.NEXT_PUBLIC_API_URL + '/nfe/'+props.notaFiscalSelecionado.nfe_id+'').then((res) => {
        // Nota Fiscal ------------------------------------------------
        document.getElementById("naturezaOperacaoNF").value = res.natureza_operacao
        document.getElementById("operacaoNF").value = res.operacao;
        if (res.modelo == "nfe") {
          document.getElementById("modeloNF").value = 1;
        } else if (res.modelo == "nfce") {
          document.getElementById("modeloNF").value = 2;
        } else {
          document.getElementById("modeloNF").value = 1;
        }
        document.getElementById("FinalidadeNF").value = res.finalidade;
        // Nota Fiscal ------------------------------------------------
        // Cliente ----------------------------------------------------
        let ClienteState = {
          cpf: res.cliente.cpf,
          nome_completo: res.cliente.nome_completo,
          endereco: res.cliente.endereco,
          complemento: res.cliente.complemento,
          numero: res.cliente.numero,
          bairro: res.cliente.bairro,
          cidade: res.cliente.cidade,
          uf: res.cliente.uf,
          cep: res.cliente.cep,
          telefone: res.cliente.telefone,
          email: res.cliente.email
        };
        setDadosCliente(ClienteState);
        // Cliente ----------------------------------------------------
        // Produtos ---------------------------------------------------
        setListProdutos(res.produtos)
        // Produtos ---------------------------------------------------
        // Pedido -----------------------------------------------------
        const PedidoState = {
          pagamento: res.pedido.pagamento,
          presenca: res.pedido.presenca,
          modalidade_frete: res.pedido.modalidade_frete,
          frete: res.pedido.frete,
          desconto: res.pedido.desconto,
          total: res.pedido.total
        };
        setDadosPedido(PedidoState);
        // Pedido -----------------------------------------------------
      })
    } else {
      setDadosCliente(initialClienteState);
      setDadosProduto(initialProdutoState);
      setDadosPedido(initialPedidoState);
    }
  }, [props]);

  const renderContent = () => {
    switch (selectedTab) {
      case "Cliente":
        return (
          <div className="px-6">
            <div className=" space-y-6">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Campos com ( <label className="text-red-600">*</label> ) são obrigatórios!
              </label>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Nome {isNfe ? <label className="text-red-600">*</label> : <></>}
                </label>
                <input
                  id="nomeCliente"
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                  placeholder="Ex: João Paulo"
                  name="nome_completo"
                  value={dadosCliente.nome_completo}
                  onChange={(e) => handleInputChange(e, setDadosCliente)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Celular
                </label>
                <InputMask
                  id="celularCliente"
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                  type="tel"
                  placeholder="Ex: 41 9 9999-9999"
                  mask="99 9 9999-9999"
                  name="telefone"
                  value={dadosCliente.telefone}
                  onChange={(e) => handleInputChange(e, setDadosCliente)}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  E-mail
                </label>
                <input
                  id="emailCliente"
                  type="email"
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                  placeholder="Ex: joao@gmail.com"
                  name="email"
                  value={dadosCliente.email}
                  onChange={(e) => handleInputChange(e, setDadosCliente)}
                />
              </div>
              <div className="flex flex-row w-full gap-8 items-center justify-center">
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium  text-gray-300">
                    CPF {isNfe ? <label className="text-red-600">*</label> : <></>}
                  </label>
                  <div className="flex flex-row gap-8 w-full">
                    <InputMask
                      id="cpfCliente"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      placeholder="999.999.999-99"
                      mask="999.999.999-99"
                      name="cpf"
                      value={dadosCliente.cpf}
                      onChange={(e) => handleInputChange(e, setDadosCliente)}
                    />
                  </div>
                </div>
                {
                  /*
                  <div className="flex flex-row items-center pr-4 gap-4">
                  <label className="text-white">
                    CNPJ
                  </label>
                  <input
                    type="checkbox"
                    name=""
                    id="checkCpfCnpj"
                  />
                </div>
                  */
                }
              </div>
              {/* campo endereço */}
              <div className="flex flex-col">
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    CEP {isNfe ? <label className="text-red-600">*</label> : <></>}
                  </label>
                  <InputMask
                    id="cepCliente"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    placeholder="Ex: 99999-999"
                    mask="99999-999"
                    name="cep"
                    value={dadosCliente.cep}
                    onChange={(e) => handleInputChange(e, setDadosCliente)}
                  />
                </div>
                <div className="flex flex-row gap-4 mt-3">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Endereço {isNfe ? <label className="text-red-600">*</label> : <></>}
                    </label>
                    <input
                      id="enderecoCliente"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      placeholder="Ex: Limoeiro"
                      name="endereco"
                      value={dadosCliente.endereco}
                      onChange={(e) => handleInputChange(e, setDadosCliente)}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Complemento
                    </label>
                    <input
                      id="complementoCliente"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      placeholder="Ex: Apto 1A"
                      name="complemento"
                      value={dadosCliente.complemento}
                      onChange={(e) => handleInputChange(e, setDadosCliente)}
                    />
                  </div>
                  <div className="md:w-1/12 w-1/4">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Numero {isNfe ? <label className="text-red-600">*</label> : <></>}
                    </label>
                    <input
                      id="numeroCliente"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      placeholder="847"
                      type="number"
                      name="numero"
                      value={dadosCliente.numero}
                      onChange={(e) => handleInputChange(e, setDadosCliente)}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-3">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Bairro {isNfe ? <label className="text-red-600">*</label> : <></>}
                    </label>
                    <input
                      id="bairroCliente"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      placeholder="Ex: Limoeiro"
                      name="bairro"
                      value={dadosCliente.bairro}
                      onChange={(e) => handleInputChange(e, setDadosCliente)}
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Cidade {isNfe ? <label className="text-red-600">*</label> : <></>}
                    </label>
                    <input
                      id="cidadeCliente"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      placeholder="Ex: Curitiba"
                      name="cidade"
                      value={dadosCliente.cidade}
                      onChange={(e) => handleInputChange(e, setDadosCliente)}
                    />
                  </div>
                  <div className="md:w-1/12 w-1/4">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      UF {isNfe ? <label className="text-red-600">*</label> : <></>}
                    </label>
                    <InputMask
                      id="ufCliente"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      mask="aa"
                      placeholder="PR"
                      name="uf"
                      value={dadosCliente.uf}
                      onChange={(e) => handleInputChange(e, setDadosCliente)}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-3"></div>
              </div>
            </div>
          </div>
        )
      case "Produtos":
        return (
          <div className="px-6">
            <div className=" space-y-6">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Campos com ( <label className="text-red-600">*</label> ) são obrigatórios!
              </label>
              <div className="flex flex-row gap-4">
                <div className="w-3/4">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Nome <label className="text-red-600">*</label>
                  </label>
                  <input
                    id="nomeProduto"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    placeholder="Ex: Camisa Nike"
                    name="nome"
                    value={dadosProduto.nome}
                    onChange={(e) => handleInputChange(e, setDadosProduto)}
                  />
                </div>
                <div className="w-1/4">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    Código
                  </label>
                  <input
                    id="codigoProduto"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    name="codigo"
                    value={dadosProduto.codigo}
                    onChange={(e) => handleInputChange(e, setDadosProduto)}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Origem <label className="text-red-600">*</label>
                </label>
                <select
                  id="origemProduto"
                  name="origem"
                  value={dadosProduto.origem}
                  onChange={(e) => handleInputChange(e, setDadosProduto)}
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white">
                  <option value="0">0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8</option>
                  <option value="1">1 - Estrangeira - Importação direta, exceto a indicada no código 6</option>
                  <option value="2">2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7</option>
                  <option value="3">3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%</option>
                  <option value="4">4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes</option>
                  <option value="5">5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%</option>
                  <option value="6">6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural</option>
                  <option value="7">7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural</option>
                  <option value="8">8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%</option>
                </select>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    NCM <label className="text-red-600">*</label>
                  </label>
                  <InputMask
                    id="ncmProduto"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    placeholder="Ex: 6109.10.00"
                    mask="9999.99.99"
                    name="ncm"
                    value={dadosProduto.ncm}
                    onChange={(e) => handleInputChange(e, setDadosProduto)}
                  />
                </div>
                <div className="w-full">
                  <label className="block mb-2 text-sm font-medium text-gray-300">
                    CEST
                  </label>
                  <InputMask
                    id="cestProduto"
                    className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    placeholder="Ex: 28.038.00"
                    mask="99.999.99"
                    name="cest"
                    value={dadosProduto.cest}
                    onChange={(e) => handleInputChange(e, setDadosProduto)}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-4">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Classe Imposto <label className="text-red-600">*</label>
                    </label>
                    <input
                      id="classeImpostoProduto"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      placeholder="Ex: REF94749247"
                      name="classe_imposto"
                      value={dadosProduto.classe_imposto}
                      onChange={(e) => handleInputChange(e, setDadosProduto)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Unidade <label className="text-red-600">*</label>
                    </label>
                    <InputMask
                      id="unidadeProduto"
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                      mask="aa"
                      placeholder="Ex: UN"
                      name="unidade"
                      value={dadosProduto.unidade}
                      onChange={(e) => handleInputChange(e, setDadosProduto)}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Peso
                    </label>
                    <input
                      id="pesoProduto"
                      type="number"
                      name="peso"
                      value={dadosProduto.peso}
                      onChange={(e) => handleInputChange(e, setDadosProduto)}
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-3">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Quantidade <label className="text-red-600">*</label>
                    </label>
                    <input
                      id="quantidadeProduto"
                      type="number"
                      name="quantidade"
                      value={dadosProduto.quantidade}
                      onChange={(e) => handleInputChange(e, setDadosProduto)}
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Subtotal <label className="text-red-600">*</label>
                    </label>
                    <input
                      id="subtotalProduto"
                      type="number"
                      name="subtotal"
                      value={dadosProduto.subtotal}
                      onChange={(e) => handleInputChange(e, setDadosProduto)}
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Total <label className="text-red-600">*</label>
                    </label>
                    <input
                      id="totalProduto"
                      type="number"
                      name="total"
                      value={dadosProduto.total}
                      onChange={(e) => handleInputChange(e, setDadosProduto)}
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
                    />
                  </div>
                </div>
                <div className="my-4">
                  <button
                    onClick={incluirProdutoTable}
                    type="button"
                    className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800"
                  >
                    Incluir Produto
                  </button>
                </div>
                <div className="mb-2 w-full">
                  <div className="w-full h-96 2xl:h-128 overflow-auto bg-applojaLight2 rounded">
                    <table className="w-full text-sm text-left text-gray-400 ">
                      <thead className="sticky top-0 text-xs uppercase bg-applojaDark text-white border-b border-gray-700">
                        <tr>
                          <th scope="col" className="py-3 px-6 w-2/4">
                            Produto
                          </th>
                          <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                            Código
                          </th>
                          <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                            NCM
                          </th>
                          <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                            CEST
                          </th>
                          <th scope="col" className="hidden py-3 px-6 sm:table-cell md:flex md:justify-center">
                            Quantidade
                          </th>
                          <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                            Subtotal
                          </th>
                          <th scope="col" className="hidden py-3 px-6 sm:table-cell">
                            Total
                          </th>
                          <th scope="col" className="py-3 px-6">

                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listProdutos.map((item, key) => (
                          <tr key={key} className="border-b bg-applojaDark border-gray-700 text-white">
                            <th scope="row" className="py-4 px-6 font-medium">
                              {item.nome}
                            </th>
                            <td className="hidden py-4 px-6 sm:table-cell">
                              {item.codigo}
                            </td>
                            <td className="hidden py-4 px-6 sm:table-cell">
                              {item.ncm}
                            </td>
                            <td className="hidden py-4 px-6 sm:table-cell">
                              {item.cest}
                            </td>
                            <td className="hidden py-4 px-6 sm:table-cell md:flex md:justify-center">
                              <div className="font-bold text-white">{item.quantidade}</div>
                            </td>
                            <td className="hidden py-4 px-6 sm:table-cell">
                              {pontoPorVirgula(Number(item.subtotal).toFixed(2))}
                            </td>
                            <td className="hidden py-4 px-6 sm:table-cell">
                              {pontoPorVirgula(Number(item.total).toFixed(2))}
                            </td>
                            <td className="py-4 px-6">
                              <button onClick={() => removerProduto(key)} className="cursor-pointer">
                                <BsFillTrashFill />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-3"></div>
              </div>
            </div>
          </div>
        )
      case "Pedido":
        return (
          <div className="px-6">
            <div className=" space-y-6">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Campos com ( <label className="text-red-600">*</label> ) são obrigatórios!
              </label>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Pagamento
                </label>
                <select
                  id="pagamentoPedido"
                  name="pagamento"
                  value={dadosPedido.pagamento}
                  onChange={(e) => handleInputChange(e, setDadosPedido)}
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white">
                  <option value=""></option>
                  <option value="0">Pagamento à vista</option>
                  <option value="1">Pagamento a prazo</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Presença <label className="text-red-600">*</label>
                </label>
                <select
                  id="presencaPedido"
                  name="presenca"
                  value={dadosPedido.presenca}
                  onChange={(e) => handleInputChange(e, setDadosPedido)}
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white">
                  <option value="1">Operação presencial (Para NF-e e NFC-e)</option>
                  <option value="0">Não se aplica (por exemplo, Nota Fiscal complementar ou de ajuste) (Para NF-e)</option>
                  <option value="2">Operação não presencial, pela Internet (Para NF-e)</option>
                  <option value="3">Operação não presencial, Teleatendimento (Para NF-e)</option>
                  <option value="4">NFC-e em operação com entrega a domicílio (Para NFC-e)</option>
                  <option value="5">Operação presencial, fora do estabelecimento (Para NF-e)</option>
                  <option value="9">Operação não presencial, outros (Para NF-e)</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Modalidade Frete <label className="text-red-600">*</label>
                </label>
                <select
                  id="modalidadeFretePedido"
                  name="modalidade_frete"
                  value={dadosPedido.modalidade_frete}
                  onChange={(e) => handleInputChange(e, setDadosPedido)}
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white">
                  <option value="0">Contratação do Frete por conta do Remetente (CIF) (Para NF-e)</option>
                  <option value="1">Contratação do Frete por conta do Destinatário (FOB) (Para NF-e)</option>
                  <option value="2">Contratação do Frete por conta de Terceiros (Para NF-e)</option>
                  <option value="3">Transporte Próprio por conta do Remetente (Para NF-e)</option>
                  <option value="4">Transporte Próprio por conta do Destinatário (Para NF-e)</option>
                  <option value="9">Sem Ocorrência de Transporte (Para NFC-e)</option>
                </select>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row gap-4">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Frete
                    </label>
                    <input
                      id='fretePedido'
                      type="number"
                      name="frete"
                      value={dadosPedido.frete}
                      onChange={(e) => handleInputChange(e, setDadosPedido)}
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Desconto
                    </label>
                    <input
                      id='descontoPedido'
                      type="number"
                      name="desconto"
                      value={dadosPedido.desconto}
                      onChange={(e) => handleInputChange(e, setDadosPedido)}
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" />
                  </div>
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-300">
                      Total
                    </label>
                    <input
                      id='totalPedido'
                      type="number"
                      name="total"
                      value={dadosPedido.total}
                      onChange={(e) => handleInputChange(e, setDadosPedido)}
                      className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white" placeholder="1999.99" />
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-3"></div>
              </div>
            </div>
          </div>
        )
      default:
        return null;
    }
  };

  const handleModeloNfe = () => {
    let modeloNf = document.getElementById("modeloNF").value

    if (modeloNf == "1") {
      setIsNfe(true);
    }
    if (modeloNf == "2") {
      setIsNfe(false);
    }
  }

  const incluirProdutoTable = () => {
    let nomeProduto = document.getElementById("nomeProduto").value
    let codigoProduto = document.getElementById("codigoProduto").value
    let origemProduto = document.getElementById("origemProduto").value
    let ncmProduto = document.getElementById("ncmProduto").value
    let cestProduto = document.getElementById("cestProduto").value
    let classeImpostoProduto = document.getElementById("classeImpostoProduto").value
    let unidadeProduto = document.getElementById("unidadeProduto").value
    let pesoProduto = document.getElementById("pesoProduto").value
    let quantidadeProduto = document.getElementById("quantidadeProduto").value
    let subtotalProduto = document.getElementById("subtotalProduto").value
    let totalProduto = document.getElementById("totalProduto").value

    if (nomeProduto === "" ||
      origemProduto === "" ||
      ncmProduto === "" ||
      classeImpostoProduto === "" ||
      unidadeProduto === "" ||
      quantidadeProduto === "" ||
      subtotalProduto === "" ||
      totalProduto === "") {

      alert("Preencha todos os campos obrigatórios");
      return;
    } else {

      let dadosProduto = {
        nome: nomeProduto,
        codigo: codigoProduto,
        ncm: ncmProduto,
        cest: cestProduto,
        quantidade: quantidadeProduto,
        unidade: unidadeProduto,
        peso: pesoProduto,
        origem: origemProduto,
        subtotal: subtotalProduto,
        total: totalProduto,
        classe_imposto: classeImpostoProduto
      };

      setListProdutos(old => [...old, dadosProduto]);
      setDadosProduto(initialProdutoState);
    }
  }

  const validarNotaFiscal = () => {
    if (document.getElementById("naturezaOperacaoNF").value === "") {
      alert("Preencha dos os campos obrigatórios da nota fiscal");
      return false;
    }
    return true;
  };

  const validarCliente = () => {
    if (isNfe) {
      if (
        dadosCliente.cpf === "" ||
        dadosCliente.nome_completo === "" ||
        dadosCliente.endereco === "" ||
        dadosCliente.numero === "" ||
        dadosCliente.bairro === "" ||
        dadosCliente.cidade === "" ||
        dadosCliente.uf === "" ||
        dadosCliente.cep === ""
      ) {
        alert("Preencha dos os campos obrigatórios do cliente");
        return false;
      }
      return true;
    }
    return true;
  };

  const validarProduto = () => {
    if (listProdutos.length === 0) {
      alert("Adicione pelo menos um produto");
      return false;
    }
    return true;
  };

  const validarPedido = () => {
    if (
      dadosPedido.presenca === "" ||
      dadosPedido.modalidade_frete === ""
    ) {
      alert("Preencha dos os campos obrigatórios do pedido");
      return false;
    }
    return true;
  };

  const salvar = () => {
    if (
      validarNotaFiscal() &&
      validarCliente() &&
      validarProduto() &&
      validarPedido()
    ) {
      setLoading(true);

      let jsonNF = {
        operacao: Number(document.getElementById("operacaoNF").value),
        natureza_operacao: document.getElementById("naturezaOperacaoNF").value,
        modelo: document.getElementById("modeloNF").value,
        finalidade: Number(document.getElementById("FinalidadeNF").value),
        cliente: {
          cpf: dadosCliente.cpf,
          nome_completo: dadosCliente.nome_completo,
          endereco: dadosCliente.endereco,
          complemento: dadosCliente.complemento || null,
          numero: Number(dadosCliente.numero),
          bairro: dadosCliente.bairro,
          cidade: dadosCliente.cidade,
          uf: dadosCliente.uf,
          cep: dadosCliente.cep,
          telefone: dadosCliente.telefone || null,
          email: dadosCliente.email || null
        },
        produtos: listProdutos.map(produto => ({
          ...produto,
          codigo: produto.codigo || null,
          cest: produto.cest || null,
          quantidade: Number(produto.quantidade),
          peso: produto.peso || null,
          origem: Number(produto.origem),
        })),
        pedido: {
          pagamento: Number(dadosPedido.pagamento) || null,
          presenca: Number(dadosPedido.presenca),
          modalidade_frete: Number(dadosPedido.modalidade_frete),
          frete: dadosPedido.frete || null,
          desconto: dadosPedido.desconto || null,
          total: dadosPedido.total || null,
        }
      }

      post(process.env.NEXT_PUBLIC_API_URL + '/nfe', jsonNF).then((res) => {
        console.log(res)
        if (res && res.idNfe) {
          alert("Nota Fiscal Emitida com Sucesso!");
          setDadosCliente(initialClienteState);
          setDadosPedido(initialPedidoState);
          setDadosProduto(initialProdutoState);
          setListProdutos([]);
        } else if (res && res.message == "Erro na comunicação com a Webmania" && res.details && res.details.error) {
          alert(res.details.error)
        } else if (res && res.message == "Erro na comunicação com a Webmania" && res.details && res.details.motivo) {
          alert(res.details.motivo)
        }
        setLoading(false);
      });
      
    }
  };

  const pontoPorVirgula = (valor) => {
    let valorString;
    valorString = valor.toString().replace(".", ",");
    return valorString;
  }

  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
  }

  const removerProduto = (index) => {

    // Crie uma cópia da lista original e remova o produto usando o índice.
    const listaNova = [...listProdutos];
    const produtoRemovido = listaNova.splice(index, 1);

    console.log("listaNova após remoção: ", listaNova);
    console.log("produtoRemovido: ", produtoRemovido);

    // Atualize a lista de produtos no seu estado (assumindo que você está usando useState).
    setListProdutos(listaNova);
  }

  return (
    <div
      id="medium-modal"
      className={
        props.statusModal +
        " first-letter:overflow-y-auto overflow-x-hidden absolute z-50 w-full h-modal sm:h-auto sm:w-3/4"
      }
    >
      <div className="relative p-4 w-full h-full sm:h-auto">
        {/*<!-- Modal content --> */}
        <div className="relative rounded-lg shadow bg-applojaDark2">
          {/*<!-- Modal header --> */}
          <div className="flex justify-between items-center p-5 rounded-t border-b border-applojaDark">
            <h3 className="text-xl font-medium text-white">Nota Fiscal</h3>
            <button
              onClick={closeModal}
              type="button"
              className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-applojaDark hover:text-white"
            >
              <BsX className="text-white" size={24} />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/*!-- Modal body --> */}
          <div className="p-6 space-y-6">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Campos com ( <label className="text-red-600">*</label> ) são obrigatórios!
            </label>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Natureza da Operação <label className="text-red-600">*</label>
              </label>
              <input
                id="naturezaOperacaoNF"
                className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white"
              />
            </div>
            <div className="flex flex-row justify-between gap-4">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Operação <label className="text-red-600">*</label>
                </label>
                <select
                  id="operacaoNF"
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white">
                  <option value="1">Saída</option>
                  <option value="0">Entrada</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Modelo <label className="text-red-600">*</label>
                </label>
                <select
                  id="modeloNF"
                  onClick={handleModeloNfe}
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white">
                  <option value="1">NF-e</option>
                  <option value="2">NFC-e</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Finalidade <label className="text-red-600">*</label>
                </label>
                <select
                  id="FinalidadeNF"
                  className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-applojaDark border-applojaLight2 placeholder-gray-400 text-white">
                  <option value="1">NF-e normal</option>
                  <option value="3">Ajuste/Estorno</option>
                  <option value="4">Devolução</option>
                </select>
              </div>
            </div>
          </div>
          <div id="abas" className="px-6 flex flex-row justify-start items-center space-x-4 mb-8 border-t border-applojaDark pt-4">
            <div
              onClick={() => handleTabChange('Cliente')}
              className={`cursor-pointer p-2 rounded-lg shadow-sm ${selectedTab === 'Cliente' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}>
              Cliente
            </div>
            <div
              onClick={() => handleTabChange('Produtos')}
              className={`cursor-pointer p-2 rounded-lg shadow-sm ${selectedTab === 'Produtos' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}>
              Produtos
            </div>
            <div
              onClick={() => handleTabChange('Pedido')}
              className={`cursor-pointer p-2 rounded-lg shadow-sm ${selectedTab === 'Pedido' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}>
              Pedido
            </div>
          </div>
          {renderContent()}
          {/*<!-- Modal footer --> */}
          {loading ? (
            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-applojaDark">
              <button
                type="button"
                className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800"
              >
                <div className="flex" role="status">
                  <svg
                    aria-hidden="true"
                    className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="https://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  Aguarde...
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-applojaDark">
              <button
                onClick={salvar}
                type="button"
                className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800"
              >
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

