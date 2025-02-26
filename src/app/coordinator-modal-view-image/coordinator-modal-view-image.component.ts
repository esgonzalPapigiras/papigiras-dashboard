import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoordinatorService } from 'app/services/coordinator.service';

@Component({
  selector: 'app-coordinator-modal-view-image',
  templateUrl: './coordinator-modal-view-image.component.html',
  styleUrls: ['./coordinator-modal-view-image.component.scss']
})
export class CoordinatorModalViewImageComponent implements OnInit {

  imageUrl: string | undefined;

  constructor(
    private coordinatorService: CoordinatorService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getImage();
  }

  getImage(): void {
    this.coordinatorService.fetchImage(this.data).subscribe({
      next: (imageBlob: Blob) => {
        this.convertBlobToBase64(imageBlob).then(base64Image => {
          this.imageUrl = base64Image;
        }).catch(error => {
          console.error('Error al convertir el Blob a base64:', error);
        });
      },
      error: (error) => {
        console.error('Error al obtener la imagen:', error);
      }
    });
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String); // Devuelve la cadena base64
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Lee el Blob y convierte a base64
    });
  }

}
