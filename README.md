\# Lab 4: Registration, login and JWT

\*\*Yegireddy Dinesh\*\* · \*\*252U1R1265\*\* · \*\*Section: CSE-2E\*\*



\*\*Live link:\*\* Not deployed (Local SQLite database used; API test screenshots of all endpoints are attached below).



\## How to run

1\. Navigate to the lab folder:

&#x20;  ```bash

&#x20;  cd lab-04

&#x20;  ```

2\. Install dependencies:

&#x20;  ```bash

&#x20;  npm install

&#x20;  ```

3\. Environment variables:

&#x20;  None required for this lab (`JWT\_SECRET` and `PORT` are defined as constants in `index.js`).

4\. Start the server:

&#x20;  ```bash

&#x20;  node index.js

&#x20;  ```



\## Endpoints

| Method | Path | Description |

| :--- | :--- | :--- |

| `POST` | `/register/` | Registers a new user after hashing their password with `bcrypt`; returns `400` if username exists. |

| `POST` | `/login/` | Verifies credentials using `bcrypt.compare` and returns a signed `{ jwt\_token }`; returns `400` on invalid user/password. |



\## Screenshots



\### 1. Successful User Registration (`201 Created`)

!\[Register Success](screenshots/register-success.png)



\### 2. Successful Login \& JWT Generation (`200 OK`)

!\[Login Success](screenshots/login-success.png)



\### 3. Invalid Login Credentials (`400 Bad Request`)

!\[Login Invalid](screenshots/login-invalid.png)



\### 4. Decoded JWT on jwt.io (Header, Payload, Signature)

!\[JWT Decoded](screenshots/jwt-decoded.png)



\## Notes: Problems faced and how I solved them

\* \*\*Problem:\*\* `npm install` blocked native install scripts for `bcrypt` and `sqlite3` due to npm `allowScripts` security warnings.

\* \*\*Solution:\*\* Approved the packages using `npm install-scripts approve bcrypt sqlite3` and rebuilt native binaries via `npm rebuild bcrypt sqlite3`.

\* \*\*Problem:\*\* Postman Web Cloud Agent blocked requests to `localhost:3000`.

\* \*\*Solution:\*\* Tested the `POST /register/` and `POST /login/` JSON endpoints directly using `curl.exe` in Windows PowerShell to verify status codes and responses.

