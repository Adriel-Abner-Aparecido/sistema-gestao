import { useEffect } from "react"
import { FaCircleExclamation, FaX } from "react-icons/fa6"

export const RenovacaoAlert = (props) => {



    useEffect(() => {
        if (props.empresa) {

            const dataContratacao = props.empresa.contratacao

            console.log(dataContratacao)

            if (props.empresa.planoId !== 1) {
                const contratacao = new Date(dataContratacao)
                const year = contratacao.getFullYear()
                const month = contratacao.getMonth() + 1
                const date = contratacao.getDate()

                const dateNow = new Date()
                const thisYear = dateNow.getFullYear()
                const thisMonth = dateNow.getMonth() + 1
                const today = new Date().getDate()
                const limit = 18

                if (thisYear > year && thisMonth >= month && today >= limit) {
                    props.setPlanAlert(true)
                }
            }
        }
    }, [props.empresa])

    if (props.planAlert) {

        return (

            <>
                <div className="fixed z-[999] flex flex-col h-screen w-screen bg-gray-700 bg-opacity-60 justify-center items-center transition-transform">
                    <div className="relative flex flex-col w-1/2 h-1/2 bg-gray-200 rounded-md p-4">
                        <div className="flex flex-row w-full rounded-t-md justify-end">
                            <button className="hover:bg-gray-400 p-2 rounded-md" onClick={() => props.setPlanAlert(false)}>
                                <FaX className="text-gray-700" />
                            </button>
                        </div>
                        <div className="flex flex-col w-full h-full p-5 text-center items-center justify-center gap-4">
                            <FaCircleExclamation className="text-8xl text-gray-700" />
                            <h1 className="text-2xl font-medium text-gray-700 uppercase">Infelizmente seu plano expirou, para continuar usando nossos serviços é necessario ralizar a renovação ou escolher um de nossos planos.</h1>
                            <button onClick={() => props.setPlanAlert(false)} className="bg-green-800 hover:bg-green-700 p-2 rounded-md uppercase text-2xl text-white">Renovar!</button>
                        </div>
                    </div>
                </div>
            </>


        )
    }

    return null
}