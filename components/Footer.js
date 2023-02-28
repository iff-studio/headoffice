import { useContext, useState } from 'react'
import { SubscribeContext } from '../contexts/SubscribeProvider'
import jsonp from 'jsonp'
import footerStyles from './footer.module.css'

const url = '//headofficemgmt.us14.list-manage.com/subscribe/post-json?u=eb60cbb9850faa8e42621d903&amp;id=a3b92b7385'

const STATUS = {
    SENDING: 'sending',
    ERROR: 'error',
    SUCCESS: 'success',
    INITIAL: 'initial',
    INVALID: 'invalid',
    HIDDEN: 'hidden',

}

const EMAIL_REGEX = /\S+@\S+\.\S+/

function validateEmail (email) {
    return EMAIL_REGEX.test(email)
}

export default function Footer () {

    const subscribeContext = useContext(SubscribeContext)
    const [status, setStatus] = useState(subscribeContext.subscribed ? STATUS.HIDDEN : STATUS.INITIAL)

    let $form = null
    let $email = null

    function submit (e) {
        e.preventDefault()
        let email = $email.value
        if (!email || !validateEmail(email)) {
            setStatus(STATUS.INVALID)
            return
        }

        setStatus(STATUS.SENDING)
        const formData = new FormData($form)

        jsonp($form.action + '-json?' + (new URLSearchParams(formData).toString()), { param: 'c' }, (err, data) => {
            if (err) {
                setStatus(STATUS.ERROR)
                return
            }
            setStatus(STATUS.SUCCESS)
            setTimeout(function () {
                subscribeContext.setSubscribed(true)
            }, 300)
        })
    }

    let message = null
    let displayInput = true
    let isError = false

    switch (status) {
        case (STATUS.SENDING):
            message = `Sending...`
            break
        case (STATUS.ERROR):
            message = `There was error sending your request. Please try again.`
            isError = true
            break
        case (STATUS.SUCCESS):
            message = `Thank you. We added you to our mailing list.`
            displayInput = false
            break
        case (STATUS.INITIAL):
            message = null
            break
        case (STATUS.INVALID):
            message = `Provided email is invalid`
            isError = true
            break

    }

    return <footer id={'footer'}>
        <div className="pt-[3.125rem]"></div>
        <div
            className={`max-w-screen-2xl mx-auto border-black z-10 border-t-2 border-l-2 transition-margin border-solid tracking-tighter leading-tight fixed bottom-0 left-0 right-0 bg-white ${status === STATUS.SUCCESS ? '-mb-[3.25rem]' : ''}`}>
            {displayInput && <form onSubmit={submit}
                                   action="https://headofficemgmt.us14.list-manage.com/subscribe/post"
                                   method="post"
                                   ref={(form) => $form = form}
                                   className="flex"
                                   name="mc-embedded-subscribe-form"
                                   target="_blank">
                <input type="email"
                       name="EMAIL"
                       ref={(input) => $email = input}
                       className="p-4 outline-none w-full"
                       id="mce-EMAIL"
                       placeholder="Subscribe to Head Office MGMT"/>
                <input type="hidden" name="u" value="eb60cbb9850faa8e42621d903" readOnly={true}/>
                <input type="hidden" name="id" value="a3b92b7385" readOnly={true}/>
                <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input type="text" name="b_eb60cbb9850faa8e42621d903_a3b92b7385" readOnly={true} tabIndex="-1"
                           value=""/>
                </div>
                {message && <div className={`flex-1 p-4 ${isError ? 'text-red' : ''}`}>{message}</div>}
                <button className="py-4 px-12 bg-black text-white font-bold uppercase" onClick={submit}
                        type="submit">Submit
                </button>

            </form>}
            {!displayInput && <div className={`flex-1 p-4 ${isError ? 'text-red' : ''}`}>{message}</div>}

        </div>
    </footer>

}
