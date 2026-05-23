import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    color: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D4AF37', // Acento Dorado
    paddingBottom: 15,
    marginBottom: 25,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 9,
    color: '#777777',
    marginTop: 3,
  },
  metaInfo: {
    textAlign: 'right',
    fontSize: 10,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#777777',
    marginBottom: 8,
  },
  clientBox: {
    marginBottom: 25,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#1A1A1A',
  },
  clientText: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#111111', // Encabezado Negro
    padding: 6,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    padding: 8,
    alignItems: 'center',
  },
  colDesc: { flex: 3, fontSize: 10 },
  colCant: { flex: 1, textAlign: 'center', fontSize: 10 },
  colPrecio: { flex: 1, textAlign: 'right', fontSize: 10 },
  colSubtotal: { flex: 1, textAlign: 'right', fontSize: 10 },
  totalsContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalsBox: {
    width: 180,
    spaceY: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalLabel: { fontSize: 10, color: '#555555' },
  totalValue: { fontSize: 10, textAlign: 'right' },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    paddingTop: 6,
    marginTop: 4,
  },
  grandTotalLabel: { fontSize: 12, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 12, fontWeight: 'bold', color: '#000000' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    fontSize: 8,
    color: '#999999',
  }
});

export const BoletaPDF = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Boleta de Venta</Text>
            <Text style={styles.subtitle}>Comprobante de Pago Electrónico</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text>Fecha: {data.fecha}</Text>
            <Text>Método: {data.metodoPago.toUpperCase()}</Text>
          </View>
        </View>

        {/* Datos del Cliente */}
        <Text style={styles.sectionTitle}>Cliente</Text>
        <View style={styles.clientBox}>
          <Text style={styles.clientText}>{data.nombreCliente}</Text>
        </View>

        {/* Tabla de Detalles */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Descripción / Concepto</Text>
          <Text style={styles.colCant}>Cant.</Text>
          <Text style={styles.colPrecio}>P. Unit</Text>
          <Text style={styles.colSubtotal}>Subtotal</Text>
        </View>

        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.nombre}</Text>
            <Text style={styles.colCant}>{item.cantidad}</Text>
            <Text style={styles.colPrecio}>S/ {Number(item.precio_unitario).toFixed(2)}</Text>
            <Text style={styles.colSubtotal}>S/ {Number(item.subtotal).toFixed(2)}</Text>
          </View>
        ))}

        {/* Totales */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <div style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal Neto:</Text>
              <Text style={styles.totalValue}>S/ {Number(data.subtotal).toFixed(2)}</Text>
            </div>
            {data.descuento > 0 && (
              <div style={styles.totalRow}>
                <Text style={styles.totalLabel}>Descuento:</Text>
                <Text style={styles.totalValue}>- S/ {Number(data.descuento).toFixed(2)}</Text>
              </div>
            )}
            {data.comision > 0 && (
              <div style={styles.totalRow}>
                <Text style={styles.totalLabel}>Recargo Tarjeta:</Text>
                <Text style={styles.totalValue}>S/ {Number(data.comision).toFixed(2)}</Text>
              </div>
            )}
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Pagado:</Text>
              <Text style={styles.grandTotalValue}>S/ {Number(data.totalFinal).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Pie de página */}
        <Text style={styles.footer}>Gracias por su preferencia.</Text>
      </Page>
    </Document>
  );
};