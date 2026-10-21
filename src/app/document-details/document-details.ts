
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

    console.log('Document ID from URL:', documentId);

    this.documentService.getDocumentById(documentId).subscribe({
      next: (response) => {
        console.log('Document details received:', response);

        this.document.set(response);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error('Error loading document:', error);

        this.errorMessage.set('Unable to load document details.');
        this.isLoading.set(false);
      }
    });
  }
}
