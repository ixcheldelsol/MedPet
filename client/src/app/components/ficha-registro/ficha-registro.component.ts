/**
 * import
 */
import { Component, OnInit } from '@angular/core';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

import { MascotasService } from '../../services/mascotas.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/auth.service'

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Mascota } from '../../models/mascota'
import { UserDetails } from 'src/app/models/usuario';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

/**
 * Componente
 */
@Component({
  selector: 'app-ficha-registro',
  templateUrl: './ficha-registro.component.html',
  styleUrls: ['./ficha-registro.component.css']
})

/**
 * Clase
 */
export class FichaRegistroComponent implements OnInit {
/**
 * Declarcion de la variable usuarioActual
 */
  usuarioActual: number;
/**
 * Declarcion de la variable mascotasUsuario
 */
  mascotasUsuario: any;
  /**
 * Declarcion de la variable cantMascotas
 */
  cantMascotas: number;
  /**
 * Declarcion de la variable details
 */
  details: UserDetails;
  /**
 * Declarcion de la variable formMascota
 */
  formMascota: FormGroup;
  /**
 * Declarcion de la variable subida
 */
  subida: boolean;
 /**
 * Atributos  subir imagen a Firebase Storage
 */
 /**
 * Task principal
 */
  task: AngularFireUploadTask;
/**
 * Path
 */
  path: string;

/**
 * Monitoreo del proceso
 */
/**
 * percentage
 */
  percentage: Observable<number>;
/**
 * snapshot
 */
  snapshot: Observable<any>;
/**
 * URL imagen
 */
/**
 * downloadURL
 */
  downloadURL: Observable<string>;
/**
 * url
 */
  url:string;

/**
 * Estado del dropzone para la imagen
 */
/**
 * isHovering
 */
  isHovering: boolean;
/**
 * ========================================
 */

/**
 * Declarcion de la variable nombreM
 */  
  nombreM = new FormControl('', Validators.required);
/**
 * Declarcion de la variable apodoM
 */
  apodoM = new FormControl('', Validators.required);
  /**
 * Declarcion de la variable especieM
 */
  especieM = new FormControl('', Validators.required);
  /**
 * Declarcion de la variable razaM
 */
  razaM = new FormControl('', Validators.required);
  /**
 * Declarcion de la variable sexoM
 */
  sexoM = new FormControl('', Validators.required);
  /**
 * Declarcion de la variable fechaM
 */
  fechaM = new FormControl('', Validators.required);


/**
 * Constructor
 */
  constructor(private storage: AngularFireStorage, private auth: AuthService, private usuarioService: UsuariosService, private mascotasService: MascotasService, fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {

    this.formMascota = fb.group({
      nombreM: this.nombreM,
      apodoM: this.apodoM,
      especieM: this.especieM,
      razaM: this.razaM,
      sexoM: this.sexoM,
      fechaM: this.fechaM,
    });


  }

  /**
 * ngOnInit
 */
  ngOnInit() {
    this.downloadURL = undefined;
    this.url = undefined;
    this.task = undefined;
    this.path = undefined;
    this.subida = false;

    this.auth.profile().subscribe(
      user => {
        this.details = user
        this.usuarioActual = this.details.id_usuario
        this.usuarioService.getMascotas(this.usuarioActual).subscribe ( 
          mascotas => {
            this.mascotasUsuario = mascotas;
            this.cantMascotas = Object.keys(this.mascotasUsuario).length;
            this.path = `usuario_id_${this.usuarioActual}/mascota_${this.cantMascotas+1}`;
          },
          err => {
            console.log(err);
          }
        )
      },
      err => {
        console.log(err)
      }
    )

  }

  /**
 * Funcion toggleHover
 */
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

/**
 * Funcion startUpload
 */
  startUpload(event: FileList) {
    /**
 * El objeto de la imagen a subir
 */
    const file = event.item(0)
/**
 * Validación de la imagen
 */
    if (file.type.split('/')[0] !== 'image') { 
      console.error('Tipo de archivo no es compatible :( ')
      return;
    }
/**
 * Task principal
 */
    
    this.task = this.storage.upload(this.path, file)
/**
 * Monitoreo del proceso
 */
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges()
/**
 * El URL de la imagen
 */
    this.snapshot.pipe(finalize(() => {
      this.downloadURL = this.storage.ref(this.path).getDownloadURL()
    }))
    .subscribe();
  }

  /**
 * Funcion isActive que determina si está activa la función de upload
 */
  isActive(snapshot: any) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

  /**
 * Funcion getImagenUrl
 */
  getImagenUrl(url: string){
    this.url = url;

  }

/**
 * Funcion registrar
 */
  registrar(): void {

    this.snapshot.pipe(finalize(() => {
      const URL = this.storage.ref(this.path).getDownloadURL().pipe.toString()
    }))
    .subscribe();

    const nuevaMascota: Mascota = {
      nombre: this.formMascota.value.nombreM.toString(),
      apodo: this.formMascota.value.apodoM.toString(),
      especie: this.formMascota.value.especieM.toString(),
      raza: this.formMascota.value.razaM.toString(),
      sexo: this.formMascota.value.sexoM.toString(),
      fecha_nacimiento: this.formMascota.value.fechaM,
      foto: this.url,
      id_usuario: this.usuarioActual
    }

    this.mascotasService.saveMascota(nuevaMascota)
      .subscribe(
        res => {
          this.mascotasService.setMascotaActual(res);
          Swal.fire({
            type: 'success',
            title: `Registro exitoso`,
            text: `¡Agregaste a ${nuevaMascota.nombre} a tus mascotas!`,
            backdrop:'rgba(57, 207, 60, 0.48)'
          })
          this.router.navigate(['/inicio']);
        },
        err => console.error(err)
      );

  }

}
