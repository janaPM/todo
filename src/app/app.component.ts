// app.component.ts
import { Component, OnInit } from '@angular/core';
// import { lastValueFrom } from 'rxjs';
import { GoogleApiService, UserInfo  } from './google-api.service';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { TodoSService } from './todo-s.service';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
// import { getAllTask} from './todo-s.service';

export interface Task {
  id: string;
  description: string;
  startDate: Date;
  targetDate: Date;
  iscompleted: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  tasks: Task[] = [];
  taskID: string= '';
  taskDescription: string = '';
  taskStartDate: Date;
  taskEndDate: Date;
  taskiscompleted: boolean = false;
  filterOption: string = 'all';
  mailSnippets: string[] = []
  userInfo?: UserInfo;
  router: any;
  editingTask: any;
  newTask: Task={
    id: '',
    description: '',
    startDate: new Date(),
    targetDate: new Date(),
    iscompleted: false
  
  }

  constructor(private readonly googleApi: GoogleApiService,
    private readonly todoService: TodoSService,
    private datePipe: DatePipe) {
    this.taskStartDate = new Date();
    this.taskEndDate = new Date();
    googleApi.userProfileSubject.subscribe( info => {
      this.userInfo = info
    })
    

  }
  ngOnInit(): void {
    this.getAllTask()
    
      
    if (!this.googleApi.isLoggedIn()) {
      // Redirect to login page if user is not authenticated
      this.router.navigateByUrl('/');
    }
  }
  getAllTask(){
    this.todoService.getAllTask()
      .subscribe({
        next: (task) => {
          this.tasks =task;
        }
      });

  }



  isLoggedIn(): boolean {
    return this.googleApi.isLoggedIn()
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.googleApi.signOut()
    this.router.navigate(['/']);
  }
  
  

  addTask() {
    const formattedStartDate = this.datePipe.transform(this.taskStartDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(this.taskEndDate, 'yyyy-MM-dd');

    const newTask: Task = {
      description: this.taskDescription,
      startDate: this.taskStartDate,
      targetDate: this.taskEndDate,
      iscompleted: false,
      id: ''
    };
    
    // this.taskDescription = '';
    // this.taskStartDate = new Date();
    // this.taskEndDate = new Date();
    this.todoService.addTask(newTask)
       .subscribe({
        next: (tasks) => {
          this.tasks.push(newTask);

        }
       })

  }
  // editTask() {
  //   const index = this.tasks.findIndex(task => task.id === this.editingTask.id);
    
  //   if (index !== -1) {
  //     // Update the task in the tasks array
  //     this.tasks[index] = { ...this.editingTask }; // Using spread operator to create a copy of the edited task
  //     console.log('Updated task:', this.editingTask);
  //     // After updating, you might want to reset the editingTask property or close the editing window/modal
  //     this.editingTask = null;
  //   } else {
  //     console.error('Task not found for editing!');
  //   }
  // }
  

  deleteTask(id: string): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.todoService.deleteTask(id)
      .subscribe({
        next: (Response) => {
          this.getAllTask();
        }
      }

      )
      
    }
  }
  confirmDeleteTask(id: string): void {
    const isConfirmed = confirm('Are you sure you want to delete this task?');

    if (isConfirmed) {
      this.deleteTask(id);
    }
  }
  //  

  isOverdue(task: Task): boolean {
    return task.targetDate < new Date() && !task.iscompleted;
  }

  filteredTasks(): Task[] {
    if (this.filterOption === 'completed') { 
      return this.tasks.filter(task => task.iscompleted);
    } else if (this.filterOption === 'pending') {
      return this.tasks.filter(task => !task.iscompleted);
    } else {
      return this.tasks;
    }
  }

  toggleTaskStatus(id: string, task: Task) {
    task.iscompleted = !task.iscompleted;
    
    this.todoService.updateTask(id, task)
      .subscribe({
        next: (response) => {
          // Refresh the list of tasks after updating
          this.getAllTask();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          // Handle the error appropriately, e.g., show a message to the user
        }
      });
  }
  // toggleTaskStatus(id: string, task: Task){
  //   task.completed = !task.completed;
    
  //   this.todoService.updateTodo(id,task)
  //   .subscribe({
  //     next: (response) => {
  //       this.getAllTask()

  //     }
  //   })
  // }

  async getEmails() {
    if (!this.userInfo) {
      return;
    }
  
  const userId = this.userInfo?.info.sub as string
  const messages = await lastValueFrom(this.googleApi.emails(userId))
  messages.messages.forEach( (element: any) => {
    const mail = lastValueFrom(this.googleApi.getMail(userId, element.id))
    mail.then( mail => {
      this.mailSnippets.push(mail.snippet)
    })
  });
}
  
}