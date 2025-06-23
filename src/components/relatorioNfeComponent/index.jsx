import { useState } from "react"
import { get } from "../../services/api"
import { BsDownload } from "react-icons/bs"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { LoadingComponent } from "../LoadingComponent"

export const RelatorioNfe = () => {

    const datePadrao = new Date()
    const primeiroDia = new Date(datePadrao.getFullYear(), datePadrao.getMonth(), 1).toLocaleDateString('en-CA')
    const ultimoDia = new Date(datePadrao.getFullYear(), datePadrao.getMonth() + 1, 0).toLocaleDateString('en-CA')

    const [dataInicial, setDataInicial] = useState(primeiroDia)
    const [dataFinal, setDataFinal] = useState(ultimoDia)
    const [listaNotas, setListaNotas] = useState([])
    const [loading, setLoading] = useState(false)
    const [modelo, setModelo] = useState("nfe")
    const [status, setStatus] = useState("aprovado")
    const [noNotes, setNoNotes] = useState(false)

    const buscarRelatorio = async (event) => {
        event.preventDefault()

        try {
            const xmls = await get(`${process.env.NEXT_PUBLIC_API_URL}/relatorio/${dataInicial}/${dataFinal}/${modelo}/${status}`)
            setListaNotas(xmls)
        } catch (error) {
            console.error(error)
        }

    }

    const downloadXml = async () => {

        setLoading(true)

        const zip = new JSZip()

        try {
            let index = 1;
            for (const { xml, chave } of listaNotas) {
                const response = await fetch(xml);
                if (!response.ok) {
                    console.warn(`Erro ao baixar o arquivo: ${xml}`);
                    continue
                }
                const data = await response.text();
                zip.file(`notasfiscais/emitidas/${chave}-protNFe.xml`, data);
                index++;
            }

            const content = await zip.generateAsync({ type: 'blob' })

            saveAs(content, `relatorio_de_${dataInicial}_a_${dataFinal}.zip`)

        } catch (error) {
            console.error(error)
        } finally {
            setListaNotas([])
            setLoading(false)
        }
    }

    console.log("Modelo:", modelo)

    return (<>
        {
            listaNotas.length === 0 ?
                <div className="flex flex-col w-4/5 max-w-screen-xl">
                    <div className="flex flex-row w-full bg-gray-300 p-5 rounded-t-lg">
                        <h1 className="uppercase font-bold">Relatorio</h1>
                    </div>
                    <div className="flex flex-col bg-gray-100 p-5">
                        <form onSubmit={buscarRelatorio} className="flex flex-col gap-3">
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700" htmlFor="dataInicial">Data Inicial</label>
                                    <input className="px-1 py-2 rounded-lg border" type="date" name="dataInicial" onChange={(e) => setDataInicial(e.target.value)} value={dataInicial} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700" htmlFor="dataInicial">Data Final</label>
                                    <input className="px-1 py-2 rounded-lg border" type="date" name="dataFinal" onChange={(e) => setDataFinal(e.target.value)} value={dataFinal} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700" htmlFor="dataInicial">Tipo</label>
                                    <select className="px-1 py-2 rounded-lg border min-h-[44px]" type="date" name="dataFinal" onChange={(e) => setModelo(e.target.value)} value={modelo} >
                                        <option className="px-1 py-2 rounded-lg" value="nfe">NFe</option>
                                        <option className="px-1 py-2 rounded-lg" value="nfce">NFCe</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-gray-700" htmlFor="dataInicial">Status</label>
                                    <select className="px-1 py-2 rounded-lg border min-h-[44px]" type="date" name="dataFinal" onChange={(e) => setStatus(e.target.value)} value={status} >
                                        <option className="px-1 py-2 rounded-lg" value="aprovado">Aprovado</option>
                                        <option className="px-1 py-2 rounded-lg" value="reprovado">Reprovado</option>
                                        <option className="px-1 py-2 rounded-lg" value="cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row">
                                <button className="p-2 bg-gray-300 rounded-lg" type="submit">Buscar</button>
                            </div>
                        </form>
                    </div>
                </div>
                :
                <div className="flex flex-col w-4/5 py-5">
                    <div className="flex flex-row w-full bg-gray-300 p-5 rounded-t-lg">
                        <h1 className="uppercase font-bold">Relatório</h1>
                    </div>
                    {
                        loading ? <LoadingComponent /> :
                            <div className="flex flex-col h-[500px] justify-center items-center bg-gray-100 p-5 text-center gap-4">
                                <p>
                                    Foram encontradas um total de <span className="font-bold">{listaNotas.length}</span> notas fiscais
                                </p>

                                <div className="flex">
                                    <button onClick={() => setListaNotas([])} className="flex flex-row items-cente hover:underline p-3 rounded-lg">
                                        <span>cancelar</span>
                                    </button>
                                    <button onClick={downloadXml} className="flex flex-row items-center bg-gray-300 hover:bg-gray-400 p-3 rounded-lg">
                                        <BsDownload className="w-5 h-5 mr-2" />
                                        <span>Baixar</span>
                                    </button>
                                </div>
                            </div>
                    }

                </div>

        }
    </>)
}