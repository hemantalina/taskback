import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { User } from 'src/users/user.entity';

@Injectable()
export class PdfService {

  async generateUserListPdf(users: User[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 30 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => {
          buffers.push(chunk);
        });

        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        doc.on('error', (err) => {
          reject(err);
        });

        // Define table settings
        const table = {
          headers: ['Name', 'Email', 'Phone Number', 'Address'],
          rows: users.map(user => [user.name, user.email, user.phoneNumber, user.address]),
          columnSpacing: 10,
          rowSpacing: 5,
          marginLeft: 30,
          marginTop: 50,
          headerBackgroundColor: 'black',
          cellPadding: 5,
          fontSize: 12,
          textColor: 'black', // black color
          borderColor: 'black', // black color
        };

        const tableStartX = table.marginLeft;
        let tableStartY = table.marginTop;

        // Calculate available width for the table
        const maxTableWidth = doc.page.width - table.marginLeft - doc.page.margins.right;
        const columnCount = table.headers.length;
        const columnWidth = (maxTableWidth - (table.columnSpacing * (columnCount - 1))) / columnCount;

        // Draw table headers
        doc.fontSize(table.fontSize).fillColor(table.textColor);

        // Draw table headers with background color
        let currentX = tableStartX;
        doc.rect(currentX, tableStartY, maxTableWidth, table.fontSize + table.cellPadding * 2)
          .strokeColor(table.headerBackgroundColor)
          .stroke();
        table.headers.forEach((header) => {
          doc.text(header, currentX + table.cellPadding, tableStartY + table.cellPadding, {
            width: columnWidth - table.cellPadding * 2,
            align: 'left',
          });
          currentX += columnWidth + table.columnSpacing;
        });

        // Draw table rows
        tableStartY += table.fontSize + table.cellPadding * 2 + table.rowSpacing;
        table.rows.forEach((row, rowIndex) => {
          currentX = tableStartX;
          let maxRowHeight = table.fontSize + table.cellPadding * 2;
          row.forEach((cell) => {
            const cellHeight = doc.heightOfString(cell, { width: columnWidth - table.cellPadding * 2 });
            if (cellHeight + table.cellPadding * 2 > maxRowHeight) {
              maxRowHeight = cellHeight + table.cellPadding * 2;
            }
          });

          row.forEach((cell) => {
            // doc.rect(currentX, tableStartY, columnWidth, maxRowHeight)
            //   .strokeColor(table.borderColor)
            //   .stroke();
            doc.text(cell, currentX + table.cellPadding, tableStartY + table.cellPadding, {
              width: columnWidth - table.cellPadding * 2,
              align: 'left',
            });
            currentX += columnWidth + table.columnSpacing;
          });
          tableStartY += maxRowHeight + table.rowSpacing;
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
