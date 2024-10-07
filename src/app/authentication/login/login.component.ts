import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { AdvanceTable } from "./login.model";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserManagementService } from "app/settings/user-management/user-management.service";
import { map, Observable } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  advanceTableForm!: UntypedFormGroup;
  advanceTable!: AdvanceTable;
  hide = true;
  showEmailInput = false;
  isEmail: boolean = false;
  confirmedEmail: string = "";

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    public advanceTableService: UserManagementService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.advanceTableForm = this.fb.group({
      emailid: [
        this.advanceTable?.emailid ?? "",
        [
          Validators.required,
          // this.minLengthWithCustomError(2),
          // this.maxLengthWithCustomError(50),
          // Validators.maxLength(50),
          // Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      password: [
        this.advanceTable?.password ?? "",
        [
          Validators.required,
          // Validators.pattern(
          //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
          // ),
        ],
      ],
    });
  }

  public toggleEmailField(): void {
    this.showEmailInput = true;
    if (!this.isEmail) {
      if (this.advanceTableForm.get("emailid")?.valid) {
        this.isEmail = true;
        this.confirmedEmail = this.advanceTableForm.get("emailid")?.value;
      } else {
        console.log("Email is not valid");
      }
    }
  }

  minLengthWithCustomError(minLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.length < minLength) {
        return {
          minlength: true,
          message: `Minimum ${minLength} characters`,
        };
      }
      return null;
    };
  }
  maxLengthWithCustomError(maxLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.length > maxLength) {
        return {
          maxlength: true,
        };
      }
      return null;
    };
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {}

  // public confirmLogIn(): void {
  //   const email = this.advanceTableForm.get("emailid")?.value;
  //   const password = this.advanceTableForm.get("password")?.value;

  //   if (email && password) {
  //     // Step 1: Authenticate the user
  //     this.authService.login(email, password).subscribe(
  //       (response) => {
  //         const token = response.access_token;
  //         localStorage.setItem("access_token", token);
  //         localStorage.setItem("emailid", email);
  //         this.authService.setEmail(email);

  //         // Step 2: Fetch the user's uname using their email from the users API
  //         this.getUserNameByEmail(email).subscribe(
  //           (user) => {
  //             const uname = user.uname;

  //             // Store uname in localStorage and AuthService
  //             localStorage.setItem("uname", uname);
  //             this.authService.setUserName(uname);

  //             // Navigate to the dashboard
  //             this.router.navigate(["/dashboard"]);
  //           },
  //           (error: HttpErrorResponse) => {
  //             console.log("Error fetching user data:", error);
  //           }
  //         );
  //       },
  //       (error: HttpErrorResponse) => {
  //         console.log("Login error:", error);
  //       }
  //     );
  //   }
  // }

  // Method to get the user's uname by email
  private getUserNameByEmail(email: string): Observable<any> {
    console.log(email);
    return this.http.get<any[]>(this.advanceTableService.API_URL).pipe(
      map((users) => {
        console.log(users);
        // Find the user with the matching emailid
        return users.find((user) => user.emailid === email);
      })
    );
  }
  public confirmLogIn(): void {
    const email = this.advanceTableForm.get("emailid")?.value;
    const password = this.advanceTableForm.get("password")?.value;
  
    if (email && password) {
      // Step 1: Authenticate the user
      this.authService.login(email, password).subscribe(
        (response) => {
          const token = response.access_token;
          localStorage.setItem("access_token", token);
          localStorage.setItem("emailid", email);
          this.authService.setEmail(email);
  
          // Step 2: Fetch the user's uname using their email from the users API
          this.getUserNameByEmail(email).subscribe(
            (user) => {
              const uname = user.uname;
  
              // Store uname in localStorage and AuthService
              localStorage.setItem("uname", uname);
              this.authService.setUserName(uname);
  
              // Show success message
              this._snackBar.open("Login successful!", "Close", {
                duration: 3000, // The message will disappear after 3 seconds
                panelClass: ['snackbar-success'] // Optional: Customize success style
              });
  
              // Navigate to the dashboard
              this.router.navigate(["/dashboard"]);
            },
            (error: HttpErrorResponse) => {
              console.log("Error fetching user data:", error);
              this._snackBar.open("Error fetching user details", "Close", {
                duration: 1000,
                panelClass: ['snackbar-danger'] // Optional: Customize error style
              });
            }
          );
        },
        (error: HttpErrorResponse) => {
          console.log("Login error:", error);
          // Show error message
          this._snackBar.open("Login failed! Enter a valid email or password.", "Close", {
            duration: 10000,
            panelClass: ['snackbar-danger']
            // panelClass: ['snackbar-error']
          });
        }
      );
    }
  }
}
