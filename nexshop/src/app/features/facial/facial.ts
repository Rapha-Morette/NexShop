import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-facial',
  standalone: true,
  templateUrl: './facial.html',
  styleUrls: ['./facial.scss'],
  imports: [CommonModule],
})
export class Facial implements OnInit, OnDestroy {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() fotoCapturada = new EventEmitter<string>();

  stream!: MediaStream;
  fotoCapturadaBase64: string | null = null;

  ngOnInit(): void {
    this.iniciarCamera();
  }

  ngOnDestroy(): void {
    this.pararCamera();
  }

  async iniciarCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoRef.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
    }
  }

  pararCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  capturarFoto(): void {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/png');
    this.fotoCapturadaBase64 = base64;
    this.fotoCapturada.emit(base64);

    this.pararCamera(); // opcional: para a câmera após capturar
  }
}
