import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Properly structured function that receives the report as a parameter
export default function handleDownloadPDF(report: any) {
  if (!report) return;
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add header with logo styling
  doc.setFillColor(37, 99, 235); // Blue header
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('Crime Report', 105, 20, { align: 'center' });
  
  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  
  // Add report ID and basic info
  doc.setFontSize(16);
  doc.text(`Report #${report.id.substring(0, 6).toUpperCase()}`, 15, 40);
  
  // Add status with styling
  const status = (report.current_status || report.status)?.replace(/_/g, ' ')?.toUpperCase() || 'IN PROGRESS';
  doc.setFontSize(12);
  doc.text(`Status: ${status}`, 15, 50);
  
  // Add date info
  doc.text(`Reported on: ${report.formatted_date} at ${report.formatted_time}`, 15, 60);
  
  // Add crime type
  doc.text(`Type of incident: ${report.crime_type}`, 15, 70);
  
  // Add location if available (approximate)
  doc.text('Location: Recorded in database', 15, 80);
  
  // Add assigned officer if available
  if (report.assigned_officer) {
    doc.text(`Assigned Officer: Badge #${report.assigned_officer.badge_number}`, 15, 90);
  }
  
  // Add description section
  doc.setFontSize(14);
  doc.text('Description', 15, 105);
  
  // Add description text with word wrap
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(report.description || 'No description provided.', 180);
  doc.text(splitText, 15, 115);
  
  // Calculate next vertical position based on description length
  let yPosition = 125 + (splitText.length * 7);
  
  // Add evidence section if available
  if (report.evidence && report.evidence.length > 0) {
    doc.setFontSize(14);
    doc.text('Evidence Submitted', 15, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    report.evidence.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.type} file`, 20, yPosition);
      yPosition += 7;
    });
    
    yPosition += 10;
  }
  
  // Add timeline section if available
  if (report.status_updates && report.status_updates.length > 0) {
    doc.setFontSize(14);
    doc.text('Status Timeline', 15, yPosition);
    yPosition += 10;
    
    report.status_updates.forEach((update, index) => {
      const statusText = update.status.replace(/_/g, ' ').toUpperCase();
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${statusText}`, 15, yPosition);
      yPosition += 7;
      
      doc.setFont(undefined, 'normal');
      doc.text(`${update.formatted_date}, ${update.formatted_time}`, 20, yPosition);
      yPosition += 7;
      
      if (update.description) {
        const updateText = doc.splitTextToSize(update.description, 170);
        doc.text(updateText, 20, yPosition);
        yPosition += (updateText.length * 7) + 3;
      }
      
      yPosition += 5;
    });
  }
  
  // Add footer with tracking information
  doc.setFontSize(10);
  doc.text(`This report can be tracked online at: ${window.location.href}`, 15, 280);
  
  // Save the PDF with a filename including the report ID
  doc.save(`crime-report-${report.id.substring(0, 6).toUpperCase()}.pdf`);
}