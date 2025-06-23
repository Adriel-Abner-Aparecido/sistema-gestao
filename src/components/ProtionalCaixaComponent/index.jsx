import { useRouter } from "next/router"
import { FaCircleExclamation, FaX } from "react-icons/fa6"

export const PromotionalCaixa = () => {

    const router = useRouter()

    return (
        <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="flex flex-col w-4/5 h-[600px] bg-gray-200 rounded-lg">
                <div className="flex flex-col w-full h-full p-5 text-center items-center justify-center gap-8">
                    <FaCircleExclamation className="text-8xl text-gray-700" />
                    <h1 className="text-2xl font-medium text-gray-700 uppercase">Para utilizar este recurso voce precisa escolher um de nossos planos.</h1>
                    <button onClick={() => router.push('/planos')} className="bg-green-800 hover:bg-green-700 p-4 rounded-md uppercase text-2xl text-white">Fazer Upgrade</button>
                </div>
            </div>
        </div>
    )
}