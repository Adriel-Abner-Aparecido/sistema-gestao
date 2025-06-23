import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { get } from '../../../services/api';
import { convertDate } from '../../../services/date';
import { LoadingComponent } from '../../LoadingComponent';
import { Brl } from '../../../services/real';

// Componente principal do relatório
export const RelatorioFrequenciaCompraClientes = () => {
    // Definir estados para filtragem e modal
    const [dados, setDados] = useState([])
    const [dadosFiltrados, setDadosFiltrados] = useState(dados);
    const [filtroSelecionado, setFiltroSelecionado] = useState('');
    const [clienteModal, setClienteModal] = useState(null);
    const [comprasModal, setComprasModal] = useState('');
    const [modalVisivel, setModalVisivel] = useState(false);
    const [loading, setLoading] = useState(false)

    // Função para obter dados do relatório de clientes
    const obterRelatorioClientes = async () => {
        setLoading(true)

        try {
            const relatorio = await get(`${process.env.NEXT_PUBLIC_API_URL}/relatorio/clientes`)
            if (relatorio) {
                setDados(relatorio)
                setDadosFiltrados(relatorio)
            }
        } catch (error) {
            console.error("Erro ao buscar dados")
        } finally {
            setLoading(false)
        }

    };

    console.log("Dados sem filtro", dados)

    // Carregar os dados da API quando o componente é montado
    useEffect(() => {
        obterRelatorioClientes();
    }, []);

    // Calcular total de clientes e contagens por categoria
    const totalClientes = dados.length;
    const desengajados = dados.filter(
        (cliente) => cliente.acaoSugerida === 'Manter contato'
    ).length;
    const atencao = dados.filter(
        (cliente) => cliente.acaoSugerida === 'Reengajar'
    ).length;
    const frequentes = dados.filter(
        (cliente) => cliente.acaoSugerida === 'Agradecimento'
    ).length;

    console.log("Desengajados", desengajados)

    // Calcular percentuais
    const percDesengajados = (desengajados / totalClientes) * 100 || 0;
    const percAtencao = (atencao / totalClientes) * 100 || 0;
    const percFrequentes = (frequentes / totalClientes) * 100 || 0;

    // Atualizar dados filtrados quando o filtro é alterado
    useEffect(() => {
        filtrarDados();
    }, [filtroSelecionado]);

    // Função para filtrar os dados com base no filtro selecionado
    const filtrarDados = () => {
        let filtradados = dados;

        if (filtroSelecionado === 'desengajados') {
            filtradados = dados.filter((cliente) => cliente.acaoSugerida === 'Manter contato');
        } else if (filtroSelecionado === 'atencao') {
            filtradados = dados.filter((cliente) => cliente.acaoSugerida === 'Reengajar');
        } else if (filtroSelecionado === 'frequentes') {
            filtradados = dados.filter((cliente) => cliente.acaoSugerida === 'Agradecimento');
        } else if (filtroSelecionado === '') {
            setDadosFiltrados(dados)
        }

        setDadosFiltrados(filtradados);
    };

    // Função para abrir o modal com as compras
    const abrirModal = (cliente) => {
        setClienteModal(cliente.cliente);
        setComprasModal(cliente.ultimosProdutosComprados.join(', '));
        setModalVisivel(true);
    };

    // Componente do modal
    const ModalCompras = () => {
        if (!modalVisivel) {
            return null;
        }

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h5 className="text-lg font-bold">Compras de {clienteModal}</h5>
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setModalVisivel(false)}
                        >
                        </button>
                    </div>
                    <div className="p-4">
                        <p>{comprasModal}</p>
                    </div>
                    <div className="flex justify-end p-4 border-t">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={() => setModalVisivel(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Componente para renderizar a linha da tabela com dados do cliente
    const LinhaCliente = ({ cliente }) => {
        // Definir a classe de acordo com a ação sugerida
        const classeLinha = cliente.acaoSugerida === 'Manter contato' ? 'bg-red-100' : cliente.acaoSugerida === 'Reengajar' ? 'bg-yellow-100' : 'bg-green-100';

        return (
            <tr className={classeLinha}>
                <td className="border border-gray-700 px-4 py-2">{cliente.cliente}</td>
                <td className="border border-gray-700 px-4 py-2">{cliente.contato}</td>
                <td className="border border-gray-700 px-4 py-2">{cliente.celular}</td>
                <td className="border border-gray-700 px-4 py-2">
                    <a rel='noreferrer noopener' target="_blank" href={`https://api.whatsapp.com/send?phone=55${cliente.celular}&text=Olá, ${cliente.cliente}, ${cliente.acaoSugerida}!`} >
                        <button type="button" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" >
                            {cliente.acaoSugerida}
                        </button>
                    </a>
                </td>
                <td className="border border-gray-700 px-4 py-2">{convertDate(cliente.ultimaCompra)}</td>
                <td className="border border-gray-700 px-4 py-2">{cliente.diasDesdeUltimaCompra}</td>
                <td className="border border-gray-700 px-4 py-2">{cliente.intervaloEntreCompras}</td>
                <td className="border border-gray-700 px-4 py-2">{cliente.quantidadeCompras}</td>
                <td className="border border-gray-700 px-4 py-2">{Brl(cliente.valorMedioPedido)}</td>
                <td className="border border-gray-700 px-4 py-2">{Brl(cliente.valorMedioProduto)}</td>
                <td className="border border-gray-700 px-4 py-2">{Brl(cliente.ltv)}</td>
                <td className="border border-gray-700 px-4 py-2">
                    <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => abrirModal(cliente)} >
                        Compras
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <Head>
                <title>APPLoja - Relatório de Frequência de Compra de Clientes</title>
            </Head>

            <h2 className="text-center text-2xl font-bold my-4">
                Ciclo de Compra dos Clientes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-600 text-white rounded shadow mb-3">
                    <div className="bg-red-700 p-2 rounded-t">
                        <h3 className="text-lg font-bold">Clientes Inativos</h3>
                    </div>
                    <div className="p-4">
                        <h5 className="text-xl font-bold">{desengajados} Clientes</h5>
                        <p>{percDesengajados.toFixed(2)}% do total</p>
                    </div>
                </div>
                <div className="bg-yellow-500 text-white rounded shadow mb-3">
                    <div className="bg-yellow-600 p-2 rounded-t">
                        <h3 className="text-lg font-bold">Clientes em Atenção</h3>
                    </div>
                    <div className="p-4">
                        <h5 className="text-xl font-bold">{atencao} Clientes</h5>
                        <p>{percAtencao.toFixed(2)}% do total</p>
                    </div>
                </div>
                <div className="bg-green-600 text-white rounded shadow mb-3">
                    <div className="bg-green-700 p-2 rounded-t">
                        <h3 className="text-lg font-bold">Clientes Ativos</h3>
                    </div>
                    <div className="p-4">
                        <h5 className="text-xl font-bold">{frequentes} Clientes</h5>
                        <p>{percFrequentes.toFixed(2)}% do total</p>
                    </div>
                </div>
            </div>

            <div className="flex h-6 rounded overflow-hidden my-3">
                <div
                    className="bg-red-600 h-full"
                    style={{ width: `${percDesengajados}%` }}
                ></div>
                <div
                    className="bg-yellow-500 h-full"
                    style={{ width: `${percAtencao}%` }}
                ></div>
                <div
                    className="bg-green-600 h-full"
                    style={{ width: `${percFrequentes}%` }}
                ></div>
            </div>

            <div className="mb-4">
                <label htmlFor="filtroClientes" className="block text-sm font-medium text-gray-700">
                    Filtrar Clientes
                </label>
                <select id="filtroClientes" className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none" value={filtroSelecionado} onChange={(e) => setFiltroSelecionado(e.target.value)} >
                    <option value="">Todos</option>
                    <option value="desengajados">Inativos</option>
                    <option value="atencao">Atenção</option>
                    <option value="frequentes">Ativos</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                {
                    loading ?
                        <LoadingComponent />
                        :
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border border-gray-700 px-4 py-2">Cliente</th>
                                    <th className="border border-gray-700 px-4 py-2">Contato</th>
                                    <th className="border border-gray-700 px-4 py-2">Celular</th>
                                    <th className="border border-gray-700 px-4 py-2">Ação Sugerida</th>
                                    <th className="border border-gray-700 px-4 py-2">Última Compra</th>
                                    <th className="border border-gray-700 px-4 py-2">Dias Desde a Última Compra</th>
                                    <th className="border border-gray-700 px-4 py-2">Intervalo entre Compras</th>
                                    <th className="border border-gray-700 px-4 py-2">Quantidade Compras</th>
                                    <th className="border border-gray-700 px-4 py-2">Valor Médio Pedido</th>
                                    <th className="border border-gray-700 px-4 py-2">Valor Médio Produto</th>
                                    <th className="border border-gray-700 px-4 py-2">LTV</th>
                                    <th className="border border-gray-700 px-4 py-2">Últimos Produtos Comprados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dadosFiltrados.map((cliente) => (
                                        <LinhaCliente key={cliente.id} cliente={cliente} />
                                    ))
                                }
                            </tbody>
                        </table>
                }

            </div>

            {/* Modal para exibir as compras */}
            <ModalCompras />
        </div>
    );
};