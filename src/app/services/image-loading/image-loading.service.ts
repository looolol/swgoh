import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageLoadingService {
  private cache: Set<string> = new Set();
  private loadingQueue: Set<string> = new Set();
  private loading = false;
  private loadedImages = new BehaviorSubject<Set<string>>(new Set());

  constructor() { }

  preloadImages(urls: string[]): void {
    urls.forEach(url => {
      if (!this.cache.has(url) && !this.loadingQueue.has(url)) {
        this.loadingQueue.add(url);
      }
    });
    this.loadNextBatch();
  }

  getImage(url: string): Observable<string | undefined> {
    if (this.cache.has(url)) {
      return of(url);
    }
    
    if (!this.loadingQueue.has(url)) {
      this.loadingQueue.add(url);
      this.loadNextBatch();
    }

    return this.loadedImages.pipe(
      map(images => images.has(url) ? url : undefined)
    );
  }

  private loadNextBatch(): void {
    if (this.loading || this.loadingQueue.size === 0) return;
    this.loading = true;

    const batch = Array.from(this.loadingQueue).slice(0, 100);
    from(batch).pipe(
      mergeMap(url => this.loadImage(url), 20), // Load 20 images concurrently
      catchError(error => {
        console.error('Error loading image:', error);
        return of(null);
      })
    ).subscribe({
      complete: () => {
        this.loading = false;
        this.loadNextBatch();
      }
    });
  }

  private loadImage(url: string): Observable<void> {
    return new Observable(observer => {
      const img = new Image();
      img.onload = () => {
        this.cache.add(url);
        this.loadingQueue.delete(url);
        this.loadedImages.next(new Set(this.cache));
        observer.next();
        observer.complete();
      };
      img.onerror = (error) => {
        this.loadingQueue.delete(url);
        observer.error(error);
      };
      img.src = url;
    });
  }
}