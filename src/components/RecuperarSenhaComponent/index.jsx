import Link from 'next/link';
import { post } from '../../services/api';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const RecuperarSenhaComponent = () => {

    const route = useRouter()

    const { token } = route.query

    const [tokenRecuperacao, setTokenRecuperacao] = useState('')
    const [data, setData] = useState({
        email: '',
        senha: '',
        confirmacaoSenha: '',
        token: ''
    })

    useEffect(() => {
        if (token) {
            setTokenRecuperacao(token)
        }
    }, [token])

    useEffect(() => {
        setData({ ...data, token: tokenRecuperacao })
    }, [tokenRecuperacao])

    console.log("Path", data)

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value })
    }

    const alterarSenha = () => {

        if (data.senha == data.confirmacaoSenha) {

            post(process.env.NEXT_PUBLIC_API_URL + '/resetarsenha', data).then((res) => {
                if (res.erro) {
                    console.log(res.erro)
                } else {
                    console.log('Senha alterada com sucesso!')
                    Router.push('/login')
                }
            })

        } else {
            console.log('As Senhas não são compatíveis')
        }
    }

    return (
        <section className="h-screen">
            <div className="px-6 h-full text-gray-800">
                <div className="flex justify-center flex-wrap">
                    <div className="bg-white mt-8 p-8 rounded w-96">
                        <form autoComplete='off' aria-autocomplete='off'>
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
                                    <input
                                        type="text"
                                        className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        name="email"
                                        placeholder="E-mail"
                                        value={data.email}
                                        onChange={handleChange}
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="mb-6">
                                    <input
                                        type="password"
                                        className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        name="senha"
                                        placeholder="Nova Senha"
                                        value={data.senha}
                                        onChange={handleChange}
                                        autoComplete='off'
                                    />
                                </div>
                                <div className="mb-6">
                                    <input
                                        type="password"
                                        className="form-control block w-full px-4 py-2 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                        name="confirmacaoSenha"
                                        placeholder="Confirmação da Nova Senha"
                                        value={data.confirmacaoSenha}
                                        onChange={handleChange}
                                        autoComplete='off'
                                    />
                                </div>
                            </div>

                            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>

                            <div className="flex flex-row items-center justify-center lg:justify-start">
                                <button onClick={alterarSenha} type="button" className="h-11 w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                                    Alterar Senha
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}