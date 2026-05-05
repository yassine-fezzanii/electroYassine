import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/models';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css'
})
export class CategoryManagementComponent implements OnInit {
  private categoryService = inject(CategoryService);
  
  categories: Category[] = [];
  editingCategory: Partial<Category> | null = null;
  newCategory: Partial<Category> = { name: '', description: '', icon: '' };

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);
  }

  addCategory() {
    if (!this.newCategory.name) return;
    this.categoryService.createCategory(this.newCategory as Category).subscribe(() => {
      this.loadCategories();
      this.newCategory = { name: '', description: '', icon: '' };
    });
  }

  editCategory(cat: Category) {
    this.editingCategory = { ...cat };
  }

  updateCategory() {
    if (!this.editingCategory || !this.editingCategory.id) return;
    this.categoryService.updateCategory(this.editingCategory.id, this.editingCategory as Category).subscribe(() => {
      this.loadCategories();
      this.editingCategory = null;
    });
  }

  deleteCategory(id: number) {
    if (confirm('Supprimer cette catégorie ? Cela peut affecter les produits liés.')) {
      this.categoryService.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }

  cancelEdit() {
    this.editingCategory = null;
  }
}
