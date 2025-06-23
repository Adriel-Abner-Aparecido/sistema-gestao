import { useEffect, useState } from "react"
import { useAuth } from "../../context"
import { LoadingComponent } from "../LoadingComponent"
import { PromotionalCaixa } from "../ProtionalCaixaComponent"
import { useEmpresa } from "../../context/empresaContext"

export const LimiterComponent = ({ children }) => {

    const [loading, setLoading] = useState(false)

    const { empresa } = useEmpresa();

    useEffect(() => {
        setLoading(true)
        if (empresa && empresa.planoId !== undefined) {
            setLoading(false)
        }
    }, [empresa])

    if (loading) {
        return <LoadingComponent />
    }

    if (empresa && empresa.planoId === 1 && +empresa.dias_para_expirar < 373) {
        return (
            <PromotionalCaixa />
        )
    }

    return children
}