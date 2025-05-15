Sistema Hospitalario

Descripción

Este sistema hospitalario permite la gestión de usuarios, doctores, pacientes, citas, medicamentos e historial médico.
Incluye un sistema de autenticación de usuarios basado en email y contraseña.

Características Principales

Gestor de Usuarios: Control de roles y autenticación.

Manejo de Pacientes: Registro y seguimiento de pacientes.

Gestor de Doctores: Administración de información de doctores.

Sistema de Citas: Creación y gestión de citas médicas.

Control de Medicamentos: Almacenamiento y administración de medicamentos.

Historial Médico: Registro de diagnósticos, tratamientos y exámenes.

Tablas de la Base de Datos

1. Rol

Define los roles de los usuarios dentro del sistema.

Campo

Tipo

Descripción

id_rol

INT (PK)

Identificador único del rol

nombre_rol

VARCHAR(100)

Nombre del rol (ej. Doctor, Administrador)

2. Usuario

Almacena información de los usuarios registrados.

Campo

Tipo

Descripción

id_usuario

INT (PK)

Identificador del usuario

nombres

VARCHAR(100)

Nombre del usuario

apellidos

VARCHAR(100)

Apellido del usuario

email

VARCHAR(100)

Correo electrónico (login)

contrasena

VARCHAR(255)

Contraseña cifrada

id_rol

INT (FK)

Relación con la tabla Rol

numero_intento

INT

Intentos fallidos de login

status

ENUM

Estado del usuario (activo/bloqueado)

cedula

VARCHAR(10)

Cédula del usuario (número único)

bloqueado_hasta

DATETIME

Fecha hasta la cual está bloqueado

3. Doctor

Registra la información de los doctores en el sistema.

Campo

Tipo

Descripción

id_doctor

INT (PK)

Identificador del doctor

id_usuario

INT (FK)

Usuario vinculado

nombres

VARCHAR(100)

Nombre del doctor

apellidos

VARCHAR(100)

Apellido del doctor

cedula

VARCHAR(10)

Cédula del doctor

area_especializacion

VARCHAR(100)

Especialidad médica

telefono

VARCHAR(15)

Teléfono de contacto

direccion

TEXT

Dirección del doctor

4. Paciente

Registra información de los pacientes.

Campo

Tipo

Descripción

id_paciente

INT (PK)

Identificador del paciente

nombres

VARCHAR(100)

Nombre del paciente

apellidos

VARCHAR(100)

Apellido del paciente

cedula

VARCHAR(10)

Cédula del paciente

edad

INT

Edad del paciente

sexo

ENUM

Género del paciente

condiciones_medicas

TEXT

Enfermedades previas

alergias

TEXT

Alergias registradas

medicamentos_actuales

TEXT

Medicación actual

5. Cita

Registra las citas médicas programadas entre pacientes y doctores.

Campo

Tipo

Descripción

id_cita

INT (PK)

Identificador de la cita

id_paciente

INT (FK)

Relación con Paciente

id_doctor

INT (FK)

Relación con Doctor

fecha_cita

DATETIME

Fecha y hora de la cita

motivo

TEXT

Razón de la consulta

estado

ENUM

Estado (Confirmada, Cancelada, Pendiente)

observaciones

TEXT

Notas del doctor

6. Medicamento

Lista de medicamentos disponibles en el hospital.

Campo

Tipo

Descripción

id_medicamento

INT (PK)

Identificador del medicamento

nombre

VARCHAR(100)

Nombre del medicamento

dosis

VARCHAR(50)

Dosis recomendada

frecuencia

VARCHAR(50)

Frecuencia de administración

hora_administracion

TIME

Hora recomendada de administración

notas

TEXT

Indicaciones adicionales

7. HistorialMedico

Registra el historial médico de los pacientes.

Campo

Tipo

Descripción

id_paciente

INT (FK)

Paciente relacionado

diagnostico

TEXT

Diagnóstico registrado

tratamiento

TEXT

Tratamiento asignado

recetas

TEXT

Medicación prescrita

resultados_examenes

TEXT

Exámenes realizados

alergias

TEXT

Alergias detectadas

vacunas

TEXT

Vacunas aplicadas

fecha_consulta

DATETIME

Fecha de la consulta

Autenticación de Usuarios

El sistema permite a los usuarios iniciar sesión usando su email y contraseña registrados en la tabla Usuario.

Si los datos son correctos y el usuario está "activo", se le concede acceso.

Si el usuario falla más de un número permitido de intentos, su cuenta se bloquea temporalmente.

Los usuarios bloqueados no pueden iniciar sesión hasta que pase el tiempo especificado en bloqueado_hasta.

Instalación

Importar la base de datos ejecutando el script SQL proporcionado.

Configurar una aplicación web para la autenticación y gestión de datos.

Implementar las restricciones de seguridad necesarias para la protección de la información.