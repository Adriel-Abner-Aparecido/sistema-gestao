import Head from 'next/head'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga4';
import { LoginComponent } from '../components/LoginComponent'
import Router from 'next/router';

ReactGA.initialize('G-EXCKC833V1');
export default function Home() {

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ReactGA.send("pageview");

    setLoading(true)

    if (localStorage.getItem('token')) {
      Router.push('dashboard')
      setLoading(false)
    }

  }, [])

  return (
    <>
      <Head>
        <title>APPLoja Web</title>
        <meta name="description" content="Sistema gratuito de gestão para pequenas e médias empresas." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='bg-gray-200'>
        <LoginComponent />
      </div>
    </>
  )
}
