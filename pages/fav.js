import Link from 'next/link'
import PreviewAlert from '../components/PreviewAlert'
import Footer from '../components/Footer'

export default function Index () {

    return <div className="min-h-screen">
        <div className="sm:pt-[4.5rem]"></div>
        <nav
            className="wrap z-10 text-9xl text-[50rem] fixed top-0 left-0 right-0 bg-white">
            <ul className={'mx-auto clearfix py-96 px-2'}>
                <li className={'block sm:float-left'}>
                    <Link className={'inline-block p-2 uppercase font-bold'} href={'/'}>HO</Link>
                </li>

            </ul>
        </nav>



        <Footer/>
    </div>


}

