import { Component, OnInit, signal, ElementRef, ViewChild, viewChild } from '@angular/core';
import { DocumentResponse } from '../document.model';
import { DocumentService } from '../document';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { single } from 'rxjs';

@Component({
  imports: [DatePipe,FormsModule],
  selector: 'app-documents',
  styleUrl: './documents.css',
  templateUrl: './documents.html',
})
export class Documents implements OnInit {

  documents = signal<DocumentResponse[]>([]);
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(true);
  isUploading = signal(false);
  selectedFile: File | null = null;
  documentTitle = '';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
}
