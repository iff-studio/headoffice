import PreviewAlert from './preview-alert'
import Footer from '../components/footer'
import Meta from '../components/meta'
import Link from 'next/link'

export default function Layout ({ preview, children }) {
    return (
        <>
            <Meta/>
            <div className="min-h-screen">
                <PreviewAlert preview={preview}/>
                <nav className='border-black border-b border-solid font-bold tracking-tighter leading-tight' >
                    <ul className={'p-4'}>
                        <li className={'pr-3 inline'}><Link href={'/'}>Home</Link></li>
                        <li className={'pr-3 inline'}><Link href={'/news'}>News</Link></li>
                        <li className={'pr-3 inline'}><Link href={'/about'}>About</Link></li>
                        <li className={'pr-3 inline'}><Link href={'/contact'}>Contact</Link></li>
                    </ul>
                </nav>
                <main>{children}</main>
            </div>
            <Footer/>
        </>
    )
}
