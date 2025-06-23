import { BsSearch, BsX } from "react-icons/bs"

export const SearchForm = ({ onSubmit, placeholder, busca, buscar, limpaBusca }) => {

    return (<>
        <form onSubmit={onSubmit} className="flex w-full md:w-auto flex-nowrap">
            <div className="relative flex items-center">
                <input onChange={(e) => buscar(e.target.value)} value={busca} className="w-[220px] rounded-l-lg p-2.5 text-sm focus:outline-none placeholder-gray-400 text-gray-500 bg-gray-300" placeholder={placeholder} />
                {
                    busca && <button onClick={limpaBusca} type="button" className="absolute flex items-center right-0 rounded-full bg-gray-700 mr-2"><BsX className="text-white" /></button>
                }
            </div>
            <button type="submit" className="p-2.5 text-sm font-medium text-gray-500 bg-gray-200 rounded-r-lg">
                <BsSearch className="w-5 h-5" />
                <span className="sr-only">Search</span>
            </button>
        </form>
    </>)

}