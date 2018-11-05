# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     TasktrackerSPA.Repo.insert!(%TasktrackerSPA.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias TasktrackerSPA.Repo
alias TasktrackerSPA.Users.User
alias TasktrackerSPA.Tasks.Task

pwhash = Argon2.hash_pwd_salt("pass1")

Repo.insert!(%User{email: "raquel@example.com", password_hash: pwhash})
Repo.insert!(%User{email: "bob@example.com", password_hash: pwhash})
Repo.insert!(%User{email: "jane@example.com", password_hash: pwhash})

Repo.insert!(%Task{title: "Web Dev Homework", description: "finish building single page app version of task tracker app", completed: false , timespent: 30, user_id: 1,})
Repo.insert!(%Task{title: "Interaction Design Homework", description: "Listen to podcast and complete reading response", completed: true , timespent: 75, user_id: 1,})
Repo.insert!(%Task{title: "Co-op Onboarding", description: "Finsih filling out the onboarding documents for upcoming coop", completed: false , timespent: 15, user_id: 2,})