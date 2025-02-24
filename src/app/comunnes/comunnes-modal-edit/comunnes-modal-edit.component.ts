import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BranchService } from 'app/services/branch.service';
import { ComunnesService } from 'app/services/comunnes.service';

@Component({
  selector: 'app-comunnes-modal-edit',
  templateUrl: './comunnes-modal-edit.component.html',
  styleUrls: ['./comunnes-modal-edit.component.scss']
})
export class ComunnesModalEditComponent implements OnInit {

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
      public dialog: MatDialog,
      private comunnesService: ComunnesService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private branchService:BranchService) { }

  ngOnInit(): void {
  }

}
