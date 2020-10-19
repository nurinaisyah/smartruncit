import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  first_section: boolean = false;
  second_section: boolean = false;
  third_section: boolean = false;
  forth_section: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  first() {
    this.first_section = true;
    this.second_section = false;
    this.third_section = false;
    this.forth_section = false;
  }

  second() {
    this.first_section = false;
    this.second_section = true;
    this.third_section = false;
    this.forth_section = false;
  }

  third() {
    this.first_section = false;
    this.second_section = false;
    this.third_section = true;
    this.forth_section = false;
  }

  forth() {
    this.first_section = false;
    this.second_section = false;
    this.third_section = false;
    this.forth_section = true ;
  }

}
