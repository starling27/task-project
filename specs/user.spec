# 📦 user.spec

context:
  name: User Management
  description: Represents team members and users in the system

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

use_cases:

  - name: Get Users
    output:
      users: User[]

  - name: Get User By ID
    input:
      id: uuid
    output:
      user: User

api:

  basePath: /users

  endpoints:

    - method: GET
      path: /
      use_case: Get Users

    - method: GET
      path: /:id
      use_case: Get User By ID

rules:

  - name: Email must be unique
    type: business
    validation: unique(email)
