defmodule TasktrackerSPA.Repo.Migrations.CreateTasks do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :title, :string, null: false
      add :description, :text, null: false
      add :completed, :boolean, default: false, null: false
      add :timespent, :integer, default: 0
      add :user_id, references(:users, on_delete: :nilify_all)

      timestamps()
    end

    create index(:tasks, [:user_id])
  end
end