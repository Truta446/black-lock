import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivitiesService } from './activities.service'
import { Activity } from '../interfaces/activity';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  loading = true;
  activities: Activity[] = [];
  onContentReady?: Subscription;

  @Input() title: string = '';

  constructor(private activitiesService: ActivitiesService) { }

  ngOnInit() {
    this.onContentReady = this.activitiesService.contentReady.subscribe(async () => {
      this.activities = await this.activitiesService.getActivities();

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
  }

  async onLoadMore() {
    try {
      this.loading = true;

      this.activities = await this.activitiesService.getActivities();
    } catch (err) {
      console.log(err);
    } finally {
      this.loading = false;
    }
  }
}
