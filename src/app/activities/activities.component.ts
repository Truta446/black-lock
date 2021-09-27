import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivitiesService } from '../services/activities.service';
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

  constructor(private activitiesService: ActivitiesService) { }

  ngOnInit(): void {
    this.onContentReady = this.activitiesService.contentReady.subscribe(async (result: number) => {
      if (!!result) { return; }

      this.activities = await this.activitiesService.getActivities(true);

      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
  }

  async onLoadMore(): Promise<void> {
    try {
      this.loading = true;

      const activities = await this.activitiesService.getActivities(false);

      activities.forEach(activity => {
        this.activities.push(activity);
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
