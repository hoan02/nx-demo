import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@nx-demo/libs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list-user',
  imports: [CommonModule],
  templateUrl: './list-user.component.html',
})
export class ListUserComponent implements OnInit {
  users: IUser[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Error loading users', err),
    });
  }

  onAddUser(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onViewUser(id?: string): void {
    if (id) {
      this.router.navigate([id], { relativeTo: this.activatedRoute });
    }
  }

  onDeleteUser(id?: string): void {
    if (id && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.toastr.success('User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => {
          this.toastr.error('Error deleting user!', err.message);
        },
      });
    }
  }
}
