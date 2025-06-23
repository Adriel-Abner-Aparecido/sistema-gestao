import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';

export const PromocaoComponent = () => {
    const [hidden, setHidden] = useState('hidden');

    useEffect(() => {
        get(process.env.NEXT_PUBLIC_API_URL + '/minhaempresa').then((res) => {
            if (res && res.mensagem) {
                if (res.mensagem == "falha na autenticação") {
                    console.log('falha na autenticação');
                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                if (res && res[0] && res[0].plano_id == 1) {
                    setHidden('');
                } else {
                    setHidden('hidden');
                }
            }
        });
    }, []);

    return (
        <div className={hidden + ' bg-yellow-400 w-full flex flex-row justify-center items-center gap-8 py-2'}>
            <div className="w-1/2 md:w-auto">
                <span className="font-bold text-base md:text-xl text-red-600">Escolha um de nossos Planos</span>
            </div>
            <div>
                <button onClick={() => Router.push('/planos')} className="bg-red-600 px-2 py-1 text-sm rounded text-white hover:bg-red-500">Assine agora!</button>
            </div>
        </div>
    )
}