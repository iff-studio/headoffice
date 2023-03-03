import PreviewAlert from './PreviewAlert'
import Footer from './Footer'
import Meta from './Meta'
import Link from 'next/link'

export default function Layout ({ preview, children }) {
    return (
        <>
            <Meta/>
            <div className="min-h-screen">

                <div className="pt-[4.25rem]"></div>
                <nav
                    className="wrap z-10 border-b-2 border-solid border-transparent font-bold leading-tight fixed top-0 left-0 right-0 bg-white">
                    <ul className={' mx-auto clearfix py-2'}>
                        <li className={'inline-block mr-8'}><Link className={'inline-block 2xl:pl-0 p-4 uppercase'} href={'/'}>Headoffice MGMT</Link></li>
                        <li className={'inline-block float-right'}><Link className={'inline-block p-4 uppercase'} href={'/contact'}>Contact</Link></li>
                        <li className={'inline-block float-right'}><Link className={'inline-block p-4 uppercase'} href={'/about'}>About</Link></li>
                        <li className={'inline-block float-right'}><Link className={'inline-block p-4 uppercase'} href={'/news'}>News</Link></li>
                        <li className={'inline-block float-right'}><Link className={'inline-block p-4 uppercase'} href={'/'}>Models</Link></li>

                    </ul>
                </nav>
                <PreviewAlert preview={preview}/>
                <main className={'wrap mx-auto'}>{children}</main>

                <Footer/>
            </div>
        </>
    )
}
