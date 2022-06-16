import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket, User } from '@acme/shared-models';

@Injectable()
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  users() {
    return this.httpClient.get<User[]>('/api/users');
  }

  user(id: number) {
    return this.httpClient.get<User>(`/api/users/${id}`);
  }


}
