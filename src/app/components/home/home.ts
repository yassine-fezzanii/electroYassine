import { Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Category, Product } from '../../models/models';
import { NgFor, NgIf, CurrencyPipe, SlicePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, SlicePipe, RouterLink, FormsModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  authService = inject(AuthService);

  categories: Category[] = [];
  products: Product[] = [];
  quantities: { [key: number]: number } = {};

  ngOnInit() {
    this.categoryService.getCategories().subscribe((cats: Category[]) => this.categories = cats);
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((prods: Product[]) => this.products = prods);
  }

  get totalStock() {
    return this.products.reduce((acc: number, p: Product) => acc + p.stock, 0);
  }

  get avgPrice() {
    return this.products.length ? this.products.reduce((acc, p) => acc + p.price, 0) / this.products.length : 0;
  }

  orderProduct(product: Product) {
    const qty = this.quantities[product.id!] || 1;
    const userId = this.authService.currentUser()?.id;

    if (!userId) {
      alert('Veuillez vous connecter pour commander.');
      return;
    }

    if (qty > product.stock) {
      alert('Stock insuffisant.');
      return;
    }

    this.orderService.createOrder({
      productId: product.id!,
      userId: userId,
      quantity: qty
    }).subscribe({
      next: () => {
        alert('Commande validée !');
        this.loadProducts(); // Refresh stock
      },
      error: (err) => alert(err.error || 'Erreur lors de la commande')
    });
  }
}
