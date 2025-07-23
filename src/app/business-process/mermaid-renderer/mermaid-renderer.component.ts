import { Component, Input, AfterViewInit, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import mermaid from 'mermaid';
import { MatDialog } from '@angular/material/dialog';
import { ProcessInfoDialogComponent } from '../../process-info-dialog/process-info-dialog.component';
import { BusinessProcess } from '../business-process.service'; // Sesuaikan jika path berbeda

@Component({
  selector: 'app-mermaid-renderer',
  template: `<div class="mermaid-container"><div class="mermaid" #mermaidDiv></div></div>`,
  styles: [`
    .mermaid-container {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 1rem;
      overflow-x: auto;
    }
  `]
})
export class MermaidRendererComponent implements AfterViewInit, OnChanges {
  @Input() diagram: string = '';
  @Input() diagramData: BusinessProcess[] = []; // ✅ Tambahkan input ini
  

  private initialized = false;

  constructor(
    private el: ElementRef,
    private dialog: MatDialog // ✅ Tambahkan ini
  ) {}

  ngAfterViewInit(): void {
    this.initialized = true;
    this.renderMermaid();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['diagram'] && this.initialized) {
      this.renderMermaid();
    }
  }

  private renderMermaid(): void {
    const element = this.el.nativeElement.querySelector('.mermaid');
    if (!element || !this.diagram) return;

    element.innerHTML = this.diagram;

    try {
      mermaid.initialize({ startOnLoad: false });
      mermaid.init(undefined, element);

      // Klik node setelah render selesai
      setTimeout(() => this.addNodeClickEvents(), 500);
    } catch (err) {
      console.error('[MermaidRenderer] Error rendering diagram:', err);
    }
  }

  private addNodeClickEvents(): void {
  const nodes = this.el.nativeElement.querySelectorAll('.node');

  nodes.forEach((node: HTMLElement) => {
    node.style.cursor = 'pointer';
    node.addEventListener('click', () => {
      const rawId = node.id?.replace('flowchart-', ''); // e.g., 'n1-1'
      const baseNodeId = rawId?.split('-')[0]; // hasil: 'n1'

      console.log('[Klik Node]', node.id, '→', baseNodeId);

      // ✅ Gunakan ID pendek ('n1') langsung untuk pencocokan
      const foundProcess = this.diagramData.find((proc: BusinessProcess) => {
        // Cocokkan berdasarkan pemetaan uuidToShortId di parent
        // Harusnya parent generate shortId() → ex: 'n1', 'n2'
        const safeId = proc.id.replace(/[^a-zA-Z0-9_]/g, '_');
        const idStartsWith = 'n' + (this.diagramData.indexOf(proc) + 1);
        return idStartsWith === baseNodeId;
      });

      if (foundProcess) {
        this.dialog.open(ProcessInfoDialogComponent, {
          width: '500px',
          data: foundProcess
        });
      } else {
        console.warn('❌ Node tidak dikenali:', baseNodeId);
      }
    });
  });
}


}
