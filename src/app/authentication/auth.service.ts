import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // private loginUrl = "http://192.168.1.200:8000/login";
  // private loginUrl = "https://b3f1-210-18-182-133.ngrok-free.app/login/";
  private loginUrl = "https://a87d-210-18-182-133.ngrok-free.app/login";
  // private loginUrl = "http://levarustrips.great-site.net/login";
  

  private currentEmailSubject = new BehaviorSubject<string | null>(null); 
  private currentUserNameSubject = new BehaviorSubject<string | null>(null);
  public currentEmail$ = this.currentEmailSubject.asObservable();
  public currentUserName$ = this.currentUserNameSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Check if the token and email are already stored in localStorage
    const storedEmail = localStorage.getItem("emailid");
    const storedUname = localStorage.getItem("uname");
    const token = localStorage.getItem("access_token");
    if (storedEmail && token) {
      this.currentEmailSubject.next(storedEmail);
    }
    if (storedUname && token) {
      this.currentUserNameSubject.next(storedUname);
    }
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const body = { emailid: email, password: password };

    return this.http.post<any>(this.loginUrl, body, { headers }).pipe(
      tap((response) => {
        // After login, store the email in the BehaviorSubject
        this.currentEmailSubject.next(email);
        localStorage.setItem("emailid", email);
        localStorage.setItem("access_token", response.access_token);
      })
    );
  }

  logout(): void {
    // Clear the session
    this.currentEmailSubject.next(null);
    this.currentUserNameSubject.next(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("emailid");
    localStorage.removeItem("uname");
    this.router.navigate(["/authentication/login"]);
  }

  // Check if the user is authenticated by verifying the token
  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  }

  // Set email when user logs in
  setEmail(email: string): void {
    this.currentEmailSubject.next(email);
  }

  // Get email from localStorage if page reloads
  getEmail(): string | null {
    return localStorage.getItem("emailid");
  }
  setUserName(uname: string): void {
    this.currentUserNameSubject.next(uname);
  }

  getUserName(): string | null {
    return localStorage.getItem("uname");
  }
}
