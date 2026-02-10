"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { ReactNode } from 'react'

export default function Filter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathName = usePathname();

    function handleFilter(filter: string){
        const params = new URLSearchParams(searchParams);
        params.set("capacity", filter);
        router.replace(`${pathName}?${params.toString()}`, {scroll: false});
    
    }

    const activeFilter = searchParams.get("capacity") ?? "all";

  return (
    <div className="border border-primary-800 flex">
        <Button activeFilter={activeFilter} filter="all" handleFilter={handleFilter}>All cabins</Button>

        <Button activeFilter={activeFilter} filter="small" handleFilter={handleFilter}>1&mdash;3 guests</Button>
        <Button activeFilter={activeFilter} filter="medium" handleFilter={handleFilter}>4&mdash;7 guests</Button>
        <Button activeFilter={activeFilter} filter="large" handleFilter={handleFilter}>8&mdash;12 guests</Button>

    </div>
  )
}


type ButtonProps = {
    filter: string;
    handleFilter: (filter: string) => void;
    activeFilter: string;
    children: ReactNode
}

function Button({filter, handleFilter, activeFilter, children}: ButtonProps){
    return <button className={`px-5 py-2 hover:bg-primary-700 
                    ${activeFilter === filter ? "bg-primary-700":""}`}
                onClick={() => handleFilter(filter)}>
                {children}
            </button>

}