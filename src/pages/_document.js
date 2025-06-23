import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang="pt-BR">
                <Head>
                    <link rel="manifest" href="/manifest.json" />
                    <meta name="theme-color" content="#000000" />

                    <script id='Hotjar' strategy="afterInteractive" dangerouslySetInnerHTML={{
                        __html: `(function(h,o,t,j,a,r){
                                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                                    h._hjSettings={hjid:3489617,hjsv:6};
                                    a=o.getElementsByTagName('head')[0];
                                    r=o.createElement('script');r.async=1;
                                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                                    a.appendChild(r);
                                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}}>

                    </script>
                    <script id='googletagmanager' async src='https://www.googletagmanager.com/gtag/js?id=AW-737054992%22'></script>
                    {/* <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=6b819266-2c44-4bee-9662-3b01920d3637"></script> */}
                    <script id='google-remarketing' dangerouslySetInnerHTML={{
                        __html: `window.dataLayer = window.dataLayer || [];
                                            function gtag(){dataLayer.push(arguments);}
                                            gtag('js', new Date());  
                                            gtag('config', 'AW-737054992');`}}>

                    </script>

                </Head>
                <body className='relative flex flex-col'>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument