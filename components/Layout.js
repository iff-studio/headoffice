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
                    className="border-black z-10 border-b-2 border-solid font-bold leading-tight fixed top-0 left-0 right-0 bg-white">
                    <ul className={'max-w-screen-2xl mx-auto clearfix'}>
                        <li className={'block float-left'}><Link className={'block p-4 uppercase'} href={'/'}>Headoffice MGMT</Link></li>
                        <li className={'block float-left'}><Link className={'block p-4 uppercase'} href={'/'}>Models</Link></li>
                        <li className={'block float-left'}><Link className={'block p-4 uppercase'} href={'/news'}>News</Link></li>
                        <li className={'block float-left'}><Link className={'block p-4 uppercase'} href={'/about'}>About</Link></li>
                        <li className={'block float-left'}><Link className={'block p-4 uppercase'} href={'/contact'}>Contact</Link></li>
                    </ul>
                </nav>
                <PreviewAlert preview={preview}/>
                <main className={'max-w-screen-2xl mx-auto'}>{children}</main>

                <Footer/>
            </div>
        </>
    )
}
