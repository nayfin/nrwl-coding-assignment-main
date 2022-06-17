import { User } from '@acme/shared-models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  constructor(private httpClient: HttpClient) {}

  users() {
    return this.httpClient.get<User[]>('/api/users');
  }

  user(id: number) {
    return this.httpClient.get<User>(`/api/users/${id}`);
  }
}
