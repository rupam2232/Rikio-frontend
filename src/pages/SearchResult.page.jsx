import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import NotFound from './NotFound.page.jsx'
import axios from '../utils/axiosInstance.js'
import errorMessage from '../utils/errorMessage.js'

const SearchResult = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('query')

    useEffect(() => {
        if(!query) return;
        axios.get(`/videos/?search=${query}`)
        .then((res) => {
            console.log(res.data)
        })
        .catch((err) => {
            console.error(errorMessage(err))
        })
    }, [query])
    // if(!query) {
    //     return <NotFound>
    //         <p>Please Search something to access this page.</p>
    //         </NotFound>
    // }
    return (
        <section className='w-full'>
            <div className='container mx-auto'>
                <div className='flex flex-wrap'>
                    <div className='w-full lg:w-3/4'>
                        <div className='flex flex-wrap'>
                            <div className='w-full'>
                                <h2 className='text-2xl font-semibold text-zinc-500'>Search Results</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SearchResult
