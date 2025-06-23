import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { post, put, remove, getPublic } from "../../services/api";
import InputMask from "react-input-mask";
import Router from "next/router";

export const CustomerModal = (props) => {

  const clientePadrao = {
    id: null,
    nome: "",
    telefone: "",
    celular: "",
    email: "",
    tipoPessoa: "Pessoa Física",
    cnpjCpf: "",
    fantasia: "",
    observacao: "",
    inscricaoEstadual: "",
    dataNascimento: "",
    fornecedorId: null,
    clienteId: "",
    vendedorId: null,
    rua: "",
    numero: "",
    bairro: "",
    cep: "",
    cidade: "",
    uf: "",
    complemento: ""
  }

  const [loading, setLoading] = useState(false);
  const [isCnpj, setIsCnpj] = useState(false);
  const [confirma, setConfirma] = useState(false)
  const [cliente, setCliente] = useState(clientePadrao)

  const closeModal = () => {
    props.setClienteSelecionado(null)
    setCliente(clientePadrao)
    props.setStatusModal("hidden");
    setIsCnpj(false)
  };

  useEffect(() => {
    if (props.clienteSelecionado && props.clienteSelecionado.id !== cliente.id) {
      setCliente({
        id: props.clienteSelecionado.id || null,
        nome: props.clienteSelecionado.nome,
        celular: props.clienteSelecionado.celular || "",
        cnpjCpf: props.clienteSelecionado.cnpj_cpf || "",
        dataNascimento: props.clienteSelecionado.data_nascimento || "",
        email: props.clienteSelecionado.email || "",
        fantasia: props.clienteSelecionado.fantasia || "",
        telefone: props.clienteSelecionado.telefone || "",
        tipoPessoa: props.clienteSelecionado.tipo_pessoa || "",
        observacao: props.clienteSelecionado.observacao || "",
        inscricaoEstadual: props.clienteSelecionado.inscricao_estadual || "",
        enderecoId: props.clienteSelecionado.endereco_id || null,
        bairro: props.clienteSelecionado.bairro || "",
        cep: props.clienteSelecionado.cep || "",
        cidade: props.clienteSelecionado.cidade || "",
        clienteId: props.clienteSelecionado.cliente_id || null,
        fornecedorId: null,
        vendedorId: null,
        numero: props.clienteSelecionado.numero || "",
        rua: props.clienteSelecionado.rua || "",
        uf: props.clienteSelecionado.uf || "",
        complemento: props.clienteSelecionado.complemento || "",
      })
      if (props.clienteSelecionado.cnpj_cpf) {
        setIsCnpj(props.clienteSelecionado.cnpj_cpf.length === 18);
      }
    }
  }, [props.clienteSelecionado]);

  const handleClienteChange = (event) => {
    setCliente({ ...cliente, [event.target.name]: event.target.value });
  }

  const handleTipoPessoa = () => {
    setIsCnpj(!isCnpj);
    setCliente({
      ...cliente,
      tipoPessoa: isCnpj ? "Pessoa Física" : "Pessoa Jurídica",
    });
  }

  const salvar = async (event) => {
    event.preventDefault()

    try {

      if (cliente.id) {
        await put(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${cliente.id}`, cliente)
      } else {
        await post(`${process.env.NEXT_PUBLIC_API_URL}/clientes`, cliente);
      }

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      props.setAtualizar(true)
      closeModal()
    }

  }

  const deletar = async () => {
    if (props.clienteSelecionado && props.clienteSelecionado.nome) {
      setLoading(true);
      try {
        const idCliente = props.clienteSelecionado.id;
        const res = await remove(`${process.env.NEXT_PUBLIC_API_URL}/clientes/${idCliente}`);
        if (res.mensagem && res.mensagem === "falha na autenticação") {
          console.log("Falha na autenticação");
          localStorage.removeItem("applojaweb_token");
          Router.push("/login");
        } else {
          console.log("Cliente deletado com sucesso");
          props.setClienteSelecionado(null);
          setConfirma(false)
          closeModal();
        }
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
      } finally {
        setLoading(false);
        props.setAtualizar(true)
      }
    }
  };

  const buscarCep = (cep) => {
    setCliente({ ...cliente, cep: cep })
    let cepRefatorado = cep.replace(/\D/g, "");
    if (process.env.CEP_TOKEN_APP_KEY != undefined && process.env.CEP_TOKEN_APP_SECRET != undefined) {
      if (cepRefatorado.length == 8) {
        getPublic(`https://webmaniabr.com/api/1/cep/${cepRefatorado}/?app_key=${process.env.CEP_TOKEN_APP_KEY}&app_secret=${process.env.CEP_TOKEN_APP_SECRET}`).then((res) => {
          setCliente({
            ...cliente,
            cep: cep,
            rua: res.endereco,
            cidade: res.cidade,
            bairro: res.bairro,
            uf: res.uf
          })
        });
      }
    }
  };

  console.log("Cliente", cliente)

  return (
    <div id="medium-modal" className={props.statusModal + " flex flex-col absolute z-10 w-full bg-gray-700 bg-opacity-60 items-center p-6"}>
      <div className="flex flex-col w-full md:w-4/5 h-full">
        <div className="relative rounded-lg shadow bg-gray-200">
          <div className="flex justify-between items-center p-5 rounded-t">
            <h3 className="text-xl font-medium text-gray-700">Cliente</h3>
            <button onClick={closeModal} type="reset" form="formCliente" className="text-gray-700 bg-transparent rounded-lg text-sm p-1.5 inline-flex items-center hover:bg-gray-400">
              <BsX className="text-gray-700" size={24} />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/*!-- Modal body --> */}
          <div className="p-6 space-y-6">
            <form onSubmit={salvar} id="formCliente" className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input onChange={handleClienteChange} name="nome" defaultValue={cliente.nome} className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: João Paulo" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Celular
                </label>
                <InputMask onChange={handleClienteChange} name="celular" value={cliente.celular} className="border text-sm rounded-lg block w-full p-2.5" mask="(99) 9 9999-9999" placeholder="Ex: 41 99999-9999" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <InputMask onChange={handleClienteChange} value={cliente.telefone} name="telefone" className="border text-sm rounded-lg block w-full p-2.5" mask="(99) 9 9999-9999" placeholder="Ex: 41 33333-3333"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input onChange={handleClienteChange} name="email" defaultValue={cliente.email} type="email" className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: joao@gmail.com" />
              </div>
              <div className="flex flex-row items-center pr-4 gap-4">
                <label className="text-gray-700">CNPJ</label>
                <input type="checkbox" onClick={handleTipoPessoa} checked={isCnpj}
                />
              </div>
              <div className="flex flex-row w-full gap-8 items-center justify-center">
                {
                  isCnpj ? (
                    <div className="flex flex-col md:flex-row w-full gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium  text-gray-700">
                          Nome fantasia
                        </label>
                        <input name="fantasia" className="border text-sm rounded-lg block w-full p-2.5" value={cliente.fantasia} onChange={handleClienteChange} />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium  text-gray-700">
                          CNPJ
                        </label>
                        <InputMask name="cnpjCpf" className="border text-sm rounded-lg block w-full p-2.5" placeholder="99.999.999/9999-99" mask="99.999.999/9999-99" value={cliente.cnpjCpf} onChange={handleClienteChange} />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium  text-gray-700" htmlFor="inscricaoEstadual">IE</label>
                        <input className="border text-sm rounded-lg block w-full p-2.5" type="number" name="inscricaoEstadual" value={cliente.inscricaoEstadual} onChange={handleClienteChange} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <label className="block text-sm font-medium  text-gray-700">
                        CPF
                      </label>
                      <div className="flex flex-row gap-8 w-full">
                        <InputMask name="cnpjCpf" className="border text-sm rounded-lg block w-full p-2.5" placeholder="999.999.999-99" mask="999.999.999-99" value={cliente.cnpjCpf} onChange={handleClienteChange} />
                      </div>
                    </div>
                  )
                }

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input name="dataNascimento" value={cliente.dataNascimento} type="date" className="border text-sm rounded-lg block w-full p-2.5" onChange={handleClienteChange} />
              </div>
              {/* campo endereço */}
              <div className="flex flex-col">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    CEP
                  </label>
                  <InputMask name="cep" onChange={(e) => buscarCep(e.target.value)} value={cliente.cep} className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: 99999-999" mask="99999-999" />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="md:w-full w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Endereço
                    </label>
                    <InputMask name="rua" value={cliente.rua} className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Rua 15 de março" onChange={handleClienteChange} />
                  </div>
                  <div className="md:w-full w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Complemento
                    </label>
                    <InputMask name="complemento" value={cliente.complemento} className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Casa 2" onChange={handleClienteChange} />
                  </div>
                  <div className="flex flex-col md:w-1/12">
                    <label className="block text-sm font-medium text-gray-700">
                      Número
                    </label>
                    <InputMask name="numero" value={cliente.numero} className="border text-sm rounded-lg block w-full p-2.5" placeholder="836" onChange={handleClienteChange} />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Bairro
                    </label>
                    <InputMask name="bairro" value={cliente.bairro} className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Limoeiro" onChange={handleClienteChange} />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700">
                      Cidade
                    </label>
                    <InputMask name="cidade" value={cliente.cidade} className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Curitiba" onChange={handleClienteChange} />
                  </div>
                  <div className="flex flex-col md:w-1/12">
                    <label className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <InputMask name="uf" value={cliente.uf} className="border text-sm rounded-lg block w-full p-2.5" mask="aa" placeholder="PR" onChange={handleClienteChange} />
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/*<!-- Modal footer --> */}
          {loading ? (
            <div className="flex items-center justify-between p-6 space-x-2 rounded-b">
              <button type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600">
                <div className="flex" role="status">
                  <svg aria-hidden="true" className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  Aguarde...
                </div>
              </button>
              <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">
                <div className="flex" role="status">
                  <svg aria-hidden="true" className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg" >
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  Aguarde...
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-6 space-x-2 rounded-b">
              <button onClick={() => setConfirma(true)} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600">
                Excluir
              </button>
              <button type="submit" form="formCliente" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={confirma ? "absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
        <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
          <h1 className="text-2xl text-gray-700 text-center">Tem certeza?</h1>
          <div className="flex flex-row gap-4">
            <button onClick={deletar} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
            <button onClick={() => setConfirma(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
          </div>
        </div>
      </div>
    </div>
  );
};
