import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateDistance } from './calculateDistance';

export const exportToPDF = (days, itinerary) => {
    const doc = new jsPDF();

    doc.setProperties({
        title: `${itinerary.title} - Route Details`,
        subject: 'Route Details',
        author: 'Travel itinerary App'
    });

    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text(itinerary.title, 105, 20, { align: 'center' });

    const today = new Date();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated: ${today.toLocaleDateString('pl-PL')}`, 195, 28, { align: 'right' });

    let yPosition = 40;

    days.forEach((day, index) => {
        const markers = day.markers || [];

        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        doc.setFillColor(52, 152, 219);
        doc.rect(14, yPosition, 182, 10, 'F');

        doc.setFontSize(14);
        doc.setTextColor(255);
        doc.setFont('helvetica', 'bold');
        doc.text(`Day ${index + 1}`, 105, yPosition + 7, { align: 'center' });

        yPosition += 15;

        if (markers.length === 0) {
            doc.setFontSize(12);
            doc.setTextColor(80);
            doc.text('No planned places.', 14, yPosition + 10);
            yPosition += 20;
            return;
        }

        const tableData = markers.map((marker, i) => {
            let distance = '';
            if (i < markers.length - 1) {
                const meters = calculateDistance(marker, markers[i + 1]);
                distance = meters < 1000
                    ? `${Math.round(meters)} m`
                    : `${(meters / 1000).toFixed(1)} km`;
            }

            return [
                i + 1,
                marker.label,
                marker.notes || '',
                distance
            ];
        });

        autoTable(doc, {
            startY: yPosition,
            head: [['#', 'Place', 'Notes', 'Distance']],
            body: tableData,
            margin: { left: 14, right: 14 },
            theme: 'striped',
            headStyles: {
                fillColor: [173, 216, 230],
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [240, 245, 255]
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                3: { cellWidth: 30, halign: 'center' }
            }
        });

        yPosition = doc.lastAutoTable.finalY + 15;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
    }

    doc.save(`travel-plan-${itinerary.title}.pdf`);
};