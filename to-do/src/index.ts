(() => {
  enum NotificationPlataform {
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
  }

  enum viewMode {
    TODO = "TODO",
    REMINDER = "REMINDER",
  }
  const UUID = (): string => {
    return Math.random().toString(36).substring(7);
  };

  const DateUltils = {
    today(): Date {
      return new Date();
    },
    toMorrow(): Date {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
    formatDate(date: Date): string {
      return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    },
  };

  interface Task {
    id: string;
    dateCrated: Date;
    dateUpdated: Date;
    description: string;
    render(): string;
  }
  class Todo implements Task {
    id: string = UUID();
    dateCrated: Date = DateUltils.today();
    dateUpdated: Date = DateUltils.today();
    description: string = "";
    done: boolean = false;
    constructor(description: string) {
      this.description = description;
    }
    render(): string {
      return `
      ---> TODO <---
      description: ${this.description}
      done:${this.done}
      `;
    }
  }

  class Reminder implements Task {
    id: string = UUID();
    dateCrated: Date = DateUltils.today();
    dateUpdated: Date = DateUltils.today();
    description: string = "";

    date: Date = DateUltils.toMorrow();
    notifications: Array<NotificationPlataform> = [NotificationPlataform.EMAIL];
    render(): string {
      return `
      ---> Reminder <---
      description: ${this.description}
      date: ${DateUltils.formatDate(this.date)}
      plataform: ${this.notifications.join(",")}
      `;
    }
    constructor(
      description: string,
      date: Date,
      notifications: Array<NotificationPlataform>
    ) {
      this.description = description;
      this.date = date;
      this.notifications = notifications;
    }
  }

  const todo = new Todo("Todo criado com sucesso!");
  const reminder = new Reminder("Reminder criado", new Date(), [
    NotificationPlataform.EMAIL,
  ]);

  const taskView = {
    getTodo(form: HTMLFormElement): Todo {
      const todoDescription = form.todoDescription.value;
      form.reset();
      return new Todo(todoDescription);
    },
    getReminder(form: HTMLFormElement): Reminder {
      const reminderNotification = [
        form.notification.value as NotificationPlataform,
      ];
      const reminderDate = new Date();
      const reminderDescription = form.reminderDescription.value;
      form.reset();
      return new Reminder(
        reminderDescription,
        reminderDate,
        reminderNotification
      );
    },
    render(tasks: Array<Task>, mode: viewMode) {
      const taskList = document.getElementById("tasksList");
      while (taskList?.firstChild) {
        taskList.removeChild(taskList.firstChild);
      }
      tasks.forEach((task) => {
        const li = document.createElement("LI");
        const textNode = document.createTextNode(task.render());
        li.appendChild(textNode);
        taskList?.appendChild(li);
      });
      const todoSet = document.getElementById("todoSet");
      const reminderSet = document.getElementById("reminderSet");

      if (mode === viewMode.TODO) {
        todoSet?.setAttribute("style", "display: block");
        todoSet?.removeAttribute("disabled");
        reminderSet?.setAttribute("style", "display: none");
        reminderSet?.setAttribute("disabled", "true");
      } else {
        reminderSet?.setAttribute("style", "display:block");
        reminderSet?.removeAttribute("disabled");
        todoSet?.setAttribute("style", "display: none");
        todoSet?.setAttribute("disabled", "true");
      }
    },
  };
  const taskController = (view: typeof taskView) => {
    const tasks: Array<Task> = [];
    let mode: viewMode = viewMode.TODO;
    const handleToggleMode = () => {
      switch (mode as viewMode) {
        case viewMode.TODO:
          mode = viewMode.REMINDER;
          break;
        case viewMode.REMINDER:
          mode = viewMode.TODO;
          break;
      }
      view.render(tasks, mode);
    };
    const handleEvent = (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      switch (mode as viewMode) {
        case viewMode.TODO:
          tasks.push(view.getTodo(form));
          break;
        case viewMode.REMINDER:
          tasks.push(view.getReminder(form));
          break;
      }
      view.render(tasks, mode);
    };
    document
      .getElementById("toggleMode")
      ?.addEventListener("click", handleToggleMode);
    document
      .getElementById("taskForm")
      ?.addEventListener("submit", handleEvent);
  };
  taskController(taskView);
})();
