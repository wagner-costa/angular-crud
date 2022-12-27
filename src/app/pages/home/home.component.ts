import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Routes } from './models/routes';
import { HomeService } from './services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  closeModal: string = "";
  formLabel: string = "";
  btnLabel: string = "";

  constructor(
    private modalService: NgbModal,
    private alertService: AlertService,
    private homeService: HomeService) { }

  public routesList: Routes[] = new Array<Routes>();
  public routes: Routes = new Routes();

  ngOnInit(): void {
    this.getRoutes();
  }

  getRoutes() {
    this.homeService.getRoutes().subscribe((data: Array<Routes>) => {
      this.routesList = data;
    });
  }

  getRoutesById(id: Number) {
    this.homeService.getRoutesById(id).subscribe((data: Routes) => {
      this.routes = data;
      console.log(this.routes);
    });
  }



  deleteRoutes(id: any) {
    this.alertService.question("", "Deseja realmente deletar este registro?", "OK").then(data => {

      if (data.isConfirmed) {
        this.homeService.deleteRoutes(id).subscribe(data => {
          this.getRoutes();
          this.alertService.success("", "Registro deletado com sucesso!", "OK");
        });
      }

    });
  }

  addRoutes(content: any) {
    this.formLabel = "Adicionar Rota de Viagem";
    this.btnLabel = "Salvar";

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  editRoutes(content: any, id: any) {

    this.formLabel = "Editar Rota de viagem";
    this.btnLabel = "Atualizar";


    this.getRoutesById(id);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  sendForm() {

    if (this.routes.id != undefined) {
      this.homeService.updateRoutes(this.routes).subscribe(data => {
        this.modalService.dismissAll();
        this.getRoutes();
        this.routes = new Routes();

        this.alertService.success('', 'Rota de viagem atualizada com sucesso!', 'Ok')
      });
    } else {
      this.homeService.createRoutes(this.routes).subscribe(data => {
        this.modalService.dismissAll();
        this.getRoutes();
        this.routes = new Routes();
        this.alertService.success('', 'Rota de Viagem criada com sucesso!', 'Ok')
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
