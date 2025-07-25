import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { get } from '../../../services/api';
import { ReciboA4 } from '../../../components/ReciboA4';
import { Recibo80mm } from '../../../components/Recibo80mm';
import { Recibo58mm } from '../../../components/Recibo58mm';
import { AuthProvider } from '../../../context';
import { EmpresaProvider } from '../../../context/empresaContext';

export default function Recibo() {

  const router = useRouter();
  const [dadosRecibo, setDadosRecibo] = useState()
  const [loading, setLoading] = useState(false)

  const { formato, pedido } = router.query

  useEffect(() => {
    if (router.isReady) {
      loadReciboPedido(pedido)
    }
  }, [router.isReady, formato, pedido])

  const loadReciboPedido = async (pedidoId) => {
    setLoading(true)
    try {

      const dadosrecibo = await get(`${process.env.NEXT_PUBLIC_API_URL}/recibovenda/${pedidoId}`)

      if (dadosrecibo) {
        console.log("dados recuperados", dadosrecibo)
        setDadosRecibo(dadosrecibo)
      }

    } catch (error) {
      console.error("Erro ao inesperado", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthProvider>
      <EmpresaProvider>
        <Head>
          <title>APPLoja Web | Recibo</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {
          loading ? 'Carregando...' : formato && formato === "a4" ? <ReciboA4 dadosRecibo={dadosRecibo} /> : formato && formato === "80mm" ? <Recibo80mm dadosRecibo={dadosRecibo} /> : formato && formato === "58mm" ? <Recibo58mm dadosRecibo={dadosRecibo} /> : ''
        }
      </EmpresaProvider>
    </AuthProvider>
  )
}
