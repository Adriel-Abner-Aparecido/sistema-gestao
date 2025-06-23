import { createContext, useContext, useEffect, useState } from "react";
import { get } from "../services/api";
import Router from "next/router";

// Criação do contexto
const EmpresaContext = createContext();

// Hook para facilitar o uso do contexto
export const useEmpresa = () => {
    const context = useContext(EmpresaContext);
    if (!context) {
        throw new Error("useEmpresa deve ser usado dentro de um EmpresaProvider.");
    }
    return context;
};

// Provedor do contexto
export const EmpresaProvider = ({ children }) => {

    const [empresa, setEmpresa] = useState({});

    const [alerts, setAlerts] = useState(false);
    const [text, setText] = useState("");

    useEffect(() => {
        fetchEmpresa()
    }, [])

    useEffect(() => {

        if (empresa.planoId != 1 && Boolean(empresa.inativo) && empresa.dias_para_expirar === 0) {

            Router.push('/planos')

        }

    }, [empresa])

    const fetchEmpresa = async () => {

        try {

            const empresa = await get(`${process.env.NEXT_PUBLIC_API_URL}/minhaempresa`)

            if (empresa.mensagem === "falha na autenticação") {

                localStorage.removeItem("applojaweb_token");
                Router.push('/login')

            } else {

                setEmpresa({
                    id: empresa[0].id,
                    nome: empresa[0].nome,
                    cnpj: empresa[0].cnpj,
                    telefone: empresa[0].telefone,
                    celular: empresa[0].celular,
                    email: empresa[0].email,
                    planoId: empresa[0].plano_id,
                    consumerKey: empresa[0].webmania_consumer_key,
                    consumerSecret: empresa[0].webmania_consumer_secret,
                    classeImpostoPadrao: empresa[0].classe_imposto_padrao,
                    contratacao: empresa[0].contratacao,
                    logoImage: empresa[0].logo_image ? empresa[0].logo_image : null,
                    cep: empresa[0].cep,
                    inativo: empresa[0].inativo,
                    dias_para_expirar: empresa[0].dias_para_expirar,
                    validade_plano: empresa[0].validade_plano
                })

            }

        } catch (error) {
            console.error(error)
        }

    }

    return (
        <EmpresaContext.Provider value={{ empresa, setEmpresa, alerts, setAlerts, text, setText }}>
            {children}
        </EmpresaContext.Provider>
    );
};
