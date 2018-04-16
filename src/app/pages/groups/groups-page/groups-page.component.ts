import { Component, OnInit } from '@angular/core';
import { Tab } from '../../../data/local/tab';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {

  public tabs: Tab[];

  constructor(private _translateService: TranslateService,
              private _route: ActivatedRoute,
              private _router: Router) {
  }

  async ngOnInit() {
    this.tabs = [];
    const allTab = new Tab();
    allTab.name = await this._translateService.get('groups.all').toPromise();
    allTab.routerLink = 'all';
    this.tabs.push(allTab);

    const myTab = new Tab();
    myTab.name = await this._translateService.get('groups.my').toPromise();
    myTab.routerLink = 'my';
    this.tabs.push(myTab);
  }

  openNewGroupPage = async () => this._router.navigate(['new'], {relativeTo: this._route});

}
