import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (days) => {
    const doc = new jsPDF();

    days.forEach((day, index) => {
        const markers = day.markers || [];

        const spacing = index === 0 ? 20 : (doc.lastAutoTable?.finalY || 20) + 15;

        doc.setFontSize(14);
        doc.text(`Day ${index + 1}`, 14, spacing);

        if (markers.length === 0) {
            doc.setFontSize(12);
            doc.text('No markers added.', 14, spacing + 10);
            return;
        }

        const tableData = markers.map((marker, i) => [
            i + 1,
            marker.label,
            marker.notes || ''
        ]);

        autoTable(doc, {
            startY: spacing + 5,
            head: [['#', 'Place', 'Notes']],
            body: tableData,
            margin: { left: 14, right: 14 },
            theme: 'grid',
            styles: { fontSize: 11 },
        });
    });

    doc.save('travel-itinerary.pdf');
};
