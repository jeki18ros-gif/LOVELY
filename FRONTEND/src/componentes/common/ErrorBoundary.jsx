import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error de renderizado en la aplicación:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="notranslate flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center text-gray-800 dark:bg-[#0f0f0f] dark:text-white" translate="no">
          <h1 className="text-xl font-semibold">No se pudo mostrar esta vista</h1>
          <p className="max-w-md text-sm text-gray-600 dark:text-gray-300">
            Parece que una interferencia del navegador afectó la página. Puedes recargarla para continuar.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded bg-[#D4AF37] px-4 py-2 font-semibold text-black hover:brightness-105"
          >
            Recargar vista
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}