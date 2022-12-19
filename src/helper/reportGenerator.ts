import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = ({ reportName, headers, data }) => {
  const doc: any = new jsPDF();
  const tableColumn = headers.map((header) => header.Header);
  const tableRows = data.map((ticket) => {
    return ticket.map((element) => element.data);
  });
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    margin: { top: 20 },
  });
  // const date = Date().split(" ");
  // const dateStr = `${date[1]}-${date[2]}-${date[3]} `;
  doc.text(`${reportName}`, 14, 15);
  // doc.save(`${reportName}_report_${dateStr}.pdf`);
  doc.save(`${reportName}.pdf`);
};

const exportDataToSupportCSVFormat = ({ tableHeader, formatedTablData }) => {
  const header = tableHeader.map((data) => data.Header);
  const tableData = formatedTablData.map((dataRow) => {
    return dataRow.map((dataColumn) => dataColumn.data);
  });
  return [header, ...tableData];
};

export { generatePDF, exportDataToSupportCSVFormat };
