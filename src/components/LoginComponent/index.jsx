import { BsGoogle, BsX } from 'react-icons/bs';
import { post } from '../../services/api';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from "../../context";
import { ErrorComponent } from '../ErrorComponent';

export const LoginComponent = () => {

    const dadosPadrao = {
        email: '',
        senha: ''
    }

    const emailRecuperacaoPadrao = {
        email: ''
    }

    const dadosRecuperacaoPadrao = {
        email: '',
        senha: '',
        confirmacaoSenha: '',
        token: ''
    }

    const [hiddenPopUpRecuperarSenha, setHiddenPopUpRecuperarSenha] = useState('hidden');
    const [loading, setLoading] = useState(false)
    const [dados, setDados] = useState(dadosPadrao)
    const [emailRecuperacao, setEmailRecuperacao] = useState(emailRecuperacaoPadrao)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState()
    const [alertMessage, setAlertMessage] = useState()
    const [recuperaSenha, setRecuperaSenha] = useState(false)
    const [dadosRecuperacao, setDadosRecuperacao] = useState(dadosRecuperacaoPadrao)

    const closePopUpRecuperarSenha = () => {
        setError(false)
        setAlertMessage('')
        setEmailRecuperacao(emailRecuperacaoPadrao)
        if (hiddenPopUpRecuperarSenha == 'hidden') {
            setHiddenPopUpRecuperarSenha('')
        } else {
            setHiddenPopUpRecuperarSenha('hidden')
        }
    }

    const closePopUpRecuperarSenhaAndOpenRecuperar = () => {
        closePopUpRecuperarSenha()
        setRecuperaSenha(true)
    }

    const handleDados = (event) => {
        setDados({ ...dados, [event.target.name]: event.target.value })
    }

    const entrar = async (event) => {
        event.preventDefault()
        setLoading(true)

        if (dados.email != '') {
            if (dados.senha != '') {
                try {
                    const login = await post(`${process.env.NEXT_PUBLIC_API_URL}/login`, dados)

                    if (login.mensagem == 'Falha na autenticação') {
                        setLoading(false)

                        setError(true)
                        setErrorMessage({
                            message: <div><p>Email ou Senha incorreto.</p><p>Dica: Caso você seja novo aqui, clique no botão Cadastre-se.</p></div>,
                            nivel: 'Crítico'
                        })

                    } else {
                        localStorage.setItem("applojaweb_token", login.token);
                        localStorage.setItem("applojaweb_user_name", login.username);
                        localStorage.setItem("applojaweb_user_email", login.email);
                        localStorage.setItem("applojaweb_user_empresa", login.empresa_id);
                        localStorage.setItem("apploja_user_id", login.usuario_id)
                        localStorage.setItem("applojaweb_user_level", login.nivel_usuario);
                        console.log(login.nivel_usuario)
                        if (login.nivel_usuario === 1) {
                            Router.push('/dashboard')
                        }
                        if (login.nivel_usuario === 2) {
                            Router.push('/newPdv')
                        }
                        if (login.nivel_usuario === 3) {
                            Router.push('/pedidos')
                        }
                        setError(false)
                        setErrorMessage(undefined)
                    }
                } catch (error) {
                    setError(true)
                    setErrorMessage({
                        message: <>
                            <p>Erro inesperado no servidor, tente novamente mais tarde!</p>
                            <p>Caso o erro persista contate nosso <a href='https://wa.me/5541995313382?text=Estou%20tendo%20problemas%20para%20entrar%20no%20sistema'>suporte</a></p>
                        </>,
                        nivel: 'Crítico'
                    })
                    console.error(error)
                    setLoading(false)
                }
            } else {
                setLoading(false)
                setError(true)
                setErrorMessage({
                    message: <p>Campo senha deve ser preenchido</p>,
                    nivel: 'Crítico'
                })
            }
        } else {
            setLoading(false)
            setError(true)
            setErrorMessage({
                message: <p>Campo email deve ser preenchido</p>,
                nivel: 'Crítico'
            })
        }
    }

    const esqueceuSenha = async (event) => {
        event.preventDefault()

        try {
            const recuperar = await post(`${process.env.NEXT_PUBLIC_API_URL}/esqueceusenha`, emailRecuperacao)
            if (recuperar.erro) {
                setError(true)
                setErrorMessage({
                    message: recuperar.erro,
                    nivel: 'Crítico'
                })
                setEmailRecuperacao(emailRecuperacaoPadrao)
            } else {
                setRecuperaSenha(true)
                setEmailRecuperacao(emailRecuperacaoPadrao)
                closePopUpRecuperarSenha()
            }
        } catch (error) {
            setError(true)
            setErrorMessage({
                message: <>
                    <p>Erro inesperado no servidor, tente novamente mais tarde!</p>
                    <p>Caso o erro persista contate nosso <a href='https://wa.me/5541995313382?text=Estou%20tendo%20problemas%20para%20solicitar%20o%20Token'>suporte</a></p>
                </>,
                nivel: 'Crítico'
            })
            console.error(error)
        }
    }

    const alterarSenha = async (event) => {
        event.preventDefault()

        if (dadosRecuperacao.email !== '') {

            if (dadosRecuperacao.senha == dadosRecuperacao.confirmacaoSenha) {

                try {
                    const recupera = await post(`${process.env.NEXT_PUBLIC_API_URL}/resetarsenha`, dadosRecuperacao)
                    if (recupera.erro) {
                        setError(true)
                        setErrorMessage({
                            message: <p>{recupera.erro}</p>,
                            nivel: 'Crítico'
                        })
                        setDadosRecuperacao(dadosRecuperacaoPadrao)
                        console.log("Error", recupera.erro)
                    } else {
                        setError(true)
                        setErrorMessage({
                            message: <p>Senha alterada com sucesso!</p>,
                            nivel: 'Mínimo'
                        })
                        setTimeout(() => {
                            setRecuperaSenha(false)
                            setError(false)
                            setErrorMessage(undefined)
                        }, 2000)
                    }
                } catch (error) {
                    setError(true)
                    setErrorMessage({
                        message: <>
                            <p>Erro inesperado no servidor, tente novamente mais tarde!</p>
                            <p>Caso o erro persista contate nosso <a href='https://wa.me/5541995313382?text=Estou%20tendo%20problemas%20para%20alterar%20minha%20senha'>suporte</a></p>
                        </>,
                        nivel: 'Crítico'
                    })
                    console.error(error)
                }

            } else {
                setError(true)
                setErrorMessage({
                    message: <p>As senhas devem ser iguais</p>,
                    nivel: 'Crítico'
                })
            }

        }

    }

    const handleChangeRecuperacao = (event) => {
        setDadosRecuperacao({ ...dadosRecuperacao, [event.target.name]: event.target.value })
    }

    return (
        <section className="h-screen">
            <div className="px-6 h-full text-gray-800">
                <div className="flex justify-center flex-wrap">
                    <div className="flex flex-col bg-white mt-16 p-8 rounded w-96 gap-4">
                        {
                            error && errorMessage && <ErrorComponent errorMessage={errorMessage.message} level={errorMessage.nivel} />
                        }
                        {
                            recuperaSenha ? (

                                <form onSubmit={alterarSenha}>
                                    <div className="flex flex-col items-center">
                                        <div className="h-36 w-36">
                                            <img src="/images/logoAPPLoja.png" className="w-full h-full" alt="Flowbite Logo" />
                                        </div>
                                        <p className="text-gray-500 mt-2 pt-1 mb-0">
                                            Já tem uma conta?
                                            <button onClick={() => setRecuperaSenha(false)}>
                                                <label className='ml-2 text-blue-600 hover:text-blue-700 focus:text-blue-700 hover:underline transition duration-200 ease-in-out cursor-pointer'>Entre aqui</label>
                                            </button>
                                        </p>
                                    </div>

                                    <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>

                                    <div className='flex flex-col gap-6'>
                                        <div className="w-full">
                                            <input type="text" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="email" placeholder="E-mail" value={dadosRecuperacao.email} onChange={handleChangeRecuperacao} require />
                                        </div>
                                        <div className="w-full">
                                            <input type="password" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="senha" placeholder="Nova Senha" value={dadosRecuperacao.senha} onChange={handleChangeRecuperacao} require />
                                        </div>
                                        <div className="w-full">
                                            <input type="password" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="confirmacaoSenha" placeholder="Confirmação da Nova Senha" value={dadosRecuperacao.confirmacaoSenha} onChange={handleChangeRecuperacao} required />
                                        </div>
                                        <div className="w-full">
                                            <input type="text" className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="token" placeholder="Token" value={dadosRecuperacao.token} onChange={handleChangeRecuperacao} required />
                                        </div>
                                    </div>

                                    <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>

                                    <div className="flex flex-row items-center justify-center w-full">
                                        <button type="submit" className="h-11 w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-5 py-2.5 text-center items-center justify-center">
                                            Alterar Senha
                                        </button>
                                    </div>
                                </form>

                            ) : (

                                <form onSubmit={entrar}>
                                    <div className="flex flex-col items-center">
                                        <div className="h-36 w-36">
                                            <img src="/images/logoAPPLoja.png" className="w-full h-full" alt="Flowbite Logo" />
                                        </div>
                                    </div>
                                    <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>
                                    <div>
                                        <div className="mb-6">
                                            <input type="text" className="block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="email" placeholder="E-mail" onChange={handleDados} />
                                        </div>
                                        <div className="mb-6">
                                            <input type="password" className="block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" name="senha" placeholder="Senha" onChange={handleDados} />
                                        </div>
                                        <div className="flex justify-between items-center mb-6">
                                            <a onClick={closePopUpRecuperarSenha} className="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out hover:underline hover:cursor-pointer">Esqueceu a Senha?</a>
                                        </div>
                                        <div className="flex flex-col text-center lg:text-left gap-2">

                                            {
                                                loading ?
                                                    <button type="button" className="inline-block w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                                                        Carregando...
                                                    </button> :
                                                    <button type="submit" className="inline-block w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                                                        Entrar
                                                    </button>
                                            }

                                            {/* <button type="button" className="h-11 w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                                                <BsGoogle size={20} className='mr-4' />
                                                Entrar com Google
                                            </button> */}
                                        </div>
                                        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                                            <p className="text-center text-gray-600 font-semibold mx-4 mb-0">Ou</p>
                                        </div>
                                        <div className="text-center lg:text-left">
                                            <button onClick={() => Router.push('/cadastro')} type="button" className="inline-block w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                                                Cadastre-se
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )
                        }
                    </div>
                </div>
            </div>
            {/* POPUP esqueceu */}
            <div id="popup-modal" className={"fixed w-full z-50 md:p-4 " + hiddenPopUpRecuperarSenha + " overflow-x-hidden overflow-y-auto inset-0 h-modal h-full bg-gray-700 bg-opacity-80"}>
                <div className="flex justify-center items-center w-full h-full">
                    <div className="md:w-1/3 rounded-lg shadow bg-white p-2">
                        {
                            error && alertMessage && <ErrorComponent errorMessage={alertMessage.message} level={errorMessage.nivel} />
                        }

                        <div className="flex flex-col text-center gap-4">
                            <div className="flex flex-row rounded-t-lg justify-end">
                                <button onClick={closePopUpRecuperarSenha} type="button" className="bg-transparent rounded-lg text-sm p-2 items-center hover:bg-gray-400 text-gray-700" data-modal-hide="popup-modal">
                                    <BsX className="text-4xl" />
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className='flex flex-col px-6 gap-2'>
                                <form onSubmit={esqueceuSenha} id='resetSenha'>
                                    <label className="block mb-2 text-sm font-medium">E-mail de recuperação</label>
                                    <input name='email' className="block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" onChange={(e) => setEmailRecuperacao({ ...emailRecuperacao, email: e.target.value })} value={emailRecuperacao.email} required />
                                </form>
                                <button onClick={closePopUpRecuperarSenhaAndOpenRecuperar} className='text-blue-700 hover:underline'>Ja tenho um token!</button>
                            </div>
                            <div className="flex flex-row justify-between px-6">
                                <button type="submit" form='resetSenha' className="flex-1 text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center justify-center px-5 py-2.5 text-center mr-2">
                                    Enviar
                                </button>
                                <button onClick={closePopUpRecuperarSenha} type="button" className="flex-1 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center justify-center px-5 py-2.5  mr-2">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}