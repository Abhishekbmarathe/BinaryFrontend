import React from 'react'

function Loader() {
    return (
        <div>
            <div className="flex justify-center items-center gap-3">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-dotted rounded-full border-black" role="status">
                </div>
                <span className="breathing">Loading...</span>
            </div>
        </div>
    )
}

export default Loader
