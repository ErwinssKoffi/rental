import { Fragment } from "react";
import "../styles/app.css"
import Head from 'next/head';


const App = ({ Component, pageProps }) => {
    let Layout = Component.layout || Fragment

    return (
        <>
            <Layout>
                <Head>
                    <title>Goriber Gari.kom</title>
                </Head>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}


export default App