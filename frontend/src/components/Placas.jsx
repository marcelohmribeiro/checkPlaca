function PlacaMercoSul({ placa }) {
    // Formata a placa Mercosul
    const formatted = placa.length === 7 ? `${placa.slice(0, 3)}${placa.slice(3)}` : placa

    return (
        <div className="mx-auto mt-6 w-[350px] rounded-lg border-[3px] border-black bg-white shadow-md font-['Roboto_Mono'] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-8 bg-blue-800 text-white flex items-center justify-between px-3 text-xs font-semibold tracking-wide">
                <span className="text-[10px] opacity-80">MERCOSUL</span>
                <span className="text-sm">BRASIL</span>
                <span className="text-xl">🇧🇷</span>
            </div>
            <div className="flex items-center justify-between pt-10 px-3 pb-2">
                <div className="text-[12px] font-bold">BR</div>
                <div className="text-4xl font-black tracking-[6px] text-center ml-4 w-full">{formatted}</div>
                <div className="w-[30px]" />
            </div>
        </div>
    )
}

function PlacaAntiga({ placa, uf, municipio }) {
    // Formata a placa antiga
    const formatted = placa.length === 7 ? `${placa.slice(0, 3)}-${placa.slice(3)}` : placa;

    return (
        <div className="mx-auto mt-6 w-[350px] rounded-lg border-[3px] border-gray-400 bg-gray-200 shadow-md font-['Roboto_Mono'] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-8 bg-gray-300 flex items-center justify-center px-3 text-xs font-semibold tracking-wide text-gray-700
                      shadow-[0_0_5px_rgba(0,0,0,0.5)]">
                <span className="select-none">{uf?.toUpperCase() || 'UF'} - {municipio?.toUpperCase() || 'MUNICÍPIO'}</span>
            </div>
            <div className="flex items-center justify-center pt-8 px-3 pb-2 mt-2">
                <div className="text-5xl font-bold tracking-[4px] text-center w-full text-gray-800">{formatted}</div>
            </div>
        </div>
    )
}

function isPlacaMercosul(placa) {
    const regexMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
    return regexMercosul.test(placa)
}

export default function Placas({ placa, uf, municipio }) {
    const placaUpper = placa.toUpperCase()

    return isPlacaMercosul(placaUpper) ? (
        <PlacaMercoSul placa={placaUpper} />
    ) : (
        <PlacaAntiga placa={placaUpper} uf={uf} municipio={municipio} />
    )
}
