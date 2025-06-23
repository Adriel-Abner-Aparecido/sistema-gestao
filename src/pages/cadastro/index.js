import Head from 'next/head'
import { CadastroComponent } from '../../components/CadastroComponent'

export default function Cadastro() {

    return (
        <div className='bg-gray-200'>
            <Head>
                <title>APPLoja Web | Cadastro</title>
                <meta name="description" content="Organize sua empresa com um ERP simples e eficiente. Controle de vendas, estoque e financeiro em um só lugar, 100% online." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <CadastroComponent />

        </div>
    )
}
