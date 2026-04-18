# 📦 user.spec

context:
  name: Gestión de User
  description: Representa miembros del equipo y usuarios en el sistema

entity:
  name: User
  fields:
    id:
      type: uuid
      required: true
    email:
      type: string
      required: true
      format: email
    name:
      type: string
      required: true
    role:
      type: string
      enum: [admin, member, viewer]
      default: member
    avatarUrl:
      type: string
      required: false
    createdAt:
      type: datetime
    updatedAt:
      type: datetime      
    deletedAt:
      type: datetime

use_cases:

  - name: Obtener Users
    output:
      users: User[]

  - name: Obtener User Por ID
    input:
      user: User
    output:
      user: User

  - name: Eliminar User Por ID
    input:
      id: uuid
    output:
      user: User   

  - name: Crear User
    input:
      id: uuid
    output:
      user: User delete     


api:

  basePath: /users

  endpoints:

    - method: GET
      path: /
      use_case: Get Users

    - method: GET
      path: /:id
      use_case: Get User By ID
    
    - method: POST
      path:/
      use_case: Create user

    - method: DELETE
      path: /:id
      use_case: Delete User By ID

rules:

  - name: Email debe ser único
    type: business
    validation: unique(email)
## ADDED Requirements

### Requirement: Hexagonal Structure for User Module
The User module SHALL be structured into `domain`, `application`, and `infrastructure` layers.

#### Scenario: Layered architecture validation
- **WHEN** the User module is inspected
- **THEN** it MUST contain a `domain/repositories` interface and an `infrastructure/repositories` implementation using Prisma.

### Requirement: User Use Cases
All User operations SHALL be implemented as discrete Use Case classes in the `application` layer.

#### Scenario: Use case isolation
- **WHEN** a User is retrieved
- **THEN** the `GetUserUseCase` SHALL be executed, depending only on the `UserRepository` interface.
