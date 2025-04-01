'use client'

import dynamic from 'next/dynamic'

const ClientOnlySearch = dynamic(() => import('./Search'), {
    ssr: false,
})

export default ClientOnlySearch
