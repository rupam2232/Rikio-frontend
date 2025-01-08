import { Button, Logo } from '../components/index.js';
import React from 'react'
import { NavLink, useRouteError } from "react-router-dom";

const NotFound = () => {
    const error = useRouteError();

    return (
        <section className='h-full w-full flex justify-center items-center'>
            <div>
                <Logo className="size-20 m-auto" />
                <h1 className='text-9xl m-auto w-min'>404</h1>
                <p className='px-3 text-center'>Ooops looks like this page is not available. Please recheck the url you have entered</p>
                <Button className="mx-auto flex items-center mt-3">
                    <NavLink to="/">Go back to home</NavLink>
                </Button>
            </div>
        </section>
    )
}

export default NotFound
