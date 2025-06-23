
import { useEffect, useState } from "react";
import { get } from "../../services/api";
import * as XLSX from 'xlsx';
import { RelatorioVendasTotais } from "../RelatorioVendasTotais";
import { RelatorioVendasPorProdutos } from "../RelatorioVendasPorProdutos";
import { RelatorioVendasPorCategorias } from "../RelatorioVendasPorCategorias";
import { RelatorioEstoqueNivel } from "../RelatorioEstoqueNivel";
import { RelatorioEstoqueValor } from "../RelatorioEstoqueValor";
import { RelatorioReceitas } from "../RelatorioReceitas";
import { RelatorioFormasPagamento } from "../RelatorioFormasPagamento";
import { RelatorioFrequenciaCompraClientes } from "./frequenciaCompra";
import { RelatorioLucroBrutoPorProduto } from "../relatorioLucroBrutoPorProduto";
import { RelatorioVendasVendedor } from "../relatorioVendasVendedor";
import { RelatorioComissaoVendedor } from "../relatorioComissao";
import { RelatorioCrediario } from "../relatorioCrediario";
import { RelatorioCrediarioCliente } from "../relatorioCrediarioCliente";
import { RelatorioContaReceberPorPeriodo } from "../relatorioContaReceberPorPeriodo";

export const RelatorioComponent = () => {
  const [currentTab, setCurrentTab] = useState("");

  const components = {
    vendasTotais: <RelatorioVendasTotais />,
    vendasPorProdutos: <RelatorioVendasPorProdutos />,
    vendasPorCategoriasProduto: <RelatorioVendasPorCategorias />,
    estoqueNivel: <RelatorioEstoqueNivel />,
    estoqueValor: <RelatorioEstoqueValor />,
    receitas: <RelatorioReceitas />,
    financeiroFormasPagamento: <RelatorioFormasPagamento />,
    frequenciaCompra: <RelatorioFrequenciaCompraClientes />,
    lucroBrutoPorProturo: <RelatorioLucroBrutoPorProduto />,
    vendasPorVendedor: <RelatorioVendasVendedor />,
    comissaoPorVendedor: <RelatorioComissaoVendedor />,
    crediarioPorPeriodo: <RelatorioCrediario />,
    crediarioPorCliente: <RelatorioCrediarioCliente />,
    contaReceberPorPeriodo: <RelatorioContaReceberPorPeriodo />
  }

  return (
    <div className="px-5 mt-4 w-full">
      <MenuRelatorios setCurrentTab={setCurrentTab} currentTab={currentTab} />
      {components[currentTab]}
    </div>
  );
};

