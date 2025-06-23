import { PieChart } from "../PieChart";
import { LineChart } from "../LineChart";
import { BarChart } from "../BarChart/BarChart";
import { FaShoppingCart, FaUsers, FaTag, FaDollarSign, FaArrowUp, FaBox, FaExclamationTriangle } from 'react-icons/fa';
import { useState } from "react";
import { useEffect } from "react";
import { get } from "../../services/api";
import { AiOutlineLineChart, AiOutlineBarChart } from "react-icons/ai";
import { Brl } from "../../services/real";
import { utcStringToDateLocal } from "../../services/date";
import { BsBarChart, BsListOl } from "react-icons/bs";

export const DashboardComponentNew = (props) => {
  const [username, setUsername] = useState("");
  const [totalVendasMesAtual, setTotalVendasMesAtual] = useState([]);
  const [totalVendasAnoAtual, setTotalVendasAnoAtual] = useState([]);
  //novos
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalVendasValor, setTotalVendasValor] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [topProdutos, setTopProdutos] = useState(null);
  const [novosClientes, setNovosClientes] = useState(0);
  const [topClients, setTopClients] = useState([]);
  const [totalInventory, setTotalInventory] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [numberLowStockProducts, setNumberLowStockProducts] = useState(0)
  const [controllerGraficoTopProduto, setControllerGraficoTopProduto] = useState('bar');
  const [controllerGraficoVendaMes, setControllerGraficoVendaMes] = useState('bar');
  const [controllerGraficoVendaValorMes, setControllerGraficoVendaValorMes] = useState('bar')
  const [controllerGraficoVendaDia, setControllerGraficoVendaDia] = useState('bar');
  const [controllerGraficoVendaValorDia, setControllerGraficoVendaValorDia] = useState('bar');
  const [parcelasCrediario, setParcelasCrediario] = useState([])
  const [totalCrediario, setTotalCrediario] = useState(0)
  const [valorTotalCrediario, setValorTotalCrediario] = useState(0)
  const [parcelasEmAtraso, setParcelasEmAtraso] = useState([])
  const [crediarioEmAtraso, setCrediarioEmAtraso] = useState(0)
  const [valorEmAtraso, setValorEmAtraso] = useState(0)

  const openEntradaProdutoModal = (produto) => {
    props.setProdutoSelecionado(produto);
    console.log(props.hiddenEntradaProdutoModal)
    if (props.hiddenEntradaProdutoModal == "hidden") {
      props.setHiddenEntradaProdutoModal("")
      props.setAtualizarModel(false)
    }
  }

  const loadAllData = async () => {

    const {
      vendasmesatual,
      vendas,
      estoque,
      clientes,
      vendasanoatual,
      produtosdasvendastopcinco,
      clientestop,
      estoquecompletotopdez,
      crediario,
      foraprazo
    } = await get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)

    console.log("Dados dashboard", {
      vendasmesatual,
      vendas,
      estoque,
      clientes,
      vendasanoatual,
      produtosdasvendastopcinco,
      clientestop,
      estoquecompletotopdez
    })

    setTotalVendasMesAtual(vendasmesatual)
    setTotalVendasAnoAtual(vendasanoatual)
    setTotalVendas(vendas[0].total_vendas || 0)
    setTotalVendasValor(Brl(vendas[0].valor_total || 0))
    setTotalProdutos(estoque[0].total_produtos || 0)
    setTotalClientes(clientes[0].total_clientes || 0)
    setNovosClientes(clientes[0].novos_clientes || 0)
    setParcelasCrediario(crediario.crediario)
    setTotalCrediario(crediario.parcelas)
    setValorTotalCrediario(crediario.total_a_receber)
    setParcelasEmAtraso(foraprazo.crediario)
    setValorEmAtraso(foraprazo.total_a_receber)
    setCrediarioEmAtraso(foraprazo.parcelas)

    setTopProdutos({
      labels: [produtosdasvendastopcinco[0]?.produto, produtosdasvendastopcinco[1]?.produto, produtosdasvendastopcinco[2]?.produto, produtosdasvendastopcinco[3]?.produto, produtosdasvendastopcinco[4]?.produto],
      datasets: [
        {
          label: 'Vendas',
          data: [produtosdasvendastopcinco[0]?.quantidade_vendida, produtosdasvendastopcinco[1]?.quantidade_vendida, produtosdasvendastopcinco[2]?.quantidade_vendida, produtosdasvendastopcinco[3]?.quantidade_vendida, produtosdasvendastopcinco[4]?.quantidade_vendida],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    })

    setTopClients(clientestop)

    setNumberLowStockProducts(estoque[0].estoque_baixo)

    setTotalInventory(estoque[0].total_estoque);

    setLowStockProducts(estoquecompletotopdez || [])

  }

  const preencherGraficoVendasMensais = () => {

    let vendasMensais = {
      labels: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ],
      datasets: [
        {
          label: "Vendas",
          data: totalVendasAnoAtual.vendasMensais,
          backgroundColor: ["rgba(75, 192, 192, 1)"],
          borderColor: ["rgba(75, 192, 192, 1)"],
          borderWidth: 1,
        },
      ],
    };

    return vendasMensais

  }

  const preencherGraficoVendasValorMensais = () => {

    let vendasMensais = {
      labels: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ],
      datasets: [
        {
          label: "Valor",
          data: totalVendasAnoAtual.valoresMensais,
          backgroundColor: [
            "rgba(54, 162, 235, 1)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return vendasMensais

  }

  const preencherGraficoVendasDiaria = () => {
    const dataAtual = new Date()
    let diasNoMes = new Date(dataAtual.getFullYear(), (dataAtual.getMonth() + 1), 0).getDate()

    const labelsDiaDoMes = []

    for (let i = 0; i < diasNoMes; i++) {
      labelsDiaDoMes.push('Dia ' + (i + 1) + '')
    }

    let vendasMensais = {
      labels: labelsDiaDoMes,
      datasets: [
        {
          label: "Vendas",
          data: totalVendasMesAtual.vendasDiarias,
          backgroundColor: ["rgba(153, 102, 255, 1)"],
          borderColor: ["rgba(153, 102, 255, 1)"],
          borderWidth: 1,
        },
      ],
    };

    return vendasMensais

  }

  const preencherGraficoVendasValorDiaria = () => {
    const dataAtual = new Date()
    let diasNoMes = new Date(dataAtual.getFullYear(), (dataAtual.getMonth() + 1), 0).getDate()

    const labelsDiaDoMes = []

    for (let i = 0; i < diasNoMes; i++) {
      labelsDiaDoMes.push('Dia ' + (i + 1) + '')
    }

    let vendasMensais = {
      labels: labelsDiaDoMes,
      datasets: [
        {
          label: "Valor",
          data: totalVendasMesAtual.valoresDiarios,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return vendasMensais

  }

  useEffect(() => {
    loadAllData()
    setUsername(localStorage.getItem("applojaweb_user_name"));
    props.setAtualizarModel(false)
  }, [])

  useEffect(() => {
    props.setAtualizarModel(false)
  }, [props.atualizarModel])

  useEffect(() => {
    atualizaDadosDeEstoque()
    props.setAtualizarListaBaixoEstoque(false)
  }, [props.atualizarListaBaixoEstoque])

  const atualizaDadosDeEstoque = async () => {

    const {
      estoque,
      estoquecompletotopdez
    } = await get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)

    setNumberLowStockProducts(estoque[0].estoque_baixo)

    setTotalInventory(estoque[0].total_estoque);

    setLowStockProducts(estoquecompletotopdez)

  }

  return (
    <div className="px-5 mt-4 w-full">
      <h1 className="text-2xl mb-4">
        Olá, <span className="font-bold">{username}</span>
      </h1>
      {
        //Visão Geral
      }
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Visão geral</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InfoGeralCard title="Total de Vendas" value={totalVendas} IconComponent={FaShoppingCart} />
        <InfoGeralCard title="Total de Produtos" value={totalProdutos} IconComponent={FaTag} />
        <InfoGeralCard title="Total de Clientes" value={totalClientes} IconComponent={FaUsers} />
        <InfoGeralCard title="Valor Total" value={totalVendasValor} IconComponent={FaDollarSign} />
      </div>
      {
        //Vendas
      }
      <hr className="my-6 border-gray-300" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vendas</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <VendasCard headerColor="bg-green-300" bgColor="bg-green-100" title="Vendas (Mês)" data={preencherGraficoVendasMensais()} chartType={controllerGraficoVendaMes} setControllerGrafico={setControllerGraficoVendaMes} />
        <VendasCard headerColor="bg-blue-300" bgColor="bg-blue-100" title="Valor Em Vendas (Mês)" data={preencherGraficoVendasValorMensais()} chartType={controllerGraficoVendaValorMes} setControllerGrafico={setControllerGraficoVendaValorMes} />
        <VendasCard headerColor="bg-purple-300" bgColor="bg-purple-100" title="Vendas (Dia)" data={preencherGraficoVendasDiaria()} chartType={controllerGraficoVendaDia} setControllerGrafico={setControllerGraficoVendaDia} />
        <VendasCard headerColor="bg-red-300" bgColor="bg-red-100" title="Valor Em Vendas (Dia)" data={preencherGraficoVendasValorDiaria()} chartType={controllerGraficoVendaValorDia} setControllerGrafico={setControllerGraficoVendaValorDia} />
        <ProdutosVendaCard title="Top 5 Produtos Mais Vendidos" data={topProdutos} chartType={controllerGraficoTopProduto} setControllerGraficoTopProduto={setControllerGraficoTopProduto} />
      </div>
      {
        //Clientes
      }
      <hr className="my-6 border-gray-300" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Clientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8">
        <InfoClienteCard title="Total de Clientes" value={totalClientes} IconComponent={FaUsers} />
        <InfoClienteCard title="Novos Clientes (Este Mês)" value={novosClientes} IconComponent={FaArrowUp} />
      </div>
      <div className="grid grid-cols-1 gap-6 mb-8">
        <TopClientesCard clients={topClients} />
      </div>
      {
        //Crediario
      }
      <hr className="my-6 border-gray-300" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Crediário</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <InfoCardTotalCrediario title={"Total crediario"} value={Brl(valorTotalCrediario)} IconComponent={FaDollarSign} iconColor={"bg-blue-500"} />
        <InfoCardTotalCrediario title={"Total Parcelas"} value={totalCrediario} IconComponent={BsListOl} iconColor={"bg-blue-500"} />
        <InfoCardTotalCrediario title={"Total em Atraso"} value={Brl(valorEmAtraso)} IconComponent={FaDollarSign} iconColor={"bg-red-500"} />
        <InfoCardTotalCrediario title={"Total Parcelas em Atraso"} value={crediarioEmAtraso} IconComponent={BsListOl} iconColor={"bg-red-500"} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8">
        <CrediarioCLientes title={"A vencer este Mês"} parcelas={parcelasCrediario} color1={"bg-blue-100"} color2={"bg-blue-50"} />
        <CrediarioCLientes title={"Em Atraso"} parcelas={parcelasEmAtraso} color1={"bg-red-100"} color2={"bg-red-50"} />
      </div>
      {
        //Estoque
      }
      <hr className="my-6 border-gray-300" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Estoque</h2>
      <div className="grid grid-cols-1 gap-6 mb-8">
        <EstoqueCard totalInventory={totalInventory} lowStockCount={numberLowStockProducts} />
        <ProdutosBaixoEstoqueCard products={lowStockProducts} openEntradaProdutoModal={openEntradaProdutoModal} />
      </div>
    </div>
  );
};

function InfoGeralCard({ title, value, IconComponent, bgColor }) {
  return (
    <div className={`bg-gray-100 p-6 rounded-md shadow-md flex items-center space-x-4`}>
      <div className="p-3 rounded-full bg-blue-500 text-white">
        <IconComponent size={24} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function VendasCard({ title, data, chartType, setControllerGrafico, bgColor, headerColor }) {
  let ChartComponent;
  if (!data) {
    return null; // ou algum tipo de componente de carregamento
  }

  switch (chartType) {
    case 'bar':
      ChartComponent = BarChart;
      break;
    case 'line':
      ChartComponent = LineChart;
      break;
    case 'pie':
      ChartComponent = PieChart;
      break;
    default:
      ChartComponent = BarChart;
      break;
  }

  return (
    <div className={`${bgColor} bg-gray-100 shadow-md rounded-lg overflow-hidden`}>
      <div className={`${headerColor} w-full p-6 rounded-t-lg flex justify-between items-center`}>
        <h3 className={`text-lg font-bold text-gray-700 uppercase`}>{title}</h3>
        <div className="flex gap-4">
          <button className="text-gray-700 hover:text-green-600" onClick={() => { setControllerGrafico("bar") }}>
            <AiOutlineBarChart size={32} />
          </button>
          <button className="text-gray-700 hover:text-green-600" onClick={() => { setControllerGrafico("line") }}>
            <AiOutlineLineChart size={32} />
          </button>
        </div>
      </div>
      <div className="flex-grow p-6">
        <ChartComponent data={data} />
      </div>
    </div>
  );
}

function ProdutosVendaCard({ title, data, chartType, setControllerGraficoTopProduto }) {
  let ChartComponent;
  if (!data) {
    return null; // ou algum tipo de componente de carregamento
  }

  switch (chartType) {
    case 'bar':
      ChartComponent = BarChart;
      break;
    case 'line':
      ChartComponent = LineChart;
      break;
    case 'pie':
      ChartComponent = PieChart;
      break;
    default:
      ChartComponent = BarChart;
      break;
  }

  return (
    <div className="bg-gray-100 rounded-md shadow-md flex flex-col">
      <div className="w-full flex justify-between items-center bg-gray-200 p-6 rounded-t-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-4">
          <button className="text-black hover:text-green-600" onClick={() => { setControllerGraficoTopProduto("bar") }}>
            <AiOutlineBarChart size={32} />
          </button>
          <button className="text-black hover:text-green-600" onClick={() => { setControllerGraficoTopProduto("line") }}>
            <AiOutlineLineChart size={32} />
          </button>
        </div>
      </div>

      <div className="flex-grow p-6">
        <ChartComponent data={data} />
      </div>
    </div>
  );
}

function InfoClienteCard({ title, value, IconComponent }) {
  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md flex items-center space-x-4">
      <div className="p-3 rounded-full bg-blue-500 text-white">
        <IconComponent size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl">{value}</p>
      </div>
    </div>
  );
}

function TopClientesCard({ clients }) {
  // Criar uma nova lista de clientes, ordenada pelo total de compras
  const sortedClients = [...clients].sort((a, b) => b.quantidade_de_vendas - a.quantidade_de_vendas);

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-black">Top 5 Clientes</h3>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Nome do Cliente</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider">Vendas</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedClients.map((client, index) => (
              <tr key={index++} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                <td className="px-6 py-4 text-sm text-gray-500">{client.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-500 text-center">{client.quantidade_de_vendas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EstoqueCard({ totalInventory, lowStockCount }) {
  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md h-full overflow-hidden">
      <h3 className="text-lg font-medium text-gray-500 mb-4">Estoque</h3>
      <div className="flex flex-col sm:flex-row gap-8 sm:justify-around">
        <div className="flex justify-around items-center">
          <FaBox size={36} className="mr-2 text-blue-500" />
          <div className='flex flex-col items-center'>
            <h4 className="text-sm font-medium text-gray-500">Total em Estoque</h4>
            <p className="text-2xl font-bold text-gray-900">{parseFloat(totalInventory).toFixed(2)}</p>
          </div>
        </div>
        <div className="flex justify-around items-center">
          <FaExclamationTriangle size={36} className="mr-2 text-red-500" />
          <div className='flex flex-col items-center'>
            <h4 className="text-sm font-medium text-gray-500">Produtos com baixo estoque</h4>
            <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProdutosBaixoEstoqueCard({ products, openEntradaProdutoModal }) {
  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md h-full">
      <div className="flex items-center mb-4">
        <FaExclamationTriangle size={24} className="mr-4 text-red-500" />
        <h3 className="text-lg font-medium text-gray-500">Produtos com baixo estoque</h3>
      </div>
      <div className="overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th scope="col" className="px-3 md:px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Nome do Produto</th>
              <th scope="col" className="hidden px-3 md:px-6 py-3 lg:table-cell text-left text-xs font-medium text-black uppercase tracking-wider">Cód de Barras</th>
              <th scope="col" className="hidden px-3 md:px-6 py-3 lg:table-cell text-left text-xs font-medium text-black uppercase tracking-wider">Cor</th>
              <th scope="col" className="hidden px-3 md:px-6 py-3 lg:table-cell text-left text-xs font-medium text-black uppercase tracking-wider">Tamanho</th>
              <th scope="col" className="px-3 md:px-6 py-3 text-xs font-medium text-black uppercase tracking-wider text-center">Estoque</th>
              <th scope="col" className="px-3 md:px-6 py-3 text-xs font-medium text-black uppercase tracking-wider text-center">Estoque Min</th>
              <th scope="col" className="px-3 md:px-6 py-3 text-xs font-medium text-black uppercase tracking-wider text-center">Entrada</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={index++} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                <td className="px-3 md:px-6 py-4 text-sm text-gray-500">{product.nome}</td>
                <td className="hidden px-3 md:px-6 py-4 lg:table-cell text-sm text-gray-500">{product.codigo_barras}</td>
                <td className="hidden px-3 md:px-6 py-4 lg:table-cell text-sm text-gray-500">{product.cor_nome}</td>
                <td className="hidden px-3 md:px-6 py-4 lg:table-cell text-sm text-gray-500">{product.tamanho_nome}</td>
                <td className="px-3 md:px-6 py-4 text-sm text-gray-500 text-center">{product.quantidade}</td>
                <td className="px-3 md:px-6 py-4 text-sm text-gray-500 text-center">{product.quantidade_min}</td>
                <td className="px-3 md:px-6 py-4 text-sm text-gray-500 text-center">
                  <button onClick={() => openEntradaProdutoModal(product)}>
                    <div className="p-1 rounded-full bg-blue-500 text-white">
                      <FaArrowUp size={12} />
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function InfoCardTotalCrediario({ title, value, IconComponent, iconColor }) {
  return (<>
    <div className="flex-1 bg-gray-100 p-6 rounded-md shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${iconColor} text-white`}>
        <IconComponent size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl">{value}</p>
      </div>
    </div>
  </>)
}

function CrediarioCLientes({ title, parcelas, color1, color2 }) {
  return (
    <>
      <div className={`${color2} p-6 rounded-md shadow-md`}>
        <div className="flex flex-row justify-between">
          <h3 className="text-lg font-semibold mb-4 text-black">{title}</h3>
          {/* <a href="/crediario"><BsBarChart /></a> */}
        </div>
        <div className="flex shadow border-b border-gray-200 rounded-lg max-h-[300px] overflow-auto relative">
          <table className="min-w-full divide-y divide-gray-400">
            <thead className={`${color1} sticky top-0`}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Data Vencimento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Venda</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Nome do Cliente</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium text-black uppercase tracking-wider text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="w-full divide-y divide-gray-400">
              {parcelas && parcelas.map((parcela, index) => (
                <tr key={index} className={index % 2 === 0 ? color1 : color2}>
                  <td className="px-6 py-4 text-sm text-gray-500">{utcStringToDateLocal(parcela.data_vencimento)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500"><a className="hover:underline" href={`/newPdv/${parcela.venda_id}`}>{parcela.venda_id}</a></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{parcela.nome_cliente}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">{Brl(parcela.valor_a_receber)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
