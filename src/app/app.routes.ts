import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductFormComponent } from './components/product-form/product-form';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { CategoryManagementComponent } from './components/category-management/category-management';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const adminGuard = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAdmin()) return true;
    router.navigate(['/login']);
    return false;
};

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/new', component: ProductFormComponent, canActivate: [adminGuard] },
    { path: 'products/edit/:id', component: ProductFormComponent, canActivate: [adminGuard] },
    { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'admin/categories', component: CategoryManagementComponent, canActivate: [adminGuard] },
    { path: 'admin', redirectTo: 'admin/dashboard' },
    { path: '**', redirectTo: '' }
];