function MenuRelatorios({ setCurrentTab, currentTab }) {
  const [hiddenMenuRelatorios, setHiddenMenuRelatorios] = useState('hidden');
  const [hiddenSubMenuVendas, setHiddenSubMenuVendas] = useState('hidden');
  const [hiddenSubMenuEstoque, setHiddenSubMenuEstoque] = useState('hidden');
  const [hiddenSubMenuFinanceiro, setHiddenSubMenuFinanceiro] = useState('hidden');
  // Inicio Controladores Menu
  const openMenuRelatorios = () => {
    if (hiddenMenuRelatorios == "hidden") {
      setHiddenMenuRelatorios("")
    } else {
      setHiddenMenuRelatorios("hidden");
    }
  }

  const openSubMenuVendas = () => {
    if (hiddenSubMenuVendas == "hidden") {
      setHiddenSubMenuVendas("")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setHiddenSubMenuVendas("hidden");
    }
  }

  const openSubMenuEstoque = () => {
    if (hiddenSubMenuEstoque == "hidden") {
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setHiddenSubMenuEstoque("hidden");
    }
  }

  const openSubMenuFinanceiro = () => {
    if (hiddenSubMenuFinanceiro == "hidden") {
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("");
    } else {
      setHiddenSubMenuFinanceiro("hidden");
    }
  }
  // Fim Controladores Menu

  // Inicio Controladores Componente
  const openVendasTotais = () => {
    if (currentTab !== "vendasTotais") {
      setCurrentTab("vendasTotais");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  }

  const openVendasPorProdutos = () => {
    if (currentTab !== "vendasPorProdutos") {
      setCurrentTab("vendasPorProdutos");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");

    } else {
      setCurrentTab("");
    }
  }

  const openLucroBrutoPorProdutos = () => {
    if (currentTab !== "lucroBrutoPorProturo") {
      setCurrentTab("lucroBrutoPorProturo");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");

    } else {
      setCurrentTab("");
    }
  }

  const openVendasPorCategoriasProduto = () => {
    if (currentTab !== "vendasPorCategoriasProduto") {
      setCurrentTab("vendasPorCategoriasProduto");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");

    } else {
      setCurrentTab("");
    }
  }

  const openEstoqueNivel = () => {
    if (currentTab !== "estoqueNivel") {
      setCurrentTab("estoqueNivel");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");

    } else {
      setCurrentTab("");
    }
  }

  const openEstoqueValor = () => {
    if (currentTab !== "estoqueValor") {
      setCurrentTab("estoqueValor");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  }

  const openReceitas = () => {
    if (currentTab !== "receitas") {
      setCurrentTab("receitas");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");

    } else {
      setCurrentTab("");
    }
  }

  const openFinanceiroFormasPagamento = () => {
    if (currentTab !== "financeiroFormasPagamento") {
      setCurrentTab("financeiroFormasPagamento");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  }

  const openFrequenciaCompra = () => {
    if (currentTab !== "frequenciaCompra") {
      setCurrentTab("frequenciaCompra");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  };

  const openVendasPorVendedor = () => {
    if (currentTab !== "vendasPorVendedor") {
      setCurrentTab("vendasPorVendedor");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  };

  const openComissaoPorVendedor = () => {
    if (currentTab !== "comissaoPorVendedor") {
      setCurrentTab("comissaoPorVendedor");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  };

  const openRelatorioCrediario = () => {
    if (currentTab !== "crediarioPorPeriodo") {
      setCurrentTab("crediarioPorPeriodo");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  };

  const openRelatorioCrediarioCliente = () => {
    if (currentTab !== "crediarioPorCliente") {
      setCurrentTab("crediarioPorCliente");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  };

  const openRelatorioContaReceberPorPeriodo = () => {
    if (currentTab !== "contaReceberPorPeriodo") {
      setCurrentTab("contaReceberPorPeriodo");
      setHiddenSubMenuVendas("hidden")
      setHiddenSubMenuEstoque("hidden");
      setHiddenSubMenuFinanceiro("hidden");
    } else {
      setCurrentTab("");
    }
  };

  // Fim Controladores Componente

  return (
    <nav className="bg-gray-200 border-gray-700 rounded">
      <div className="flex flex-wrap items-center justify-between p-4">
        <div className="flex items-center">
          <h1 className="px-5 font-bold text-3xl text-gray-700">
            Relatórios
          </h1>
        </div>
        <button data-collapse-toggle="navbar-dropdown" onClick={openMenuRelatorios} type="button" className="inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg md:hidden hover:bg-applojaDark focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </button>
        <div className={hiddenMenuRelatorios + " w-full md:block md:w-auto"} id="navbar-dropdown">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-200 md:bg-gray-200 border-gray-700">
            <li>
              <div className="">
                <button onClick={openSubMenuVendas} id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 pl-3 pr-4 rounded md:border-0 md:p-0 md:w-auto text-gray-700 focus:text-gray-600">
                  Vendas
                  <svg className="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd">
                    </path>
                  </svg>
                </button>
                <div id="dropdownNavbar" className={hiddenSubMenuVendas + " z-10 w-full md:w-52 md:absolute md:rounded font-normal bg-gray-300"}>
                  <ul className="text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                    <li>
                      <a onClick={openVendasTotais} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Vendas Totais</a>
                    </li>
                    <li>
                      <a onClick={openVendasPorProdutos} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Vendas por Produto</a>
                    </li>
                    <li>
                      <a onClick={openVendasPorCategoriasProduto} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Vendas por Categoria de Produto</a>
                    </li>
                    <li>
                      <a onClick={openLucroBrutoPorProdutos} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Lucro Bruto Por Produto</a>
                    </li>
                    <li>
                      <a onClick={openVendasPorVendedor} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Vendas por Vendedor</a>
                    </li>
                    <li>
                      <a onClick={openFrequenciaCompra} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Frequência de Compra</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="">
                <button onClick={openSubMenuEstoque} id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 pl-3 pr-4 rounded md:border-0 md:p-0 md:w-auto text-gray-700 focus:text-gray-600">
                  Estoque
                  <svg className="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd">
                    </path>
                  </svg>
                </button>
                <div id="dropdownNavbar" className={hiddenSubMenuEstoque + " z-10 w-full md:w-52 md:absolute md:rounded font-normal bg-gray-300"}>
                  <ul className="text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                    <li>
                      <a onClick={openEstoqueNivel} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Nível do Estoque</a>
                    </li>
                    <li>
                      <a onClick={openEstoqueValor} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Valor do Estoque</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <div className="">
                <button onClick={openSubMenuFinanceiro} id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 pl-3 pr-4 rounded md:border-0 md:p-0 md:w-auto text-gray-700 focus:text-gray-600">
                  Financeiro
                  <svg className="w-5 h-5 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd">
                    </path>
                  </svg>
                </button>
                <div id="dropdownNavbar" className={hiddenSubMenuFinanceiro + " z-10 w-full md:right-8 md:w-52 md:absolute md:rounded font-normal bg-gray-300"}>
                  <ul className="text-sm text-gray-700" aria-labelledby="dropdownLargeButton">
                    <li>
                      <a onClick={openReceitas} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Receitas</a>
                    </li>
                    <li>
                      <a onClick={openComissaoPorVendedor} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Comissao Vendedores</a>
                    </li>
                    <li>
                      <a onClick={openFinanceiroFormasPagamento} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Financeiro por Formas de Pagamento</a>
                    </li>
                    <li>
                      <a onClick={openRelatorioCrediario} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Crediario Por Periodo</a>
                    </li>
                    <li>
                      <a onClick={openRelatorioCrediarioCliente} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Crediario Por Cliente</a>
                    </li>
                    <li>
                      <a onClick={openRelatorioContaReceberPorPeriodo} className="block px-4 py-2 hover:bg-gray-400 cursor-pointer">Conta Receber Por Periodo</a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}