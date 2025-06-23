import { BsX } from "react-icons/bs"
import { post } from "../../services/api"

export const PopUpCancelaNota = (props) => {

    const cancelarNf = async () => {

        props.setPopUpCancelarNota(false)

        try {

            const cancelanota = await post(`${process.env.NEXT_PUBLIC_API_URL}/cancelarnf`, {
                chave: props.notaParaCancelar.chave,
            })

            if (cancelanota.message) {
                props.setReload(true)
                props.setNotaParaCancelar(null)
            }

        } catch (error) {
            console.error(error)
        } finally {
            props.setPopUpCancelarNota(false)
            props.setNotaParaCancelar(null)
            props.setReload(true)
        }

    }

    const closeClear = () => {
        props.setPopUpCancelarNota(false)
        props.setNotaParaCancelar(null)
    }

    return (<>
        <div className={`${props.popUpCancelarNota ? 'absolute' : 'hidden'}  flex w-full h-full bg-gray-700 bg-opacity-60 items-center justify-center`}>
            <div className="relative bg-gray-200 rounded-lg">
                <div className="flex flex-row p-2 justify-end">
                    <button onClick={closeClear} className="p-2 bg-gray-300 rounded-lg">
                        <BsX className="" />
                    </button>
                </div>
                <div className="flex flex-row px-2 text-center">
                    <h1 className="uppercase text-xl font-medium">Voce esta prestes a cancelar a NF: {props.notaParaCancelar && props.notaParaCancelar.nfe_numero}</h1>
                </div>
                <div>
                    <div className="flex flex-row px-2 text-center">
                        <h1 className="uppercase text-xl font-medium">Tem certeza?</h1>
                    </div>
                    <div className="p-2">
                        <div className="flex flex-row gap-4">
                            <button onClick={cancelarNf} className="p-2 bg-red-600 rounded-lg flex-1 font-medium text-white">Sim</button>
                            <button onClick={closeClear} className="p-2 bg-green-600 rounded-lg flex-1 font-medium text-white">Não</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}