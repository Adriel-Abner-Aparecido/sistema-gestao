import Link from 'next/link';
import { post } from '../../services/api';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ErrorComponent } from '../ErrorComponent';

export const CadastroComponent = () => {

    const dadosPadrao = {
        nome: '',
        nomeFantasia: '',
        cnpj: null,
        telefone: null,
        celular: null,
        email: null,
        cep: null,
        rua: null,
        numero: null,
        bairro: null,
        complemento: null,
        cidade: null,
        uf: null,
        emailUser: '',
        planoId: 1,
        consumerKey: null,
        consumerSecret: null,
        classeImpostoPadrao: null,
        origem: "organico"
    }

    const dadosUsuarioPadrao = {
        empresaId: null,
        username: '',
        email: '',
        senha: '',
        nivelUsuario: 1
    }

    const [dados, setDados] = useState(dadosPadrao)
    const [usuario, setUsuario] = useState(dadosUsuarioPadrao)
    const [confirmaSenha, setConfirmaSenha] = useState('')
    const [politicas, setPoliticas] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState()

    const router = useRouter()
    const query = router.query

    useEffect(() => {
        if (typeof window !== "undefined") {
            const { utm_campanha, indicacao } = query

            setDados((prev) => ({
                ...prev,
                origem: utm_campanha ? utm_campanha : "Organico",
                indicacao: indicacao ? Number(indicacao) : false
            }));
        }
    }, [query])

    const handleMail = (email) => {
        setDados({ ...dados, emailUser: email })
        setUsuario({ ...usuario, email })
    }

    const handleChange = (event) => {
        setUsuario({ ...usuario, [event.target.name]: event.target.value })
    }

    const handleChangeEmpresa = (event) => {
        setDados({ ...dados, [event.target.name]: event.target.value })
    }

    const cadastrar = async (event) => {
        event.preventDefault()

        if (dados.nome === "" && usuario.username === "" && usuario.email === "" && usuario.senha === "" && confirmaSenha === "") {
            setError(true)
            setErrorMessage({
                message: <p>Todos os campos precisam estar cadastrados</p>,
                nivel: 'Médio'
            })
            setLoading(false)
        }


        if (usuario.senha === confirmaSenha) {
            setError(true)
            setErrorMessage({
                message: <p>As senhas devem ser iguais</p>,
                nivel: 'Crítico'
            })
            setLoading(false)
        }

        if (politicas) {
            setError(true)
            setErrorMessage({
                message: <p>Aceite os termos de uso e as políticas de Privacidade</p>,
                nivel: 'Crítico'
            })
            setLoading(false)
        }

        try {

            setLoading(true)

            const cadastraempresa = await post(`${process.env.NEXT_PUBLIC_API_URL}/empresas`, dados)
            if (cadastraempresa.message) {
                setLoading(false)
                setError(true)
                setErrorMessage({
                    message: cadastraempresa.message,
                    nivel: 'Crítico'
                })
            }
            if (cadastraempresa.insertId) {
                const dadosUsuarioNovo = {
                    ...usuario,
                    empresaId: cadastraempresa.insertId
                }

                const cadastraUsuario = await post(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, dadosUsuarioNovo)
                if (cadastraUsuario.erro) {
                    setLoading(false)
                    setError(true)
                    setErrorMessage({
                        message: cadastraUsuario.message,
                        nivel: 'Crítico'
                    })
                }
                if (cadastraUsuario.insertId) {
                    const dataLogin = {
                        email: usuario.email,
                        senha: usuario.senha
                    }

                    const login = await post(`${process.env.NEXT_PUBLIC_API_URL}/login`, dataLogin)
                    if (login.mensagem === "Falha na autenticação") {
                        alert("Email ou Senha incorreto")
                    } else {
                        localStorage.setItem("applojaweb_token", login.token);
                        localStorage.setItem("applojaweb_user_name", login.username);
                        localStorage.setItem("applojaweb_user_email", login.email);
                        localStorage.setItem("applojaweb_user_empresa", login.empresa_id);
                        localStorage.setItem("apploja_user_id", login.usuario_id)
                        localStorage.setItem("applojaweb_user_level", login.nivel_usuario);
                        Router.push('/dashboard')
                        setLoading(false)
                    }
                }
            }

        } catch (error) {
            setError(true)
            setErrorMessage({
                message: <p>Erro inesperado {error}</p>,
                nivel: 'Crítico'
            })
            setLoading(false)
        }

    }

    console.log("dados", dados)

    return (
        <section className="h-screen">
            <div className="px-6 h-full text-gray-800">
                <div className="flex justify-center flex-wrap">
                    <div className="flex flex-col gap-3 bg-white mt-8 p-8 rounded w-96">
                        {
                            error && errorMessage && <ErrorComponent errorMessage={errorMessage.message} level={errorMessage.nivel} />
                        }
                        <form onSubmit={cadastrar}>
                            <div className="flex flex-col items-center">
                                <div className="h-36 w-36">
                                    <img src="/images/logoAPPLoja.png" className="w-full h-full" alt="Flowbite Logo" />
                                </div>
                                <p className="text-gray-500 mt-2 pt-1 mb-0">
                                    Já tem uma conta?
                                    <Link href='/login'>
                                        <label className='ml-2 text-blue-600 hover:text-blue-700 focus:text-blue-700 hover:underline transition duration-200 ease-in-out cursor-pointer'>Entre aqui</label>
                                    </Link>
                                </p>
                            </div>
                            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>
                            <div>
                                <div className="mb-6">
                                    <input type="text" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="nome" placeholder="Nome da Empresa" value={dados.nome} onChange={handleChangeEmpresa} required autoComplete='off' />
                                </div>
                                <div className="mb-6">
                                    <input type="text" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="username" placeholder="Nome de usuario" value={usuario.username} onChange={handleChange} required autoComplete='off' />
                                </div>
                                <div className="mb-6">
                                    <input type="text" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="emailUser" placeholder="E-mail" value={usuario.email} onChange={(event) => handleMail(event.target.value)} required />
                                </div>
                                <div className="mb-6">
                                    <input type="password" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="senha" placeholder="Senha" value={usuario.senha} onChange={handleChange} required autoComplete='off' />
                                </div>
                                <div className="mb-6">
                                    <input type="password" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="confirmacaoSenha" placeholder="Confirmação da Senha" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} required autoComplete='off' />
                                </div>
                                <div className="mb-6">
                                    <input type="checkbox" className='mr-2' checked={politicas} onChange={() => setPoliticas(!politicas)} required />
                                    <label>Concordo com os <a rel='noopener noreferrer' onClick={() => { window.open('https://apploja.com/termosservico/', '_blank') }} className='text-blue-600 hover:text-blue-700 cursor-pointer hover:underline'>termos de uso</a> e a <a onClick={() => { window.open('https://apploja.com/termosservico/', '_blank') }} className='text-blue-600 hover:text-blue-700 cursor-pointer hover:underline'>política de Privacidade</a></label>
                                </div>
                            </div>

                            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>

                            <div className="flex flex-row items-center justify-center lg:justify-start">
                                {
                                    loading ? <button type="submit" className="h-11 w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                                        Carregando
                                    </button> : <button type="submit" className="h-11 w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                                        Cadastrar
                                    </button>
                                }

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}