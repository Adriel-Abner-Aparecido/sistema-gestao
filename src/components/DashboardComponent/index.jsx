import { PieChart } from "../PieChart";
import { LineChart } from "../LineChart";
import { BarChart } from "../BarChart/BarChart";
import { FaShoppingBag } from 'react-icons/fa';


// icons
import { FiFileText, FiUsers } from "react-icons/fi";
import { MdSell, MdAttachMoney } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { AiOutlineClockCircle, AiFillLock } from "react-icons/ai";
import { IoTodayOutline } from "react-icons/io5";
import { useState } from "react";
import { useEffect } from "react";
import { get } from "../../services/api";
import Router from "next/router";

export const DashboardComponent = () => {

  const [username, setUsername] = useState("");
  const [totalVendasMesAtual, setTotalVendasMesAtual] = useState([]);
  const [totalVendasDiaAtual, setTotalVendasDiaAtual] = useState([]);
  const [totalVendasAnoAtual, setTotalVendasAnoAtual] = useState([]);
  const [valorVendasFinalizadas, setValorVendasFinalizadas] = useState(0);
  const [valorVendasAbertas, setValorVendasAbertas] = useState(0);
  const [totalVendasDiasMes, setTotalVendasDiaMes] = useState([]);
  const [totalProdutos, setTotalProdutos] = useState(0);

  const loadAll = () => {
    get(process.env.NEXT_PUBLIC_API_URL + '/vendasmesatual').then((res) => {
      if (res.mensagem) {
        if (res.mensagem == "falha na autenticação") {
          console.log('falha na autenticação');

          localStorage.removeItem("applojaweb_token");
          Router.push('/login');
        }
      } else {
        setTotalVendasMesAtual(res);
      }
    })
    get(process.env.NEXT_PUBLIC_API_URL + '/vendasdiaatual').then((res) => {
      setTotalVendasDiaAtual(res);
    })

    get(process.env.NEXT_PUBLIC_API_URL + '/vendasanoatual').then((res) => {
      setTotalVendasAnoAtual(res);
    })

    get(process.env.NEXT_PUBLIC_API_URL + '/produtos').then((res) => {
      setTotalProdutos(res.length)
    })
  }

  const preencherGanhoDiario = () => {
    let ganhoDiario = 0;
    for (let i = 0; i < totalVendasDiaAtual.length; i++) {

      ganhoDiario = ganhoDiario + totalVendasDiaAtual[i].valor;
    }

    return ganhoDiario
  }

  const preencherVendasFinalizadas = () => {
    let valorVendasFinalizadas = 0;

    const vendasFinalizadas = Object.values(totalVendasDiaAtual).filter((obj) => {
      if (obj.status == 'Finalizado') {
        return obj;
      }
    })

    for (let i = 0; i < vendasFinalizadas.length; i++) {

      valorVendasFinalizadas = valorVendasFinalizadas + vendasFinalizadas[i].valor;
    }

    setValorVendasFinalizadas(valorVendasFinalizadas);
  }

  const preencherVendasAbertas = () => {
    let valorVendasAbertas = 0;

    const vendasAbertas = Object.values(totalVendasDiaAtual).filter((obj) => {
      if (obj.status == 'Aguardando') {
        return obj;
      }
    })

    for (let i = 0; i < vendasAbertas.length; i++) {

      valorVendasAbertas = valorVendasAbertas + vendasAbertas[i].valor;
    }

    setValorVendasAbertas(valorVendasAbertas);
  }

  const preencherGraficoBarrasMensais = () => {

    let jan = 0;
    let fev = 0;
    let mar = 0;
    let abr = 0;
    let mai = 0;
    let jun = 0;
    let jul = 0;
    let ago = 0;
    let set = 0;
    let out = 0;
    let nov = 0;
    let dez = 0;

    for (let i = 0; i < totalVendasAnoAtual.length; i++) {
      let data = new Date(totalVendasAnoAtual[i].data);

      if (data.getMonth() == 0) {
        jan = jan + 1;
      } else if (data.getMonth() == 1) {
        fev = fev + 1;
      } else if (data.getMonth() == 2) {
        mar = mar + 1;
      } else if (data.getMonth() == 3) {
        abr = abr + 1;
      } else if (data.getMonth() == 4) {
        mai = mai + 1;
      } else if (data.getMonth() == 5) {
        jun = jun + 1;
      } else if (data.getMonth() == 6) {
        jul = jul + 1;
      } else if (data.getMonth() == 7) {
        ago = ago + 1;
      } else if (data.getMonth() == 8) {
        set = set + 1;
      } else if (data.getMonth() == 9) {
        out = out + 1;
      } else if (data.getMonth() == 10) {
        nov = nov + 1;
      } else if (data.getMonth() == 11) {
        dez = dez + 1;
      }
    }

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
          data: [jan, fev, mar, abr, mai, jun, jul, ago, set, out, nov, dez],
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(60, 99, 71, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(60, 99, 71, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return vendasMensais
  }

  const preencherGraficoBarrasDiario = () => {
    const dataAtual = new Date()
    const dadosDiasDoMes = [];
    let diasNoMes = new Date(dataAtual.getFullYear(), (dataAtual.getMonth() + 1), 0).getDate()


    for (let i = 1; i <= diasNoMes; i++) {
      let dadosDiasAtual = 0


      for (let j = 0; j < totalVendasMesAtual.length; j++) {
        let data = new Date(totalVendasMesAtual[j].data);
        let dia = data.getDate();

        if (dia == i) {
          dadosDiasAtual = dadosDiasAtual + 1
        }
      }
      dadosDiasDoMes.push(dadosDiasAtual)
    }

    const labelsDiaDoMes = []

    for (let i = 0; i < diasNoMes; i++) {
      labelsDiaDoMes.push('' + (i + 1) + '')
    }

    let vendasMensais = {
      labels: labelsDiaDoMes,
      datasets: [
        {
          label: "Vendas",
          data: dadosDiasDoMes,
          backgroundColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(60, 99, 71, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(60, 99, 71, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(60, 150, 163, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return vendasMensais
  }

  useEffect(() => {
    loadAll();
    setUsername(localStorage.getItem("applojaweb_user_name"));
  }, [])

  useEffect(() => {
    preencherVendasAbertas();
    preencherVendasFinalizadas();
  }, [totalVendasDiaAtual])

  const pontoPorVirgula = (valor) => {
    let valorString;
    valorString = valor.toString().replace(".", ",");
    return valorString;
  }

  return (
    <div className="px-5 mt-4 w-full">
      <h1 className="text-2xl">
        Olá, <span className="font-bold">{username}</span>
      </h1>
      <div className="flex flex-row flex-wrap gap-4">
        {/* total de vendas */}
        <div className="w-full h-28 md:w-32% text-center rounded-lg border  flex flex-row justify-center bg-slate-300 hover:bg-slate-200 transition duration-300 ease-in-out hover:scale-x-100">
          <div className="w-1/3 flex flex-col items-center justify-center">
            <FiFileText size={60} />
          </div>
          <div className="w-2/3 flex flex-col items-center justify-center">
            <span className="text-black flex justify-center">
              Total de vendas (mês)
            </span>
            <h1 className="font-bold text-3xl">{totalVendasMesAtual.length}</h1>
          </div>
        </div>
        {/* ganhos */}
        <div className="w-full h-28 md:w-32% text-center rounded-lg border  flex flex-row justify-center bg-slate-300 hover:bg-slate-200 transition duration-300 ease-in-out hover:scale-100">
          <div className="w-1/3 flex flex-col items-center justify-center">
            <IoTodayOutline size={60} />
          </div>
          <div className="w-2/3 flex flex-col items-center justify-center">
            <span className="text-black flex justify-center">Vendas do dia</span>
            <h1 className="font-bold text-3xl">R${pontoPorVirgula(preencherGanhoDiario().toFixed(2))}</h1>
          </div>
        </div>
        {/* a receber */}
        <div className=" w-full h-28 md:w-32% text-center rounded-lg   border bg-slate-300 flex flex-row justify-center hover:bg-slate-200 transition duration-300 ease-in-out hover:scale-100">
          <div className="w-1/3 flex flex-col items-center justify-center">
            <AiFillLock size={60} />
          </div>
          <div className="w-2/3 flex flex-col items-center justify-center">
            <span className="text-black flex justify-center">Vendas Finalizadas</span>
            <h1 className="font-bold text-3xl">R${pontoPorVirgula(valorVendasFinalizadas?.toFixed(2))}</h1>
          </div>
        </div>
        {/* a pagar */}
        <div className=" w-full h-28 md:w-32% text-center rounded-lg  bg-slate-300 border flex flex-row justify-center hover:bg-slate-200 transition duration-300 ease-in-out hover:scale-100">
          <div className="w-1/3 flex flex-col items-center justify-center">
            <AiOutlineClockCircle size={60} />
          </div>
          <div className="w-2/3 flex flex-col items-center justify-center">
            <span className="text-black flex justify-center">Vendas em Aberto</span>
            <h1 className="font-bold text-3xl">R${pontoPorVirgula(valorVendasAbertas?.toFixed(2))}</h1>
          </div>
        </div>
        {/* vendido hoje */}
        <div className=" w-full h-28 md:w-32% text-center rounded-lg border  flex flex-row justify-center bg-slate-300 hover:bg-slate-200 transition duration-300 ease-in-out hover:scale-100">
          <div className="w-1/3 flex flex-col items-center justify-center">
            <MdSell size={60} />
          </div>
          <div className="w-2/3 flex flex-col items-center justify-center">
            <span className="text-black flex justify-center mt-2">
              Vendas diaria
            </span>
            <h1 className="font-bold text-3xl">{totalVendasDiaAtual.length}</h1>
          </div>
        </div>
        {/* total Produtos */}
        <div className=" w-full h-28 md:w-32% text-center rounded-lg border  flex flex-row justify-center bg-slate-300 hover:bg-slate-200 transition duration-300 ease-in-out hover:scale-100">
          <div className="w-1/3 flex flex-col items-center justify-center">
            <FaShoppingBag size={60} />
          </div>
          <div className="w-2/3 flex flex-col items-center justify-center">
            <span className="text-black flex justify-center mt-2">
              Total de Produtos
            </span>
            <h1 className="font-bold text-3xl">{totalProdutos}</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:gap-4 mt-4 mb-2">
        <div className="h-full text-center rounded-lg border bg-slate-300 hover:bg-slate-200 flex flex-col">
          <span className="text-black flex justify-center mt-2">
            Vendas Mensais{" "}
            <span className="ml-2 mt-1 text-lg">
              <HiDocumentReport />
            </span>
          </span>
          <div className="w-full md:w-graficoBarras my-4 center m-auto sm:w-10/12">
            <BarChart data={preencherGraficoBarrasMensais()} />
          </div>
        </div>
        <div className="h-full text-center rounded-lg border bg-slate-300 hover:bg-slate-200 flex flex-col mb-8">
          <span className="text-black flex justify-center mt-2">
            Vendas Diarias{" "}
            <span className="ml-2 mt-1 text-lg">
              <HiDocumentReport />
            </span>
          </span>
          <div className="w-full md:w-graficoBarras my-4 center m-auto sm:w-10/12">
            <BarChart data={preencherGraficoBarrasDiario()} />
          </div>
        </div>

      </div>
    </div>
  );
};
