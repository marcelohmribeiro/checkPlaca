import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const platePrefixes = {
  PR: ['A', 'B'],
  SC: ['M', 'N'],
  RS: ['I', 'J'],
}

function getStateByPlate(plate) {
  const prefix = plate.slice(0, 1).toUpperCase()
  if (plate.length < 3) return null

  if (platePrefixes.PR.includes(prefix)) return 'Paraná'
  if (platePrefixes.SC.includes(prefix)) return 'Santa Catarina'
  if (platePrefixes.RS.includes(prefix)) return 'Rio Grande do Sul'
  return null;
}

export default function App() {
  const [plate, setPlate] = useState('')
  const [result, setResult] = useState(null)

  const handleCheck = () => {
    const cleaned = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')

    if (cleaned.length !== 7) {
      setResult({
        type: 'warning',
        message: 'Placa inválida. Use 7 caracteres: letras e números.',
      });
      return;
    }

    const state = getStateByPlate(cleaned);
    if (state) {
      setResult({
        type: 'success',
        message: `A placa pertence ao estado de ${state}.`,
      });
    } else {
      setResult({
        type: 'error',
        message: 'Esta placa não pertence à região Sul (PR, SC ou RS).',
      });
    }
  };

  const renderIcon = () => {
    if (!result) return null;
    if (result.type === 'success') return <FaCheckCircle className="text-green-600 mr-2" size={20} />;
    if (result.type === 'error') return <FaTimesCircle className="text-red-600 mr-2" size={20} />;
    if (result.type === 'warning') return <FaExclamationCircle className="text-yellow-500 mr-2" size={20} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-1 transition-all duration-300">
          Verificador de Placas
        </h1>
        <p className="text-center text-gray-600 text-sm font-serif mb-6">Região Sul</p>

        <input
          type="text"
          placeholder="PLACA: AAA-0000"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-lg uppercase tracking-wider placeholder-gray-400 transition duration-300"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          maxLength={8}
        />

        <button
          onClick={handleCheck}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 cursor-pointer"
        >
          Verificar
        </button>

        {result && (
          <div
            className={`mt-6 flex items-center p-3 rounded-lg shadow-md text-sm transition-all duration-300 ${result.type === 'success'
              ? 'bg-green-100 text-green-800'
              : result.type === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {renderIcon()}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}