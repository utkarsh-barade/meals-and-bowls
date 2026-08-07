import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def build_pdf():
    pdf_filename = "e:/Downloads/meals-bowls/docs/Client_Handover_Document.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#16A34A'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'BulletDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=10,
        spaceAfter=3
    )

    tbl_header_style = ParagraphStyle(
        'TblHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )

    tbl_cell_style = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#1E293B')
    )

    tbl_cell_bold = ParagraphStyle(
        'TblCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#0F172A')
    )

    elements = []

    # Title & Subtitle
    elements.append(Paragraph("Meals & Bowls — Client Handover Document", title_style))
    elements.append(Paragraph("Official Technical Handover, Database Info & Operations Guide | Date: August 2026", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#16A34A'), spaceAfter=12))

    # Section 1: Access & Credentials
    elements.append(Paragraph("1. Project Access & Credentials", h2_style))
    
    table_data_1 = [
        [Paragraph("Item / Portal", tbl_header_style), Paragraph("URL / Details", tbl_header_style)],
        [Paragraph("Customer Portal Login", tbl_cell_bold), Paragraph("https://your-domain.vercel.app/login", tbl_cell_style)],
        [Paragraph("Admin Panel Login", tbl_cell_bold), Paragraph("https://your-domain.vercel.app/admin/login", tbl_cell_style)],
        [Paragraph("Admin Default Mobile", tbl_cell_bold), Paragraph("9999999999", tbl_cell_style)],
        [Paragraph("Admin Default Password", tbl_cell_bold), Paragraph("utkarsh13", tbl_cell_style)],
    ]

    t1 = Table(table_data_1, colWidths=[170, 360])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#16A34A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#F8FAFC')),
    ]))
    elements.append(t1)
    elements.append(Spacer(1, 10))

    # Section 2: Features Delivered
    elements.append(Paragraph("2. Key Features Delivered", h2_style))
    
    elements.append(Paragraph("<b>A. Customer Web App Portal</b>", body_style))
    elements.append(Paragraph("• Phone Number Login & Signup with JWT Security.", bullet_style))
    elements.append(Paragraph("• Active Subscription Dashboard, Remaining Meals Counter, Expiry Indicator.", bullet_style))
    elements.append(Paragraph("• Daily Meal Consumption History & Profile Settings.", bullet_style))

    elements.append(Spacer(1, 4))
    elements.append(Paragraph("<b>B. Admin Management System</b>", body_style))
    elements.append(Paragraph("• <b>Customer Management:</b> Create, View, Edit, Search, and Delete customer profiles.", bullet_style))
    elements.append(Paragraph("• <b>Subscription Plan Assignment:</b> Activate 30-Meal (₹2,700) or 56-Meal (₹5,000) plans with automatic validity calculations.", bullet_style))
    elements.append(Paragraph("• <b>Meal Management (Serving):</b> 1-Click Lunch & Dinner meal serving, meal correction audit logs.", bullet_style))
    elements.append(Paragraph("• <b>Payment Tracking:</b> Record manual/online payments with full transaction logs.", bullet_style))
    elements.append(Paragraph("• <b>Reports & Analytics:</b> Daily served meal totals and expiring plan alerts.", bullet_style))
    elements.append(Paragraph("• <b>WhatsApp Automated Gateway:</b> Live WhatsApp QR Scanner (/admin/whatsapp) with automated meal serving notifications & session recovery.", bullet_style))

    elements.append(Spacer(1, 10))

    # Section 3: Database Information
    elements.append(Paragraph("3. Database Information (MongoDB Cloud Atlas)", h2_style))
    
    table_data_db = [
        [Paragraph("Property / Collection", tbl_header_style), Paragraph("Details / Purpose", tbl_header_style)],
        [Paragraph("Database Engine", tbl_cell_bold), Paragraph("MongoDB Atlas (Cloud NoSQL Database)", tbl_cell_style)],
        [Paragraph("Database Name", tbl_cell_bold), Paragraph("meals_bowls", tbl_cell_style)],
        [Paragraph("Collection: customers", tbl_cell_bold), Paragraph("Customer accounts, mobile numbers, passwords, status", tbl_cell_style)],
        [Paragraph("Collection: subscriptions", tbl_cell_bold), Paragraph("Active & expired subscriptions, start/end dates, total & remaining meals", tbl_cell_style)],
        [Paragraph("Collection: meals", tbl_cell_bold), Paragraph("Daily meal serving logs (Lunch & Dinner status per customer)", tbl_cell_style)],
        [Paragraph("Collection: payments", tbl_cell_bold), Paragraph("Payment transaction records, receipts, and payment statuses", tbl_cell_style)],
        [Paragraph("Collection: plans", tbl_cell_bold), Paragraph("Thali subscription plans specs (Plan 1: 30 meals, Plan 2: 56 meals)", tbl_cell_style)],
    ]

    tdb = Table(table_data_db, colWidths=[170, 360])
    tdb.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0,5), (-1,5), colors.HexColor('#F8FAFC')),
        ('BACKGROUND', (0,7), (-1,7), colors.HexColor('#F8FAFC')),
    ]))
    elements.append(tdb)

    elements.append(Spacer(1, 10))

    # Section 4: Daily Operations Guide
    elements.append(Paragraph("4. Daily Operations Guide for Client", h2_style))
    
    elements.append(Paragraph("<b>Step 1: Connect WhatsApp (One-Time Setup)</b>", body_style))
    elements.append(Paragraph("1. Navigate to Admin Panel &rarr; <b>WhatsApp Status</b> (<i>/admin/whatsapp</i>).", bullet_style))
    elements.append(Paragraph("2. Click <b>Generate New QR</b> (if disconnected).", bullet_style))
    elements.append(Paragraph("3. Open <b>WhatsApp / WhatsApp Business App</b> on phone &rarr; <b>Settings</b> &rarr; <b>Linked Devices</b> &rarr; <b>Link a Device</b> &rarr; Scan QR Code.", bullet_style))
    elements.append(Paragraph("4. Gateway status turns <b>Connected</b>. Automated notifications will now send directly to customers on WhatsApp!", bullet_style))

    elements.append(Spacer(1, 4))
    elements.append(Paragraph("<b>Step 2: Serve Daily Meals</b>", body_style))
    elements.append(Paragraph("1. Open <b>Meal Management</b> (<i>/admin/meal-management</i>).", bullet_style))
    elements.append(Paragraph("2. Select <b>Lunch</b> or <b>Dinner</b> tab.", bullet_style))
    elements.append(Paragraph("3. Click <b>Serve</b> next to customer name. Meal count updates instantly and WhatsApp notification triggers.", bullet_style))

    elements.append(Spacer(1, 10))

    # Section 5: Environment Variables & Hosting Details
    elements.append(Paragraph("5. Environment Variables & Hosting Architecture", h2_style))

    table_data_2 = [
        [Paragraph("Layer", tbl_header_style), Paragraph("Platform", tbl_header_style), Paragraph("Environment Variables", tbl_header_style)],
        [Paragraph("Frontend", tbl_cell_bold), Paragraph("Vercel", tbl_cell_style), Paragraph("VITE_API_BASE_URL=https://your-backend-api.onrender.com", tbl_cell_style)],
        [Paragraph("Backend API", tbl_cell_bold), Paragraph("Render / Railway", tbl_cell_style), Paragraph("MONGODB_URI, JWT_SECRET, ADMIN_PASSWORD=utkarsh13, WA_GATEWAY_URL, FRONTEND_URL", tbl_cell_style)],
        [Paragraph("WA Gateway", tbl_cell_bold), Paragraph("Render / Railway", tbl_cell_style), Paragraph("PORT=3001, WA_GATEWAY_API_KEY=meals-bowls-secret", tbl_cell_style)],
    ]

    t2 = Table(table_data_2, colWidths=[80, 100, 350])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
    ]))
    elements.append(t2)

    elements.append(Spacer(1, 10))

    # Section 6: Maintenance & 24/7 Always-On
    elements.append(Paragraph("6. Maintenance & 24/7 Always-On Setup", h2_style))
    elements.append(Paragraph("• <b>Health Check Endpoint:</b> https://your-backend-api.onrender.com/api/public/health", bullet_style))
    elements.append(Paragraph("• <b>24/7 Keep-Alive:</b> Configured via UptimeRobot / Cron-Job.org (pinging every 5 minutes so Render backend never sleeps).", bullet_style))

    doc.build(elements)
    print(f"Successfully generated PDF at {pdf_filename}")

if __name__ == '__main__':
    build_pdf()
