import '../styles/index.css'
import { SubscribeProvider } from '../contexts/SubscribeProvider'

function MyApp({ Component, pageProps }) {
  return <SubscribeProvider><Component {...pageProps} /></SubscribeProvider>
}

export default MyApp
