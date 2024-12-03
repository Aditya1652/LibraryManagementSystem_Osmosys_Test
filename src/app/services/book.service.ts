import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl =
    'https://library-management-6ca70-default-rtdb.asia-southeast1.firebasedatabase.app/books';
  private booksSubject: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>(
    []
  );
  public books$: Observable<Book[]> = this.booksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBooks();
  }

  private loadBooks(): void {
    this.http
      .get<{ [key: string]: Book }>(`${this.apiUrl}.json`)
      .pipe(
        map((response) => {
          const books: Book[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              books.push({ ...response[key], id: key });
            }
          }
          return books;
        }),
        tap((books) => this.booksSubject.next(books))
      )
      .subscribe();
  }

  getBooks(): Observable<Book[]> {
    return this.books$;
  }

  getBookById(id: string): Observable<Book | undefined> {
    return this.http
      .get<Book>(`${this.apiUrl}/${id}.json`)
      .pipe(map((book) => (book ? { ...book, id } : undefined)));
  }

  addBook(book: Omit<Book, 'id'>): Observable<Book> {
    return this.http.post<{ name: string }>(`${this.apiUrl}.json`, book).pipe(
      map((response) => ({ ...book, id: response.name })),
      tap((newBook) => {
        const currentBooks = this.booksSubject.value;
        this.booksSubject.next([...currentBooks, newBook]);
      })
    );
  }

  updateBook(updatedBook: Book) {
    return this.http
      .put<Book>(`${this.apiUrl}/${updatedBook.id}.json`, updatedBook)
      .pipe(
        tap(() => {
          const currentBooks = this.booksSubject.value;
          const index = currentBooks.findIndex(
            (book) => book.id === updatedBook.id
          );
          if (index !== -1) {
            currentBooks[index] = updatedBook;
            this.booksSubject.next([...currentBooks]);
          }
        })
      );
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}.json`).pipe(
      tap(() => {
        const currentBooks = this.booksSubject.value;
        this.booksSubject.next(currentBooks.filter((book) => book.id !== id));
      })
    );
  }

  checkoutBook(id: string): Observable<Book> {
    return this.getBookById(id).pipe(
      map((book) => {
        if (book && book.available) {
          return { ...book, available: false };
        }
        throw new Error('Book not available for checkout');
      }),
      tap((updatedBook) => this.updateBook(updatedBook).subscribe())
    );
  }

  returnBook(id: string): Observable<Book> {
    return this.getBookById(id).pipe(
      map((book) => {
        if (book && !book.available) {
          return { ...book, available: true };
        }
        throw new Error('Book is already available');
      }),
      tap((updatedBook) => this.updateBook(updatedBook).subscribe())
    );
  }

  getCheckedOutBooks(): Observable<Book[]> {
    return this.books$.pipe(
      map((books) => books.filter((book) => !book.available))
    );
  }
}
