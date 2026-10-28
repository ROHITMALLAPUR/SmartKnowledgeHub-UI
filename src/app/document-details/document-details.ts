
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { DocumentResponse } from '../document.model';
import { DocumentService } from '../document';

@Component({
  selector: 'app-document-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './document-details.html',
  styleUrl: './document-details.css',
})
export class DocumentDetails implements OnInit {
  document = signal<DocumentResponse | null>(null);

  isLoading = signal(true);
  errorMessage = signal('');

  isFileLoading = signal(false);
  fileAction = signal<'view' | 'download' | null>(null);
  fileError = signal('');

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Document ID is missing.');
      this.isLoading.set(false);
      return;
    }

    const documentId = Number(id);

    if (!Number.isInteger(documentId) || documentId <= 0) {
      this.errorMessage.set('Invalid document ID.');
      this.isLoading.set(false);
      return;
    }

    this.documentService.getDocumentById(documentId).subscribe({
      next: (response) => {
        this.document.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading document:', error);
        this.errorMessage.set('Unable to load document details.');
        this.isLoading.set(false);
      },
    });
  }

  viewFile(): void {
    const doc = this.document();

    if (!doc) {
      this.fileError.set('Document details are not available.');
      return;
    }

    if (this.isFileLoading()) {
      return;
    }

    this.isFileLoading.set(true);
    this.fileAction.set('view');
    this.fileError.set('');

    this.documentService.getDocumentFile(doc.id).subscribe({
      next: (fileBlob) => {
        const fileUrl = URL.createObjectURL(fileBlob);
        const openedWindow = window.open(fileUrl, '_blank');

        if (!openedWindow) {
          URL.revokeObjectURL(fileUrl);
          this.fileError.set(
            'The file could not be opened. Please allow pop-ups and try again.'
          );
        } else {
          // Keep the URL available while the new tab loads the file.
          window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
        }

        this.isFileLoading.set(false);
        this.fileAction.set(null);
      },
      error: (error) => {
        console.error('Error loading file:', error);
        this.fileError.set('Unable to open the document file.');
        this.isFileLoading.set(false);
        this.fileAction.set(null);
      },
    });
  }

  downloadFile(): void {
    const doc = this.document();

    if (!doc) {
      this.fileError.set('Document details are not available.');
      return;
    }

    if (this.isFileLoading()) {
      return;
    }

    this.isFileLoading.set(true);
    this.fileAction.set('download');
    this.fileError.set('');

    this.documentService.downloadDocument(doc.id).subscribe({
      next: (fileBlob) => {
        const url = URL.createObjectURL(fileBlob);
        const link = document.createElement('a');

        link.href = url;
        link.download = doc.fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1_000);

        this.isFileLoading.set(false);
        this.fileAction.set(null);
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        this.fileError.set('Unable to download document.');
        this.isFileLoading.set(false);
        this.fileAction.set(null);
      },
    });
  }
}
