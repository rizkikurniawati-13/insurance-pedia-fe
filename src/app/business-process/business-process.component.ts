import { ViewChild, TemplateRef, Component, NO_ERRORS_SCHEMA, AfterViewInit, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Node, Edge, NgxGraphModule } from '@swimlane/ngx-graph';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as shape from 'd3-shape';
import { transition } from 'd3-transition';
import * as d3 from 'd3';
import { MatDialog } from '@angular/material/dialog';
import { ProcessInfoDialogComponent } from '../process-info-dialog/process-info-dialog.component';

interface CustomNode extends Node {
  tooltipPosition?: string; // Hanya untuk tooltip
  dimension: { width: number; height: number; x?: number; y?: number };
  data?: { actor?: string, description?: string };
}

@Component({
  selector: 'app-business-process',
  imports: [SidebarComponent, NgxGraphModule, CommonModule],
  templateUrl: './business-process.component.html',
  styleUrl: './business-process.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class BusinessProcessComponent implements OnInit {
  hierarchialGraph: { nodes: CustomNode[]; links: Edge[] } = { nodes: [], links: [] };
  curve = shape.curveBundle.beta(1);

  constructor(private dialog: MatDialog) {}


  ngOnInit(): void {
    this.showGraph();

  }

  showGraph() {
    this.hierarchialGraph.nodes = [
      { id: 'start', label: 'Pengajuan Pertanggungan', tooltipPosition: 'x0', dimension: { width: 150, height: 70 }, data: { actor: 'Tertanggung', description: 'xxx' } },
      { id: '1', label: 'Menyalurkan Pertanggungan', tooltipPosition: 'x1', dimension: { width: 150, height: 70 }, data: { actor: 'Broker/Agen' } },
      { id: '2', label: 'Penilaian Risiko', tooltipPosition: 'x2', dimension: { width: 150, height: 70 }, data: { actor: 'Asuradur' } },
      { id: '3', label: 'Penetapan Premi', tooltipPosition: 'x3', dimension: { width: 150, height: 70 }, data: { actor: 'Asuradur' } },
      { id: '4', label: 'Pembayaran Premi', tooltipPosition: 'x4', dimension: { width: 150, height: 70 }, data: { actor: 'Tertanggung' } },
      { id: '5', label: 'Melakukan Pengajuan Reasuransi', tooltipPosition: 'x5', dimension: { width: 150, height: 70 }, data: { actor: 'Asuradur' } },
      { id: '6', label: 'Menyalurkan Reasuransi', tooltipPosition: 'x6', dimension: { width: 150, height: 70 }, data: { actor: 'Broker Reasuransi' } },
      { id: '7', label: 'Penilaian Risiko (Reas)', tooltipPosition: 'x7', dimension: { width: 150, height: 70 }, data: { actor: 'Reasuradur' } },
      { id: '8', label: 'Penetapan Premi Reas', tooltipPosition: 'x8', dimension: { width: 150, height: 70 }, data: { actor: 'Reasuradur' } },
      { id: '9', label: 'Pembayaran Premi Reas', tooltipPosition: 'x9', dimension: { width: 150, height: 70 }, data: { actor: 'Asuradur' } },
    ];


    this.hierarchialGraph.links = [
      { id: 'link1', source: 'start', target: '1', label: '' },
      { id: 'link2', source: 'start', target: '2', label: '' },
      { id: 'link3', source: '1', target: '2', label: '' },
      { id: 'link4', source: '2', target: '3', label: '' },
      { id: 'link5', source: '3', target: '4', label: '' },
      { id: 'link6', source: '3', target: '5', label: '' },
      { id: 'link7', source: '5', target: '6', label: '' },
      { id: 'link8', source: '6', target: '7', label: '' },
      { id: 'link9', source: '7', target: '8', label: '' },
      { id: 'link10', source: '8', target: '9', label: '' },
    ];
  }


  wrapText(text: string, maxCharPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine.length > 0 ? currentLine + ' ' + word : word;
    if (testLine.length > maxCharPerLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

onNodeClick(node: any): void {
  // console.log(event.node.label);
    this.dialog.open(ProcessInfoDialogComponent, {
      data: {
        title: node.label,
        actor: node.data?.actor,
        description: node.data?.description || 'Belum ada deskripsi.'
      }
    });
  }

  

}
