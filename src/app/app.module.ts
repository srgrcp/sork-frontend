import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { RootComponent } from './root/root.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { HttpClientModule } from '@angular/common/http';
//import { ProductComponent } from './admin/product/product.component';
import { ProductListComponent } from './admin/product-list/product-list.component';
import { AlertComponent } from './alert/alert.component';
import { AdminProductFormComponent } from './admin/admin-product-form/admin-product-form.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminSubcategoryComponent } from './admin/admin-subcategory/admin-subcategory.component';
import { AdminBrandComponent } from './admin/admin-brand/admin-brand.component';
import { ProductTileComponent } from './product-tile/product-tile.component';
import { CatalogComponent } from './catalog/catalog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RootComponent,
    AdminComponent,
    AdminLoginComponent,
    //ProductComponent,
    ProductListComponent,
    AlertComponent,
    AdminProductFormComponent,
    AdminCategoryComponent,
    AdminSubcategoryComponent,
    AdminBrandComponent,
    ProductTileComponent,
    CatalogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
