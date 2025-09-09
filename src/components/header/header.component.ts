// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { Subject, takeUntil, filter } from "rxjs";
import { ThemeService } from "../../app/core/services/theme.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  pageTitle = "Dashboard";
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService, private router: Router) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark) => {
        this.isDarkMode = isDark;
      });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle(event.url);
      });
    this.updatePageTitle(this.router.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  navigateToHome(): void {
    this.router.navigate(["/dashboard"]);
  }

  private updatePageTitle(url: string): void {
    if (url.includes("/employees/add")) {
      this.pageTitle = "Add Employee";
    } else if (url.includes("/employees/edit")) {
      this.pageTitle = "Edit Employee";
    } else {
      this.pageTitle = "Dashboard";
    }
  }
}
