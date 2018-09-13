import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { HotkeysService } from './hotkeys.service';
import { Hotkey } from './hotkey.model';
import * as _ from "lodash";

@Component({
  selector: 'hotkeys-cheatsheet',
  styles: [`
  .cfp-hotkeys-container {
      display: table !important;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      color: #333;
      font-size: 1em;
      background-color: rgba(255, 255, 255, 0.9);
    }
    
    .cfp-hotkeys-container.fade {
      z-index: -1024;
      visibility: hidden;
      opacity: 0;
      -webkit-transition: opacity 0.15s linear;
      -moz-transition: opacity 0.15s linear;
      -o-transition: opacity 0.15s linear;
      transition: opacity 0.15s linear;
    }
    
    .cfp-hotkeys-container.fade.in {
      z-index: 10002;
      visibility: visible;
      opacity: 1;
    }
    
    .cfp-hotkeys-title {
      font-weight: bold;
      text-align: center;
      font-size: 1.2em;
    }
    
    .cfp-hotkeys {
      width: 100%;
      height: 100%;
      display: table-cell;
      vertical-align: inherit;
      font-size: .8em;
    }

    .cfp-content {
      display: table-cell;
      vertical-align: middle;
    }
    
    .cfp-hotkeys-keys {
      padding: 5px;
    }
    
    .cfp-hotkeys-key {
      display: inline-block;
      color: #fff;
      background-color: #333;
      border: 1px solid #333;
      border-radius: 5px;
      text-align: center;
      margin-right: 5px;
      box-shadow: inset 0 1px 0 #666, 0 1px 0 #bbb;
      padding: 5px 9px;
      font-size: 1em;
    }
    
    .cfp-hotkeys-text {
      padding-left: 10px;
      font-size: 1em;
    }
    
    .cfp-hotkeys-close {
      position: fixed;
      top: 20px;
      right: 20px;
      font-size: 2em;
      font-weight: bold;
      padding: 5px 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      min-height: 45px;
      min-width: 45px;
      text-align: center;
    }
    
    .cfp-hotkeys-close:hover {
      background-color: #fff;
      cursor: pointer;
    }
    
    @media all and (max-width: 500px) {
      .cfp-hotkeys {
        font-size: 0.8em;
      }
    }
    
    @media all and (min-width: 750px) {
      .cfp-hotkeys {
        /** font-size: 1.2em;**/
      }

      .cfp-hotkeys .hotkey-container {
        height: calc(100vh - 100px);
        width: calc(100vw - 10px);
        display: flex;
        overflow-y: auto;
        flex-wrap: nowrap;
        flex-flow: column wrap;
      }

      .cfp-hotkeys .hotkey-container .hotkey-content {
        margin: 10px;
      }
    }`],
  template: `<div class="cfp-hotkeys-container fade" [ngClass]="{'in': helpVisible}" style="display:none">
  <div class="cfp-hotkeys">
      <h4 class="cfp-hotkeys-title">{{ title }}</h4>
      <div class="hotkey-container">
        <div *ngFor="let group of allHotkeys" class="hotkey-content">
          <div class="hotkey-group-title">
            <span style="font-weight:bold">
              {{ group.key }}
            </span>
          </div>
          <div *ngFor="let hotkey of group.value" class="cfp-hotkeys-keys">
            <span *ngFor="let key of hotkey.formatted" class="cfp-hotkeys-key">
              {{ key }}
            </span>

            <span class="hotkey-key-text">
              {{ hotkey.descriptionPair.helpText }}
            </span>
          </div>
        </div>
      </div>

      <div class="cfp-hotkeys-close" (click)="toggleCheatSheet()">&#215;</div>
  </div>
</div>`
})
export class CheatSheetComponent implements OnInit, OnDestroy {
  helpVisible = false;
  @Input() title = 'Keyboard Shortcuts:';
  subscription: Subscription;
  leftSide: Hotkey[];
  rightSide: Hotkey[];
  allHotkeys: Hotkey[];

  constructor(private hotkeysService: HotkeysService) {
  }

  public ngOnInit(): void {
    this.subscription = this.hotkeysService.cheatSheetToggle.subscribe((isOpen: boolean) => {
      if (isOpen !== false) {
        const hotkeyGroups = _.groupBy(this.hotkeysService.hotkeys, 'descriptionPair.areaName');
        const hotkeysArray = this.transform(hotkeyGroups);
        this.allHotkeys = hotkeysArray;
      }

      if (isOpen === false) {
        this.helpVisible = false;
      } else {
        this.toggleCheatSheet();
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public toggleCheatSheet(): void {
    this.helpVisible = !this.helpVisible;
  }

  public transform(value: any, args?: string[]): any {
    let arr = [];
    for (let key in value) {
      arr.push({ key: key, value: value[key] });
    }
    return arr;
  }
}
