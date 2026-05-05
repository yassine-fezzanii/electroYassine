import { Component, inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product, Order } from '../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('ordersChart') ordersChartCanvas!: ElementRef;
  @ViewChild('stockChart') stockChartCanvas!: ElementRef;
  private pieChart: any;
  private barChart: any;
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  products: Product[] = [];
  orders: Order[] = [];

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Chart will be initialized after data is loaded
  }

  loadData() {
    forkJoin({
      products: this.productService.getProducts(),
      orders: this.orderService.getOrders()
    }).subscribe(({ products, orders }) => {
      this.products = products;
      this.orders = orders;
      this.updateCharts();
    });
  }

  updateCharts() {
    this.initPieChart();
    this.initBarChart();
  }

  initPieChart() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const categoryData: { [key: string]: number } = {};
    console.log('Orders received for chart:', this.orders);
    this.orders.forEach(order => {
      const catName = order.product?.category?.name || 'Inconnu';
      console.log(`Order ID ${order.id} product: ${order.product?.name}, category: ${catName}`);
      // Counting number of orders as requested
      categoryData[catName] = (categoryData[catName] || 0) + 1;
    });

    const labels = Object.keys(categoryData);
    console.log('Category data for pie chart:', categoryData);
    const data = Object.values(categoryData);

    const ctx = this.ordersChartCanvas.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Articles par Catégorie',
          data: data,
          backgroundColor: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} articles (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  initBarChart() {
    if (this.barChart) {
      this.barChart.destroy();
    }

    const stockData: { [key: string]: number } = {};
    this.products.forEach(product => {
      const catName = product.category?.name || 'Inconnu';
      stockData[catName] = (stockData[catName] || 0) + product.stock;
    });

    const labels = Object.keys(stockData);
    const data = Object.values(stockData);

    const ctx = this.stockChartCanvas.nativeElement.getContext('2d');
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Stock total',
          data: data,
          backgroundColor: '#6366f1',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#94a3b8' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}
