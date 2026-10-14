import { Component,OnInit,signal } from '@angular/core';
import { DocumentResponse } from '../document.model';
import { DocumentService } from '../document';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-documents',
  styleUrl: './documents.css',
  templateUrl: './documents.html',
})
export class Documents implements OnInit {

  documents = signal<DocumentResponse[]>([]);
  errorMessage = signal('');
  isLoading = signal(true);

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
}
