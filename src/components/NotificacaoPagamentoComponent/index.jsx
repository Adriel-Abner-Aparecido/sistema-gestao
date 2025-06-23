import Router from 'next/router';
import { get } from '../../services/api';
import { useEffect, useState } from 'react';

export const NotificacaoPagamentoComponent = () => {
    const [aVencer, setAVencer] = useState(false);
    const [vencida, setVencida] = useState(false);
    const [dias, setDias] = useState(0);

    useEffect(() => {
        get(process.env.NEXT_PUBLIC_API_URL + '/minhaempresa').then((res) => {
            if (res && res.mensagem) {
                if (res.mensagem === "falha na autenticação") {
                    console.log('falha na autenticação');
                    localStorage.removeItem("applojaweb_token");
                    Router.push('/login');
                }
            } else {
                if (res && res[0] && res[0].plano_id !== 1) {
                    get(process.env.NEXT_PUBLIC_API_URL + '/vencimento-info').then((res) => {
                        console.log(res);
                        if (res.mensagem === "à vencer") {
                            setAVencer(true);
                            setDias(res.dias);
                        } else if (res.mensagem === "vencida") {
                            setVencida(true);
                            setDias(res.dias);
                        }
                    });
                }
            }
        });
    }, []);

    const mensagem = () => {
        if (aVencer) {
            return (
                <div className={'bg-red-600 w-full flex flex-row justify-center items-center gap-8 py-2'}>
                    <div className="w-1/2 md:w-auto">
                        <span className="font-bold text-base md:text-xl text-white">Faltam apenas <span className="text-base md:text-2xl">{dias}</span> dias para vencer seu plano!</span>
                    </div>
                </div>
            );
        } else if (vencida) {
            return (
                <div className={'bg-red-600 w-full flex flex-row justify-center items-center gap-8 py-2'}>
                    <div className="w-1/2 md:w-auto">
                        <span className="font-bold text-base md:text-xl text-white">Seu plano está bloqueado! renove o pagamento para recuperar as funcionalidades do seu plano</span>
                    </div>
                    <div>
                        <button onClick={() => Router.push('/planos')} className="bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-500">Renovar pagamento</button>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    return mensagem();
}
