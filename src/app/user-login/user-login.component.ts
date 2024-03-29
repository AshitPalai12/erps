// Import necessary modules
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
 
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  // Variable to track login status
  Login: boolean = false;
 
  // Constructor to inject dependencies
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private service: ApiService,
    private toastr: ToastrService
  ) {
    // Clear session storage on component initialization
    sessionStorage.clear();
  }
 
  // Variables to store user data
  userData: any;
  filteredData: any;
 
  // FormGroup for the login form
  loginForm!: FormGroup;
 
  // OnInit lifecycle hook
  ngOnInit() {
    // Initialize login form with validation rules
    this.loginForm = new FormGroup({
      "youremailaddress": new FormControl('', [Validators.email, Validators.required]),
      "yourpassword": new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])
    });
  }
 
  // Method to handle the login process
  login() {
    // Make an HTTP GET request to fetch user data
    this.http.get<any>('http://localhost:3000/users')
      .subscribe(res => {
        // Log the response
        console.log('res', res);
 
        // Assign response to userData variable
        this.userData = res;
 
        // Extract email and password from the login form
        const emailAdded = this.loginForm.value.youremailaddress;
        const emailPassword = this.loginForm.value.yourpassword;
 
        // Find user data that matches the provided email
        this.filteredData = this.userData.find((each: any) => each.email === emailAdded);
 
        // Check if the provided password matches the user's password
        if (this.filteredData.password === emailPassword) {
          // Log successful login check
          console.log('passcheck');
 
          // Set login status to true
          this.service.Login();
 
          // Reset the login form
          this.loginForm.reset();
 
          // Navigate to the home page
          this.router.navigate(['/home']);
        } else {
          // Display toastr info message for invalid email or password
          this.toastr.info('Invalid Email or Password');
        }
      }, error => {
        // Log error if there's an issue with the HTTP request
        console.log(error, 'err');
 
        // Display toastr info message for a generic error
        this.toastr.info("Something went wrong!!");
      });
  }
}
 
