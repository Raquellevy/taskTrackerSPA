defmodule TasktrackerSPA.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset


  schema "tasks" do
    field :completed, :boolean, default: false
    field :description, :string
    field :timespent, :integer
    field :title, :string
    belongs_to :user, TasktrackerSPA.Users.User

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :description, :completed, :timespent])
    |> validate_required([:title, :description, :completed, :timespent])
  end
end
