defmodule TasktrackerSPAWeb.PageController do
  use TasktrackerSPAWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
