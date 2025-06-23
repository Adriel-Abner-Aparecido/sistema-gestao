import { BsX } from 'react-icons/bs';
import { get, getPublic, post, put, remove } from '../../services/api';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import InputMask from 'react-input-mask'
import { ErrorComponent } from '../ErrorComponent';

export const UserModal = (props) => {

    const dadosPadrao = {
        username: '',
        email: '',
        nivelUsuario: 1,
        senha: '',
        confirmaSenha: '',
        empresaId: ''
    }

    const dadosVendedorPadrao = {
        nome: '',
        usuarioId: '',
        telefone: '',
        celular: '',
        email: '',
        tipoPessoa: 'Pessoa Física',
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
        uf: ''
    }

    const [dados, setDados] = useState(dadosPadrao)
    const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)
    const [nivelList, setNivelList] = useState(null)
    const [cnpj, setCnpj] = useState(false)
    const [vendedor, setVendedor] = useState(dadosVendedorPadrao)
    const [enderecoVendedor, setEnderecoVendedor] = useState(enderecoVendedorPadrao)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [listaVendedores, setListaVendedores] = useState()


    const closeModal = () => {
        props.setHiddenUserModal("hidden");
        props.setUserSelecionado(null)
        setDados(dadosPadrao)
        setVendedor(dadosVendedorPadrao)
        setEnderecoVendedor(enderecoVendedorPadrao)
        setPopUpConfirmacao(false)
        setError(false)
    }

    useEffect(() => {
        if (props.userSelecionado) {
            console.log(props.userSelecionado)
            setDados({
                id: props.userSelecionado.id,
                username: props.userSelecionado.username,
                email: props.userSelecionado.email,
                nivelUsuario: props.userSelecionado.nivel_usuario_id,
                senha: '',
                empresaId: props.userSelecionado.empresa_id
            })
            buscaDadosVendedor(props.userSelecionado.id)
        }
    }, [props.userSelecionado]);

    useEffect(() => {
        getAllNiveis()
        getAllVendedores()
    }, [])

    const getAllNiveis = async () => {

        try {
            const niveis = await get(`${process.env.NEXT_PUBLIC_API_URL}/nivelusuario`)
            setNivelList(niveis)
        } catch (error) {
            console.error(error)
        }

    }

    const getAllVendedores = async () => {
        try {
            const vendedores = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendedores`)
            if (vendedores) {
                setListaVendedores(vendedores)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const salvar = async (event) => {
        event.preventDefault()
        if (dados.senha !== dados.confirmaSenha) {
            setError(true)
            setMessage({
                message: "As senhas precisam ser iguais",
                nivel: "Crítico"
            })
            return
        }

        try {

            const quantidadeusuarios = await get(`${process.env.NEXT_PUBLIC_API_URL}/usuariosempresa`)
            const minhaempresa = await get(`${process.env.NEXT_PUBLIC_API_URL}/minhaempresa`)

            if (minhaempresa[0].plano_id === 1) {
                setError(true)
                setMessage({
                    message: "Você não pode ter mais de 1 usuário no plano gratuito, considere alterar de plano :)",
                    nivel: "Crítico"
                })
                if (dados.id) {
                    atualizaUsuario(dados.id)
                }
                closeModal()
                Router.push('/planos')
            } else if (minhaempresa[0].plano_id === 2) {
                if (quantidadeusuarios.length >= 2) {
                    setError(true)
                    setMessage({
                        message: "Você não pode ter mais de 2 usuário no plano bronze, considere alterar de plano :)",
                        nivel: "Crítico"
                    })
                    closeModal()
                    Router.push('/planos')
                } else {
                    if (dados.id) {
                        atualizaUsuario(dados.id)
                    } else {
                        salvarUsuario()
                    }
                }
            } else if (minhaempresa[0].plano_id === 3) {
                if (quantidadeusuarios.length >= 5) {
                    setError(true)
                    setMessage({
                        message: "Você não pode ter mais de 5 usuário no plano prata, considere alterar de plano :)",
                        nivel: "Crítico"
                    })
                    closeModal()
                    Router.push('/planos')
                } else {
                    if (dados.id) {
                        atualizaUsuario(dados.id)
                    } else {
                        salvarUsuario()
                    }
                }
            } else if (minhaempresa[0].plano_id === 4) {
                if (quantidadeusuarios.length >= 10) {
                    setError(true)
                    setMessage({
                        message: "Você atingiu o limite máximo de usuários no sistema",
                        nivel: "Crítico"
                    })
                    closeModal();
                } else {
                    if (dados.id) {
                        atualizaUsuario(dados.id)
                    } else {
                        salvarUsuario(minhaempresa[0].id)
                    }
                }
            }

        } catch (error) {
            console.error(error)
        }
    }

    const salvarUsuario = async (empresaId) => {

        const novosDados = {
            ...dados,
            empresaId: localStorage.getItem('applojaweb_user_empresa') || empresaId
        }

        console.log(novosDados)

        try {
            const salvo = await post(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, novosDados)
            if (salvo.message) {
                setError(true)
                setMessage({
                    message: `Erro: ${salvo.message}`,
                    nivel: "Crítico"
                })
            }
            if (salvo.insertId) {
                if (dados.nivelUsuario === "3") {
                    await salvarVendedor(salvo.insertId)
                }
                props.setAtualizar(true)
                closeModal()
            }

        } catch (error) {
            console.error(error)
        }

    }

    const salvarVendedor = async (idUser) => {

        const dadosTratados = {
            ...vendedor,
            usuarioId: idUser,
            email: dados.email,
        }

        try {

            if (vendedor.id) {
                const salvaVendedor = await put(`${process.env.NEXT_PUBLIC_API_URL}/vendedores/${vendedor.id}`, dadosTratados)

                if (salvaVendedor.affectedRows === 1) {
                    console.log("Vendedor atualizado com sucesso")
                    if (enderecoVendedor.enderecoId) {
                        await atualizaEnderecoVendedor()
                    } else {
                        await salvaEnderecoVendedor(salvaVendedor.insertId)
                    }
                }
            } else {
                const salvaVendedor = await post(`${process.env.NEXT_PUBLIC_API_URL}/vendedores`, dadosTratados)

                if (salvaVendedor.insertId) {
                    console.log("Vendedor salvo com sucesso")
                    await salvaEnderecoVendedor(salvaVendedor.insertId)
                }
            }

        } catch (error) {
            console.error("Erro", error)
        }
    }

    const salvaEnderecoVendedor = async (idVendedor) => {
        const dadosTratados = {
            ...enderecoVendedor,
            vendedorId: idVendedor,
            fornecedorId: null,
            clienteId: null,
        }

        try {
            const salvaEndereco = post(`${process.env.NEXT_PUBLIC_API_URL}/enderecos`, dadosTratados)
            if (salvaEndereco.insertId) {
                console.log("Endereço do vendedor salvo com sucesso")
            }
        } catch (error) {
            console.error("Erro", error)
        }
    }

    const atualizaEnderecoVendedor = async () => {

        try {
            const atualizaendereco = await put(`${process.env.NEXT_PUBLIC_API_URL}/enderecos/${enderecoVendedor.enderecoId}`, enderecoVendedor)
            if (atualizaendereco.affectedRows === 1) {
                setError(true)
                setMessage({
                    message: "Dados Atualizados com Sucesso!!",
                    nivel: "Mínimo"
                })
                console.log("Endereco atualizado com sucesso!!")
            }
        } catch (error) {
            console.error(error)
        }

    }

    const atualizaUsuario = async (idUser) => {
        try {
            const atualizauser = await put(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${idUser}`, dados)
            if (atualizauser.affectedRows === 1) {
                setError(true)
                setMessage({
                    message: "Dados Atualizados com sucesso",
                    nivel: "Mínimo"
                })
                if (dados.nivelUsuario == "3") {
                    salvarVendedor(idUser)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (event) => {
        setDados({
            ...dados, [event.target.name]: event.target.value
        })
    }

    const deletar = async () => {

        try {
            const verificaquantidade = await get(`${process.env.NEXT_PUBLIC_API_URL}/usuariosempresa`)
            if (verificaquantidade.length === 1) {
                setError(true)
                setMessage({
                    message: "Você precisa ter pelo menos um usuário",
                    nivel: "Crítico"
                })
            } else {
                await remove(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${props.userSelecionado.id}`)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setError(true)
            setMessage({
                message: "Usuario Excluido!",
                nivel: "Médio"
            })
            props.setAtualizar(true)
            props.setUserSelecionado(null)
            closeModal()
        }
    }

    const handleVendedor = (event) => {
        setVendedor({ ...vendedor, [event.target.name]: event.target.value })
    }

    const handleAssoSsiarVendedor = (vendedor) => {

        if (vendedor.usuario_id) {
            setError(true)
            setMessage({
                message: "Vendedor já esta assissiado a outro usuario!!",
                nivel: "Crítico"
            })
        } else {
            setVendedor({
                id: vendedor.id,
                nome: vendedor.nome,
                usuarioId: dados.id,
                telefone: vendedor.telefone,
                celular: vendedor.celular,
                email: vendedor.email,
                tipoPessoa: vendedor.tipo_pessoa,
                cnpjCpf: vendedor.cnpj_cpf,
                inscricaoEstadual: vendedor.inscricao_estadual,
                fantasia: vendedor.fantasia,
                comissao: vendedor.comissao,
                observacao: vendedor.observacao,
                dataNascimento: vendedor.data_nascimento,
                dataContratacao: vendedor.data_contratacao,
            })
            setEnderecoVendedor({
                enderecoId: vendedor.enderecoId,
                vendedorId: vendedor.vendedor_id,
                clienteId: vendedor.cliente_id,
                fornecedorId: vendedor.fornecedor_id,
                cep: vendedor.cep,
                rua: vendedor.rua,
                numero: vendedor.numero,
                bairro: vendedor.bairro,
                cidade: vendedor.cidade,
                uf: vendedor.uf
            })
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

    const buscaDadosVendedor = async (idUser) => {
        setLoading(true)
        try {
            const dadosVendedor = await get(`${process.env.NEXT_PUBLIC_API_URL}/vendedorbyusuarioid/${idUser}`)
            if (dadosVendedor[0]) {
                setVendedor({
                    ...vendedor,
                    id: dadosVendedor[0].vendedorId,
                    nome: dadosVendedor[0].nome,
                    usuarioId: dadosVendedor[0].usuario_id,
                    telefone: dadosVendedor[0].telefone,
                    celular: dadosVendedor[0].celular,
                    email: dadosVendedor[0].email,
                    tipoPessoa: dadosVendedor[0].tipo_pessoa,
                    cnpjCpf: dadosVendedor[0].cnpj_cpf,
                    inscricaoEstadual: dadosVendedor[0].inscricao_estadual,
                    fantasia: dadosVendedor[0].fantasia,
                    comissao: dadosVendedor[0].comissao,
                    observacao: dadosVendedor[0].observacao,
                    dataNascimento: dadosVendedor[0].data_nascimento,
                    dataContratacao: dadosVendedor[0].data_contratacao,
                })
                setEnderecoVendedor({
                    enderecoId: dadosVendedor[0].enderecoId,
                    vendedorId: dadosVendedor[0].vendedor_id,
                    clienteId: dadosVendedor[0].cliente_id,
                    fornecedorId: dadosVendedor[0].fornecedor_id,
                    cep: dadosVendedor[0].cep,
                    rua: dadosVendedor[0].rua,
                    numero: dadosVendedor[0].numero,
                    bairro: dadosVendedor[0].bairro,
                    cidade: dadosVendedor[0].cidade,
                    uf: dadosVendedor[0].uf
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    console.log("Vendedor", vendedor)
    console.log("Endereco", enderecoVendedor)
    console.log("Vendedores", listaVendedores)

    return (
        <div id="medium-modal" className={props.hiddenUserModal + " flex flex-col absolute z-50 w-full min-h-full bg-gray-700 bg-opacity-60 items-center"}>
            <div className="relative p-4 w-full lg:w-1/2 h-full">
                {/*<!-- Modal content --> */}
                <div className="relative rounded-lg shadow bg-gray-200">
                    {/*<!-- Modal header --> */}
                    <div className="flex justify-between items-center p-5 rounded-t">
                        <h3 className="text-xl font-medium text-gray-700">
                            Usuário
                        </h3>
                        <button onClick={closeModal} type="button" className="text-gray-700 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-400">
                            <BsX className='text-gray-700' size={24} />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>



                    {/*!-- Modal body --> */}
                    <div className="p-6 space-y-6">

                        {error && message && <ErrorComponent errorMessage={message.message} level={message.nivel} />}

                        <form onSubmit={salvar} id='userForm' className='flex flex-col text-gray-700 gap-3'>
                            <div>
                                <label className="block text-sm font-medium">Nome</label>
                                <input name='username' className="border text-sm rounded-lg block w-full p-2.5" value={dados.username} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">E-mail</label>
                                <input name='email' type='email' className="border text-sm rounded-lg block w-full p-2.5" value={dados.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tipo</label>
                                <select className='border text-sm rounded-lg block w-full p-2.5' name="nivelUsuario" value={dados.nivelUsuario} onChange={handleChange} required>
                                    {
                                        nivelList && nivelList.map((nivel, i) => (
                                            <option key={i} value={nivel.id}>{nivel.nome}</option>
                                        ))
                                    }
                                </select>
                            </div>


                            {
                                loading ? 'Carregando...' : Number(dados.nivelUsuario) === 3 &&
                                    <div className='flex flex-col gap-3'>
                                        <div>
                                            <label className="block text-sm font-medium">Assossiar Vendedor</label>
                                            <select className="border text-sm rounded-lg block w-full p-2.5" name="nivelUsuario" value={vendedor.id || ''} onChange={(e) => {
                                                const vendedorSelecionado = listaVendedores.find(v => v.id == e.target.value);
                                                handleAssoSsiarVendedor(vendedorSelecionado);
                                            }}
                                            >
                                                <option value="">Selecione um Vendedor</option>
                                                {listaVendedores &&
                                                    listaVendedores.map((item, i) => (
                                                        <option key={i} value={item.id}>
                                                            {item.nome}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className='flex flex-col'>
                                            <label className="block text-sm font-medium" htmlFor="nome">Nome Completo</label>
                                            <input className='border text-sm rounded-lg p-2.5' type="text" name='nome' value={vendedor.nome} onChange={handleVendedor} required />
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
                                            <div>
                                                <label className="block text-sm font-medium" htmlFor="cep">Cep</label>
                                                <InputMask className='border text-sm rounded-lg block w-full p-2.5' type="text" name='cep' value={enderecoVendedor.cep} onChange={buscaCep} mask={'99.999-999'} required />
                                            </div>
                                            <div className='flex-1'>
                                                <label className="block text-sm font-medium" htmlFor="rua">Endereço</label>
                                                <input className='border text-sm rounded-lg block w-full p-2.5' type="text" name='rua' value={enderecoVendedor.rua} onChange={handleEnderecoVendedor} />
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
                            }

                            <div className='flex flex-col lg:flex-row gap-3'>
                                <div className='flex-1'>
                                    <label className="block text-sm font-medium">Senha</label>
                                    <input name='senha' type='password' className="border text-sm rounded-lg block w-full p-2.5" value={dados.senha} onChange={handleChange} required />
                                </div>
                                <div className='flex-1'>
                                    <label className="block text-sm font-medium">Confirmar Senha</label>
                                    <input name='confirmaSenha' type='password' className="border text-sm rounded-lg block w-full p-2.5" value={dados.confirmaSenha} onChange={handleChange} required />
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