import { Component, OnInit } from '@angular/core';
import { FinancialReport } from './dashboard-bpui.model';
import { BpuiReportService } from './dashboard-bpui.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import * as XLSX from 'xlsx';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dashboard-bpui',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule, MatCardModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './dashboard-bpui.component.html',
  styleUrls: ['./dashboard-bpui.component.css']
})
export class DashboardBpuiComponent implements OnInit {
  reports: FinancialReport[] = [];
  filteredReports: FinancialReport[] = [];

  availableYears: number[] = [];
  availableCompanies: { id: string; name: string }[] = [];

  selectedCompanyId = '';
  selectedYear = 0;

  netProfitChartData: any;

  rbcChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  rbcChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 700,
        title: {
          display: true,
          text: 'RBC (%)'
        }
      }
    }
  };

  netProfitChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const // 👈 penting agar tidak error
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nilai (dalam IDR)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tahun'
        }
      }
    }
  };

  financialRatioChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  financialRatioChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Persentase (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tahun'
        }
      }
    }
  };


  mmbrChartData: ChartData<'bar'> = {
  labels: [],
  datasets: []
};

mmbrChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Jumlah MMBR'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Tahun'
      }
    }
  }
};

profitComponentChartData: ChartData<'line'> = {
  labels: [],
  datasets: []
};

profitComponentChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Nilai (IDR)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Tahun'
      }
    }
  }
};


expenseChartData: ChartData<'line'> = {
  labels: [],
  datasets: []
};

expenseChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Persentase (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Tahun'
      }
    }
  }
};


premiumGrowthChartData: ChartData<'line'> = {
  labels: [],
  datasets: []
};

premiumGrowthChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Growth (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Tahun'
      }
    }
  }
};

liquiditySolvencyChartData: ChartData<'line'> = {
  labels: [],
  datasets: []
};

liquiditySolvencyChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Rasio (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Tahun'
      }
    }
  }
};


netProfitMarginChartData: ChartData<'line'> = {
  labels: [],
  datasets: []
};

netProfitMarginChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Net Profit Margin (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Tahun'
      }
    }
  }
};

  constructor(private bpuiReportService: BpuiReportService) { }

  ngOnInit(): void {
    this.bpuiReportService.getAllReports().subscribe(data => {
      this.reports = data;

      const uniqueCompaniesMap = new Map<string, string>();
      data.forEach(r => {
        if (!uniqueCompaniesMap.has(r.company.id)) {
          uniqueCompaniesMap.set(r.company.id, r.company.name);
        }
      });

      this.availableCompanies = Array.from(uniqueCompaniesMap.entries()).map(([id, name]) => ({ id, name }));
      this.availableYears = [...new Set(data.map(r => r.year))].sort();

      this.selectedCompanyId = this.availableCompanies[0]?.id || '';
      this.selectedYear = this.availableYears[this.availableYears.length - 1];

      this.filterReports();
    });
  }

  filterReports(): void {
    this.filteredReports = this.reports.filter(r =>
      (this.selectedCompanyId === '' || r.company.id === this.selectedCompanyId) &&
      (this.selectedYear === 0 || r.year === this.selectedYear)
    );

    this.prepareLineChart();
    this.prepareRbcChart();
    this.prepareFinancialRatioChart();
    this.prepareMmbrChart();
    this.prepareProfitComponentChart();
    this.prepareExpenseChart();
    this.preparePremiumGrowthChart();
    this.prepareLiquiditySolvencyChart();
    this.prepareNetProfitMarginChart();
  }

  onFilterChange(): void {
    this.filterReports();
  }

  getTotalNetProfit(): number {
    return this.filteredReports.reduce((acc, r) => acc + (r.netProfit || 0), 0);
  }

  getAverage(field: keyof FinancialReport): number {
    const valid = this.filteredReports.filter(r => typeof r[field] === 'number');
    const total = valid.reduce((acc, r) => acc + (r[field] as number), 0);
    return valid.length > 0 ? total / valid.length : 0;
  }

  prepareLineChart(): void {
    const data = this.reports
      .filter(r => r.company.id === this.selectedCompanyId)
      .sort((a, b) => a.year - b.year);

    this.netProfitChartData = {
      labels: data.map(r => r.year.toString()),
      datasets: [
        {
          label: 'Net Profit',
          data: data.map(r => r.netProfit),
          borderColor: 'green',
          backgroundColor: 'rgba(0,128,0,0.3)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Claims Expense',
          data: data.map(r => r.claimsExpense),
          borderColor: 'red',
          backgroundColor: 'rgba(255,0,0,0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Net Premium',
          data: data.map(r => r.netPremium),
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.20)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Total Assets',
          data: data.map(r => r.totalAssets),
          borderColor: 'orange',
          backgroundColor: 'rgba(255,165,0,0.20)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }


  prepareRbcChart() {
    const companyReports = this.reports
      .filter(r => r.company.id === this.selectedCompanyId)
      .sort((a, b) => a.year - b.year);

    const labels = companyReports.map(r => r.year.toString());
    const data = companyReports.map(r => r.rbc ?? 0);  // Gunakan 0 jika null/undefined

    this.rbcChartData = {
      labels,
      datasets: [
        {
          label: 'RBC (%)',
          data,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Threshold (120%)',
          data: new Array(data.length).fill(120),
          borderColor: 'red',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        }
      ]
    };
  }

  prepareFinancialRatioChart(): void {
    const companyReports = this.reports
      .filter(r => r.company.id === this.selectedCompanyId)
      .sort((a, b) => a.year - b.year);

    const labels = companyReports.map(r => r.year.toString());
    const roa = companyReports.map(r => r.roa ?? 0);
    const roe = companyReports.map(r => r.roe ?? 0);
    const solvency = companyReports.map(r => r.solvencyRatio ?? 0);

    this.financialRatioChartData = {
      labels,
      datasets: [
        {
          label: 'ROA (%)',
          data: roa,
          borderColor: '#42a5f5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: false,
          tension: 0.3
        },
        {
          label: 'ROE (%)',
          data: roe,
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.2)',
          fill: false,
          tension: 0.3
        },
        {
          label: 'Solvency Ratio (%)',
          data: solvency,
          borderColor: '#ef5350',
          backgroundColor: 'rgba(239, 83, 80, 0.2)',
          fill: false,
          tension: 0.3
        }
      ]
    };
  }

  prepareMmbrChart(): void {
  const companyReports = this.reports
    .filter(r => r.company.id === this.selectedCompanyId)
    .sort((a, b) => a.year - b.year);

  const labels = companyReports.map(r => r.year.toString());
  const data = companyReports.map(r => r.mmbr ?? 0);

  this.mmbrChartData = {
    labels,
    datasets: [
      {
        label: 'MMBR',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
}

prepareProfitComponentChart() {
  const companyReports = this.reports
    .filter(r => r.company.id === this.selectedCompanyId)
    .sort((a, b) => a.year - b.year);

  const labels = companyReports.map(r => r.year.toString());

  this.profitComponentChartData = {
    labels,
    datasets: [
      {
        label: 'Net Profit',
        data: companyReports.map(r => r.netProfit ?? 0),
        borderColor: 'green',
        backgroundColor: 'rgba(0,128,0,0.2)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Underwriting Income',
        data: companyReports.map(r => r.underwritingIncome ?? 0),
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.2)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Investment Income',
        data: companyReports.map(r => r.investmentIncome ?? 0),
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.2)',
        fill: false,
        tension: 0.3
      }
    ]
  };
}

prepareExpenseChart() {
  const companyReports = this.reports
    .filter(r => r.company.id === this.selectedCompanyId)
    .sort((a, b) => a.year - b.year);

  const labels = companyReports.map(r => r.year.toString());

  this.expenseChartData = {
    labels,
    datasets: [
      {
        label: 'Expense Ratio',
        data: companyReports.map(r => r.expenseRatio ?? 0),
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.2)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Operational Cost Ratio',
        data: companyReports.map(r => r.operationalCostRatio ?? 0),
        borderColor: 'purple',
        backgroundColor: 'rgba(128,0,128,0.2)',
        fill: false,
        tension: 0.3
      }
    ]
  };
}

preparePremiumGrowthChart() {
  const companyReports = this.reports
    .filter(r => r.company.id === this.selectedCompanyId)
    .sort((a, b) => a.year - b.year);

  const labels = companyReports.map(r => r.year.toString());
  const data = companyReports.map(r => r.premiumGrowth ?? 0);

  this.premiumGrowthChartData = {
    labels,
    datasets: [
      {
        label: 'Premium Growth (%)',
        data,
        borderColor: 'teal',
        backgroundColor: 'rgba(0,128,128,0.3)',
        fill: false,
        tension: 0.3
      }
    ]
  };
}

prepareLiquiditySolvencyChart() {
  const companyReports = this.reports
    .filter(r => r.company.id === this.selectedCompanyId)
    .sort((a, b) => a.year - b.year);

  const labels = companyReports.map(r => r.year.toString());

  const liquidityData = companyReports.map(r => r.liquidityRatio ?? 0);
  const solvencyData = companyReports.map(r => r.solvencyRatio ?? 0);

  this.liquiditySolvencyChartData = {
    labels,
    datasets: [
      {
        label: 'Liquidity Ratio (%)',
        data: liquidityData,
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.2)',
        fill: false,
        tension: 0.3
      },
      {
        label: 'Solvency Ratio (%)',
        data: solvencyData,
        borderColor: 'purple',
        backgroundColor: 'rgba(128,0,128,0.2)',
        fill: false,
        tension: 0.3
      }
    ]
  };
}

prepareNetProfitMarginChart() {
  const companyReports = this.reports
    .filter(r => r.company.id === this.selectedCompanyId)
    .sort((a, b) => a.year - b.year);

  const labels = companyReports.map(r => r.year.toString());
  const marginData = companyReports.map(r => r.netProfitMargin ?? 0);

  this.netProfitMarginChartData = {
    labels,
    datasets: [
      {
        label: 'Net Profit Margin (%)',
        data: marginData,
        borderColor: 'green',
        backgroundColor: 'rgba(0,128,0,0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  };
}



  getAverageFromReports(reports: FinancialReport[], key: keyof FinancialReport): number {
    const values = reports
      .map(r => {
        const val = r[key];
        return typeof val === 'number' ? val : NaN;
      })
      .filter(val => !isNaN(val));

    const sum = values.reduce((a, b) => a + b, 0);
    return values.length ? sum / values.length : 0;
  }

  groupReportsByYear(reports: FinancialReport[]): { [year: string]: FinancialReport[] } {
    return reports.reduce((acc, report) => {
      const year = report.year.toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(report);
      return acc;
    }, {} as { [year: string]: FinancialReport[] });
  }


}
