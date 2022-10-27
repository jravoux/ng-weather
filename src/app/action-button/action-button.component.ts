import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Observable, timer } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

const REINIT_TIME = 500;

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonComponent implements OnInit {
  @Input() public baseTemplate: TemplateRef<unknown>;
  @Input() public baseClass = '';
  @Input() public inProgressTemplate: TemplateRef<unknown>;
  @Input() public inProgressClass = '';
  @Input() public completeTemplate: TemplateRef<unknown>;
  @Input() public completeClass = '';
  @Input() public disabled = false;
  @Input() public action$!: Observable<void>;

  public currentTemplate: TemplateRef<unknown>;
  public currentClass = '';
  public isInProgress = false;

  private readonly reinitTimer = timer(REINIT_TIME);

  public ngOnInit() {
    this.switchToBaseTemplate();
  }

  public triggerAction() {
    this.switchToInProgressTemplate();
    this.action$
      .pipe(
        tap(() => this.switchToCompleteTemplate()),
        switchMap(() => this.reinitTimer),
        finalize(() => this.switchToBaseTemplate())
      )
      .subscribe();
  }

  private switchToInProgressTemplate() {
    this.currentTemplate = this.inProgressTemplate;
    this.currentClass = this.inProgressClass;
    this.isInProgress = true;
  }

  private switchToCompleteTemplate() {
    this.currentTemplate = this.completeTemplate;
    this.currentClass = this.completeClass;
  }

  private switchToBaseTemplate() {
    this.currentTemplate = this.baseTemplate;
    this.currentClass = this.baseClass;
    this.isInProgress = false;
  }
}
