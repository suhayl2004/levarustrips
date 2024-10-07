import * as XLSX from 'xlsx';
import { TableElement } from './TableElement';
import { saveAs } from 'file-saver'; // For downloading the file
import * as Papa from 'papaparse'; // Use 'papaparse' for CSV export
import { jsPDF } from 'jspdf';

const getFileName = (name: string) => {
  const currentDate = new Date();
  const dateString = currentDate.toISOString().split('T')[0];
  const timeString = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
  const sheetName = name || 'ExportResult';
  const fileName = `${sheetName}_${dateString}_${timeString}`;
  return {
    sheetName,
    fileName,
  };
};

export class TableExportUtil {
  static exportToExcel(arr: Partial<TableElement>[], name: string) {
    const { sheetName, fileName } = getFileName(name);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(arr);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  static exportToCSV(arr: Partial<TableElement>[], name: string) {
    const { sheetName, fileName } = getFileName(name);

    const csvData = Papa.unparse(arr); // Use 'Papa.unparse' to convert data to CSV format

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${fileName}.csv`);
  }

  static exportToODS(arr: Partial<TableElement>[], name: string) {
    const { sheetName, fileName } = getFileName(name);
    const csvData = Papa.unparse(arr); // Use 'Papa.unparse' to convert data to CSV format
    const blob = new Blob([csvData], { type: 'text/csv;charset=ISO-8859-1' });
    saveAs(blob, `${fileName}.ods`);

  }

  static exportToPDF(arr: Partial<TableElement>[], name: string) {
    const { sheetName, fileName } = getFileName(name);

    // Create a new jsPDF document
    const doc = new jsPDF();

    const columns = Object.keys(arr[0]);

    const headerStyles = {
      fillColor: false, // Set the background color to transparent
      textColor: [0, 0, 0], // RGB color for the text (in this case, black)
      fontStyle: 'bold', // Text style
    };

    // Map the data to an array of rows
    const rows = arr.map(item => Object.values(item));

    // Add the table to the PDF document using jsPDF autoTable
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      headStyles: headerStyles, // Apply the custom style to the header
    });

    // Save the PDF document
    doc.save(`${fileName}.pdf`);
  }

  //import * as CSV from 'csv';
  //import { TableElement } from './TableElement';

  //const getFileName = (name: string) => {
  //  const timeSpan = new Date().toISOString();
  //  const sheetName = name || 'ExportResult';
  // const fileName = `${sheetName}-${timeSpan}`;
  //  return {
  //    sheetName,
  //    fileName,
  //  };
  //};
  //export class TableExportUtil {
  //  static exportToExcel(arr: Partial<TableElement>[], name: string) {
  //    const { sheetName, fileName } = getFileName(name);

  //    const wb = CSV.utils.book_new();
  //    const ws = CSV.utils.json_to_sheet(arr);
  //    CSV.utils.book_append_sheet(wb, ws, sheetName);
  //    CSV.writeFile(wb, `${fileName}.csv`);
  //  }

  // static exportToPDF(exportData: any[]) {
  //   const doc = new jsPDF();
  //   const dataValue: any = Object.keys(exportData).map(function (
  //     personNamedIndex: any
  //   ) {
  //     return Object.values(exportData[personNamedIndex]);
  //   });
  //   const keys: any = Object.keys(exportData[0]);

  //   autoTable(doc, {
  //     head: [keys],
  //     body: dataValue,
  //   });

  //   const { fileName } = getFileName('pdf');

  //   doc.save(`${fileName}.pdf`);
  // }
}
