import { month, year } from "../../services/date";

export const SelectData = ({ dataSelecionada }) => {

    return (
        <div className="w-4/5 max-w-screen-xl">
            <form>
                <input className="border-2 font-medium text-lg p-1 rounded-md" type="month" name="data" id="data" max={`${year}-${month}`} defaultValue={`${year}-${month}`} onChange={(e) => dataSelecionada(e.target.value)} />
            </form>
        </div>
    )

}