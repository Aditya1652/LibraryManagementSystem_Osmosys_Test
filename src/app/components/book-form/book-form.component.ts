import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode: boolean = false;
  bookId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      available: [true],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = params['id'];
        this.bookService.getBookById(this.bookId).subscribe((book) => {
          if (book) {
            this.bookForm.patchValue(book);
          }
        });
      }
    });
  }

  onClick() {
    if (this.bookForm.valid) {
      if (this.isEditMode && this.bookId) {
        this.bookService
          .updateBook({ ...this.bookForm.value, id: this.bookId })
          .subscribe(() => {
            this.router.navigate(['/books']);
          });
      } else {
        this.bookService.addBook(this.bookForm.value).subscribe(() => {
          this.router.navigate(['/books']);
        });
      }
    }
  }
}
