import {
  ViewChild,
  TemplateRef,
  Component,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit
} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProcessInfoDialogComponent } from '../process-info-dialog/process-info-dialog.component';
import {
  BusinessProcess,
  BusinessProcessService,
  ProcessLink
} from './business-process.service';
import { HttpClient } from '@angular/common/http';
import { MermaidRendererComponent } from './mermaid-renderer/mermaid-renderer.component';
import { MatButtonModule } from '@angular/material/button';
import { log } from 'mermaid/dist/logger.js';

@Component({
  selector: 'app-business-process',
  standalone: true,
  imports: [NgxGraphModule, CommonModule, MermaidRendererComponent, MatDialogModule, MatButtonModule, SidebarComponent],
  templateUrl: './business-process.component.html',
  styleUrl: './business-process.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class BusinessProcessComponent implements OnInit {
  insuranceTypes = ['Asuransi Jiwa', 'Asuransi Umum', 'Asuransi Wajib', 'Asuransi Sosial', 'Reasuransi'];
  phaseMapping: { [key: string]: string[] } = {
    'Treaty': ['Akseptasi Treaty', 'Klaim Treaty'],
    'Fakultatif': ['Akseptasi Fakultatif', 'Klaim Fakultatif'],
    'Asuransi Jiwa': ['Underwriting', 'Klaim', 'Subrogasi'],
    'Asuransi Umum': ['Underwriting', 'Klaim', 'Subrogasi'],
    'Asuransi Wajib': ['Pendaftaran & Kepesertaan', 'Klaim & Pembayaran Manfaat'],
    'Asuransi Sosial': ['Pendaftaran & Kepesertaan Otomatis', 'Klaim', 'Subrogasi'],
    'Reasuransi': ['Treaty', 'Fakultatif']
  };

  zoomLevel = 1;

  selectedReinsuranceType: string | null = null;
  processPhases: string[] = [];
  selectedInsuranceType: string | null = null;
  selectedPhase: string | null = null;

  swimlaneData: {
    actor: string;
    processes: { label: string; sequence: number }[];
  }[] = [];

  isLoading = false;
  diagram: string = '';
  allNodes: BusinessProcess[] = [];

  private uuidToShortId = new Map<string, string>();

  constructor(
    private http: HttpClient,
    private businessService: BusinessProcessService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void { }

  safeId(id: string): string {
    // Hanya simpan huruf, angka, dan underscore
    let cleanId = id.replace(/[^a-zA-Z0-9_]/g, '_');

    // Tambahkan prefix jika dimulai dengan angka
    if (/^[0-9]/.test(cleanId)) {
      cleanId = 'id_' + cleanId;
    }

    return cleanId;
  }

  selectInsuranceType(type: string) {
    this.selectedInsuranceType = type;
    this.selectedReinsuranceType = null;
    this.processPhases = this.phaseMapping[type] || [];
    this.selectedPhase = null;
    this.swimlaneData = [];
    this.diagram = '';
  }

  selectReinsuranceType(type: string): void {
    this.selectedReinsuranceType = type;
    this.processPhases = this.phaseMapping[type] || [];
    this.selectedPhase = null; 
  }

  selectPhase(phase: string) {
    this.selectedPhase = phase;
    this.fetchProcessData();
  }

  fetchProcessData(): void {
    const insurance = this.selectedInsuranceType || this.selectedReinsuranceType;
    if (!insurance || !this.selectedPhase) return;
    this.isLoading = true;
    this.businessService.getFilteredNodes(insurance, this.selectedPhase).subscribe(nodes => {
      this.allNodes = nodes;
      this.businessService.getFilteredLinks(insurance, this.selectedPhase!).subscribe(links => {
        const grouped = new Map<string, { label: string; sequence: number }[]>();

        nodes.forEach(n => {
          const seq = n.sequence ?? 0;
          if (!grouped.has(n.actor)) grouped.set(n.actor, []);
          grouped.get(n.actor)?.push({ label: n.label, sequence: seq });
        });

        this.swimlaneData = Array.from(grouped.entries()).map(([actor, processes]) => ({
          actor,
          processes: processes.sort((a, b) => a.sequence - b.sequence)
        }));

        this.diagram = this.generateMermaidDiagram(nodes, links);
        this.isLoading = false;

      });
    });
  }

  backToInsuranceTypes(): void {
    this.selectedInsuranceType = null;
    this.selectedPhase = null;
    this.swimlaneData = [];
    this.diagram = '';
  }

  backToPhases(): void {
    this.selectedPhase = null;
    this.swimlaneData = [];
    this.diagram = '';
  }

  generateMermaidDiagram(nodes: BusinessProcess[], links: ProcessLink[]): string {
    let diagram = 'flowchart LR\n\n';

    // Map UUID ke short ID
    this.uuidToShortId.clear();

    let nodeCounter = 1;

    const shortId = (uuid: string): string => {
      if (!this.uuidToShortId.has(uuid)) {
        this.uuidToShortId.set(uuid, 'n' + nodeCounter++);
      }
      return this.uuidToShortId.get(uuid)!;
    };

    // Pemetaan informasi node
    const actorMap = new Map<string, { id: string; label: string; shape: string }[]>();

    nodes.forEach(node => {
      const id = shortId(node.id);
      const label = node.label.replace(/["]/g, "'"); // Escape quote
      const shape = node.category === 'decision' ? 'rhombus' : 'rect';

      if (!actorMap.has(node.actor)) actorMap.set(node.actor, []);
      actorMap.get(node.actor)!.push({ id, label, shape });
    });

    // Render subgraph per aktor
    actorMap.forEach((nodeList, actor) => {
      diagram += `  subgraph ${actor}\n`;
      nodeList.forEach(({ id, label, shape }) => {
        const open = shape === 'rhombus' ? '{{' : '[';
        const close = shape === 'rhombus' ? '}}' : ']';
        diagram += `    ${id}${open}"${label}"${close}\n`;
      });
      diagram += `  end\n\n`; // Penting: baris kosong setelah end
    });

    // Render edges
    links.forEach(link => {
      const sourceId = shortId(link.source.id);
      const targetId = shortId(link.target.id);
      const label = (link.label ?? '')
        .replace(/[^a-zA-Z0-9 _\-?!.,]/g, '')
        .replace(/\s+/g, ' ')
        .trim();


      // Tambahkan edge dengan/ tanpa label
      const cleanLabel = (link.label ?? '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // hilangkan aksen
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/[^a-zA-Z0-9 _\-?!.,]/g, '')
        .trim();

      diagram += cleanLabel
        ? `  ${sourceId} --|${cleanLabel}|--> ${targetId}\n`
        : `  ${sourceId} --> ${targetId}\n`;
    });

    return diagram;
  }

  onNodeClick(shortId: string): void {
    const matchedUuid = Array.from(this.uuidToShortId.entries())
      .find(([uuid, sid]) => sid === shortId)?.[0];

    const node = this.allNodes.find(n => n.id === matchedUuid);
    if (!node) return;

    this.dialog.open(ProcessInfoDialogComponent, {
      width: '500px',
      data: node
    });
  }

  zoomIn() {
  this.zoomLevel += 0.1;
  this.applyZoom();
}

zoomOut() {
  this.zoomLevel = Math.max(0.1, this.zoomLevel - 0.1);
  this.applyZoom();
}

resetZoom() {
  this.zoomLevel = 1;
  this.applyZoom();
}

applyZoom() {
  const diagramEl = document.querySelector('.mermaid');
  if (diagramEl) {
    (diagramEl as HTMLElement).style.transform = `scale(${this.zoomLevel})`;
    (diagramEl as HTMLElement).style.transformOrigin = 'top left';
  }
}


}
