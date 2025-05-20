import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (markers) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Itinerary", 14, 20);

    const tableData = markers.map((marker, index) => [
        index + 1,
        marker.label,
        `Day ${marker.day}`,
        marker.time,
        marker.priority
    ]);

    autoTable(doc,{
        head: [['#', 'Place', 'Day', 'Time', 'Priority']],
        body: tableData,
        startY: 30
    });

    doc.save("itinerary.pdf");
};
