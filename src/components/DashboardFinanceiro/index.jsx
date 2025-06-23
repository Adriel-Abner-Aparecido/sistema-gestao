import { useState } from "react";
import { useEffect } from "react";
import { get } from "../../services/api";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaArrowUp, FaArrowDown, FaCalendarAlt } from 'react-icons/fa';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DashboardFinanceiro = (props) => {
  const [username, setUsername] = useState("");
  const [listContasMesAtual, setListContasMesAtual] = useState([]);
  const [listContasMesAnterior, setListContasMesAnterior] = useState([]);
  const [pageAtual, setPageAtual] = useState(1);
  const [ultimaPagina, setUltimaPagina] = useState();
  const [loading, setLoading] = useState(false);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [totalReceitasMesAnterior, setTotalReceitasMesAnterior] = useState(0);
  const [totalDespesasMesAnterior, setTotalDespesasMesAnterior] = useState(0);
  const [nomeMesAtual, setNomeMesAtual] = useState("");
  const [nomeMesAnterior, setNomeMesAnterior] = useState("");

  // Função para obter o nome do mês atual
  const getNomeMesAtual = () => {
    const hoje = new Date();
    const mesAtual = subMonths(hoje, 0);
    return format(mesAtual, 'MMMM', { locale: ptBR });
  };

  // Função para obter o nome do mês anterior
  const getNomeMesAnterior = () => {
    const hoje = new Date();
    const mesAnterior = subMonths(hoje, 1);
    return format(mesAnterior, 'MMMM', { locale: ptBR });
  };

  const loadAll = async () => {
    setLoading(true);

    const startDataMesAtual = '2023-12-01';
    const endDataMesAtual = '2023-12-31';

    get(process.env.NEXT_PUBLIC_API_URL + '/contapagarbydate?startDate=' + startDataMesAtual + '&endDate=' + endDataMesAtual).then((data) => {
      if (data.mensagem) {
        if (data.mensagem == "falha na autenticação") {
          console.log('falha na autenticação');

          localStorage.removeItem("applojaweb_token");
        }
      } else {
        setListContasMesAtual([]);
        for (let i = 0; i < data.length; i++) {
          let dataConta = {
            tipo: 1,
            data: data[i].data_vencimento,
            recebimento: data[i].tipo,
            cliente: data[i].cliente,
            valor: data[i].valor,
            formaPagamento: data[i].forma_de_pagamento,
            situação: "Pago"
          }

          setListContasMesAtual(old => [...old, dataConta]);
        }

        setLoading(false);
      }
    }).catch((error) => {
      console.error("Erro ao buscar contas:", error);
      setLoading(false);
    });

    get(process.env.NEXT_PUBLIC_API_URL + '/contareceberbydate?startDate=' + startDataMesAtual + '&endDate=' + endDataMesAtual).then((data) => {
      if (data.mensagem) {
        if (data.mensagem == "falha na autenticação") {
          console.log('falha na autenticação');
          localStorage.removeItem("applojaweb_token");
        }
      } else {
        for (let i = 0; i < data.length; i++) {
          let dataConta = {
            tipo: 0,
            data: data[i].data_vencimento,
            recebimento: data[i].tipo,
            cliente: data[i].cliente,
            valor: data[i].valor,
            formaPagamento: data[i].forma_de_pagamento,
            situação: "Pago"
          }

          setListContasMesAtual(old => [...old, dataConta]);
        }

        setLoading(false);
      }
    }).catch((error) => {
      console.error("Erro ao buscar contas:", error);
      setLoading(false);
    });

    const startDataMesAnterior = '2023-11-01';
    const endDataMesAnterior = '2023-11-31';

    get(process.env.NEXT_PUBLIC_API_URL + '/contapagarbydate?startDate=' + startDataMesAnterior + '&endDate=' + endDataMesAnterior).then((data) => {
      if (data.mensagem) {
        if (data.mensagem == "falha na autenticação") {
          console.log('falha na autenticação');

          localStorage.removeItem("applojaweb_token");
        }
      } else {
        setListContasMesAnterior([]);
        for (let i = 0; i < data.length; i++) {
          let dataConta = {
            tipo: 1,
            data: data[i].data_vencimento,
            recebimento: data[i].tipo,
            cliente: data[i].cliente,
            valor: data[i].valor,
            formaPagamento: data[i].forma_de_pagamento,
            situação: "Pago"
          }

          setListContasMesAnterior(old => [...old, dataConta]);
        }

        setLoading(false);
      }
    }).catch((error) => {
      console.error("Erro ao buscar contas:", error);
      setLoading(false);
    });

    get(process.env.NEXT_PUBLIC_API_URL + '/contareceberbydate?startDate=' + startDataMesAnterior + '&endDate=' + endDataMesAnterior).then((data) => {
      if (data.mensagem) {
        if (data.mensagem == "falha na autenticação") {
          console.log('falha na autenticação');
          localStorage.removeItem("applojaweb_token");
        }
      } else {
        console.log("data", data)
        for (let i = 0; i < data.length; i++) {
          let dataConta = {
            tipo: 0,
            data: data[i].data_vencimento,
            recebimento: data[i].tipo,
            cliente: data[i].cliente,
            valor: data[i].valor,
            formaPagamento: data[i].forma_de_pagamento,
            situação: "Pago"
          }

          setListContasMesAnterior(old => [...old, dataConta]);
        }

        setLoading(false);
      }
    }).catch((error) => {
      console.error("Erro ao buscar contas:", error);
      setLoading(false);
    });

  }

  useEffect(() => {
    let receitasMesAnterior = 0;
    let despesasMesAnterior = 0;

    listContasMesAnterior.forEach(conta => {
      if (conta.tipo === 0) { // Tipo 0 para receitas
        receitasMesAnterior += parseFloat(conta.valor);
      } else if (conta.tipo === 1) { // Tipo 1 para despesas
        despesasMesAnterior += parseFloat(conta.valor);
      }
    });

    setTotalReceitasMesAnterior(receitasMesAnterior);
    setTotalDespesasMesAnterior(despesasMesAnterior);
  }, [listContasMesAnterior]);

  // Função para ordenar listContas por data
  const sortListContasByDate = () => {
    setListContasMesAtual((currentList) => {
      return [...currentList].sort((a, b) => {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return dateB - dateA; // Ordena do mais recente para o mais antigo
      });
    });
  };

  useEffect(() => {
    setListContasMesAtual([])

    loadAll().then(() => {
      // Após carregar os dados, organiza a lista por data
      sortListContasByDate();
    });

    setNomeMesAtual(getNomeMesAtual);
    setNomeMesAnterior(getNomeMesAnterior)
  }, [props.contaPagarSelecionado, pageAtual]);

  const isCurrentMonth = (isoDateString) => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const dataConta = new Date(isoDateString);

    return dataConta.getMonth() === mesAtual && dataConta.getFullYear() === anoAtual;
  };

  // Função para calcular o total de receitas e despesas
  const calculateTotals = () => {
    let receitasDoMesAtual = 0;
    let despesasDoMesAtual = 0;

    listContasMesAtual.forEach(conta => {
      if (isCurrentMonth(conta.data)) {
        if (conta.tipo === 0) { // Tipo 0 para receitas
          receitasDoMesAtual += parseFloat(conta.valor);
        } else if (conta.tipo === 1) { // Tipo 1 para despesas
          despesasDoMesAtual += parseFloat(conta.valor);
        }
      }
    });

    setTotalReceitas(receitasDoMesAtual);
    setTotalDespesas(despesasDoMesAtual);
  };

  // Atualizar totais quando listContas mudar
  useEffect(() => {
    calculateTotals();
  }, [listContasMesAtual]);

  const getRowColor = (tipo) => {
    return tipo === 0 ? 'bg-green-100' : 'bg-red-100';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque getMonth() retorna 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const primeiraLetraMaiuscula = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const calcularDiferencaPercentual = (valorAtual, valorAnterior) => {
    if (valorAnterior === 0) return 0;
    return ((valorAtual - valorAnterior) / valorAnterior * 100).toFixed(2);
  };

  return (
    <div className="px-5 mt-4 w-full">
      <h1 className="text-2xl mb-4">
        Olá, <span className="font-bold">{username}</span>
      </h1>
      {
        //Visão Geral
      }
      <h2 className="text-2xl font-semibold text-gray-900 mb-4" onClick={() => console.log(listContasMesAtual)}>Visão geral</h2>
      <div className="flex flex-row gap-4 justify-center">
        <IoIosArrowBack size={32} className="cursor-pointer" />
        <h3 className="text-2xl text-gray-900 mb-4 font-semibold">{primeiraLetraMaiuscula(nomeMesAtual) + " " + new Date().getFullYear()}</h3>
        <IoIosArrowForward size={32} className="cursor-pointer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <InfoGeralCard title="Contas à Receber (Mês atual)" value={totalReceitas.toFixed(2)} IconComponent={FaArrowUp} />
        <InfoGeralCard title="Contas à Pagar (Mês atual)" value={totalDespesas.toFixed(2)} IconComponent={FaArrowDown} />
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Receitas e Despesas</h2>
        <table className="w-full text-sm text-left text-gray-500 shadow-md">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="py-3 px-6">Data</th>
              <th scope="col" className="py-3 px-6">Descrição</th>
              <th scope="col" className="py-3 px-6">Cliente/Fornecedor</th>
              <th scope="col" className="py-3 px-6">Valor</th>
              <th scope="col" className="py-3 px-6">Forma de Pagamento</th>
              <th scope="col" className="py-3 px-6">Situação</th>
            </tr>
          </thead>
          <tbody>
            {listContasMesAtual.map((item, index) => (
              <tr key={index} className={getRowColor(item.tipo)}>
                <td className="py-4 px-6">{formatDate(item.data)}</td>
                <td className="py-4 px-6">{item.recebimento || item.pagamento}</td>
                <td className="py-4 px-6">{item.cliente || item.fornecedor}</td>
                <td className="py-4 px-6">{item.valor.toFixed(2)}</td>
                <td className="py-4 px-6">{item.formaPagamento}</td>
                <td className="py-4 px-6">{item.situação}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Nova seção para comparação de receitas e despesas */}
      <div className="my-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Comparativo de Receitas e Despesas</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <FaCalendarAlt size={24} />
              <h3 className="text-2xl font-semibold text-gray-900">{primeiraLetraMaiuscula(nomeMesAnterior)}</h3>
            </div>
            <InfoGeralCard title="Receita Mês Anterior" value={totalReceitasMesAnterior.toFixed(2)} IconComponent={FaArrowUp} />
            <InfoGeralCard title="Despesa Mês Anterior" value={totalDespesasMesAnterior.toFixed(2)} IconComponent={FaArrowDown} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <h3 className="text-2xl font-semibold text-gray-900">Diferença (%)</h3>
            </div>
            <InfoGeralCard title="Diferença de Receita (%)" value={calcularDiferencaPercentual(totalReceitas, totalReceitasMesAnterior) + '%'} IconComponent={FaArrowUp} />
            <InfoGeralCard title="Diferença de Despesa (%)" value={calcularDiferencaPercentual(totalDespesas, totalDespesasMesAnterior) + '%'} IconComponent={FaArrowDown} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
              <FaCalendarAlt size={24} />
              <h3 className="text-2xl font-semibold text-gray-900">{primeiraLetraMaiuscula(nomeMesAtual)}</h3>
            </div>
            <InfoGeralCard title="Receita Este Mês" value={totalReceitas.toFixed(2)} IconComponent={FaArrowUp} />
            <InfoGeralCard title="Despesa Este Mês" value={totalDespesas.toFixed(2)} IconComponent={FaArrowDown} />
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoGeralCard({ title, value, IconComponent }) {
  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md flex items-center space-x-4">
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
