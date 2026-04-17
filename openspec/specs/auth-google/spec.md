# 📦 auth-google.spec

context:
  name: Autenticación con Google
  description: Permite a los usuarios autenticarse en la plataforma mediante su cuenta de Google utilizando OAuth 2.0

---

authentication:

  provider: google

  protocol: OAuth2

  flow: authorization_code

---

ui:

  components:

    - name: GoogleLoginButton
      type: action
      responsibility: iniciar flujo de autenticación con Google

    - name: AuthLoader
      type: feedback
      responsibility: mostrar estado de carga durante autenticación

    - name: AuthErrorMessage
      type: feedback
      responsibility: mostrar errores de autenticación

---

backend:

  modules:

    - auth
    - user

---

entities:

  - name: User
    fields:

      id:
        type: uuid

      email:
        type: string
        required: true
        unique: true

      name:
        type: string

      avatar:
        type: string

      provider:
        type: string
        enum: [google]

      providerId:
        type: string

      createdAt:
        type: datetime

      updatedAt:
        type: datetime

---

use_cases:

  - name: Login with Google
    description: autentica usuario usando Google OAuth

  - name: Create user if not exists
    description: crea usuario en base de datos si no existe

  - name: Generate session
    description: crea sesión o token JWT

  - name: Logout
    description: cerrar sesión del usuario

---

auth_flow:

  steps:

    - user_clicks_google_login
    - redirect_to_google_auth
    - user_authorizes
    - google_returns_code
    - backend_exchanges_code_for_token
    - backend_fetches_user_info
    - validate_user
    - create_or_update_user
    - generate_jwt
    - return_session_to_frontend

---

api:

  basePath: /api/v1/auth

  endpoints:

    - method: GET
      path: /google
      description: redirige a Google OAuth

    - method: GET
      path: /google/callback
      description: maneja respuesta de Google

    - method: POST
      path: /logout
      description: cerrar sesión

---

security:

  strategies:

    - use_https: true
    - store_tokens_securely: true
    - validate_google_token: true
    - csrf_protection: true

  jwt:

    enabled: true
    expiration: 1h

---

state_management:

  frontend:

    store: auth_store

    structure:

      user:
        id:
        email:
        name:
        avatar:

      isAuthenticated:
        type: boolean

      token:
        type: string

---

integration:

  google:

    required_env:

      - GOOGLE_CLIENT_ID
      - GOOGLE_CLIENT_SECRET
      - GOOGLE_CALLBACK_URL

---

rules:

  - name: Email debe ser único
    type: system
    validation: unique(email)

  - name: Usuario debe existir después del login
    type: system
    validation: create_if_not_exists

  - name: Token debe generarse después de autenticación
    type: security
    validation: jwt_generated

---

edge_cases:

  - usuario_cancela_login
  - token_invalido
  - error_google_api
  - usuario_sin_email

---

performance:

  - cache_user_session: true
  - minimize_external_calls: true

---

tests:

  unit:

    - name: Debe generar URL de autenticación
      action: generateAuthUrl
      expect:
        urlValida: true

    - name: Debe crear usuario si no existe
      action: login
      expect:
        usuarioCreado: true

    - name: Debe generar token JWT
      action: login
      expect:
        tokenGenerado: true

  integration:

    - name: Login completo con Google
      steps:
        - clickLogin
        - authGoogle
        - callback
      expect:
        autenticado: true

    - name: Usuario existente no se duplica
      steps:
        - login
        - loginAgain
      expect:
        usuarioUnico: true

    - name: Logout elimina sesión
      steps:
        - login
        - logout
      expect:
        autenticado: false