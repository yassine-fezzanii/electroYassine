import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category, Product } from '../../models/models';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './product-form.html'
})
export class ProductFormComponent implements OnInit {
  protected productService = inject(ProductService);
  protected categoryService = inject(CategoryService);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);

  product: Product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    brand: '',
    categoryId: 1
  };
  
  categories: Category[] = [];
  isEdit = false;

  ngOnInit() {
    this.categoryService.getCategories().subscribe((cats: Category[]) => this.categories = cats);
    
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.productService.getProduct(id).subscribe((p: Product) => this.product = p);
    }
  }

  onSubmit() {
    console.log('Submitting product:', this.product);
    if (this.isEdit) {
      this.productService.updateProduct(this.product.id!, this.product).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error updating product:', err);
          alert('Erreur lors de la modification du produit');
        }
      });
    } else {
      // Ensure ID is not sent for new products
      const newProduct = { ...this.product };
      delete newProduct.id;
      delete (newProduct as any).category;
      
      console.log('Creating new product with payload:', newProduct);
      this.productService.createProduct(newProduct).subscribe({
        next: (resp) => {
          console.log('Product created successfully:', resp);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error creating product:', err);
          alert('Erreur lors de la création du produit. ' + (err.error?.message || 'Vérifiez que tous les champs sont valides.'));
        }
      });
    }
  }
}
