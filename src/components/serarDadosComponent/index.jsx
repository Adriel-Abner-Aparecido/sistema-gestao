import { useState } from "react"
import { remove } from "../../services/api"

export const ZerarDadosComponent = () => {

    const [popUpConfirmacao, setPopUpConfirmacao] = useState(false)

    const excluirDados = async () => {

        try {
            const res = await remove(`${process.env.NEXT_PUBLIC_API_URL}/zerar-dados-empresa`)

            if (res.message) {
                alert(res.message)
            }

        } catch (error) {
            console.error("Erro ao tentar excluir os dados:" + error.message)
        } finally {
            setPopUpConfirmacao(false)
        }

    }


    return (<>
        <div className="flex flex-col md:flex-row gap-4 w-full">

            <div className="flex flex-row">
                <button onClick={() => setPopUpConfirmacao(true)} className="bg-red-500 font-bold uppercase px-4 py-2 rounded-lg hover:bg-red-400 text-white active:bg-red-600">Zerar Dados</button>
            </div>

            <div className={popUpConfirmacao ? "absolute w-full h-full top-0 left-0 flex items-center justify-center bg-gray-700 bg-opacity-60" : "hidden"}>
                <div className="bg-gray-200 w-[400px] p-6 rounded-lg shadow-lg flex flex-col gap-4">
                    <h1 className="text-2xl text-gray-700 text-center">Tem certeza que deseja zerar os dados do seu sistema?</h1>
                    <div className="flex flex-row gap-4">
                        <button onClick={excluirDados} className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Sim</button>
                        <button onClick={() => setPopUpConfirmacao(false)} className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Não</button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}