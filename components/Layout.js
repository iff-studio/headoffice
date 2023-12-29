import PreviewAlert from './PreviewAlert'
import Footer from './Footer'
import Meta from './Meta'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout ({ preview, children }) {
    const router = useRouter()
    const activeClasses = 'underline decoration-2 underline-offset-4'

    return (
        <>
            <Meta/>
            <div className="min-h-screen">
                <div className="sm:pt-[4.5rem]"></div>
                <nav
                    className="wrap z-10 fixed top-0 left-0 right-0 bg-white">
                    <ul className={'mx-auto clearfix py-4 px-2'}>
                        <li className={'block sm:float-left'}>
                            <Link className={'inline-block p-2 uppercase font-bold'} href={'/'}>Headoffice MGMT</Link>
                        </li>
                        <li className={'clear-both sm:clear-none block float-left sm:float-right'}>
                            <Link className={'inline-block p-2 uppercase ' + (router.asPath === '/contact' ? activeClasses : '')}
                                  href={'/contact'}>Contact</Link>
                        </li>

                        <li className={'block float-left sm:float-right'}>
                            <Link className={'inline-block p-2 uppercase ' + (router.asPath === '/news' ? activeClasses : '')} href={'/news'}>News</Link>
                        </li>
                        <li className={'block float-left sm:float-right'}>
                            <Link className={'inline-block p-2 uppercase ' + (router.asPath === '/' ? activeClasses : '')} href={'/'}>Models</Link>
                        </li>
                    </ul>
                </nav>
                <PreviewAlert preview={preview}/>
                <main className={'wrap mx-auto'}>{children}</main>

                <Footer/>
            </div>
        </>
    )
}
