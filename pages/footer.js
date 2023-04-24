import React from 'react';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

export default function Footer() 
{
    return (
        <React.Fragment>
            <footer>
                <p> &copy; {currentYear} • Eric Levasseur</p>
            </footer>
        </React.Fragment>
    );
}