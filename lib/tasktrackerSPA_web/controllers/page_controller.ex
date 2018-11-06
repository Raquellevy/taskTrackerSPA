defmodule TasktrackerSPAWeb.PageController do
  use TasktrackerSPAWeb, :controller

  def index(conn, _params) do
    tasks = TasktrackerSPA.Tasks.list_tasks()
    |> Enum.map(&(Map.take(&1, [:id, :title, :description, :user_id])))
    render conn, "index.html", tasks: tasks
  end
end