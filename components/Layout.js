import PreviewAlert from './PreviewAlert'
import Footer from './Footer'
import Meta from './Meta'
import Link from 'next/link'

export default function Layout ({ preview, children }) {
    return (
        <>
            <Meta/>
            <div className="min-h-screen">

                <div className="pt-[3.25rem]"></div>
                <nav
                    className="border-black z-10 border-b border-solid font-bold tracking-tighter leading-tight fixed top-0 left-0 right-0 bg-white">
                    <ul className={'p-4'}>
                        <li className={'pr-3 inline'}><Link href={'/'}>Home</Link></li>
                        <li className={'pr-3 inline'}><Link href={'/news'}>News</Link></li>
                        <li className={'pr-3 inline'}><Link href={'/about'}>About</Link></li>
                        <li className={'pr-3 inline'}><Link href={'/contact'}>Contact</Link></li>
                    </ul>
                </nav>
                <PreviewAlert preview={preview}/>
                <main>{children}</main>

                <Footer/>
            </div>
        </>
    )
}
