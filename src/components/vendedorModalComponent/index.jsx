import { BsX } from 'react-icons/bs';
import { get, getPublic, post, put, remove } from '../../services/api';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask'
import { ErrorComponent } from '../ErrorComponent';
import { Brl } from '../../services/real'

export const VendedorModal = (props) => {

    const dadosVendedorPadrao = {
        id: null,
        nome: '',
        usuarioId: '',
        telefone: '',
        celular: '',
        email: '',
        tipoPessoa: 'Pessoa física',
        cnpjCpf: '',
        inscricaoEstadual: '',
        fantasia: '',
        comissao: '',
        observacao: '',
        dataNascimento: '',
        dataContratacao: ''
    }

    const enderecoVendedorPadrao = {
        vendedorId: '',
        clienteId: '',
        cep: '',
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
        complemento: ''
    }

    const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)
    const [cnpj, setCnpj] = useState(false)
    const [vendedor, setVendedor] = useState(dadosVendedorPadrao)
    const [enderecoVendedor, setEnderecoVendedor] = useState(enderecoVendedorPadrao)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(undefined)
    const [usuarios, setUsuarios] = useState()
    const [loading, setLoading] = useState(false)
    const [dadosComissao, setDadosComissao] = useState(null)


    const closeModal = () => {
        props.setHiddenUserModal("hidden");
        props.setVendedorSelecionado(null)
        setVendedor(dadosVendedorPadrao)
        setEnderecoVendedor(enderecoVendedorPadrao)
        setPopUpConfirmacao(false)
        setError(false)
        setMessage(undefined)
        setDadosComissao(null)
    }

    useEffect(() => {
        if (props.hiddenUserModal === '') {
            buscarUsuarios()
        }
    }, [props.hiddenUserModal])

    useEffect(() => {
        if (props.vendedorSelecionado) {
            console.log(props.vendedorSelecionado)
            const dadoVendedor = props.vendedorSelecionado
            setVendedor({
                id: dadoVendedor.id,
                nome: dadoVendedor.nome,
                usuarioId: dadoVendedor.usuario_id,
                telefone: dadoVendedor.telefone,
                celular: dadoVendedor.celular,
                email: dadoVendedor.email || '',
                tipoPessoa: dadoVendedor.tipo_pessoa,
                cnpjCpf: dadoVendedor.cnpj_cpf,
                fantasia: dadoVendedor.fantasia,
                comissao: dadoVendedor.comissao,
                observacao: dadoVendedor.observacao,
                dataNascimento: dadoVendedor.data_nascimento,
                dataContratacao: dadoVendedor.data_contratacao || '',
                inscricaoEstadual: dadoVendedor.inscricao_estadual
            })
            buscaEnderecoVendedorSelecionado(dadoVendedor.id)
            buscarUsuarios()
            setDadosComissao({
                comissao: dadoVendedor.total_comissao,
                totalVendas: dadoVendedor.total_vendas
            })
        }
    }, [props.vendedorSelecionado]);

    const salvar = (event) => {
        event.preventDefault()
        if (props.vendedorSelecionado) {
            atualizaVendedor()
            if (enderecoVendedor.id) {
                atualizarEnrederecoVendedorSelecionado()
            } else {
                salvaEnderecoVendedor(props.vendedorSelecionado.id)
            }
        } else {
            salvarVendedor()
        }
    }

    const salvarVendedor = async () => {

        const dadosTratados = {
            id: null,
            nome: vendedor.nome,
            telefone: vendedor.telefone || null,
            celular: vendedor.celular || null,
            email: vendedor.email || null,
            tipoPessoa: vendedor.tipoPessoa || null,
            cnpjCpf: vendedor.cnpjCpf || null,
            inscricaoEstadual: vendedor.inscricaoEstadual || null,
            fantasia: vendedor.fantasia || null,
            comissao: vendedor.comissao || null,
            observacao: vendedor.observacao || null,
            dataNascimento: vendedor.dataNascimento || null,
            dataContratacao: vendedor.dataContratacao || null,
            usuarioId: vendedor.usuarioId || null
        }

        try {
            const salvaVendedor = await post(`${process.env.NEXT_PUBLIC_API_URL}/vendedores`, dadosTratados)

            if (salvaVendedor.insertId) {
                setVendedor({
                    ...vendedor,
                    id: salvaVendedor.insertId
                })
                setError(true)
                setMessage({
                    message: "Vendedor cadastrado com Sucesso!!!",
                    nivel: "Mínimo"
                })
                console.log("Vendedor salvo com sucesso")
                salvaEnderecoVendedor(salvaVendedor.insertId)
            }
        } catch (error) {
            console.error("Erro", error)
        }
    }

    const atualizaVendedor = async () => {

        try {
            const atualiza = await put(`${process.env.NEXT_PUBLIC_API_URL}/vendedores/${props.vendedorSelecionado.id}`, vendedor)

            if (atualiza.affectedRows == 1) {
                setError(true)
                setMessage({
                    message: "Dados Atualizados!!!",
                    nivel: "Mínimo"
                })
            }

        } catch (error) {
            console.error("erro", error)
        }

    }

    const salvaEnderecoVendedor = async (vendedorId) => {

        const dadosTratados = {
            ...enderecoVendedor,
            vendedorId,
            clienteId: null,
            fornecedorId: null
        }

        try {
            const salvaEndereco = post(`${process.env.NEXT_PUBLIC_API_URL}/enderecos`, dadosTratados)
            if (salvaEndereco.insertId) {
                console.log("Endereço do vendedor salvo com sucesso")
            }
        } catch (error) {
            console.error("Erro", error)
        } finally {
            props.setAtualizar(true)
        }

    }

    const atualizarEnrederecoVendedorSelecionado = async () => {

        try {
            const atualizaEndereco = await put(`${process.env.NEXT_PUBLIC_API_URL}/enderecos/${enderecoVendedor.id}`, enderecoVendedor)

            if (atualizaEndereco.affectedRows == 1) {
                setError(true)
                setMessage({
                    message: "Dados Atualizados",
                    nivel: "Mínimo"
                })
            }
        } catch (error) {
            console.error(error)
        }

    }

    const buscaEnderecoVendedorSelecionado = async (idVendedor) => {

        try {
            const endereco = await get(`${process.env.NEXT_PUBLIC_API_URL}/enderecovendedor/${idVendedor}`)
            if (endereco[0]) {
                setEnderecoVendedor({
                    id: endereco[0].id,
                    fornecedorId: null,
                    vendedorId: endereco[0].vendedorId,
                    clienteId: null,
                    cep: endereco[0].cep,
                    rua: endereco[0].rua,
                    numero: endereco[0].numero,
                    bairro: endereco[0].bairro,
                    cidade: endereco[0].cidade,
                    uf: endereco[0].uf
                })
            }
        } catch (error) {
            console.error("Erro", error)
        }

    }

    const deletar = async () => {

        try {
            await remove(`${process.env.NEXT_PUBLIC_API_URL}/vendedores/${props.vendedorSelecionado.id}`)
        } catch (error) {
            console.error(error)
        } finally {
            alert("Vendedor excluido!!")
            props.setAtualizar(true)
            props.setUserSelecionado(null)
            closeModal()
        }

    }

    const handleVendedor = (event) => {
        setVendedor({ ...vendedor, [event.target.name]: event.target.value })
    }

    const handleAssossiarUsuario = async (event) => {

        const { value } = event.target

        try {
            const verificavendedor = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendedorbyusuarioid/${value}`)
            if (verificavendedor[0]) {
                setError(true)
                setMessage({
                    message: "Este usuário já está assossiado a um vendedor!!",
                    nivel: "Crítico"
                })
            } else {
                setError(false)
                setMessage(undefined)
                setVendedor({
                    ...vendedor,
                    usuarioId: value
                })
            }
        } catch (error) {
            console.error(error)
        }

    }

    const handleEnderecoVendedor = (event) => {
        setEnderecoVendedor({ ...enderecoVendedor, [event.target.name]: event.target.value })
    }

    const buscaCep = async (event) => {

        const { value } = event.target

        setEnderecoVendedor({ ...enderecoVendedor, cep: value })
        let cepRefatorado = value.replace(/\D/g, "");
        if (process.env.CEP_TOKEN_APP_KEY != undefined && process.env.CEP_TOKEN_APP_SECRET != undefined) {
            if (cepRefatorado.length == 8) {
                getPublic(`https://webmaniabr.com/api/1/cep/${cepRefatorado}/?app_key=${process.env.CEP_TOKEN_APP_KEY}&app_secret=${process.env.CEP_TOKEN_APP_SECRET}`).then((res) => {
                    setEnderecoVendedor({
                        ...enderecoVendedor,
                        cep: value,
                        rua: res.endereco,
                        cidade: res.cidade,
                        bairro: res.bairro,
                        uf: res.uf
                    })
                });
            }
        }
    }

    const buscarUsuarios = async () => {
        setLoading(true)
        try {
            const getUsuarios = await get(`${process.env.NEXT_PUBLIC_API_URL}/usuariosempresa`)
            if (getUsuarios) {
                setUsuarios(getUsuarios)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div id="medium-modal" className={props.hiddenUserModal + " flex flex-col absolute z-50 w-full min-h-full bg-gray-700 bg-opacity-60 items-center"}>
            <div className="relative p-4 w-full lg:w-1/2 h-full">
                {/*<!-- Modal content --> */}
                <div className="relative rounded-lg shadow bg-gray-200">
                    {/*<!-- Modal header --> */}
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Vendedor
                        </h3>
                        <button onClick={closeModal} type="button" className="text-gray-700 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
                            <BsX className='text-gray-700' size={24} />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>



                    {/*!-- Modal body --> */}
                    <div className="p-6 space-y-6">

                        {error && message && <ErrorComponent errorMessage={message.message} level={message.nivel} />}

                        {
                            dadosComissao && (
                                <div className='flex w-full border-2 border-green-500 rounded-lg p-4 justify-between gap-4'>
                                    <div className="flex flex-col">
                                        <span className='font-bold text-2xl'>
                                            Comissão:
                                        </span>
                                        <span className='font-bold text-right'>
                                            {Brl(dadosComissao.comissao)}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className='font-bold text-2xl' >
                                            Total de Vendas:
                                        </span>
                                        <span className='font-bold text-right'>
                                            {parseInt(dadosComissao.totalVendas)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }

                        <form onSubmit={salvar} id='userForm' className='flex flex-col text-gray-700 gap-3'>


                            <div className='flex flex-col gap-3'>
                                <div>
                                    <label className="block text-sm font-medium">Assossiar Usuario</label>
                                    <select className='border text-sm rounded-lg block w-full p-2.5' name="vendedorId" value={vendedor.usuarioId || ''} onChange={handleAssossiarUsuario} >
                                        <option value={''}></option>
                                        {
                                            loading ? <option>Carregando</option> :
                                                usuarios && usuarios.map((usuario, i) => (
                                                    <option key={i} value={usuario.id}>{usuario.username}</option>
                                                ))
                                        }
                                    </select>
                                </div>
                                <div className='flex flex-col'>
                                    <label className="block text-sm font-medium" htmlFor="nome">Nome Completo</label>
                                    <input className='border text-sm rounded-lg p-2.5' type="text" name='nome' value={vendedor.nome} onChange={handleVendedor} required />
                                </div>
                                <div className='flex flex-col'>
                                    <label className="block text-sm font-medium" htmlFor="nome">E-mail</label>
                                    <input className='border text-sm rounded-lg p-2.5' type="email" name='email' value={vendedor.email} onChange={handleVendedor} required />
                                </div>
                                <div className='flex flex-row items-center gap-2'>
                                    <label className="text-sm font-medium" htmlFor="cnpj">CNPJ</label>
                                    <input className='border text-sm rounded-lg p-2.5' type="checkbox" name='cnpj' onChange={() => setCnpj(!cnpj)} checked={cnpj} />
                                </div>
                                {
                                    cnpj ?
                                        <>
                                            <div className='flex flex-col'>
                                                <label className="block text-sm font-medium" htmlFor="fantasia">Nome Fantasia</label>
                                                <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='fantasia' value={vendedor.fantasia} onChange={handleVendedor} required />
                                            </div>
                                            <div className='flex flex-row gap-3'>
                                                <div className='flex-1'>
                                                    <label className="block text-sm font-medium" htmlFor="cnpjCpf">CNPJ</label>
                                                    <InputMask className='border text-sm rounded-lg block w-full p-2.5' type="text" name='cnpjCpf' value={vendedor.cnpjCpf} onChange={handleVendedor} mask={'99.999.999/9999-99'} required />
                                                </div>
                                                <div className='flex-1'>
                                                    <label className="block text-sm font-medium" htmlFor="ie">IE</label>
                                                    <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='ie' />
                                                </div>
                                            </div>
                                        </>
                                        : <div className='flex flex-col'>
                                            <label className="block text-sm font-medium" htmlFor="cnpjCpf">CPF</label>
                                            <InputMask className='border text-sm rounded-lg block w-full p-2.5' type="text" name='cnpjCpf' value={vendedor.cnpjCpf} onChange={handleVendedor} mask={'999.999.999-99'} required />
                                        </div>
                                }
                                <div>
                                    <div className='flex flex-col lg:flex-row gap-3'>
                                        <div className='flex-1'>
                                            <label className="block text-sm font-medium" htmlFor="celular">Celular</label>
                                            <InputMask className='border text-sm rounded-lg block w-full p-2.5' type="text" name='celular' value={vendedor.celular} onChange={handleVendedor} mask={'(99) 99999-9999'} />
                                        </div>
                                        <div className='flex-1'>
                                            <label className="block text-sm font-medium" htmlFor="telefone">Telefone</label>
                                            <InputMask className='border text-sm rounded-lg block w-full p-2.5' type="text" name='telefone' value={vendedor.telefone} onChange={handleVendedor} mask={'(99) 9999-9999'} />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col lg:flex-row gap-3'>
                                    <div className='flex-1'>
                                        <label className="block text-sm font-medium" htmlFor="comissao">Comissão %</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="number" name='comissao' value={vendedor.comissao} onChange={handleVendedor} required />
                                    </div>
                                    <div className='flex-1'>
                                        <label className="block text-sm font-medium" htmlFor="dataNascimento">Data de Nascimento</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="date" name='dataNascimento' value={vendedor.dataNascimento} onChange={handleVendedor} />
                                    </div>
                                    <div className='flex-1'>
                                        <label className="block text-sm font-medium" htmlFor="dataContratacao">Data de Contratação</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="date" name='dataContratacao' value={vendedor.dataContratacao} onChange={handleVendedor} required />
                                    </div>
                                </div>
                                <div className='flex flex-col lg:flex-row gap-3'>
                                    <div className='flex flex-col w-full'>
                                        <label className="block text-sm font-medium" htmlFor="cep">Cep</label>
                                        <InputMask className='border text-sm rounded-lg block w-full p-2.5' type="text" name='cep' value={enderecoVendedor.cep} onChange={buscaCep} mask={'99.999-999'} required />
                                    </div>
                                </div>
                                <div className='flex flex-col lg:flex-row gap-3'>
                                    <div className='flex-1'>
                                        <label className="block text-sm font-medium" htmlFor="rua">Endereço</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='rua' value={enderecoVendedor.rua} onChange={handleEnderecoVendedor} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium" htmlFor="numero">Complemento</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='complemento' value={enderecoVendedor.complemento} onChange={handleEnderecoVendedor} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium" htmlFor="numero">Numero</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='numero' value={enderecoVendedor.numero} onChange={handleEnderecoVendedor} />
                                    </div>
                                </div>
                                <div className='flex flex-col lg:flex-row gap-3'>
                                    <div className='flex-1'>
                                        <label className="block text-sm font-medium" htmlFor="bairro">Bairro</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='bairro' value={enderecoVendedor.bairro} onChange={handleEnderecoVendedor} />
                                    </div>
                                    <div className='flex-1'>
                                        <label className="block text-sm font-medium" htmlFor="cidade">cidade</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='cidade' value={enderecoVendedor.cidade} onChange={handleEnderecoVendedor} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium" htmlFor="uf">UF</label>
                                        <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='uf' value={enderecoVendedor.uf} onChange={handleEnderecoVendedor} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/*<!-- Modal footer --> */}
                    <div className="flex items-center justify-between p-6 space-x-2 rounded-b">
                        <button onClick={() => setPopUpConfirmacao(true)} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600">Excluir</button>
                        <button type="submit" form='userForm' className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Salvar</button>
                    </div>
                </div>
            </div>
            <div className={popUpConfirmacao ? "absolute inset-0 flex items-start justify-center bg-gray-700 bg-opacity-60 p-20" : "hidden"}>
                <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-sm w-full flex flex-col gap-2">
                    <h1 className="text-2xl text-gray-700 text-center">Tem certeza ?</h1>
                    <div className="flex flex-row gap-4">
                        <button onClick={deletar} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                        <button onClick={() => setPopUpConfirmacao(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
                    </div>
                </div>
            </div>
        </div>
    )
}