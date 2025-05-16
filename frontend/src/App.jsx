import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaCar, FaSpinner, FaMapMarkerAlt, FaCalendarAlt, } from 'react-icons/fa';
import axios from 'axios'

function prefixToNumber(prefix) {
  const A = 'A'.charCodeAt(0);
  return (
    (prefix.charCodeAt(0) - A) * 26 * 26 +
    (prefix.charCodeAt(1) - A) * 26 +
    (prefix.charCodeAt(2) - A)
  );
}

const sulRanges = {
  PR: [
    ['AAA', 'AZZ'],
    ['BAA', 'BZZ'],
  ],
  SC: [
    ['BAH', 'BCN'],
    ['MAA', 'MAZ'],
  ],
  RS: [
    ['CDE', 'CDZ'],
    ['IBI', 'ICZ'],
  ]
};

function isInRange(prefix, start, end) {
  const val = prefixToNumber(prefix);
  return val >= prefixToNumber(start) && val <= prefixToNumber(end);
}

function getStateByPlate(plate) {
  const prefix = plate.slice(0, 3).toUpperCase();

  for (const [state, ranges] of Object.entries(sulRanges)) {
    if (ranges.some(([start, end]) => isInRange(prefix, start, end))) {
      const name = state === 'PR' ? 'Paraná'
        : state === 'SC' ? 'Santa Catarina'
          : 'Rio Grande do Sul';
      return { name, abbr: state };
    }
  }

  return null;
}

function BrazilPlate({ plate }) {
  const formatted = plate.length === 7 ? `${plate.slice(0, 3)}${plate.slice(3)}` : plate;

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
  );
}

export default function App() {
  const [plate, setPlate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    const cleaned = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (cleaned.length !== 7) {
      setResult({
        type: 'warning',
        message: 'Placa inválida. Use 7 caracteres: letras e números.',
      });
      return;
    }

    const state = getStateByPlate(cleaned);
    if (!state) {
      setResult({
        type: 'error',
        message: 'Esta placa não pertence à região Sul.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/placa/${cleaned}`);

      const data = response.data;

      setResult({
        type: 'success',
        stateName: state.name,
        stateAbbr: state.abbr,
        plate: cleaned,
        model: `${data.marca} ${data.modelo}`,
        ano: data.AnoModelo,
        marca: data.marca,
        modelo: data.modelo
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Placa inválida.',
      });
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPlate(value);
    if (result && (value.length !== 7 || result.type !== 'success')) {
      setResult(null);
    }
  };

  const renderIcon = () => {
    if (!result) return null;
    if (result.type === 'success') return <FaCheckCircle className="text-green-600 mr-2" size={20} />;
    if (result.type === 'error') return <FaTimesCircle className="text-red-600 mr-2" size={20} />;
    if (result.type === 'warning') return <FaExclamationCircle className="text-yellow-500 mr-2" size={20} />;
  };

  const inputBorderClasses = () => {
    if (result?.type === 'success' && plate.length === 7) return 'border-green-500 focus:ring-green-400';
    if (result?.type === 'error') return 'border-red-500 focus:ring-red-400';
    if (result?.type === 'warning') return 'border-yellow-500 focus:ring-yellow-400';
    return 'border-gray-300 focus:ring-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-12 font-['Poppins']">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">Verificador de Placas</h1>
        <p className="text-center text-gray-500 text-sm font-serif mb-6">Região Sul</p>

        <div className="relative">
          <input
            type="text"
            placeholder="PLACA: AAA0000"
            className={`w-full p-3 pr-10 border rounded-lg focus:outline-none text-center text-lg uppercase tracking-widest placeholder-gray-400 transition duration-300 ${inputBorderClasses()}`}
            value={plate}
            onChange={handleInputChange}
            maxLength={7}
            disabled={loading}
          />
          {result?.type === 'success' && plate.length === 7 && (
            <FaCheckCircle
              className="text-green-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              size={24}
            />
          )}
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className={`mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 flex items-center justify-center
              ${loading ? 'opacity-50 cursor-not-allowed hover:bg-blue-600' : ''}`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-3 h-5 w-5" />
              Verificando...
            </>
          ) : (
            'Verificar'
          )}
        </button>
        {result && result.type !== 'success' && <hr className='mt-6' />}
        {result && result.type !== 'success' && (
          <div
            className={`mt-6 flex items-center p-3 rounded-lg shadow-md text-sm ${result.type === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {renderIcon()}
            <span>{result.message}</span>
          </div>
        )}

        {result && result.type === 'success' && (
          <>
            <div className="mt-6">
              <BrazilPlate plate={result.plate} />
            </div>

            <div className="mt-6 grid gap-3 text-sm text-gray-700">
              <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                <FaMapMarkerAlt className="text-blue-500 mr-3" />
                <span>
                  <strong>Estado:</strong> {result.stateName}
                </span>
              </div>
              <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                <FaCar className="text-blue-500 mr-3" />
                <span>
                  <strong>Marca:</strong> {result.marca}
                </span>
              </div>
              <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                <FaCar className="text-blue-500 mr-3" />
                <span>
                  <strong>Modelo:</strong> {result.modelo}
                </span>
              </div>
              <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-sm">
                <FaCalendarAlt className="text-blue-500 mr-3" />
                <span>
                  <strong>Ano:</strong> {result.ano}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
