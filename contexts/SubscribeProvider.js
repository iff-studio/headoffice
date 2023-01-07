import { getLocalStorage, setLocalStorage } from '../lib/local'
import { createContext, useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'subscribed'

export const SubscribeContext = createContext(false)

export function SubscribeProvider ({children}) {
    const [subscribed, setSubscribed] = useState(() => getLocalStorage(LOCAL_STORAGE_KEY, false))

    useEffect(() => {
        setLocalStorage(LOCAL_STORAGE_KEY, subscribed)
        if(subscribed){
            document.getElementById('footer').classList.add('hidden')
        }
    }, [subscribed])

    return (
        <SubscribeContext.Provider
            value={{
                subscribed: subscribed,
                setSubscribed: (val) => setSubscribed(val),
            }}
        >
            {children}
        </SubscribeContext.Provider>
    )
}
