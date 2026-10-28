
import {
  Component,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
  computed
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DocumentResponse } from '../document.model';
import { DocumentService } from '../document';

@Component({
  selector: 'app-documents',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './documents.html',
  styleUrl: './documents.css'
})
export class Documents implements OnInit {

  // Stores the documents returned by the API.
  documents = signal<DocumentResponse[]>([]);

  // Messages displayed to the user.
  errorMessage = signal('');
  successMessage = signal('');

  // Search and loading state.
  searchTerm = signal('');
  isLoading = signal(true);
  isUploading = signal(false);

  // Upload form values.
  selectedFile: File | null = null;
  documentTitle = '';

  // Gives access to the file input so it can be reset after uploading.
  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  // Existing document-details state retained for compatibility.
  selectedDocument = signal<DocumentResponse | null>(null);
  isDetailsLoading = signal(false);
  detailsError = signal('');

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  // Retrieves the current user's documents from the backend.
  loadDocuments(): void {
    this.isLoading.set(true);

    this.documentService.getDocuments().subscribe({
      next: (response) => {
        this.documents.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading documents:', error);

        this.errorMessage.set(
          'Unable to load documents. Please try again.'
        );

        this.isLoading.set(false);
      }
    });
  }

  // Records the file selected in the upload form.
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage.set('');
      this.successMessage.set('');
    } else {
      this.selectedFile = null;
    }
  }

  // Validates and uploads a document.
  uploadDocument(): void {

    if (this.isUploading()) {
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage.set('Please select a file.');
      this.successMessage.set('');
      return;
    }

    if (!this.documentTitle.trim()) {
      this.errorMessage.set('Please enter a document title.');
      this.successMessage.set('');
      return;
    }

    if (this.documentTitle.trim().length > 200) {
      this.errorMessage.set(
        'Document title cannot exceed 200 characters.'
      );
      this.successMessage.set('');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.errorMessage.set(
        'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.'
      );
      this.successMessage.set('');
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (this.selectedFile.size > maxFileSize) {
      this.errorMessage.set(
        'File size cannot exceed 10 MB.'
      );
      this.successMessage.set('');
      return;
    }

    const formData = new FormData();

    formData.append('Title', this.documentTitle.trim());
    formData.append('File', this.selectedFile);

    this.isUploading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.documentService.uploadDocument(formData).subscribe({
      next: () => {
        this.successMessage.set(
          'Document uploaded successfully.'
        );

        this.errorMessage.set('');
        this.documentTitle = '';
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';

        this.isUploading.set(false);

        this.loadDocuments();
      },
      error: (error) => {
        console.error('Upload failed:', error);

        this.errorMessage.set(
          'Unable to upload document. Please try again.'
        );

        this.successMessage.set('');
        this.isUploading.set(false);
      }
    });
  }

  // Retrieves a single document when needed.
  // Retained to preserve the existing component functionality.
  viewDocument(id: number): void {
    this.selectedDocument.set(null);
    this.isDetailsLoading.set(true);
    this.detailsError.set('');

    this.documentService.getDocumentById(id).subscribe({
      next: (response) => {
        this.selectedDocument.set(response);
        this.isDetailsLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading document details:', error);

        this.detailsError.set(
          'Unable to load document details.'
        );

        this.isDetailsLoading.set(false);
      }
    });
  }

  // Deletes a document after the user confirms.
  deleteDocument(id: number, title: string): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}" ?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.successMessage.set(
          'Document deleted successfully.'
        );

        this.loadDocuments();
      },
      error: (error) => {
        console.error('Error deleting document:', error);

        this.errorMessage.set(
          'Unable to delete document. Please try again.'
        );
      }
    });
  }

  // Filters documents by title or filename as the user types.
  filteredDocuments = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();

    if (!search) {
      return this.documents();
    }

    return this.documents().filter(document =>
      document.title.toLowerCase().includes(search) ||
      document.fileName.toLowerCase().includes(search)
    );
  });
}
