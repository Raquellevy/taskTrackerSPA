defmodule TasktrackerSPAWeb.SessionController do
    use TasktrackerSPAWeb, :controller
     action_fallback TasktrackerSPAWeb.FallbackController
     alias TasktrackerSPA.Users.User
     def create(conn, %{"email" => email, "password" => password}) do
      with %User{} = user <- TasktrackerSPA.Users.get_and_auth_user(email, password) do
        resp = %{
          data: %{
            token: Phoenix.Token.sign(TasktrackerSPAWeb.Endpoint, "user_id", user.id),
            user_id: user.id,
          }
        }
         conn
        |> put_resp_header("content-type", "application/json; charset=UTF-8")
        |> send_resp(:created, Jason.encode!(resp))
      end
    end
  end