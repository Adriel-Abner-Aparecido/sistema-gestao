import { BsX } from 'react-icons/bs';
import { get, post, put, remove } from '../../services/api';
import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { BsExclamationCircle } from "react-icons/bs";


export const EntradaProdutoModal = (props) => {

    const produtoPadrao = {
        quantidade: '',
        valor: '',
        valorCusto: '',
        markup: ''
    }

    const [produtoSelecionado, setProdutoSelecionado] = useState(produtoPadrao);

    const closeModal = () => {
        props.setProdutoSelecionado(null)
        setProdutoSelecionado(produtoPadrao)
        if (props.hiddenEntradaProdutoModal == "") {
            props.setHiddenEntradaProdutoModal("hidden");
        }
    }

    useEffect(() => {
        if (props.produtoSelecionado) {
            setProdutoSelecionado({
                ...produtoSelecionado,
                valor: props.produtoSelecionado.valor != null 
                    ? props.produtoSelecionado.valor.toFixed(2) 
                    : "0.00",
                valorCusto: props.produtoSelecionado.valor_custo != null 
                    ? props.produtoSelecionado.valor_custo.toFixed(2) 
                    : "0.00",
                markup: props.produtoSelecionado.markup
            });
        }
    }, [props.produtoSelecionado]); 
    
    

    const salvar = async (event) => {
        event.preventDefault()

        try {
            const verestoque = await get(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${props.produtoSelecionado.estoque_id}`)
            const quantidadenova = verestoque[0].quantidade + Number(produtoSelecionado.quantidade)
            const dataEstoque = {
                variacaoProdutoId: verestoque[0].variacao_produto_id,
                validade: verestoque[0].validade,
                localizacao: verestoque[0].localizacao,
                quantidade: quantidadenova,
                quantidadeMin: verestoque[0].quantidade_min,
                quantidadeMax: verestoque[0].quantidade_max
            }
            const atualizaestoque = await put(`${process.env.NEXT_PUBLIC_API_URL}/estoques/${props.produtoSelecionado.estoque_id}`, dataEstoque)
            if (atualizaestoque.affectedRows) {
                console.log('Estoque atualizado')
            }

            const dataPreco = {
                variacaoProdutoId: props.produtoSelecionado.variacao_produto_id,
                listaPrecoId: props.produtoSelecionado.lista_preco_id,
                valor: produtoSelecionado.valor,
                markup: produtoSelecionado.markup,
                valorCusto: produtoSelecionado.valorCusto
            }

            const atualizapreco = await put(`${process.env.NEXT_PUBLIC_API_URL}/precoprodutos/${props.produtoSelecionado.preco_produto_id}`, dataPreco)
            if (atualizapreco.affectedRows) {
                console.log("Atualizou preço")
            }
        } catch (error) {
            console.error(error)
        } finally {
            props.setProdutoSelecionado(null)
            props.setAtualizar(true)
            props.setAtualizarModel(true)
            closeModal()
        }

    }

    return (
        <div id="medium-modal" className={props.hiddenEntradaProdutoModal + " flex flex-col w-full h-full fixed top-0 bg-gray-700 bg-opacity-60 items-center justify-center"}>
            <div className="relative p-4 w-3/4 sm:h-auto">
                {/*<!-- Modal content --> */}
                <div className="relative rounded-lg shadow bg-gray-200">
                    {/*<!-- Modal header --> */}
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Entrada do Produto
                        </h3>
                        <button onClick={closeModal} type="button" className="rounded-lg text-sm p-1.5 inline-flex items-center hover:bg-gray-400">
                            <BsX className='text-gray-700' size={24} />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/*!-- Modal body --> */}
                    <form onSubmit={salvar} id='entradaForm' className="p-6 space-y-6">
                        <div>
                            <label className="block mb-2 text-lg font-medium text-gray-700">Produto: {produtoSelecionado?.nome}</label>
                        </div>
                        <div className='w-full flex flex-col md:flex-row gap-4'>
                            <div className='w-full'>
                                <div className='flex gap-2'>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Quantidade</label>
                                    <BsExclamationCircle className='text-gray-700' data-tooltip-id="tooltipQuantidadeEntrada" data-tooltip-content="Essa quantidade será somada com a quantidade que você já tem em estoque." />
                                    <Tooltip id="tooltipQuantidadeEntrada" place="right" type="dark" effect="solid" />
                                </div>
                                <input name='quantidade' type='number' className="border text-sm rounded-lg block w-full p-2.5" value={produtoSelecionado.quantidade} onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado, quantidade: Number(e.target.value) || '' })} />
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Valor Unitário</label>
                                <input name='valor' type='number' className="border text-sm rounded-lg block w-full p-2.5" value={produtoSelecionado.valor} onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado, valor: parseFloat(e.target.value).toFixed(2) })} />
                            </div>
                        </div>
                        <div className='w-full flex flex-col md:flex-row gap-4'>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Valor Custo</label>
                                <input name='valorCusto' type='number' className="border text-sm rounded-lg block w-full p-2.5" value={produtoSelecionado.valorCusto} onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado, valorCusto: parseFloat(e.target.value).toFixed(2) })} />
                            </div>
                            <div className='w-full'>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Markup</label>
                                <input name='markup' type='number' className="border text-sm rounded-lg block w-full p-2.5" value={produtoSelecionado.markup} onChange={(e) => setProdutoSelecionado({ ...produtoSelecionado, markup: Number(e.target.value) })} />
                            </div>
                        </div>
                    </form>
                    {/*<!-- Modal footer --> */}
                    <div className="flex items-center justify-end p-6 space-x-2 rounded-b">
                        <button type="submit" form='entradaForm' className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}