use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :tasktrackerSPA, TasktrackerSPAWeb.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :tasktrackerSPA, TasktrackerSPA.Repo,
  username: "postgres",
  password: "postgres",
  database: "tasktrackerspa_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
