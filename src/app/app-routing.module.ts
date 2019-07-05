import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { RootComponent } from './root/root.component'
import { AdminComponent } from './admin/admin.component'
import { AdminLoginComponent } from './admin/admin-login/admin-login.component'
import { CatalogComponent } from './catalog/catalog.component'
import { ProductPageComponent } from './product-page/product-page.component';

const routes: Routes = [
    { path: '', component: RootComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'admin/login', component: AdminLoginComponent },

    { path: 'Producto/:productURL', component: ProductPageComponent },
    
    { path: 'Catalogo/Pagina/:page', component: CatalogComponent },
    { path: ':section/Marcas/:brand/Pagina/:page', component: CatalogComponent },
    { path: ':section/:category/Marcas/:brand/Pagina/:page', component: CatalogComponent },
    { path: ':section/:category/:subcategory/Marcas/:brand/Pagina/:page', component: CatalogComponent },
    { path: ':section/Pagina/:page', component: CatalogComponent },
    { path: ':section/:category/Pagina/:page', component: CatalogComponent },
    { path: ':section/:category/:subcategory/Pagina/:page', component: CatalogComponent },
    { path: 'Marcas/:brand/Pagina/:page', component: CatalogComponent },

    { path: 'Marcas/:brand', component: CatalogComponent },
    { path: 'Catalogo', component: CatalogComponent },
    { path: ':section/Marcas/:brand', component: CatalogComponent },
    { path: ':section/:category/Marcas/:brand', component: CatalogComponent },
    { path: ':section/:category/:subcategory/Marcas/:brand', component: CatalogComponent },
    { path: ':section', component: CatalogComponent },
    { path: ':section/:category', component: CatalogComponent },
    { path: ':section/:category/:subcategory', component: CatalogComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
