import { useEffect, useState } from 'react';
import { BsX } from 'react-icons/bs';
import { post, remove } from '../../services/api';
import InputMask from 'react-input-mask';
import Router from "next/router";

export const ListaPrecoModal = (props) => {
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        if (props.statusModal == "") {
            props.setStatusModal("hidden")
        }
    }

    useEffect(() => {
        if (props.listaPrecoSelecionada) {

        } else {

        }
    });

    const salvar = () => {
        setLoading(true);

        let nome = document.getElementById('nomeListaPreco').value;
        let empresa_id = localStorage.getItem("applojaweb_user_empresa");

        const data = {
            nome: nome,
            empresaId: empresa_id
        }

        post(process.env.NEXT_PUBLIC_API_URL + '/listaprecos', data).then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                if (res.message == undefined) {
                    console.log("Salvo com sucesso");
                    //props.setCorSelecionada(data);
                    closeModal();
                    props.setAtualizar(!props.atualizar)
                } else {
                    console.log(res.message)
                }
                setLoading(false);
            }
        })

    }

    const deletar = () => {
        setLoading(true);
        let idCor = props.corSelecionada.id

        remove(process.env.NEXT_PUBLIC_API_URL + '/listaprecos/' + idCor + '').then((res) => {
            if (res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');

                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                setLoading(false);
                props.setCorSelecionada({});
                closeModal();
            }
        })
    }

    return (
        <div id="medium-modal" className={props.statusModal + " pt-28 first-letter:overflow-y-auto overflow-x-hidden absolute z-50 w-full h-modal sm:h-auto sm:w-1/4"}>
            <div className="relative p-4 w-full h-full sm:h-auto">
                {/*<!-- Modal content --> */}
                <div className="relative rounded-lg shadow bg-gray-600">
                    {/*<!-- Modal header --> */}
                    <div className="flex justify-between items-center p-5 rounded-t border-b border-gray-500">
                        <h3 className="text-xl font-medium text-white">
                            Lista de Preços
                        </h3>
                        <button onClick={closeModal} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-500 hover:text-white">
                            <BsX className='text-white' size={24} />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/*!-- Modal body --> */}
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Nome</label>
                            <input id='nomeListaPreco' className="border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-500 border-gray-400 placeholder-gray-300 text-white" required />
                        </div>
                    </div>
                    {/*<!-- Modal footer --> */}
                    {loading ? (
                        <div className="flex items-center justify-between p-6 space-x-2 rounded-b border-t border-gray-500">
                            <button type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600">
                                <div className='flex' role="status">
                                    <svg aria-hidden="true" className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    Aguarde...
                                </div>
                            </button>
                            <button type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">
                                <div className='flex' role="status">
                                    <svg aria-hidden="true" className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="https://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    Aguarde...
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-6 space-x-2 rounded-b border-t border-gray-500">
                            <button onClick={() => { }} type="button" className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-red-700 text-white border-red-500 hover:text-white hover:bg-red-600 focus:ring-red-600">Excluir</button>
                            <button onClick={salvar} type="button" className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 hover:bg-green-700 focus:ring-green-800">Salvar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}