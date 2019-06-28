import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { RootComponent } from './root/root.component'
import { AdminComponent } from './admin/admin.component'
import { AdminLoginComponent } from './admin/admin-login/admin-login.component'
import { CatalogComponent } from './catalog/catalog.component'

const routes: Routes = [
    { path: '', component: RootComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'admin/login', component: AdminLoginComponent },
    { path: 'Catalogo', component: CatalogComponent },
    { path: 'Catalogo/:category', component: CatalogComponent },
    { path: 'Catalogo/:category/:subcategory', component: CatalogComponent },
    { path: 'Marcas/:brand', component: CatalogComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
