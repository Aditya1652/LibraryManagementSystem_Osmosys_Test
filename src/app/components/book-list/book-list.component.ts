import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  checkedOutBooks: Book[] = [];
  isLibrarian: boolean = false;
  private booksSubscription: Subscription | undefined;
  private checkedOutBooksSubscription: Subscription | undefined;

  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLibrarian = this.authService.currentUserValue.role === 'Librarian';
    this.booksSubscription = this.bookService
      .getBooks()
      .subscribe((books) => (this.books = books));
    this.checkedOutBooksSubscription = this.bookService
      .getCheckedOutBooks()
      .subscribe((books) => (this.checkedOutBooks = books));
  }

  ngOnDestroy() {
    if (this.booksSubscription) {
      this.booksSubscription.unsubscribe();
    }
    if (this.checkedOutBooksSubscription) {
      this.checkedOutBooksSubscription.unsubscribe();
    }
  }

  checkoutBook(book: Book) {
    if (book.id) {
      this.bookService.checkoutBook(book.id).subscribe();
    }
  }

  returnBook(book: Book) {
    if (book.id) {
      this.bookService.returnBook(book.id).subscribe();
    }
  }

  deleteBook(id: string) {
    this.bookService.deleteBook(id).subscribe();
  }
}
