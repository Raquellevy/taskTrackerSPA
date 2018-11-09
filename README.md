# TasktrackerSPA

DESIGN CHOICES

SCHEMA

USER
email: string
password_hash: string (hash of the user's password for security)

TASK
title: string
description: text
completed: boolen
timespent: integer
user_id: references users (user that the task is assigned to)

Login/Register
- The login/register page is conditionally redered in the root component (it is only shown when the session is null)
Login
- Users must use their email and password to login
- There account is verified and a session is given to the app state which contains a user id and session token

Register
- Users must use a unique email address, with validated format and that has not been user to register for another account
- Passwords are hashed in the database for security


Tasks 
- The main page has all of the primary functionality of the app

  New Task
  - This form is always open and allows users to create a new task
  - The contents of the form are stored in the local state of the task list component instead of the global redux store, because they are only relevant to this component
  - post request to create a task is authorized with the user token

  Log out
  - ends the current session and returns to login/register page

  Tasks
  - Tasks are rendered with form elements to assign to new users and checkbox to mark a task completed
  - Time logging is only shown for users who are assigned to tasks (if their session id matches the id of the user assigned to the task)
  - The individual form fields are stored in the local state of the task instead of the global store since they are only relevant to a specific task
  - Editing tasks is authorized with user token
  - Deleting tasks is authorized with user token


To start your Phoenix server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: https://hexdocs.pm/phoenix/overview.html
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
