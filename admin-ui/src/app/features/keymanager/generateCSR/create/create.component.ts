import {Component,  ViewEncapsulation} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { KeymanagerService } from 'src/app/core/services/keymanager.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { RequestModel } from 'src/app/core/models/request.model';
import { TranslateService } from '@ngx-translate/core';
import { HeaderService } from "src/app/core/services/header.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ["./create.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class CreateComponent {

  createForm: FormGroup;
  dropDownValues = ["Insert","Update", "Delete"];
  applicationId = [{id:"PRE_REGISTRATION", value:"PRE_REGISTRATION  3years"}, {id:"REGISTRATION_PROCESSOR", value:"REGISTRATION_PROCESSOR  3years"}, {id:"REGISTRATION", value:"REGISTRATION  3years"}, {id:"IDA", value:"IDA  3years"}, {id:"ID_REPO", value:"ID_REPO  3years"}, {id:"KERNEL", value:"KERNEL  3years"}, {id:"ROOT", value:"ROOT  5years"}, {id:"PMS", value:"PMS  3years"}];
  subscribed: any;
  fileName = "";

  constructor(
  private keymanagerService: KeymanagerService,
  private location: Location,
  private formBuilder: FormBuilder,
  private router: Router,
  private dialog: MatDialog,
  private translateService: TranslateService,
  private headerService: HeaderService
  ) {
    this.subscribed = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.initializeComponent();
      }
    });
  }

  initializeComponent() {
    this.translateService.use(this.headerService.getUserPreferredLanguage());
    this.initializeForm();
  }

  initializeForm() {
    this.createForm = this.formBuilder.group({
      applicationId : ['', [Validators.required]],
      referenceId: ['', [Validators.required]],
      commonName: ['', [Validators.required]],
      organization: ['', [Validators.required]],
      organizationUnit: ['', [Validators.required]],
      location: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  submit(){
    if (this.createForm.valid) {
      this.saveData();
    } else {
      for (const i in this.createForm.controls) {
        if (this.createForm.controls[i]) {
          this.createForm.controls[i].markAsTouched();
        }
      }
    }
  }

  saveData(){
    let self = this;
    const formData = {};
    formData['applicationId'] = self.createForm.get('applicationId').value;
    formData['referenceId'] = self.createForm.get('referenceId').value;
    formData['commonName'] = self.createForm.get('commonName').value;
    formData['organization'] = self.createForm.get('organization').value;
    formData['organizationUnit'] = self.createForm.get('organizationUnit').value;
    formData['location'] = self.createForm.get('location').value;
    formData['state'] = self.createForm.get('state').value;
    formData['country'] = self.createForm.get('country').value;
    const primaryRequest = new RequestModel(
      "",
      null,
      formData
    );
    self.keymanagerService.generateCSR(primaryRequest).subscribe(response => {
      self.showMessage(response);
    });
  }

  showMessage(response){
    let data = {};
    let self = this;
    if(response.errors){
      data = {
        case: 'MESSAGE',
        title: "Failure !",
        message: response.errors[0].message,
        btnTxt: "DONE"
      };
    }else{
      data = {
        case: 'MESSAGE',
        title: "Success",
        message: response.response.status,
        btnTxt: "DONE"
      };
    }
    const dialogRef = self.dialog.open(DialogComponent, {
      width: '650px',
      data
    });
    dialogRef.afterClosed().subscribe(response => {   
      if(response.errors){
      }else{
        location.reload();
      }     
    });
  }

  cancel() {
    location.reload();
  }
}
