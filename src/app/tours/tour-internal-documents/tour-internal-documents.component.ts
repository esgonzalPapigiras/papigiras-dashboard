import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { InternalDocumentCategory, InternalTourDocument, validInternalTourId } from '../../models/internal-document';
import { InternalDocumentsService } from '../../services/internal-documents.service';

@Component({
  selector: 'app-tour-internal-documents',
  templateUrl: './tour-internal-documents.component.html',
  styleUrls: ['./tour-internal-documents.component.scss']
})
export class TourInternalDocumentsComponent implements OnChanges, OnDestroy {
  @Input() tourId: number | string;
  documents: InternalTourDocument[] = [];
  category: InternalDocumentCategory = 'GENERAL';
  loading = false;
  loaded = false;
  error = '';
  downloadError = '';
  readonly busy = new Set<string>();
  private activeTour: number;
  private request?: Subscription;
  private downloads = new Subscription();

  constructor(private service: InternalDocumentsService) { }
  ngOnChanges(): void {
    this.request?.unsubscribe();
    this.downloads.unsubscribe();
    this.downloads = new Subscription();
    this.busy.clear();
    this.documents = [];
    this.loaded = false;
    this.category = 'GENERAL';
    this.downloadError = '';
    try { this.activeTour = validInternalTourId(this.tourId); }
    catch (_) { this.loading = false; this.error = 'No se pudo identificar esta gira.'; return; }
    this.refresh();
  }
  ngOnDestroy(): void { this.request?.unsubscribe(); this.downloads.unsubscribe(); }

  get visibleDocuments(): InternalTourDocument[] { return this.documents.filter(doc => doc.category === this.category); }
  count(category: InternalDocumentCategory): number { return this.documents.filter(doc => doc.category === category).length; }
  select(category: InternalDocumentCategory): void { this.category = category; }
  trackDocument(_: number, document: InternalTourDocument): string { return document.id; }

  refresh(): void {
    if (!this.activeTour) return;
    this.request?.unsubscribe();
    this.loading = true;
    this.error = '';
    this.request = this.service.list(this.activeTour).subscribe({
      next: documents => { this.documents = documents; this.loaded = true; this.loading = false; },
      error: () => { this.error = 'No pudimos actualizar los documentos internos. Inténtalo nuevamente.'; this.loading = false; }
    });
  }

  download(document: InternalTourDocument): void {
    if (this.busy.has(document.id)) return;
    this.busy.add(document.id);
    this.downloadError = '';
    this.downloads.add(this.service.download(this.activeTour, document).subscribe({
      next: blob => { saveAs(blob, document.storedName); this.busy.delete(document.id); },
      error: () => { this.downloadError = 'No pudimos descargar el archivo. Inténtalo nuevamente.'; this.busy.delete(document.id); }
    }));
  }
}
