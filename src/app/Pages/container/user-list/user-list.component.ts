import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { User } from '../../model/userInter';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userForm!: FormGroup
  users:User[]=[];

  isCreating:boolean=false;

  isEditMode:boolean=false;

  currentId:string = '';

  constructor(private fb: FormBuilder,private _apiService:ApiService, private toastr:ToastrService) {
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      name: [null, [Validators.required]],
      id: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      department: [null, [Validators.required]]
    })

    this.fetchUser();

  }

  onEmptySubmit() {
    if (this.userForm.invalid) {
      alert('Please enter the required fields!!')
    }
  }

  jobForm(){
    this.isCreating = !this.isCreating;
  }

  //form submit and Post the user 
  onFormSubmit() {
    if(!this.isEditMode){

      this._apiService.postUser(this.userForm.value).subscribe((res)=>{
       this.toastr.success("User has been successfully registered")
       this.isCreating = false;
       this.fetchUser();
       this.userForm.reset();
      })

    }
    else{
      
      this._apiService.updateUser(this.currentId, this.userForm.value).subscribe((res)=>{
        
        this.isEditMode=false;
        this.isCreating=false;
        this.fetchUser();
        this.userForm.reset();
      })
    }

  }

  //get the user
  onUserfetch(){
    this.fetchUser();
  }

  private fetchUser(){
    this._apiService.getUser().subscribe((res)=>{
      console.log(res);
      this.users=res;
      this.toastr.success("User has been successfully fetched")
    })
  }

  //update the user
  editUser(id){

    this.currentId=id;

    this.isCreating=true;

    let currentuser = this.users.find((p)=>{return p.id === id})

    this.userForm.setValue({
      name: currentuser.name,
      id:currentuser.id,
      email:currentuser.email,
      password:currentuser.password,
      department: currentuser.department
    })

    this.isEditMode=true;
    

  }

  //delete the user
  deleteUser(id){
    this._apiService.deleteUser(id).subscribe(()=>{
      this.fetchUser();
    })
  }

}
