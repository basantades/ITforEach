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
    this.applyFilters(); // ya extrae los tags correctos
  }


  @Output() filtered = new EventEmitter<Project[]>();

  searchText = signal('');
  selectedTags = signal<string[]>([]);
  tagCounts = signal<{ [tag: string]: number }>({});

  private allProjects: Project[] = [];


  showTags = signal(false);

  toggleTags() {
    this.showTags.update((v) => !v);
  }

  topTags = computed(() => {
    const tags = Object.entries(this.tagCounts()).sort((a, b) => b[1] - a[1]);
    return tags.slice(0, 40).map(([tag]) => tag); 
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
    const current = this.selectedTags();
    if (current.includes(tag)) {
      this.selectedTags.set(current.filter(t => t !== tag));
    } else {
      this.selectedTags.set([...current, tag]);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.searchText.set('');
    this.selectedTags.set([]);
    this.applyFilters();
  }

  applyFilters() {
    const search = this.searchText().toLowerCase();
    const selected = this.selectedTags();
  
    const filtered = this.allProjects.filter(project => {
      // Buscar en name, description, about_project y topics
      const nameMatch = project.name?.toLowerCase().includes(search);
      const descriptionMatch = project.description?.toLowerCase().includes(search);
      const aboutMatch = project.about_project?.toLowerCase().includes(search);
      const topicsMatch = project.topics?.some(topic =>
        topic.toLowerCase().includes(search)
      );
  
      const matchesSearch = !search || nameMatch || descriptionMatch || aboutMatch || topicsMatch;
  
      // Filtrado acumulativo por etiquetas
      const matchesTags = selected.length === 0 || (
        project.topics && selected.every(tag => project.topics?.includes(tag))
      );
  
      return matchesSearch && matchesTags;
    });
  
    this.filtered.emit(filtered);
    this.updateTagCounts(filtered); // actualiza el recuento visible de etiquetas según los resultados actuales
  }
  updateTagCounts(projects: Project[]) {
    const counts: { [tag: string]: number } = {};
  
    projects.forEach(project => {
      project.topics?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
  
    this.tagCounts.set(counts);
  }


}
