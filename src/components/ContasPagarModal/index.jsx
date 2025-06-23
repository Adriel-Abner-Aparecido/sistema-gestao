import { useEffect, useState } from "react";
import { BsTrashFill, BsX } from "react-icons/bs";
import { get, post, put, remove } from "../../services/api";
import { CategoriaContasModal } from "../CategoriaContasModal";

export const ContasPagarModal = (props) => {

  const dataContaPagarPadrao = {
    vendaId: null,
    fornecedorId: '',
    fornecedor: '',
    valor: "",
    dataVencimento: "",
    tipo: "",
    categoriaConta: ""
  }

  const dataPagamentoPagoPadrao = {
    valorPago: "",
    dataPagamento: "",
    contaPagarId: "",
    formasPagamentoId: 1,
    parcelas: ""
  }

  const [togglePagoIsChecked, setTogglePagoIsChecked] = useState(false);
  const [formasPagamento, setFormasPagamento] = useState(null);
  const [hiddenAutoCompleteFornecedor, setHiddenAutoCompleteFornecedor] = useState('hidden');
  const [fornecedorList, setFornecedorList] = useState([]);
  const [intervalFornecedor, setIntervalFornecedor] = useState();
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState();
  const [hiddenCategoriaContas, setHiddenCategoriaContas] = useState('hidden');
  const [categoriaContasList, setCategoriaContasList] = useState([]);
  const [atualizarCategoriaContas, setAtualizarCategoriaContas] = useState(true);
  const [dataContaPagar, setDataContaPagar] = useState(dataContaPagarPadrao)
  const [dataPagamentoPago, setDataPagamentoPago] = useState(dataPagamentoPagoPadrao)
  const [loading, setLoading] = useState(false)
  const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)
  const [listaCaixas, setListaCaixas] = useState([])
  const [caixaSelecionado, setCaixaSelecionado] = useState('')

  useEffect(() => {
    setCategoriaContasList([]);
    loadCategoriaContas();
    loadCaixas()
  }, [atualizarCategoriaContas]);

  useEffect(() => {
    loadFormasPagamento()
  }, []);

  useEffect(() => {

    if (props.contaPagarSelecionado) {
      console.log("Conta pagar Selecionado", props.contaPagarSelecionado.data_pagamento?.slice(0, 16))
      setDataContaPagar({
        id: props.contaPagarSelecionado.conta_pagar_id,
        vendaId: null,
        fornecedorId: props.contaPagarSelecionado.fornecedor_id,
        fornecedor: props.contaPagarSelecionado.fornecedor,
        valor: parseFloat(parseFloat(props.contaPagarSelecionado.valor).toFixed(2)),
        dataVencimento: props.contaPagarSelecionado.data_vencimento?.slice(0, 16) || '',
        tipo: props.contaPagarSelecionado.tipo,
        categoriaConta: props.contaPagarSelecionado.categoria_compra
      })
      if (props.contaPagarSelecionado.pagamento_pago_id) {
        setTogglePagoIsChecked(true)
      }
      setDataPagamentoPago({
        id: props.contaPagarSelecionado.pagamento_pago_id,
        contaPagarId: props.contaPagarSelecionado.conta_pagar_id,
        dataPagamento: props.contaPagarSelecionado.data_pagamento?.slice(0, 16) || '',
        formasPagamentoId: props.contaPagarSelecionado.forma_de_pagamento_id,
        parcelas: props.contaPagarSelecionado.parcelas,
        valorPago: parseFloat(parseFloat(props.contaPagarSelecionado.valor_pago).toFixed(2)),
        operacaoCaixaId: props.contaPagarSelecionado.operacao_id
      })
      setCaixaSelecionado(props.contaPagarSelecionado.caixa_id)
    }

  }, [props.contaPagarSelecionado]);

  const loadFormasPagamento = async () => {
    try {
      const formaspagamento = await get(`${process.env.NEXT_PUBLIC_API_URL}/formasPagamento`)
      setFormasPagamento(formaspagamento)
    } catch (error) {
      console.error(error)
    }
  }

  const closeModal = () => {
    setDataContaPagar(dataContaPagarPadrao)
    setDataPagamentoPago(dataPagamentoPagoPadrao)
    setTogglePagoIsChecked(false)
    setCaixaSelecionado('')
    if (props.hiddenContasPagarModal == "") {
      props.setHiddenContasPagarModal("hidden");
    }
  };

  const openCategoriaContasModal = () => {
    if (hiddenCategoriaContas == "hidden") {
      setHiddenCategoriaContas("");
    }
  };

  const handleDataContaPagar = (event) => {
    setDataContaPagar({
      ...dataContaPagar, [event.target.name]: event.target.value
    })
  }

  const handleDataPagamentoPago = (event) => {
    setDataPagamentoPago({
      ...dataPagamentoPago, [event.target.name]: event.target.value
    })
  }

  const verificarParcelaDinheiro = (event) => {

    const { value } = event.target

    if (dataPagamentoPago.formasPagamentoId === 1 || dataPagamentoPago.formasPagamentoId === 2) {
      if (dataPagamentoPago.parcelas < 1) {
        setDataPagamentoPago({
          ...dataPagamentoPago,
          parcelas: 1
        })
      };
      if (dataPagamentoPago.parcelas > 1) {
        setDataPagamentoPago({
          ...dataPagamentoPago,
          parcelas: 1
        })
      };
    } else {
      setDataPagamentoPago({
        ...dataPagamentoPago,
        parcelas: value
      })
    }

  }

  const salvar = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const salvarConta = await salvarContaPagar()
      if (togglePagoIsChecked) {
        await salvarPagamentoPago(salvarConta)
      }
    } catch (error) {
      console.error(error)
    } finally {
      closeModal()
      props.setAtualizar(true)
      setLoading(false)
    }
  }

  const salvarContaPagar = async () => {

    const dadosTratados = {
      vendaId: null,
      fornecedorId: dataContaPagar.fornecedorId || null,
      valor: parseFloat(parseFloat(dataContaPagar.valor || 0).toFixed(2)),
      dataVencimento: dataContaPagar.dataVencimento || new Date().toISOString(),
      tipo: dataContaPagar.tipo,
      categoriaConta: dataContaPagar.categoriaConta || null
    }

    try {

      if (dataContaPagar.id) {
        await put(`${process.env.NEXT_PUBLIC_API_URL}/contapagar/${dataContaPagar.id}`, dadosTratados)
        return dataContaPagar.id
      } else {
        const salvaContaReceber = await post(`${process.env.NEXT_PUBLIC_API_URL}/contapagar`, dadosTratados)
        return salvaContaReceber.insertId
      }


    } catch (error) {
      console.error(error)
    }

  }

  const salvarPagamentoPago = async (idConta) => {

    const dadosTratados = {
      valorPago: parseFloat(parseFloat(dataPagamentoPago.valorPago || 0).toFixed(2)),
      dataPagamento: dataPagamentoPago.dataPagamento || new Date().toISOString(),
      contaPagarId: idConta,
      formasPagamentoId: parseInt(dataPagamentoPago.formasPagamentoId || 1),
      parcelas: dataPagamentoPago.parcelas || 1
    }

    const dadosOperacaoCaixa = {
      caixaId: caixaSelecionado,
      valorPagamento: parseFloat(dataPagamentoPago.valorPago || 0),
      formaPagamento: dataPagamentoPago.formasPagamentoId || 1,
      tipoOperacao: 'Saida',
      observacao: dataContaPagar.tipo,
      horaPagamento: new Date().toISOString(),
      contaPagarId: idConta
    }

    try {
      if (dataPagamentoPago.id) {
        await put(`${process.env.NEXT_PUBLIC_API_URL}/pagamentopago/${dataPagamentoPago.id}`, dadosTratados)
        if (caixaSelecionado && caixaSelecionado != '') {
          dataPagamentoPago.operacaoCaixaId ? await put(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa/${dataPagamentoPago.operacaoCaixaId}`, dadosOperacaoCaixa) : await post(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa`, dadosOperacaoCaixa)
        }
        console.log("Dados atualizados")
      } else {
        await post(`${process.env.NEXT_PUBLIC_API_URL}/pagamentopago`, dadosTratados)
        if (caixaSelecionado && caixaSelecionado != '') {
          await post(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa`, dadosOperacaoCaixa)
        }
      }
    } catch (error) {
      console.error(error)
    }

  }

  const timeoutFornecedor = (event) => {
    const { value } = event.target
    setDataContaPagar({
      ...dataContaPagar,
      fornecedor: value
    })
    clearTimeout(intervalFornecedor);
    setIntervalFornecedor(setTimeout(() => buscarFornecedor(value), 500));
  }

  const buscarFornecedor = async (fornecedor) => {

    if (fornecedor != "") {
      setHiddenAutoCompleteFornecedor('absolute');
      try {
        const listaFornecedores = await get(`${process.env.NEXT_PUBLIC_API_URL}/fornecedornomecnpj/${fornecedor}`)
        console.log(listaFornecedores)
        setFornecedorList(listaFornecedores)
      } catch (error) {
        console.error(error)
      }

    } else {
      setHiddenAutoCompleteFornecedor('hidden');
    }
  }

  const selecionarFornecedor = (fornecedor) => {
    setDataContaPagar({
      ...dataContaPagar,
      fornecedorId: fornecedor.id,
      fornecedor: fornecedor.nome
    })
    setFornecedorSelecionado(fornecedor);
    setHiddenAutoCompleteFornecedor('hidden');
  }

  const loadCategoriaContas = async () => {

    try {
      const categorias = await get(`${process.env.NEXT_PUBLIC_API_URL}/categoriacontas`)
      setCategoriaContasList(categorias)
    } catch (error) {
      console.error(error)
    }

  }

  const excluirPagamentoPago = async () => {

    try {

      await remove(`${process.env.NEXT_PUBLIC_API_URL}/pagamentopago/${dataPagamentoPago.id}`)
      dataPagamentoPago.operacaoCaixaId && await remove(`${process.env.NEXT_PUBLIC_API_URL}/deleteoperacao/${dataPagamentoPago.operacaoCaixaId}`)
      console.log("Pagamento apagado")

    } catch (error) {
      console.error(error)
    } finally {
      setTogglePagoIsChecked(false)
      setDataPagamentoPago(dataPagamentoPagoPadrao)
      props.setAtualizar(true)
      setPopUpConfirmacao(false)
    }

  }

  const loadCaixas = async () => {
    try {
      const caixas = await get(`${process.env.NEXT_PUBLIC_API_URL}/caixasabertos`)
      setListaCaixas(caixas)
    } catch (error) {
      console.log()
    }
  }

  // console.log(fornecedorSelecionado)

  return (<>
    <div className={props.hiddenContasPagarModal + " flex flex-col absolute z-50 w-full min-h-full lg:hfull bg-gray-700 bg-opacity-60 items-center"}>
      <div className="flex flex-col p-4 w-11/12 sm:h-auto">
        {/*<!-- Modal content --> */}
        <div className="relative rounded-lg shadow bg-gray-200">
          {/*<!-- Modal header --> */}
          <div className="flex justify-between items-center p-5 rounded-t">
            <h3 className="text-xl font-medium text-gray-700">Conta à Pagar</h3>
            <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
              <BsX className="text-gray-700" size={24} />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/*!-- Modal body --> */}
          <form onSubmit={salvar} id="formaContaPagar" className="p-6 space-y-6">
            <div className="flex flex-row gap-4 mt-3 text-gray-700">
              <div className="w:1/2 md:w-3/4">
                <label className="block mb-2 text-sm font-medium">
                  Nome do Pagamento
                </label>
                <input name="tipo" className="border text-sm rounded-lg block w-full p-2.5" onChange={handleDataContaPagar} value={dataContaPagar.tipo} />
              </div>
              <div className="w-1/2 md:w-1/4">
                <label className="block mb-2 text-sm font-medium">
                  Valor
                </label>
                <input name="valor" type="number" className="border text-sm rounded-lg block w-full p-2.5" onChange={handleDataContaPagar} value={dataContaPagar.valor} />
              </div>
            </div>
            <div className='w-full'>
              <label className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
              <div className='flex gap-8'>
                <select name='categoriaConta' className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Branco" onChange={handleDataContaPagar} value={dataContaPagar.categoriaConta} required>
                  {categoriaContasList.map((item, key) => (
                    <option key={key} value={item.id}>{item.nome}</option>
                  ))}
                </select>
                <button onClick={() => openCategoriaContasModal()} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Novo</button>
              </div>
            </div>
            <div className="flex flex-row gap-4 mt-3 text-gray-700">
              <div className="relative mb-2 w-1/2">
                <label className="block mb-2 text-sm font-medium">Fornecedor</label>
                <input onChange={timeoutFornecedor} name='fornecedor' className="border text-sm rounded-lg block w-full p-2.5" value={dataContaPagar.fornecedor} />
                <div className={hiddenAutoCompleteFornecedor + " bg-white w-full h-40 z-50 mt-1 rounded-lg border border-gray-500 overflow-auto"}>
                  <ul className="">
                    {fornecedorList && fornecedorList.map((item, key) => (
                      <li key={key} onClick={() => { selecionarFornecedor(item) }} className="p-2 hover:bg-gray-200 hover:cursor-pointer">{item.nome}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Data Vencimento
                </label>
                <input name="dataVencimento" type="datetime-local" className="border text-sm rounded-lg block w-full p-2.5" onChange={handleDataContaPagar} value={dataContaPagar.dataVencimento} />
              </div>
            </div>
            <div className="flex flex-row gap-4 mt-3 ">
              <div className="w-1/2 md:1/5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Pago?
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input onClick={() => setTogglePagoIsChecked(true)} checked={togglePagoIsChecked} onChange={(e) => setTogglePagoIsChecked(e.target.checked)} id='checkboxPago' type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-100 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
                </label>
              </div>
            </div>
            <div className={togglePagoIsChecked ? " flex flex-col lg:flex-row gap-4 mt-3" : 'hidden'}>
              <div className="flex-1">
                <label className="block text-sm mb-2 font-medium text-gray-700">
                  Data Pagamento
                </label>
                <input name="dataPagamento" type="datetime-local" className="border text-sm rounded-lg block w-full p-2.5" onChange={handleDataPagamentoPago} value={dataPagamentoPago.dataPagamento} />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-2 font-medium text-gray-700">Forma de Pagamento</label>
                <select name='formaPagamentoId' className="border text-sm rounded-lg block w-full p-2.5" onChange={(e) => setDataPagamentoPago({ ...dataPagamentoPago, formasPagamentoId: parseInt(e.target.value) })} value={dataPagamentoPago.formasPagamentoId}>
                  {formasPagamento && formasPagamento.length > 0 && formasPagamento.map((formaPagamento) => (
                    <option key={formaPagamento.id} value={formaPagamento.id}>
                      {formaPagamento.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="block text-sm mb-2 font-medium text-gray-700">Caixa</label>
                <select className="border text-sm rounded-lg block w-full p-2.5" name="caixa" value={caixaSelecionado} onChange={(e) => setCaixaSelecionado(e.target.value)}>
                  <option value={''}></option>
                  {
                    listaCaixas && listaCaixas.map((caixa, i) => (
                      <option key={i} value={caixa.id}>{caixa.id}</option>
                    ))
                  }
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-2 font-medium text-gray-700">Parcelas</label>
                <input name='parcelas' onChange={verificarParcelaDinheiro} type="number" min="1" max={dataPagamentoPago.formasPagamentoId !== 5 ? '' : 1} className="border text-sm rounded-lg block w-full p-2.5" value={dataPagamentoPago.parcelas} />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-2 font-medium text-gray-700">Valor Recebido</label>
                <input name='valorPago' type="number" className="border text-sm rounded-lg block w-full p-2.5" onChange={handleDataPagamentoPago} value={dataPagamentoPago.valorPago} />
              </div>

              {
                dataPagamentoPago.id &&
                <div className="mt-auto">
                  <button type="button" onClick={() => setPopUpConfirmacao(true)}>
                    <BsTrashFill className="w-8 h-8 text-red-600" />
                  </button>
                </div>
              }
            </div>

          </form>
          {/*<!-- Modal footer --> */}
          <div className="flex items-center justify-end p-6 space-x-2 rounded-b">

            {
              loading ?
                <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" disabled >
                  Aguarde...
                </button>
                :
                <button form="formaContaPagar" type="submit" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" >
                  Salvar
                </button>
            }
          </div>
        </div>
      </div>
      <div className='relative flex justify-center items-center'>
        <CategoriaContasModal hiddenCategoriaContas={hiddenCategoriaContas} setHiddenCategoriaContas={setHiddenCategoriaContas} atualizarCategoriaContas={atualizarCategoriaContas} setAtualizarCategoriaContas={setAtualizarCategoriaContas} />
      </div>
    </div>
    <div className={popUpConfirmacao ? "absolute inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
        <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
        <div className="flex flex-row gap-4">
          <button onClick={excluirPagamentoPago} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
          <button onClick={() => setPopUpConfirmacao(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
        </div>
      </div>
    </div>
  </>);
};
