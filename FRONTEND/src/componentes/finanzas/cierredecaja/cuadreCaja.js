export const calcularArqueo = (esperadoTotal, totalContado) => {
  const esperado = Number(esperadoTotal || 0);
  const contado = Number(totalContado || 0);

  if (esperado < 0) {
    const deficit = Math.abs(esperado);
    return {
      diferencia: deficit,
      estado: 'Déficit / Pérdida',
      deficitGlobal: deficit
    };
  }

  const diferencia = Number(Math.abs(contado - esperado).toFixed(2));

  let estado = 'Cuadrado';
  if (contado < esperado) {
    estado = 'Faltante';
  } else if (contado > esperado) {
    estado = 'Sobrante';
  }

  return {
    diferencia,
    estado,
    deficitGlobal: Math.max(0, esperado - contado)
  };
};

export const calcularEsperadoCanal = (metodo, saldoCanal, baseInicial = 0) => {
  const saldo = Number(saldoCanal || 0) + (metodo === 'efectivo' ? Number(baseInicial || 0) : 0);
  const esDigital = metodo === 'yape' || metodo === 'plin' || metodo === 'tarjeta';

  return {
    esperado: esDigital ? Math.max(0, saldo) : saldo,
    deficit: Math.max(0, -saldo)
  };
};