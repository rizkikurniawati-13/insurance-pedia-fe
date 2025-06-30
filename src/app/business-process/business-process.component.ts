import { ViewChild, TemplateRef, Component, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Node, Edge, NgxGraphModule } from '@swimlane/ngx-graph';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as shape from 'd3-shape';
import { transition } from 'd3-transition';
import { MatDialog } from '@angular/material/dialog';
import { ProcessInfoDialogComponent } from '../process-info-dialog/process-info-dialog.component';
import { BusinessProcess, BusinessProcessService } from './business-process.service';
import { ChangeDetectorRef } from '@angular/core';
import { curveLinear } from 'd3-shape';


// Interface untuk node dari API
export interface ApiNode {
  id: string;
  label: string;
  actor?: string | null;
  description?: string | null;
  reference?: string | null;
  duration?: string | number | null;
  nodeId?: string | null;
  sequence?: string | null;
  category?: string | null;
  processBusiness?: string | null;
  status?: string | null;
}

// Interface untuk link dari API
export interface ApiLink {
  id: string;
  linkId: string;
  label: string;
  source: ApiNode;
  target: ApiNode;
}

export interface GraphNode {
  id: string;
  label: string;
  dimension: { width: number; height: number };
  data: {
    actor: string;
    description: string;
    reference: string;
    duration: string;
    category: string;
    template: string; 
  };
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  label: string;
}



@Component({
  selector: 'app-business-process',
  imports: [SidebarComponent, NgxGraphModule, CommonModule],
  templateUrl: './business-process.component.html',
  styleUrl: './business-process.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class BusinessProcessComponent implements OnInit {
  // hierarchialGraph: { nodes: GraphNode[]; links: GraphLink[] } = { nodes: [], links: [] };
  multipleGraphs: {
    title: string;
    nodes: GraphNode[];
    links: GraphLink[];
  }[] = [];


  @ViewChild('nodeSelector', { static: true }) nodeSelector!: TemplateRef<any>;
  curve: any = curveLinear;

  constructor(private dialog: MatDialog,
    private businessProcessService: BusinessProcessService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.loadGraph();
  }

  getDiamondPoints(width: number, height: number): string {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    return `${halfWidth},0 ${width},${halfHeight} ${halfWidth},${height} 0,${halfHeight}`;
  }

  loadGraph(): void {
    this.businessProcessService.getLinks().subscribe((links: ApiLink[]) => {
      const grouped: { [key: string]: { nodes: GraphNode[]; links: GraphLink[] } } = {};

      for (const link of links) {
        const source = link.source;
        const target = link.target;

        const groupKey = source.processBusiness || target.processBusiness || 'Lainnya';
        

        if (!grouped[groupKey]) {
          grouped[groupKey] = { nodes: [], links: [] };
        }

        const toGraphNode = (n: ApiNode): GraphNode => ({
          id: n.id,
          label: n.label || 'Tanpa Label',
          dimension: { width: 150, height: 70 },
          data: {
            actor: n.actor || '',
            description: n.description || '',
            reference: n.reference || '',
            duration: String(n.duration) || '0',
            category: n.category || 'process',
            template: 'custom' 
          }
        });

        // Tambahkan node jika belum ada
        const existsSource = grouped[groupKey].nodes.some(n => n.id === source.id);
        const existsTarget = grouped[groupKey].nodes.some(n => n.id === target.id);

        if (!existsSource) grouped[groupKey].nodes.push(toGraphNode(source));
        if (!existsTarget) grouped[groupKey].nodes.push(toGraphNode(target));

        // Tambahkan link
        grouped[groupKey].links.push({
          id: 'link-' + link.id.replace(/[^a-zA-Z0-9_-]/g, '_'),
          source: source.id,
          target: target.id,
          label: link.label || ''
        });
      }

      // Simpan ke multipleGraphs
      this.multipleGraphs = Object.entries(grouped).map(([title, data]) => ({
        title,
        nodes: data.nodes,
        links: data.links
      }));

      this.cdr.detectChanges();
    });
  }



  onNodeClick(node: any): void {
    if (!node || !node.label) return;

    this.dialog.open(ProcessInfoDialogComponent, {
      data: {
        label: node.label,
        actor: node.data.actor,
        description: node.data.description,
        reference: node.data.reference,
        duration: node.data.duration
      }
    });
  }

  wrapText(text: string, maxLength: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length <= maxLength) {
        currentLine += word + ' ';
      } else {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      }
    }
    if (currentLine) lines.push(currentLine.trim());

    return lines;
  }

}
