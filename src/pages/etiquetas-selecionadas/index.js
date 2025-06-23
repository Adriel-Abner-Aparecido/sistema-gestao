import Head from "next/head";
import { EtiquetasSelecionadasComponent } from "../../components/etiquetasSelecionadasComponent/indes";
import { AuthProvider } from "../../context";
import { EmpresaProvider } from "../../context/empresaContext";

const EtiquetasSelecionadas = () => {

  return (

    <AuthProvider>
      <EmpresaProvider>
        <Head>
          <title>APPLoja Web | Imprimir etiquetas</title>
          <meta name="description" content="Página para impressão de etiquetas" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <EtiquetasSelecionadasComponent />

      </EmpresaProvider>
    </AuthProvider>

  );
};

export default EtiquetasSelecionadas;
