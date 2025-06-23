import React, { useEffect } from 'react'
import { useState } from "react";
import { BsTrashFill, BsX } from "react-icons/bs";
import { get, post, put, remove } from "../../services/api";
import { CategoriaContasModal } from '../CategoriaContasModal';

export const ContasReceberModal = (props) => {

  const dadosContaReceberPadrao = {
    vendaId: null,
    clienteId: '',
    cliente: '',
    valor: '',
    dataVencimento: '',
    tipo: '',
    categoriaConta: ''
  }

  const dadosPagamentoRecebidoPadrao = {
    valorPago: '',
    dataPagamento: '',
    contaReceberId: '',
    formasPagamentoId: 1,
    parcelas: ''
  }

  const [dadosContaReceber, setDadosContaReceber] = useState(dadosContaReceberPadrao)
  const [dadosPagamentoRecebido, setDadosPagamentoRecebido] = useState(dadosPagamentoRecebidoPadrao)
  const [hiddenDataPagamento, setHiddenDataPagamento] = useState('hidden');
  const [togglePagoIsChecked, setTogglePagoIsChecked] = useState(false);
  const [formasPagamento, setFormasPagamento] = useState(null);
  const [hiddenAutoCompleteCliente, setHiddenAutoCompleteCliente] = useState('hidden');
  const [clienteList, setClienteList] = useState([]);
  const [intervalCliente, setIntervalCliente] = useState();
  const [clienteSelecionado, setClienteSelecionado] = useState();
  const [hiddenCategoriaContas, setHiddenCategoriaContas] = useState('hidden');
  const [categoriaContasList, setCategoriaContasList] = useState([]);
  const [atualizarCategoriaContas, setAtualizarCategoriaContas] = useState(true);
  const [popUpConfirmacao, setPopUpConfirmacao] = useState()
  const [loading, setLoading] = useState(false)
  const [listaCaixas, setListaCaixas] = useState([])
  const [caixaSelecionado, setCaixaSelecionado] = useState('')

  useEffect(() => {
    fetchFormasPagamento()
    loadCaixas()
  }, [])

  useEffect(() => {
    setCategoriaContasList([]);
    loadCategoriaContas();
  }, [atualizarCategoriaContas]);

  useEffect(() => {
    if (props.contaReceberSelecionado) {
      const conta = props.contaReceberSelecionado;

      if (conta.data_pagamento) {
        setHiddenDataPagamento('')
        setTogglePagoIsChecked(true)
      }

      setDadosContaReceber({
        id: conta.conta_receber_id,
        categoriaConta: conta.categoria_contas_id,
        clienteId: conta.cliente_id,
        cliente: conta.cliente,
        dataVencimento: conta.data_vencimento?.slice(0, 16),
        tipo: conta.tipo,
        valor: conta.valor?.toFixed(2),
        vendaId: conta.venda_id
      })
      setDadosPagamentoRecebido({
        id: conta.pagamento_recebido_id,
        contaReceberId: conta.conta_receber_id,
        dataPagamento: conta.data_pagamento?.slice(0, 16),
        formasPagamentoId: conta.forma_de_pagamento_id || 1,
        parcelas: conta.parcelas || 1,
        valorPago: (conta.valor_pago || 0).toFixed(2),
        operacaoCaixaId: conta.operacao_id
      })
      setCaixaSelecionado(conta.caixa_id)
    }

    console.log("Dados conta receber", dadosContaReceber)

  }, [props.contaReceberSelecionado]);

  const fetchFormasPagamento = async () => {
    try {
      const listaformaspagamento = await get(`${process.env.NEXT_PUBLIC_API_URL}/formasPagamento`)
      if (listaformaspagamento) {
        setFormasPagamento(listaformaspagamento)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const closeModal = () => {
    setDadosContaReceber(dadosContaReceberPadrao)
    setDadosPagamentoRecebido(dadosPagamentoRecebidoPadrao)
    setCaixaSelecionado('')
    setTogglePagoIsChecked(false)

    if (props.hiddenContasReceberModal == "") {
      props.setHiddenContasReceberModal("hidden");
    }
  };

  const openCategoriaContasModal = () => {
    if (hiddenCategoriaContas == "hidden") {
      setHiddenCategoriaContas("");
    }
  };

  const handleContaReceber = (event) => {
    setDadosContaReceber({
      ...dadosContaReceber, [event.target.name]: event.target.value
    })
  }

  const handlePagamentoRecebido = (event) => {
    setDadosPagamentoRecebido({
      ...dadosPagamentoRecebido, [event.target.name]: event.target.value
    })
  }

  const salvar = async () => {

    setLoading(true)

    try {

      const salvaDados = await salvarNovaContaReceber()

      if (togglePagoIsChecked) {
        await salvarPagamentoRecebido(salvaDados)
      }

    } catch (error) {
      console.error(error)
    } finally {
      closeModal()
      setLoading(false)
    }

  }

  const salvarNovaContaReceber = async () => {

    const dadosTratados = {
      vendaId: dadosContaReceber.vendaId || null,
      clienteId: dadosContaReceber.clienteId || null,
      cliente: dadosContaReceber.cliente || null,
      valor: dadosContaReceber.valor || 0,
      dataVencimento: dadosContaReceber.dataVencimento || new Date().toUTCString(),
      tipo: dadosContaReceber.tipo || null,
      categoriaConta: dadosContaReceber.categoriaConta || null
    }

    try {

      if (dadosContaReceber.id) {

        const atualizaContaReceber = await put(`${process.env.NEXT_PUBLIC_API_URL}/contareceber/${dadosContaReceber.id}`, dadosTratados)

        if (atualizaContaReceber.affectedRows === 1) {
          console.log("Dados Atualizados")
        }

        return dadosContaReceber.id

      } else {

        const salvaNovaConta = await post(`${process.env.NEXT_PUBLIC_API_URL}/contareceber`, dadosTratados)

        if (salvaNovaConta.insertId) {
          return salvaNovaConta.insertId
        }

      }
    } catch (error) {
      console.error(error)
    } finally {
      props.setAtualizar(true)
    }

  }

  const salvarPagamentoRecebido = async (crId) => {

    const dadosTratados = {
      valorPago: dadosPagamentoRecebido.valorPago || 0,
      dataPagamento: dadosPagamentoRecebido.dataPagamento,
      contaReceberId: crId,
      formasPagamentoId: parseInt(dadosPagamentoRecebido.formasPagamentoId),
      parcelas: dadosPagamentoRecebido.parcelas
    }

    const dadosOperacaoCaixa = {
      caixaId: caixaSelecionado,
      valorPagamento: parseFloat(dadosPagamentoRecebido.valorPago || 0),
      formaPagamento: dadosPagamentoRecebido.formasPagamentoId || 1,
      tipoOperacao: 'Entrada',
      observacao: dadosContaReceber.tipo,
      horaPagamento: new Date().toISOString(),
      contaReceberId: crId
    }

    try {
      if (dadosPagamentoRecebido.id) {
        const atualizaPagamentoRecebido = await put(`${process.env.NEXT_PUBLIC_API_URL}/pagamentorecebido/${dadosPagamentoRecebido.id}`, dadosTratados)
        if (caixaSelecionado && caixaSelecionado != '') {
          dadosPagamentoRecebido.operacaoCaixaId ? await put(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa/${dadosPagamentoRecebido.operacaoCaixaId}`, dadosOperacaoCaixa) : await post(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa`, dadosOperacaoCaixa)
        }
        if (atualizaPagamentoRecebido.affectedRows === 1) {
          console.log('Pagamento recebido atualizado com sucesso')
        }
      } else {
        const salvaPagamentoRecebido = await post(`${process.env.NEXT_PUBLIC_API_URL}/pagamentorecebido`, dadosTratados)
        if (caixaSelecionado && caixaSelecionado != '') {
          await post(`${process.env.NEXT_PUBLIC_API_URL}/operacoescaixa`, dadosOperacaoCaixa)
        }
        if (salvaPagamentoRecebido.insertId) {
          console.log("Pagamento recebido salvo com sucesso.")
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      props.setAtualizar(true)
    }

  }

  const verificarParcelaDinheiro = (event) => {

    const { value } = event.target

    if (dadosPagamentoRecebido.formasPagamentoId === 1 || dadosPagamentoRecebido.formasPagamentoId === 2) {
      if (dadosPagamentoRecebido.parcelas < 1) {
        setDadosPagamentoRecebido({
          ...dadosPagamentoRecebido,
          parcelas: 1
        })
      };
      if (dadosPagamentoRecebido.parcelas > 1) {
        setDadosPagamentoRecebido({
          ...dadosPagamentoRecebido,
          parcelas: 1
        })
      };
    } else {
      setDadosPagamentoRecebido({
        ...dadosPagamentoRecebido,
        parcelas: value
      })
    }

  }

  const timeoutCliente = (event) => {
    setDadosContaReceber({
      ...dadosContaReceber,
      cliente: event.target.value
    })
    clearTimeout(intervalCliente);
    setIntervalCliente(setTimeout(() => buscarCliente(event.target.value), 500));
  }

  const buscarCliente = async (value) => {

    setHiddenAutoCompleteCliente('absolute');

    if (value != "") {
      const clientes = await get(`${process.env.NEXT_PUBLIC_API_URL}/clientenomecpf/${value}`)

      if (clientes) {
        setClienteList(clientes)
      }

    } else {
      setHiddenAutoCompleteCliente('hidden');
    }
  }

  const selecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setDadosContaReceber({
      ...dadosContaReceber,
      cliente: cliente.nome,
      clienteId: cliente.id
    })
    setHiddenAutoCompleteCliente('hidden');
  }

  const loadCategoriaContas = async () => {

    const categorias = await get(`${process.env.NEXT_PUBLIC_API_URL}/categoriacontas`)

    if (categorias.length > 0) {
      setCategoriaContasList(categorias.map((categoria) => ({
        id: categoria.id,
        nome: categoria.nome
      })))
    }


  }

  const excluirPagamentoRecebido = async () => {

    try {

      await remove(`${process.env.NEXT_PUBLIC_API_URL}/pagamentorecebido/${dadosPagamentoRecebido.id}`)
      dadosPagamentoRecebido.operacaoCaixaId && remove(`${process.env.NEXT_PUBLIC_API_URL}/deleteoperacao/${dadosPagamentoRecebido.operacaoCaixaId}`)

      setPopUpConfirmacao(false)

      console.log("Pagamento recebido apagado com sucesso!!!")

    } catch (error) {
      console.error(error)
    } finally {
      setTogglePagoIsChecked(false)
      setDadosPagamentoRecebido(dadosPagamentoRecebidoPadrao)
      props.setAtualizar(true)
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

  // console.log("Pagamento Recebido", dadosPagamentoRecebido)
  // console.log("Pagamento Recebido", dadosContaReceber)

  return (<>
    <div id="relative medium-modal" className={props.hiddenContasReceberModal + " flex flex-col first-letter:overflow-y-auto overflow-x-hidden absolute z-50 w-full h-full bg-gray-700 bg-opacity-60 items-center"}>
      <div className="relative p-4 w-3/4 h-full">
        {/*<!-- Modal content --> */}
        <div className="relative rounded-lg shadow bg-gray-200">
          {/*<!-- Modal header --> */}
          <div className="flex justify-between items-center p-5 rounded-t">
            <h3 className="text-xl font-medium text-gray-700">Conta à Receber</h3>
            <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-300" >
              <BsX className="text-gray-700" size={24} />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/*!-- Modal body --> */}
          <div className="p-6 space-y-6">
            <div className="flex flex-row gap-4 mt-3 ">
              <div className="w:1/2 md:w-3/4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Nome do Recebimento
                </label>
                <input name="tipo" className="border text-sm rounded-lg block w-full p-2.5 " value={dadosContaReceber.tipo} onChange={handleContaReceber} />
              </div>
              <div className="w-1/2 md:w-1/4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Valor
                </label>
                <input name="valor" type="number" className="border text-sm rounded-lg block w-full p-2.5" value={dadosContaReceber.valor} onChange={handleContaReceber} />
              </div>
            </div>
            <div className='w-full'>
              <label className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
              <div className='flex gap-8'>
                <select name='categoriaConta' className="border text-sm rounded-lg block w-full p-2.5" value={dadosContaReceber.categoriaConta} onChange={handleContaReceber} required>
                  <option value=""></option>
                  {categoriaContasList.map((item, key) => (
                    <option key={key} value={item.id}>{item.nome}</option>
                  ))}
                </select>
                <button onClick={() => openCategoriaContasModal()} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Novo</button>
              </div>
            </div>
            <div className="flex flex-row gap-4 mt-3 ">
              <div className="relative mb-2 w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Cliente</label>
                <input onChange={timeoutCliente} name='cliente' className="border text-sm rounded-lg block w-full p-2.5" value={dadosContaReceber.cliente} />
                <div className={hiddenAutoCompleteCliente + " bg-white w-full h-40 z-50 mt-1 rounded-lg border overflow-auto"}>
                  <ul className="">
                    {clienteList.map((item, key) => (
                      <li key={key} onClick={() => { selecionarCliente(item) }} className="p-2 hover:bg-gray-100 hover:cursor-pointer">{item.nome}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="w-1/2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Data Vencimento
                </label>
                <input name="dataVencimento" type="datetime-local" className="border text-sm rounded-lg block w-full p-2.5" value={dadosContaReceber.dataVencimento} onChange={handleContaReceber} />
              </div>
            </div>
            <div className="flex flex-row gap-4 mt-3 ">
              <div className="w-1/2 md:1/5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Pago?
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input onClick={() => setTogglePagoIsChecked(!togglePagoIsChecked)} checked={togglePagoIsChecked} onChange={(e) => setTogglePagoIsChecked(e.target.checked)} name='checkboxPago' type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
                </label>
              </div>
            </div>
            <div className={togglePagoIsChecked ? "flex flex-row gap-4 mt-3" : "hidden"}>
              <div className='flex-1'>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Data Pagamento
                </label>
                <input name="dataPagamento" type="datetime-local" className="border text-sm rounded-lg block w-full p-2.5" value={dadosPagamentoRecebido.dataPagamento} onChange={handlePagamentoRecebido} />
              </div>
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-700">Forma de Pagamento</label>
                <select name='formasPagamentoId' className="border text-sm rounded-lg block w-full p-2.5" value={dadosPagamentoRecebido.formasPagamentoId} onChange={(e) => setDadosPagamentoRecebido({ ...dadosPagamentoRecebido, formasPagamentoId: parseInt(e.target.value) })}>
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
                <label className="block mb-2 text-sm font-medium text-gray-700">Parcelas</label>
                <input name='parcelas' type="number" min="1" className="border text-sm rounded-lg block w-full p-2.5" value={dadosPagamentoRecebido.parcelas} onChange={verificarParcelaDinheiro} />
              </div>
              <div className='flex-1'>
                <label className="block mb-2 text-sm font-medium text-gray-700">Valor Recebido</label>
                <input name='valorPago' type="number" min="0" className="border text-sm rounded-lg block w-full p-2.5" value={dadosPagamentoRecebido.valorPago} onChange={handlePagamentoRecebido} />
              </div>
              <div className='mt-auto items-end'>
                <button onClick={() => setPopUpConfirmacao(true)}>
                  <BsTrashFill className='w-8 h-8 text-red-600' />
                </button>
              </div>
            </div>
          </div>
          {/*<!-- Modal footer --> */}
          <div className="flex items-center justify-end p-6 space-x-2 rounded-b">

            {
              loading ? <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800" disabled>
                Aguarde...
              </button>
                :
                <button onClick={salvar} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">
                  Salvar
                </button>
            }
          </div>
        </div>
      </div>
      <div className='relative flex justify-center items-center'>
        <CategoriaContasModal
          hiddenCategoriaContas={hiddenCategoriaContas}
          setHiddenCategoriaContas={setHiddenCategoriaContas}
          atualizarCategoriaContas={atualizarCategoriaContas}
          setAtualizarCategoriaContas={setAtualizarCategoriaContas}
        />
      </div>
      <div className={popUpConfirmacao ? "absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
          <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
          <div className="flex flex-row gap-4">
            <button onClick={excluirPagamentoRecebido} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
            <button onClick={() => setPopUpConfirmacao(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
          </div>
        </div>
      </div>
    </div>
  </>);
}
