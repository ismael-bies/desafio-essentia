export interface TodoProps {
  id?: number;
  userId: string;
  title: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date | null;
}

export class Todo {
  private props: TodoProps;

  constructor(props: TodoProps) {
    if (!props.title || props.title.trim() === '') {
      throw new Error('O título da tarefa não pode ser vazio!');
    }
    if (!props.userId) {
      throw new Error('A tarefa precisa estar vinculada a um usuário!');
    }

    this.props = {
      ...props,
      completed: props.completed ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date()
    };
  }

  get id(): number | undefined { 
    return this.props.id; 
  }
  
  get userId(): string { return this.props.userId; }
  get title(): string { return this.props.title; }
  get completed(): boolean { return this.props.completed; }
  get createdAt(): Date | undefined { return this.props.createdAt; }
  get updatedAt(): Date | undefined { return this.props.updatedAt; }
  get completedAt(): Date | null | undefined { return this.props.completedAt; }

  public updateTitle(newTitle: string): void {
    if (!newTitle || newTitle.trim() === '') {
      throw new Error('O novo título não pode ser vazio!');
    }
    this.props.title = newTitle;
    this.props.updatedAt = new Date();
  }

  public toggleStatus(): void {
    this.props.completed = !this.props.completed;
    this.props.updatedAt = new Date();

    this.props.completedAt = this.props.completed ? new Date() : null;
  }
}
