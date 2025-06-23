import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const Alerts = (props) => {

    const router = useRouter()

    const [nivel, setNivel] = useState()

    useEffect(() => {
        if (props.nivel === "critico") {
            setNivel("bg-red-400")
        }
        if (props.nivel === "medio") {
            setNivel("bg-yellow-400")
        }
        if (props.nivel === "minimo") {
            setNivel("bg-gray-400")
        }
    }, [props.nivel])

    if (props.alerts) {
        return (
            <>
                <div className={"flex flex-row w-full " + nivel + " p-4 gap-4 items-center justify-center"}>
                    <h1 className="font-medium text-gray-700">{props.text}</h1>
                    <button onClick={() => router.push('/planos')} className="p-2 bg-green-600 uppercase text-white font-medium rounded-lg">Renovar!</button>
                </div>
            </>
        )
    }

    return null

}