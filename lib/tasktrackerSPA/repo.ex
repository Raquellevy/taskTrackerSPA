defmodule TasktrackerSPA.Repo do
  use Ecto.Repo,
    otp_app: :tasktrackerSPA,
    adapter: Ecto.Adapters.Postgres
end
