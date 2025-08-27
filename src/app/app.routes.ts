import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SharedCartViewComponent } from './pages/shared-cartview/shared-cartview.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation-component.component';

export const routes: Routes = [
  { path: '', component: ProductsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:category', component: ProductsComponent }, // Route for category filtering
  { path: 'product-details/:id', component: ProductDetailsComponent }, // <--- ADD THIS ROUTE
  { path: 'shared-cart', component: SharedCartViewComponent }, // <--- New Route for shared cart
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: CheckoutComponent }, // Route for your checkout page
  { path: 'checkout', redirectTo: '/payment', pathMatch: 'full' }, // Optional: redirect from /checkout to /payment
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent }, // Route for order confirmation
  { path: '**', redirectTo: '' }  // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
