// export-pdf.js — generates a clean PDF from the results section
// uses html2canvas to rasterise the DOM and jsPDF to wrap it

function exportTaxBreakdownPDF() {
    const exportBtn = document.getElementById('exportPdfBtn');
    const target    = document.getElementById('pdfExportTarget');

    if (!target) {
        alert('Nothing to export yet — enter a salary first.');
        return;
    }

    // show loading state on the button
    if (exportBtn) {
        exportBtn.disabled   = true;
        exportBtn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF…';
    }

    // short delay so the spinner renders before html2canvas blocks the thread
    setTimeout(function () {
        html2canvas(target, {
            scale:           2,          // retina quality
            useCORS:         true,
            backgroundColor: '#F8FAFB',
            logging:         false,
            removeContainer: true,
        }).then(function (canvas) {

            const { jsPDF } = window.jspdf;
            const pdf        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            const pageW   = pdf.internal.pageSize.getWidth();
            const pageH   = pdf.internal.pageSize.getHeight();
            const margin  = 12;
            const usableW = pageW - margin * 2;

            // header bar
            pdf.setFillColor(5, 150, 105); // --green-dark
            pdf.rect(0, 0, pageW, 18, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(13);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Kenya Tax Estimator — Tax Breakdown Report', margin, 12);

            // date stamp
            const today = new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' });
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Generated: ' + today, pageW - margin, 12, { align: 'right' });

            // the captured results section as an image
            const imgData   = canvas.toDataURL('image/png');
            const imgH      = (canvas.height / canvas.width) * usableW;
            let   yPos      = 24;

            // if the image is taller than one page, split it across pages
            if (imgH <= pageH - yPos - margin) {
                pdf.addImage(imgData, 'PNG', margin, yPos, usableW, imgH);
            } else {
                let remaining = imgH;
                let srcY      = 0;
                const sliceH  = pageH - yPos - margin;

                while (remaining > 0) {
                    const drawH = Math.min(remaining, sliceH);
                    pdf.addImage(imgData, 'PNG', margin, yPos, usableW, imgH, '', 'FAST', 0);
                    remaining -= drawH;
                    srcY      += drawH;
                    if (remaining > 0) {
                        pdf.addPage();
                        yPos = margin;
                    }
                }
            }

            // footer disclaimer on last page
            const totalPages = pdf.internal.getNumberOfPages();
            pdf.setPage(totalPages);
            const footerY = pageH - 8;
            pdf.setFontSize(7);
            pdf.setTextColor(107, 114, 128);
            pdf.text(
                'This report is for informational purposes only and does not constitute professional tax advice. Always verify with KRA.',
                pageW / 2, footerY, { align: 'center' }
            );

            // build filename — KES amount + date
            const salaryEl  = document.getElementById('salaryInput');
            const salaryVal = salaryEl ? (parseFloat(salaryEl.value) || 0).toFixed(0) : '0';
            const dateStr   = new Date().toISOString().slice(0, 10);
            const filename  = 'tax-breakdown-KES-' + salaryVal + '-' + dateStr + '.pdf';

            pdf.save(filename);

        }).catch(function (err) {
            console.error('PDF export failed:', err);
            alert('PDF export failed. Please try again.');
        }).finally(function () {
            // restore button state
            if (exportBtn) {
                exportBtn.disabled  = false;
                exportBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Download PDF';
            }
        });
    }, 80);
}

// wire up the button once the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('exportPdfBtn');
    if (btn) {
        btn.addEventListener('click', exportTaxBreakdownPDF);
    }
});
