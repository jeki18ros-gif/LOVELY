import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { calcularArqueo, calcularEsperadoCanal } from '../cuadreCaja';

export default function TablaCuadre({ metodos, valoresContados, onInputChange, baseInicial = 0 }) {
  return (
    <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm overflow-hidden">
      <div className="p-5 bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <ArrowRightLeft size={16} className="text-[#D4AF37]" />
        <h4 className="text-xs uppercase tracking-widest font-semibold">
          Desglose e Inspección de Canales
        </h4>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 text-[10px] uppercase tracking-widest opacity-60">
            <th className="p-4">Método</th>
            <th className="p-4 text-right">Monto en Sistema</th>
            <th className="p-4 text-center w-48">Monto Apps/Real Contado (S/)</th>
            <th className="p-4 text-right">Diferencia</th>
            <th className="p-4 text-right">Déficit canal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
          {Object.keys(metodos).map((metodo) => {
            const contado = parseFloat(valoresContados[metodo]) || 0;
            
            // Si el método es efectivo, sumamos la base inicial al esperado en sistema
            const { esperado, deficit } = calcularEsperadoCanal(metodo, metodos[metodo], baseInicial);
            const { diferencia: dif } = calcularArqueo(esperado, contado);

            return (
              <tr key={metodo} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium uppercase tracking-wider text-xs opacity-80">
                  {metodo} {metodo === 'efectivo' && Number(baseInicial) > 0 && <span className="text-[10px] text-blue-400 font-normal">(+Base)</span>}
                </td>
                <td className="p-4 text-right font-light">
                  <span className="notranslate" translate="no">S/ {esperado.toFixed(2)}</span>
                </td>
                <td className="p-4 text-center">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={valoresContados[metodo]}
                    onChange={(e) => onInputChange(metodo, e.target.value)}
                    className="w-32 bg-gray-50 dark:bg-[#1f1f1f] border-b border-gray-300 dark:border-gray-700 px-2 py-1 text-right focus:outline-none focus:border-[#D4AF37] font-semibold text-black dark:text-white"
                  />
                </td>
                <td
                  className={`p-4 text-right font-bold ${
                    dif === 0
                      ? 'opacity-40'
                      : dif > 0
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }`}
                >
                  <span className="notranslate" translate="no">{dif === 0 ? 'S/ 0.00' : `${dif > 0 ? '+' : ''} S/ ${dif.toFixed(2)}`}</span>
                </td>
                <td className="p-4 text-right font-semibold text-rose-500">
                  <span className="notranslate" translate="no">{deficit > 0 ? `S/ ${deficit.toFixed(2)}` : 'S/ 0.00'}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}