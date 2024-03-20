import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppComponent, Task } from './app.component';
// import { Observable } from 'rxjs/internal/Observable';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoSService {
  // addTask(newTask: any) {
  //   throw new Error('Method not implemented.');
  // }
  baseApiUrl: string = "https://localhost:7017/";

  constructor(private http:HttpClient) { }
  getAllTask(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseApiUrl + 'api/todo');
  }
  addTask(newTask: Task): Observable<Task>{
    newTask.id='00000000-0000-0000-0000-000000000000';
    return this.http.post<Task>(this.baseApiUrl + 'api/todo', newTask)
  }
  updateTask(id: string, task: Task): Observable<Task>{
    return this.http.put<Task>(this.baseApiUrl + 'api/todo/' + id, task);
  }
  deleteTask(id: string): Observable<Task>{
    return this.http.delete<Task>(this.baseApiUrl + 'api/todo/' + id );
  }

}

