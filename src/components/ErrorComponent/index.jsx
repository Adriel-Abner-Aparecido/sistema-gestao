import { useEffect, useState } from "react"

export const ErrorComponent = ({ errorMessage, level }) => {

    const [nivel, setNivel] = useState(null)

    useEffect(() => {
        switch (level) {
            case 'Crítico':
                setNivel("bg-red-500")
                break
            case 'Médio':
                setNivel("bg-yellow-500")
                break
            case 'Mínimo':
                setNivel("bg-green-500")
                break
            case 'Nenhum':
                setNivel("bg-gray-200")

            default:
                setNivel(null)

        }
    }, [level])

    return (
        <div className={`flex flex-row p-4 ${level === 'Nenhum' ? 'text-gray-700' : 'text-white'}  ${nivel} font-medium rounded-lg uppercase`}>
            <p>{errorMessage}</p>
        </div>
    )
}