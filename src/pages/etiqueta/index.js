import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import LabelGenerator from '../../components/GeradorEtiqueta';
import Head from "next/head";
import { BsTagsFill } from 'react-icons/bs';
import { Content } from '../../components/content';
import { EmpresaProvider } from '../../context/empresaContext';
import { AuthProvider } from '../../context';

const GeradorEtiquetasPage = () => {

  const [hiddenDrawer, setHiddenDrawer] = useState('hidden')
  const [mobile, setMobile] = useState()

  useEffect(() => {
    if (isMobile) {
      setHiddenDrawer('hidden')
    } else {
      setHiddenDrawer('absolute md:relative')
    }
  }, [mobile])

  return (
    <AuthProvider>
      <EmpresaProvider>
        <Head>
          <title>APPLoja Web | Imprimir etiquetas</title>
          <meta name="description" content="Página para impressão de etiquetas" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Content>
          <div className="flex flex-col p-6 bg-white rounded-lg gap-4 w-4/5">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <BsTagsFill className='w-6 h-6 text-blue-900' />
                <h1 className="font-bold text-3xl">
                  Impressão de Etiquetas
                </h1>
              </div>

              <p className="text-gray-600">
                Busque e selecione produtos da lista para realizar a impressão de etiquetas
              </p>
            </div>

            <LabelGenerator />
          </div>
        </Content >
      </EmpresaProvider>
    </AuthProvider>
  );
};

export default GeradorEtiquetasPage;
