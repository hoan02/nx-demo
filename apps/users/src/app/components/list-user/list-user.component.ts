import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { DialogConfirmComponent, IUser, IUserRole } from '@libs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './list-user.component.html',
})
export class ListUserComponent implements OnInit, AfterViewInit {
  userList = new MatTableDataSource<IUser>([]);
  displayedColumns: string[] = [
    'position',
    'name',
    'email',
    'fullName',
    'role',
    'actions',
  ];
  roles: string[] = Object.values(IUserRole);
  selectedRole = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.userList.paginator = this.paginator;
    this.userList.sort = this.sort;
  }

  getPosition(index: number): number {
    return index + 1 + this.paginator.pageIndex * this.paginator.pageSize;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.userList.data = data;
      },
      error: (err) => console.error('Error loading users', err),
    });
  }

  applyFilter(): void {
    this.userList.filter = this.selectedRole.trim().toLowerCase();
  }

  onAddUser(): void {
    this.router.navigate(['add'], { relativeTo: this.activatedRoute });
  }

  onViewUser(id?: string): void {
    if (id) {
      this.router.navigate([id], { relativeTo: this.activatedRoute });
    }
  }

  openDialog() {
    this.dialog.open(DialogConfirmComponent, {
      data: {
        animal: 'panda',
      },
    });
  }

  onDeleteUser(id?: string): void {
    if (id) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          message: 'Are you sure you want to delete this user?',
          lableButton: 'Delete',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'confirm') {
          // Nếu người dùng xác nhận xóa
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
      });
    }
  }
}
