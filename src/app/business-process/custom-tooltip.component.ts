import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-tooltip',
  standalone: true,
  template: `
    <div class="tooltip-box">
      <strong>{{ node?.label }}</strong><br />
      <em>Aktor:</em> {{ node?.data?.actor }}
    </div>
  `,
  styles: [`
    .tooltip-box {
      background-color: white;
      border: 1px solid #ccc;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 13px;
    }
  `]
})
export class CustomTooltipComponent {
  @Input() node: any;
}
