import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingsService } from 'src/app/shared/services/book/bookings.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
// import { NotificationService } from 'src/app/shared/services/notification/notification.service';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  public submitted = false; 
  signupForm!: FormGroup;
  today:any;
  isLoading = false

  constructor(
    public fb: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private bookService: BookingsService


  ) { }

  ngOnInit(): void {
    this.date();
    this.initializeForm()
  }

  initializeForm(){
    this.signupForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      requestor: ['', Validators.required],
      eventTitle: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventDay: ['', Validators.required],
      expectedParticipants: ['', Validators.required],
      dateRequested: [this.today, Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{11}\s*,?$')]],
    })
  }

  date(){
    this.today = new Date();
    var dd = String(this.today.getDate()).padStart(2, '0');
    var mm = String(this.today.getMonth() + 1).padStart(2, '0');
    var yyyy = this.today.getFullYear();
    this.today = dd + '/' + mm + '/' + yyyy;
  }

  get formControl() {
    return this.signupForm.controls;
  }

  book(){
    this.submitted = true;
    if(this.signupForm.invalid){
      return;
    }else{
      this.isLoading = true
      const {startTime, endTime, requestor,eventTitle, expectedParticipants, eventDate, eventDay,dateRequested, phone} = this.signupForm.value
      let data = {
        event_title:eventTitle, 
        event_day:eventDay,
        event_date:eventDate,
        requester:requestor,
        start_time:startTime,
        end_time:endTime,
        participants:expectedParticipants,
        date_requested:dateRequested,
        phone:phone
      }
    
      this.bookService.submitBookings(data).subscribe((response:any)=>{
        if(response.status == 200){
          this.isLoading = false
          this.notificationService.showSuccess(response.message, 'Success')
          this.clearForm()

            const messageContent = 
            `Dear Admin, You have a new Facility use request
              event_title: ${eventTitle},
              event_day: ${eventDay}, 
              event_date: ${eventDate},
              requester: ${requestor},
              start_time: ${startTime},
              end_time: ${endTime},
              participants: ${expectedParticipants},
              date_requested: ${dateRequested},
              phone: ${phone}

              Please, click send to notify the church admin for prompt response
            `; // Replace with the form details you want to include
            const encodedMessage = encodeURIComponent(messageContent);
            const whatsappURL = `https://api.whatsapp.com/send?phone=+2349090630179&text=${encodedMessage}`;

            // Redirect to WhatsApp URL
            window.location.href = whatsappURL;

        }else{
          this.isLoading = false
          this.notificationService.showError('An error Occurred', 'Failed')
        }
      }, (err:any) =>{
        this.isLoading = false
        if(err){
          this.notificationService.showError('An error Occurred', 'Failed')
        }
      })
    }
  }
  clearForm() {
    this.signupForm.reset();
    Object.keys(this.signupForm.controls).forEach(key => {
        this.signupForm.get(key)!.setErrors(null) ;
      });
    }


}
