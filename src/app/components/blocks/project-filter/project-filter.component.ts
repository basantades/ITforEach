import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-filter.component.html',
})
export class ProjectFilterComponent {
  @Input() set projects(value: Project[]) {
    this.allProjects = value;
    this.extractTags();
  }

  @Output() filtered = new EventEmitter<Project[]>();

  searchText = signal('');
  selectedTag = signal<string | null>(null);
  tagCounts = signal<{ [tag: string]: number }>({});

  private allProjects: Project[] = [];

  topTags = computed(() => {
    const tags = Object.entries(this.tagCounts()).sort((a, b) => b[1] - a[1]);
    return tags.slice(0, 10).map(([tag]) => tag); // Limita a 10
  });

  extractTags() {
    const counts: { [tag: string]: number } = {};

    this.allProjects.forEach(project => {
      project.topics?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    this.tagCounts.set(counts);
    this.applyFilters();
  }

  selectTag(tag: string) {
    this.selectedTag.set(this.selectedTag() === tag ? null : tag);
    this.applyFilters();
  }

  clearFilters() {
    this.searchText.set('');
    this.selectedTag.set(null);
    this.applyFilters();
  }

  applyFilters() {
    const search = this.searchText().toLowerCase();
    const tag = this.selectedTag();

    const filtered = this.allProjects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(search);
      const matchesTag = tag ? project.topics?.includes(tag) : true;
      return matchesSearch && matchesTag;
    });

    this.filtered.emit(filtered);
  }
}
