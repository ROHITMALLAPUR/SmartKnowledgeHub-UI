
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DocumentService } from '../document';
import { DocumentResponse } from '../document.model';

@Component({
  selector: 'app-document-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './document-edit.html',
  styleUrl: './document-edit.css',
})
export class DocumentEdit implements OnInit {
  documentId = 0;

  document = signal<DocumentResponse | null>(null);

  title = '';

  isLoading = signal(true);
  isSaving = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Document ID is missing.');
      this.isLoading.set(false);
      return;
    }

    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      this.errorMessage.set('Invalid document ID.');
      this.isLoading.set(false);
      return;
    }

    this.documentId = parsedId;
    this.loadDocument();
  }

  loadDocument(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.documentService.getDocumentById(this.documentId).subscribe({
      next: (response) => {
        this.document.set(response);
        this.title = response.title;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading document for editing:', error);
        this.errorMessage.set('Unable to load document.');
        this.isLoading.set(false);
      },
    });
  }

  saveChanges(): void {
    if (this.isSaving()) {
      return;
    }

    const updatedTitle = this.title.trim();

    if (!updatedTitle) {
      this.errorMessage.set('Document title is required.');
      this.successMessage.set('');
      return;
    }

    if (updatedTitle.length > 200) {
      this.errorMessage.set('Document title cannot exceed 200 characters.');
      this.successMessage.set('');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.documentService.updateDocument(
      this.documentId,
      { title: updatedTitle }
    ).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Document updated successfully.');

        // Preserve the existing behavior: return to the document list.
        this.router.navigate(['/documents']);
      },
      error: (error) => {
        console.error('Error updating document:', error);
        this.isSaving.set(false);
        this.errorMessage.set('Unable to update document. Please try again.');
      },
    });
  }
}
