import { Component, OnInit } from '@angular/core';
import { InsuranceOverview } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrderModule } from 'ngx-order-pipe';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, SidebarComponent, OrderModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  file: File | null = null;
  periode: string = '';
  createdBy: string = '';
  overviewData: InsuranceOverview[] = [];
  message = '';
  error = '';
  loading = false;
  groupedData: any[] = [];
  collapsed: boolean = false;
  order: string = 'komponen';
  reverse: boolean = false; 

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    console.log(this.groupedData); 
    this.periode = '';
    this.fetchOverview();
    this.fetchTrendData();
  }

  setOrder(value: string): void {
  if (this.order === value) {
    this.reverse = !this.reverse;
  } else {
    this.order = value;
    this.reverse = false;
  }
}

getSortIcon(field: string): string {
  if (this.order !== field) return 'fa-solid fa-sort'; // default icon
  return this.reverse ? 'fa-solid fa-sort-down' : 'fa-solid fa-sort-up';
}


  private getCurrentPeriode(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}-01`;
  }

  onFileChange(event: any): void {
    this.file = event.target.files[0] || null;
  }

  upload(): void {
    if (!this.file || !this.periode || !this.createdBy) return;
    this.dashboardService.uploadOverview(this.file, this.periode, this.createdBy).subscribe({
      next: (res) => {
        this.message = res;
        this.error = '';
        this.fetchOverview();
      },
      error: (err) => {
        this.error = err.error || 'Upload gagal';
        this.message = '';
        console.error(err);
      }
    });
  }

  fetchOverview(): void {
    this.loading = true;
    const periodeParam = this.periode?.trim() ? this.periode : undefined;
    this.dashboardService.getOverviewByPeriode(periodeParam).subscribe(data => {
      const grouped = new Map();

      data.forEach(item => {
        const key = item.komponenAsuransi;
        if (!grouped.has(key)) {
          grouped.set(key, {
            komponen: key,
            jumlahIndustriKonv: null,
            jumlahIndustriSyariah: null,
            asetKonv: null,
            asetSyariah: null,
            liabilitasKonv: null,
            liabilitasSyariah: null,
            ekuitasKonv: null,
            ekuitasSyariah: null,
            pinjamanKonv: null,
            pinjamanSyariah: null,
            premiKonv: null,
            premiSyariah: null,
            klaimKonv: null,
            klaimSyariah: null,
            createdBy: item.createdBy
          });
        }

        const row = grouped.get(key);
        if (item.kategori === 'Konvensional') {
          row.jumlahIndustriKonv = item.jumlahIndustri;
          row.asetKonv = item.aset;
          row.liabilitasKonv = item.liabilitas;
          row.ekuitasKonv = item.ekuitas;
          row.pinjamanKonv = item.pinjamanSubordinasi;
          row.premiKonv = item.premi;
          row.klaimKonv = item.klaim;
        } else if (item.kategori === 'Syariah') {
          row.jumlahIndustriSyariah = item.jumlahIndustri;
          row.asetSyariah = item.aset;
          row.liabilitasSyariah = item.liabilitas;
          row.ekuitasSyariah = item.ekuitas;
          row.pinjamanSyariah = item.pinjamanSubordinasi;
          row.premiSyariah = item.premi;
          row.klaimSyariah = item.klaim;
        }
      });

      this.groupedData = Array.from(grouped.values());
      this.loading = false;

      // Bangun data chart untuk jumlah industri
      const labels: string[] = [];
      const dataKonv: number[] = [];
      const dataSyariah: number[] = [];

      this.groupedData.forEach(item => {
        labels.push(item.komponen);
        dataKonv.push(item.jumlahIndustriKonv || 0);
        dataSyariah.push(item.jumlahIndustriSyariah || 0);
      });

      this.chartJumlahIndustri = {
        labels,
        datasets: [
          {
            label: 'Konvensional',
            data: dataKonv
          },
          {
            label: 'Syariah',
            data: dataSyariah
          }
        ]
      };

      // Bangun data chart untuk aset vs liabilitas
      const asetKonv: number[] = [];
      const asetSyariah: number[] = [];
      const liabilitasKonv: number[] = [];
      const liabilitasSyariah: number[] = [];

      this.groupedData.forEach(item => {
        asetKonv.push(item.asetKonv || 0);
        asetSyariah.push(item.asetSyariah || 0);
        liabilitasKonv.push(item.liabilitasKonv || 0);
        liabilitasSyariah.push(item.liabilitasSyariah || 0);
      });

      this.chartAsetLiabilitas = {
        labels,
        datasets: [
          {
            label: 'Aset - Konvensional',
            data: asetKonv
          },
          {
            label: 'Aset - Syariah',
            data: asetSyariah
          },
          {
            label: 'Liabilitas - Konvensional',
            data: liabilitasKonv
          },
          {
            label: 'Liabilitas - Syariah',
            data: liabilitasSyariah
          }
        ]
      };

      // Bangun data chart untuk premi vs klaim
      const premiKonv: number[] = [];
      const premiSyariah: number[] = [];
      const klaimKonv: number[] = [];
      const klaimSyariah: number[] = [];

      this.groupedData.forEach(item => {
        premiKonv.push(item.premiKonv || 0);
        premiSyariah.push(item.premiSyariah || 0);
        klaimKonv.push(item.klaimKonv || 0);
        klaimSyariah.push(item.klaimSyariah || 0);
      });

      this.chartPremiKlaim = {
        labels,
        datasets: [
          {
            label: 'Premi - Konvensional',
            data: premiKonv
          },
          {
            label: 'Premi - Syariah',
            data: premiSyariah
          },
          {
            label: 'Klaim - Konvensional',
            data: klaimKonv
          },
          {
            label: 'Klaim - Syariah',
            data: klaimSyariah
          }
        ]
      };

      // Hitung total industri
      let totalKonv = 0;
      let totalSyariah = 0;

      this.groupedData.forEach(item => {
        totalKonv += item.jumlahIndustriKonv || 0;
        totalSyariah += item.jumlahIndustriSyariah || 0;
      });

      this.chartKomposisiKategori = {
        labels: ['Konvensional', 'Syariah'],
        datasets: [
          {
            label: 'Jumlah Industri',
            data: [totalKonv, totalSyariah]
          }
        ]
      };
    });
  }

  public chartJumlahIndustri: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  public chartJumlahIndustriOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Kategori Industri',
          font: { weight: 'bold' }
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          callback: function (val, index, ticks) {
            const label = this.getLabelForValue(val as number);
            if (typeof label === 'string') {
              return label.length > 25 ? label.match(/.{1,25}/g) : label;
            }
            return label;
          }
        }

      },
      y: {
        title: {
          display: true,
          text: 'Jumlah Industri',
          font: { weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Jumlah Industri per Kategori'
      },
      legend: {
        position: 'top'
      }
    }
  };


  public chartAsetLiabilitas: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  public chartAsetLiabilitasOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Kategori Industri',
          font: { weight: 'bold' }
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          callback: function (val, index, ticks) {
            const label = this.getLabelForValue(val as number);
            if (typeof label === 'string') {
              return label.length > 25 ? label.match(/.{1,25}/g) : label;
            }
            return label;
          }
        }

      },
      y: {
        title: {
          display: true,
          text: 'Nilai',
          font: { weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Aset vs Liabilitas per Kategori'
      },
      legend: {
        position: 'top'
      }
    }
  };

  public chartPremiKlaim: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  public chartPremiKlaimOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Kategori Industri',
          font: { weight: 'bold' }
        },
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 0,
          callback: function (val, index, ticks) {
            const label = this.getLabelForValue(val as number);
            if (typeof label === 'string') {
              return label.length > 25 ? label.match(/.{1,25}/g) : label;
            }
            return label;
          }
        }

      },
      y: {
        title: {
          display: true,
          text: 'Nilai',
          font: { weight: 'bold' }
        },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Premi vs Klaim per Kategori'
      },
      legend: {
        position: 'top'
      }
    }
  };

  public chartKomposisiKategori: ChartData<'pie'> = {
    labels: ['Konvensional', 'Syariah'],
    datasets: []
  };

  public chartKomposisiKategoriOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Komposisi Industri: Konvensional vs Syariah'
      },
      legend: {
        position: 'top'
      }
    }
  };


  public chartTrendPremiKlaim: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  public chartTrendOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Tren Premi dan Klaim per Bulan'
      },
      legend: {
        position: 'top'
      }
    }
  };

  fetchTrendData(): void {
    this.dashboardService.getOverviewTrend().subscribe(data => {
      const labels: string[] = [];
      const premiKonv: number[] = [];
      const klaimKonv: number[] = [];
      const premiSyariah: number[] = [];
      const klaimSyariah: number[] = [];

      // Grupkan data berdasarkan periode
      const grouped = new Map<string, any[]>();
      data.forEach(item => {
        if (!grouped.has(item.periode)) {
          grouped.set(item.periode, []);
        }
        grouped.get(item.periode)?.push(item);
      });

      // Urutkan berdasarkan periode
      const sortedPeriode = Array.from(grouped.keys()).sort();

      sortedPeriode.forEach(periode => {
        labels.push(periode);
        const rows = grouped.get(periode);

        let konv: any = null;
        let syariah: any = null;

        if (rows) {
          konv = rows.find((r: any) => r.kategori === 'Konvensional');
          syariah = rows.find((r: any) => r.kategori === 'Syariah');
        }

        premiKonv.push(konv?.premi || 0);
        klaimKonv.push(konv?.klaim || 0);
        premiSyariah.push(syariah?.premi || 0);
        klaimSyariah.push(syariah?.klaim || 0);
      });

      this.chartTrendPremiKlaim = {
        labels,
        datasets: [
          { label: 'Premi - Konvensional', data: premiKonv, fill: false, borderColor: 'blue', tension: 0.3 },
          { label: 'Klaim - Konvensional', data: klaimKonv, fill: false, borderColor: 'red', tension: 0.3 },
          { label: 'Premi - Syariah', data: premiSyariah, fill: false, borderColor: 'green', tension: 0.3 },
          { label: 'Klaim - Syariah', data: klaimSyariah, fill: false, borderColor: 'orange', tension: 0.3 }
        ]
      };
    });
  }



}
