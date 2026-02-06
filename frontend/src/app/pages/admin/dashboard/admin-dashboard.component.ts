import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { AdminDashboardService } from '../../../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-dashboard.component.html',
   styleUrl: './dashboard.css',
})
export class AdminDashboardComponent {
  private service = inject(AdminDashboardService);

  // KPI Signals
  totalTowers = signal(0);
  totalUnits = signal(0);
  occupiedUnits = signal(0);
  vacantUnits = signal(0);
  occupancyPercent = signal(0);

  // Pie Chart
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Occupied', 'Vacant'],
    datasets: [{ data: [0, 0] }],
    // maintainAspectRation:false
  };

  // Bar Chart
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Occupancy %',
        data: []
      }
    ]
  };

//   pieChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false
// };

// barChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false
// };

pieChartOptions: ChartConfiguration<'pie'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};

barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100
    }
  }
};



  ngOnInit() {
    this.loadKPIs();
    this.loadCharts();
  }

  loadKPIs() {
    this.service.getOverallOccupancy().subscribe(res => {
      this.totalUnits.set(res.total_units);
      this.occupiedUnits.set(res.occupied_units);
      this.vacantUnits.set(res.vacant_units);
      this.occupancyPercent.set(res.overall_occupancy_percentage);

      // ✅ immutable update
      this.pieChartData = {
        labels: ['Occupied', 'Vacant'],
        datasets: [
          {
            data: [
              res.occupied_units,
              res.vacant_units
            ]
          }
        ]
      };
    });

    this.service.getTowers().subscribe(t =>
      this.totalTowers.set(t.length)
    );
  }

  loadCharts() {
    this.service.getTowerOccupancy().subscribe(res => {
      this.barChartData = {
        labels: res.towers.map((t: any) => t.tower_name),
        datasets: [
          {
            label: 'Occupancy %',
            data: res.towers.map((t: any) => t.occupancy_percentage)
          }
        ]
      };
    });
  }
}
