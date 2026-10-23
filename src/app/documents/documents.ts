import { Component, OnInit, signal, ElementRef, ViewChild, viewChild,computed } from '@angular/core';
import { DocumentResponse } from '../document.model';
import { DocumentService } from '../document';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { single } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  imports: [DatePipe,FormsModule,RouterLink],
  selector: 'app-documents',
  styleUrl: './documents.css',
  templateUrl: './documents.html',
})
export class Documents implements OnInit {

  documents = signal<DocumentResponse[]>([]);
  errorMessage = signal('');
  successMessage = signal('');
  searchTerm = signal('');
  isLoading = signal(true);
  isUploading = signal(false);
  selectedFile: File | null = null;
  documentTitle = '';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedDocument = signal<DocumentResponse | null>(null);
  isDetailsLoading = signal(false);
  detailsError = signal('');

  constructor(private documentService: DocumentService) {
    console.log('DOCUMENTS COMPONENT CREATED');
  }

  ngOnInit(): void {
    console.log('DOCUMENTS ngOnInit');
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (response) => {
        console.log('Documents received:', response);

        this.documents.set(response);
        this.isLoading.set(false);

        console.log('Documents stored:', this.documents);
        console.log('Document count:', this.documents.length);
        console.log('isLoading after API:', this.isLoading);

   
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

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

    console.log('Selected file:', this.selectedFile);

  }

  uploadDocument(): void {

    if (!this.selectedFile) {
      this.errorMessage.set('Please select a file.');
      return;
    }

    if (!this.documentTitle.trim()) {
      this.errorMessage.set('Please enter a document title.');
      return;
    }

    if (this.documentTitle.trim().length > 200) {
      this.errorMessage.set('Document title cannot exceed 200 characters.');
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
      return;
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (this.selectedFile.size > maxFileSize) {
      this.errorMessage.set(
        'File size cannot exceed 10 MB.'
      );
      return;
    }


    const formData = new FormData();

    formData.append('Title', this.documentTitle);
    formData.append('File', this.selectedFile);

    console.log('Uploading title:', this.documentTitle);
    console.log('Uploading file:', this.selectedFile);


    this.isUploading.set(true);
    this.documentService.uploadDocument(formData).subscribe({
      next: (response) => {
        console.log('Upload successful:', response);
        this.successMessage.set('Document uploaded successfully.');
        this.errorMessage.set('');

        this.documentTitle = '';
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';

        this.isUploading.set(false);
        this.loadDocuments();
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.errorMessage.set('Unable to upload document.');
        this.isUploading.set(true);
      }
    });
  }


  viewDocument(id: number): void {
    console.log('View Details clicked. Document ID:', id);

    this.selectedDocument.set(null);
    this.isDetailsLoading.set(true);
    this.detailsError.set('');

    this.documentService.getDocumentById(id).subscribe({
      next: (response) => {
        console.log('Document details received:', response);

        this.selectedDocument.set(response);

        console.log('Selected document signal:', this.selectedDocument());


        this.isDetailsLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading document details:', error);
        console.log('HTTP status:', error.status);

        this.detailsError.set('Unable to load document details.');
        this.isDetailsLoading.set(false);
      }
    });
  }

  deleteDocument(id: number, title: string): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.successMessage.set('Document deleted successfully.');
        this.loadDocuments();
      },
      error: (error) => {
        console.error('Error deleting document:', error);
        this.errorMessage.set('Unable to delete document.');
      }
    });
  }

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
