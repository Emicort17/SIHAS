package utez.edu.mx.sihas.service.summary;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import utez.edu.mx.sihas.controller.summary.dto.PatientSummaryDto;
import utez.edu.mx.sihas.model.user.User;
import utez.edu.mx.sihas.model.user.UserRepository;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.ChartUtils;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;

@Service
public class ReportService {

    private final PatientSummaryService patientSummaryService;
    private final UserRepository userRepository;

    public ReportService(PatientSummaryService patientSummaryService, UserRepository userRepository) {
        this.patientSummaryService = patientSummaryService;
        this.userRepository = userRepository;
    }

    public ByteArrayInputStream generatePatientReport(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PatientSummaryDto summary = patientSummaryService.getSummaryForUser(userId);

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        Font bold = new Font(Font.HELVETICA, 14, Font.BOLD);
        Font normal = new Font(Font.HELVETICA, 12);

        document.add(new Paragraph("Detalles Paciente", bold));
        document.add(new Paragraph("Progreso de " + user.getName() + " " + user.getSurname(), normal));
        document.add(new Paragraph("Fecha: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")), normal));
        document.add(Chunk.NEWLINE);

        var bio = user.getBiologicalData();
        document.add(new Paragraph("Progreso de Hoy", bold));
        document.add(new Paragraph("- Peso: " + (bio != null && bio.getWeight() != null ? bio.getWeight() + " kg" : "N/A")));
        document.add(new Paragraph("- Altura: " + (bio != null && bio.getHeight() != null ? bio.getHeight() + " m" : "N/A")));

        java.util.List<Double> sleepHours = summary.getSleepHoursPerDay() != null
                ? summary.getSleepHoursPerDay()
                : new ArrayList<>();
        double avgSleep = sleepHours.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        int activeDays = summary.getCurrentExerciseCount() != null ? summary.getCurrentExerciseCount() : 0;

        // --- Resumen de sueño con mini-gráfica a la derecha ---
        DefaultCategoryDataset sleepDataset = new DefaultCategoryDataset();
        StringBuilder sleepText = new StringBuilder();
        for (int i = 0; i < 7; i++) {
            LocalDate day = LocalDate.now().minusDays(6 - i);
            double hours = i < sleepHours.size() ? sleepHours.get(i) : 0.0;
            sleepDataset.addValue(hours, "Horas de Sueño", day.format(DateTimeFormatter.ofPattern("dd/MM")));
            sleepText.append("• ").append(day.format(DateTimeFormatter.ofPattern("dd/MM"))).append(": ").append(hours).append(" h\n");
        }
        sleepText.append("- Promedio: ").append(String.format("%.1f", avgSleep)).append(" h");

        // Mini-gráfica de sueño
        JFreeChart miniSleepChart = ChartFactory.createBarChart(null, null, null, sleepDataset,
                org.jfree.chart.plot.PlotOrientation.VERTICAL, false, false, false);
        ByteArrayOutputStream miniSleepOut = new ByteArrayOutputStream();
        ChartUtils.writeChartAsPNG(miniSleepOut, miniSleepChart, 250, 150);
        Image miniSleepImage = Image.getInstance(miniSleepOut.toByteArray());
        miniSleepImage.scaleToFit(250, 150);

        PdfPTable sleepTable = new PdfPTable(2);
        sleepTable.setWidthPercentage(100);

        PdfPCell textCell = new PdfPCell(new Paragraph(sleepText.toString(), normal));
        textCell.setBorder(PdfPCell.NO_BORDER);
        sleepTable.addCell(textCell);

        PdfPCell chartCell = new PdfPCell(miniSleepImage, true);
        chartCell.setBorder(PdfPCell.NO_BORDER);
        chartCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        sleepTable.addCell(chartCell);

        document.add(new Paragraph("Resumen de Sueño Semanal", bold));
        document.add(sleepTable);
        document.add(Chunk.NEWLINE);

        // --- Resumen de ejercicio con mini-gráfica a la derecha ---
        DefaultPieDataset pieDataset = new DefaultPieDataset();
        pieDataset.setValue("Activos", activeDays);
        pieDataset.setValue("Inactivos", 7 - activeDays);

        JFreeChart miniPieChart = ChartFactory.createPieChart(null, pieDataset, false, false, false);
        ByteArrayOutputStream miniPieOut = new ByteArrayOutputStream();
        ChartUtils.writeChartAsPNG(miniPieOut, miniPieChart, 250, 150);
        Image miniPieImage = Image.getInstance(miniPieOut.toByteArray());
        miniPieImage.scaleToFit(250, 150);

        PdfPTable exerciseTable = new PdfPTable(2);
        exerciseTable.setWidthPercentage(100);

        PdfPCell exerciseTextCell = new PdfPCell(new Paragraph("- Días Activos: " + activeDays + " días", normal));
        exerciseTextCell.setBorder(PdfPCell.NO_BORDER);
        exerciseTable.addCell(exerciseTextCell);

        PdfPCell exerciseChartCell = new PdfPCell(miniPieImage, true);
        exerciseChartCell.setBorder(PdfPCell.NO_BORDER);
        exerciseChartCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        exerciseTable.addCell(exerciseChartCell);

        document.add(new Paragraph("Resumen de Ejercicio Semanal", bold));
        document.add(exerciseTable);

        document.add(Chunk.NEWLINE);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }
}
