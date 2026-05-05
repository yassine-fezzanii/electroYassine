import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/models';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [NgFor, NgIf, CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './product-list.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  authService = inject(AuthService);
  
  products: Product[] = [];
  quantities: { [key: number]: number } = {};

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((prods: Product[]) => this.products = prods);
  }

  deleteProduct(id: number | undefined) {
    if (!id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
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
