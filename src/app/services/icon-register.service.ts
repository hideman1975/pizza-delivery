import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root',
})
export class IconRegisterService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) { }

  public registerIcons = (namespace, path, icons) => icons.forEach(icon => 
    {
      const iconPath = this.sanitizer.bypassSecurityTrustResourceUrl( 'assets/images/' + (path ? path + '/' : '') + icon + '.svg');
      this.iconRegistry.addSvgIconInNamespace(namespace, icon, iconPath)
    }
    )
}
