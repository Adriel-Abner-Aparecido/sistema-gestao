import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { post, put, remove, get, getPublic } from "../../services/api";
import InputMask from "react-input-mask";

export const ProviderModal = (props) => {

  const dadosFornecedorPadrao = {
    nome: "",
    telefone: "",
    celular: "",
    email: "",
    tipoPessoa: 'Pessoa Jurídica',
    cnpjCpf: "",
    fantasia: "",
    observacao: "",
    inscricaoEstadual: "",
    fornecedorId: "",
    clienteId: null,
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
  const [isCnpj, setIsCnpj] = useState(true);
  const [fornecedor, setFornecedor] = useState(dadosFornecedorPadrao)
  const [confirma, setConfirma] = useState(false)

  const closeModal = () => {
    setFornecedor(dadosFornecedorPadrao)
    props.setFornecedorSelecionado(null)
    setIsCnpj(true)
    setConfirma(false)
    setLoading(false)
    if (props.statusModal == "") {
      props.setStatusModal("hidden");
    }
  };

  useEffect(() => {
    if (props.fornecedorSelecionado && props.fornecedorSelecionado.id) {
      setFornecedor({
        id: props.fornecedorSelecionado.id,
        celular: props.fornecedorSelecionado.celular || "",
        cnpjCpf: props.fornecedorSelecionado.cnpj_cpf || "",
        email: props.fornecedorSelecionado.email || "",
        fantasia: props.fornecedorSelecionado.fantasia || "",
        nome: props.fornecedorSelecionado.nome,
        observacao: props.fornecedorSelecionado.observacao || "",
        telefone: props.fornecedorSelecionado.telefone || "",
        tipoPessoa: props.fornecedorSelecionado.tipo_pessoa || "",
        inscricaoEstadual: props.fornecedorSelecionado.inscricao_estadual || "",
        enderecoId: props.fornecedorSelecionado.endereco_id || null,
        bairro: props.fornecedorSelecionado.bairro || "",
        cep: props.fornecedorSelecionado.cep || "",
        cidade: props.fornecedorSelecionado.cidade || "",
        clienteId: null,
        fornecedorId: props.fornecedorSelecionado.fornecedor_id || "",
        vendedorId: null,
        numero: props.fornecedorSelecionado.numero || "",
        rua: props.fornecedorSelecionado.rua || "",
        uf: props.fornecedorSelecionado.uf || "",
        complemento: props.fornecedorSelecionado.complemento || ""
      })
      if (props.fornecedorSelecionado.cnpj_cpf) {
        setIsCnpj(props.fornecedorSelecionado.cnpj_cpf.length === 18);
      }
    }
  }, [props.fornecedorSelecionado]);

  const handleChangeDadosFornecedor = (event) => {
    setFornecedor({ ...fornecedor, [event.target.name]: event.target.value })
  }

  const handleInputChange = (event) => {
    setIsCnpj(!isCnpj)
    setFornecedor((prev) => ({ ...prev, tipoPessoa: event.target.checked ? "Pessoa Jurídica" : "Pessoa Física" }))
  };

  const salvar = async (event) => {

    event.preventDefault()

    setLoading(true)

    try {

      if (fornecedor.id) {
        const atualizaFornecedor = await put(`${process.env.NEXT_PUBLIC_API_URL}/fornecedores/${fornecedor.id}`, fornecedor)
        if (atualizaFornecedor.affectedRows == 1) {
          console.log("Dados Atualizados")
        }
      } else {
        const salvafornecedor = await post(`${process.env.NEXT_PUBLIC_API_URL}/fornecedores`, fornecedor)
        if (salvafornecedor.insertId) {
          console.log("Endereco cadastrado")
        }
      }

    } catch (error) {
      console.error("Erro interno do servidor", error)
    } finally {
      props.setAtualizar(true)
      setLoading(false)
    }
  }

  const deletar = async () => {
    if (props.fornecedorSelecionado.nome != undefined) {
      setLoading(true);
      try {
        await remove(`${process.env.NEXT_PUBLIC_API_URL}/fornecedores/${props.fornecedorSelecionado.id}`)
      } catch (error) {
        console.error("Erro interno do servidor", error)
      } finally {
        setLoading(false)
        props.setAtualizar(true)
        props.setFornecedorSelecionado(null)
        closeModal()
      }
    }
  };

  const buscarCep = (cep) => {
    setFornecedor({
      ...fornecedor,
      cep: cep
    })
    const cepRefatorado = cep.replace(/\D/g, "");
    if (process.env.CEP_TOKEN_APP_KEY != undefined && process.env.CEP_TOKEN_APP_SECRET != undefined) {
      if (cepRefatorado.length == 8) {
        getPublic(`https://webmaniabr.com/api/1/cep/${cepRefatorado}/?app_key=${process.env.CEP_TOKEN_APP_KEY}&app_secret=${process.env.CEP_TOKEN_APP_SECRET}`).then((res) => {
          setFornecedor({
            ...fornecedor,
            bairro: res.bairro,
            cep: res.cep,
            cidade: res.cidade,
            rua: res.endereco,
            uf: res.uf
          })
        });
      }
    }
  };

  // console.log("Endereço", enderecoFornecedor)
  console.log("Fornecedor", fornecedor)

  return (
    <div id="medium-modal" className={props.statusModal + " flex flex-col absolute z-50 w-full min-h-full bg-gray-700 bg-opacity-60 items-center"}>
      <div className="relative p-4 w-full md:w-3/4">
        {/*<!-- Modal content --> */}
        <div className="relative rounded-lg shadow bg-gray-200 text-gray-700">
          {/*<!-- Modal header --> */}
          <div className="flex justify-between items-center p-5 rounded-t">
            <h3 className="text-xl font-medium text-gray-700">Fornecedor</h3>
            <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400" >
              <BsX className="text-gray-700" size={24} />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/*!-- Modal body --> */}
          <div>
            <form onSubmit={salvar} id="fornecedorForm" className="flex flex-col p-4 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Nome
                </label>
                <input name="nome" className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: João Paulo" value={fornecedor.nome} onChange={handleChangeDadosFornecedor} required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Celular
                </label>
                <InputMask name="celular" className="border text-sm rounded-lg block w-full p-2.5" mask="(99) 9 9999-9999" placeholder="Ex: 41 99999-9999" value={fornecedor.celular} onChange={handleChangeDadosFornecedor} />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Telefone
                </label>
                <InputMask name="telefone" className="border text-sm rounded-lg block w-full p-2.5" mask="(99) 9999-9999" placeholder="Ex: 41 33333-3333" value={fornecedor.telefone} onChange={handleChangeDadosFornecedor} />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  E-mail
                </label>
                <input name="email" className="border text-sm rounded-lg block w-full p-2.5 b" placeholder="Ex: joao@gmail.com" value={fornecedor.email} onChange={handleChangeDadosFornecedor} />
              </div>
              <div className="flex flex-row md:items-center gap-4">
                <label className="">CNPJ</label>
                <input type="checkbox" name="checkCpfCnpj" id="checkCpfCnpj" onChange={handleInputChange} checked={isCnpj} />
              </div>
              <div className="flex flex-row w-full gap-8 md:items-center md:justify-center">
                {
                  isCnpj ? (
                    <div className="flex flex-col md:flex-row w-full gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium">
                          Nome Fantasia
                        </label>
                        <input name="fantasia" className="border text-sm rounded-lg block w-full p-2.5" value={fornecedor.fantasia} onChange={handleChangeDadosFornecedor} />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-sm font-medium">
                          CNPJ
                        </label>
                        <InputMask name="cnpjCpf" className="border text-sm rounded-lg block w-full p-2.5" placeholder="99.999.999/9999-99" mask="99.999.999/9999-99" value={fornecedor.cnpjCpf} onChange={handleChangeDadosFornecedor} />
                      </div>
                      <div className="flex flex-col ">
                        <label className="block text-sm font-medium" htmlFor="inscricaoEstadual">IE</label>
                        <input className="border text-sm rounded-lg block w-full p-2.5" type="number" name="inscricaoEstadual" value={fornecedor.inscricaoEstadual} onChange={handleChangeDadosFornecedor} />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <label className="block text-sm font-medium">
                        CPF
                      </label>
                      <div className="flex flex-row gap-8 w-full">
                        <InputMask name="cnpjCpf" className="border text-sm rounded-lg block w-full p-2.5" placeholder="999.999.999-99" mask="999.999.999-99" value={fornecedor.cnpjCpf} onChange={handleChangeDadosFornecedor} />
                      </div>
                    </div>
                  )
                }

              </div>
              {/* campo endereço */}
              <div className="flex flex-col">
                <div className="w-full">
                  <label className="block text-sm font-medium">
                    CEP
                  </label>
                  <InputMask name="cep" onChange={(e) => buscarCep(e.target.value)} className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: 99999-999" mask="99999-999" value={fornecedor.cep} />
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="md:w-full w-full">
                    <label className="block text-sm font-medium">
                      Endereço
                    </label>
                    <InputMask name="rua" className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Rua 15 de março" value={fornecedor.rua} onChange={handleChangeDadosFornecedor} />
                  </div>
                  <div className="md:w-full w-full">
                    <label className="block text-sm font-medium">
                      complemento
                    </label>
                    <InputMask name="complemento" className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: AP204 B2" value={fornecedor.complemento} onChange={handleChangeDadosFornecedor} />
                  </div>
                  <div className="md:w-1/12">
                    <label className="block text-sm font-medium">
                      Número
                    </label>
                    <InputMask name="numero" className="border text-sm rounded-lg block w-full p-2.5" placeholder="836" value={fornecedor.numero} onChange={handleChangeDadosFornecedor} />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-3">
                  <div className="w-full">
                    <label className="block text-sm font-medium">
                      Bairro
                    </label>
                    <InputMask name="bairro" className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Limoeiro" value={fornecedor.bairro} onChange={handleChangeDadosFornecedor} />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium">
                      Cidade
                    </label>
                    <InputMask name="cidade" className="border text-sm rounded-lg block w-full p-2.5" placeholder="Ex: Curitiba" value={fornecedor.cidade} onChange={handleChangeDadosFornecedor} />
                  </div>

                  <div className="md:w-1/12">
                    <label className="block text-sm font-medium">
                      Estado
                    </label>
                    <InputMask name="uf" className="border text-sm rounded-lg block w-full p-2.5" mask="aa" placeholder="PR" value={fornecedor.uf} onChange={handleChangeDadosFornecedor} />
                  </div>
                </div>
                <div className="flex flex-row gap-4 mt-3"></div>
              </div>
            </form>
          </div>
          {
            loading ? (
              <div className="flex items-center justify-between p-4 space-x-2 rounded-b">
                <button type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600" >
                  <div className="flex" role="status">
                    <svg aria-hidden="true" className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg" >
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    Aguarde...
                  </div>
                </button>
                <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">
                  <div className="flex" role="status">
                    <svg aria-hidden="true" className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    Aguarde...
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 space-x-2 rounded-b">
                <button onClick={() => setConfirma(true)} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600">Excluir</button>
                <button type="submit" form="fornecedorForm" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Salvar</button>
              </div>
            )
          }
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
