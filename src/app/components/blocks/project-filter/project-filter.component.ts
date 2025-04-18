import { Component, Input, Output, EventEmitter, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { Project } from '../../../interfaces/project';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-filter.component.html',
})
export class ProjectFilterComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTextInput']) {
      this.applyFilters();
    }
  }
  
  @Input() set projects(value: Project[]) {
    this.allProjects = value;
    this.applyFilters(); // ya extrae los tags correctos
  }

  @Input() searchTextInput: string = '';
  @Output() filtered = new EventEmitter<Project[]>();

  selectedTags = signal<string[]>([]);
  tagCounts = signal<{ [tag: string]: number }>({});

  private allProjects: Project[] = [];


  showTags = signal(false);


  statusFilterEnabled = signal(true); // "Cualquier estado" por defecto
  allStatuses = ['completed', 'in_progress', 'testing', 'paused', 'undefined'];
  activeStatuses = signal<string[]>(['in_progress', 'testing', 'completed', 'paused']);
  statusLabels: { [key: string]: string } = {
    undefined: 'Indefinido',
    in_progress: 'En progreso',
    testing: 'En pruebas',
    completed: 'Terminado',
    paused: 'Pausado',
  };
  
  toggleStatusFilterEnabled() {
    this.statusFilterEnabled.update(v => !v);
  
    // Reset states si se desactiva
    if (this.statusFilterEnabled()) {
      // vuelve a modo "cualquier estado"
      this.activeStatuses.set(['in_progress', 'testing', 'completed', 'paused']);
    }
  
    this.applyFilters();
  }
  
  toggleStatusFilter(status: string) {
    const current = this.activeStatuses();
    const isActive = current.includes(status);
  
    if (isActive && current.length === 1) return; // no permitir quitar el último
  
    if (isActive) {
      this.activeStatuses.set(current.filter(s => s !== status));
    } else {
      this.activeStatuses.set([...current, status]);
    }
  
    this.applyFilters();
  }
  

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

  onlyPublished = signal(false);

// Método para activar/desactivar
toggleOnlyPublished() {
  this.onlyPublished.update(v => !v);
  this.applyFilters(); // vuelve a aplicar filtros cuando cambia
}

  clearFilters() {
    this.selectedTags.set([]);
    this.applyFilters();
  }

  applyFilters() {
    
    const search = this.searchTextInput.toLowerCase();
    const selected = this.selectedTags();
    const showOnlyPublished = this.onlyPublished();
    const useStatusFilter = !this.statusFilterEnabled(); // solo si el switch está desactivado
    const activeStatuses = this.activeStatuses();

    const filtered = this.allProjects.filter(project => {
      const nameMatch = project.name?.toLowerCase().includes(search);
      const descriptionMatch = project.description?.toLowerCase().includes(search);
      const aboutMatch = project.about_project?.toLowerCase().includes(search);
      const topicsMatch = project.topics?.some(topic =>
        topic.toLowerCase().includes(search)
      );
  
      const matchesSearch = !search || nameMatch || descriptionMatch || aboutMatch || topicsMatch;
  
      const matchesTags = selected.length === 0 || (
        project.topics && selected.every(tag => project.topics?.includes(tag))
      );
  
      const matchesPublished = !showOnlyPublished || !!project.homepage_url;
  
      const matchesStatus = !useStatusFilter || (
        project.status && activeStatuses.includes(project.status)
      );

      return matchesSearch && matchesTags && matchesPublished && matchesStatus;
    });
  
    this.filtered.emit(filtered);
    this.updateTagCounts(filtered);
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
